import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { chromium } from 'playwright-core'

const root = resolve(import.meta.dirname, '..')
const base = (process.env.SPP_PHASE9_WP_URL || 'http://127.0.0.1:9492').replace(/\/$/, '')
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const outputRoot = join(root, 'wordpress-plugin', 'dist', 'phase9')
const backupPath = join(outputRoot, 'content-backup.json')
const pluginZip = join(root, 'wordpress-plugin', 'dist', 'superior-plus-content-0.8.0.zip')
const themeZip = join(root, 'wordpress-theme', 'dist', 'superior-plus-2.4.0.zip')
const focus = process.env.SPP_PHASE9_FOCUS || ''

await mkdir(outputRoot, { recursive: true })
const browser = await chromium.launch({ executablePath: edge, headless: true })
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
const checks = []
const check = (condition, name, details = '') => {
  checks.push({ name, passed: Boolean(condition), details })
  if (!condition) throw new Error(`${name}${details ? `: ${details}` : ''}`)
}

function stablePackage(packageData) {
  const stable = structuredClone(packageData)
  delete stable.exported_at
  delete stable.plugin_version
  delete stable.site_url
  return stable
}

function fingerprint(packageData) {
  return createHash('sha256').update(JSON.stringify(stablePackage(packageData))).digest('hex')
}

async function exportPackage() {
  const response = await page.evaluate(async () => {
    const nonce = await fetch('/wp-admin/admin-ajax.php?action=rest-nonce', { credentials: 'same-origin', cache: 'no-store' }).then(result => result.text())
    const result = await fetch('/wp-json/spp/v1/export', {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'X-WP-Nonce': nonce },
    })
    return { status: result.status, body: await result.json() }
  })
  check(response.status === 200, 'Authenticated export endpoint responds', `status ${response.status}`)
  const packageData = response.body?.data
  check(packageData?.format === 'spp-content-export', 'Export format is valid')
  check(Array.isArray(packageData.records) && packageData.records.length === 39, 'Export contains all 39 managed records', `records ${packageData?.records?.length}`)
  return packageData
}

async function openAdmin(path) {
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('#wpadminbar').waitFor({ timeout: 30000 })
}

async function downloadBackup() {
  await openAdmin('/wp-admin/admin.php?page=spp-content-recovery')
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download JSON backup' }).click(),
  ])
  await download.saveAs(backupPath)
  return JSON.parse(await (await import('node:fs/promises')).readFile(backupPath, 'utf8'))
}

async function mutateResidentialTitle() {
  const result = await page.evaluate(async () => {
    const nonce = await fetch('/wp-admin/admin-ajax.php?action=rest-nonce', { credentials: 'same-origin', cache: 'no-store' }).then(response => response.text())
    const services = await fetch('/wp-json/spp/v1/services', { cache: 'no-store' }).then(response => response.json())
    const residential = services.data.find(service => service.slug === 'residential-painting-melbourne')
    const response = await fetch(`/wp-json/wp/v2/spp_service/${residential.id}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
      body: JSON.stringify({ title: 'Phase 9 Recovery Marker' }),
    })
    return { status: response.status, body: await response.json() }
  })
  check(result.status === 200, 'Authenticated client edit succeeds', `status ${result.status}`)
}

async function restoreBackup() {
  await openAdmin('/wp-admin/admin.php?page=spp-content-recovery')
  await page.locator('input[name="spp_backup"]').setInputFiles(backupPath)
  await page.locator('input[name="confirm_restore"]').check()
  await Promise.all([
    page.waitForURL(/restored=1/, { timeout: 180000 }),
    page.getByRole('button', { name: 'Restore selected backup' }).click({ noWaitAfter: true }),
  ])
  await page.getByText('The content backup was restored.').waitFor()
}

async function uploadReplacement(kind, zipPath) {
  const isTheme = kind === 'theme'
  await openAdmin(isTheme ? '/wp-admin/theme-install.php' : '/wp-admin/plugin-install.php?tab=upload')
  if (isTheme) await page.getByRole('button', { name: 'Upload Theme' }).click()
  const input = page.locator('input[type="file"]')
  await input.setInputFiles(zipPath)
  await page.getByRole('button', { name: 'Install Now' }).click()
  await page.waitForLoadState('domcontentloaded')
  const replace = page.getByText(/Replace (current|installed) with uploaded/i, { exact: true })
  if (await replace.count()) {
    await replace.click()
    await page.waitForLoadState('domcontentloaded')
  }
  const body = await page.locator('body').innerText()
  check(
    /updated successfully|installed successfully/i.test(body),
    `${isTheme ? 'Theme' : 'Plugin'} package replacement completes`,
    body.slice(-500),
  )
}

async function ensurePluginActive() {
  await openAdmin('/wp-admin/plugins.php')
  let row = page.locator('tr[data-plugin="superior-plus-content/superior-plus-content.php"]')
  if (!(await row.count())) {
    await openAdmin('/wp-admin/plugin-install.php?tab=upload')
    await page.locator('input[type="file"]').setInputFiles(pluginZip)
    await page.getByRole('button', { name: 'Install Now' }).click()
    await page.waitForLoadState('domcontentloaded')
    const replace = page.getByText(/Replace (current|installed) with uploaded/i, { exact: true })
    if (await replace.count()) {
      await replace.click()
      await page.waitForLoadState('domcontentloaded')
    }
    const installResult = await page.locator('body').innerText()
    check(/installed successfully|updated successfully/i.test(installResult), 'Plugin installation completes', installResult.slice(-1000))
    await openAdmin('/wp-admin/plugins.php')
    row = page.locator('tr[data-plugin="superior-plus-content/superior-plus-content.php"]')
    check(await row.count() === 1, 'Plugin package is present after installation', (await page.locator('body').innerText()).slice(-1000))
  }
  if (!(await row.evaluate(element => element.classList.contains('active')))) {
    await row.getByRole('link', { name: 'Activate' }).click()
    await page.waitForLoadState('domcontentloaded')
  }
}

async function switchThemeAndBack() {
  await openAdmin('/wp-admin/themes.php')
  const alternative = page.locator('.theme:not(.active)').filter({ hasNotText: 'Superior Plus Painting' }).first()
  const alternativeName = (await alternative.locator('.theme-name').innerText()).trim()
  await alternative.hover()
  await alternative.getByRole('link', { name: 'Activate' }).click()
  await page.waitForLoadState('domcontentloaded')
  check((await page.locator('.theme.active .theme-name').innerText()).includes(alternativeName), 'Alternative theme activates', alternativeName)
  await openAdmin('/wp-admin/themes.php')
  const superior = page.locator('.theme').filter({ hasText: 'Superior Plus Painting' })
  await superior.hover()
  await superior.getByRole('link', { name: 'Activate' }).click()
  await page.waitForLoadState('domcontentloaded')
  check((await page.locator('.theme.active .theme-name').innerText()).includes('Superior Plus'), 'Superior Plus theme reactivates')
}

async function uninstallAndVerifyContent() {
  await openAdmin('/wp-admin/plugins.php')
  const row = page.locator('tr[data-plugin="superior-plus-content/superior-plus-content.php"]')
  await row.getByRole('link', { name: 'Deactivate' }).click()
  await page.waitForLoadState('domcontentloaded')
  const inactive = page.locator('tr[data-plugin="superior-plus-content/superior-plus-content.php"]')
  page.once('dialog', dialog => dialog.accept())
  await inactive.getByRole('link', { name: 'Delete' }).click()
  const confirm = page.getByRole('button', { name: /Yes, delete/i })
  if (await confirm.count()) await confirm.click()
  await page.waitForLoadState('domcontentloaded')
  await openAdmin('/wp-admin/plugins.php')
  check(
    !(await page.locator('tr[data-plugin="superior-plus-content/superior-plus-content.php"]').count()),
    'Plugin files uninstall cleanly',
    (await page.locator('body').innerText()).slice(-800),
  )
  const preserved = await page.evaluate(async () => {
    const get = path => fetch(path, { cache: 'no-store' }).then(async response => ({
      status: response.status,
      total: Number(response.headers.get('X-WP-Total') || 0),
      body: await response.json(),
    }))
    return {
      services: await get('/wp-json/wp/v2/spp_service?per_page=100'),
      projects: await get('/wp-json/wp/v2/spp_project?per_page=100'),
      pages: await get('/wp-json/wp/v2/pages?per_page=100'),
    }
  })
  check(preserved.services.status === 200 && preserved.services.total === 9, 'Nine service records remain after uninstall')
  check(preserved.projects.status === 200 && preserved.projects.total === 9, 'Nine project records remain after uninstall')
  const managedSlugs = new Set(['home', 'about', 'services', 'our-process', 'faqs', 'contact'])
  check(
    preserved.pages.status === 200 && preserved.pages.body.filter(item => managedSlugs.has(item.slug)).length === 6,
    'All six managed pages remain after uninstall',
  )
}

try {
  await ensurePluginActive()
  await openAdmin('/wp-admin/admin.php?page=spp-content')
  const baseline = await exportPackage()
  const baselineFingerprint = fingerprint(baseline)

  if ('uninstall' !== focus) {
    const downloaded = await downloadBackup()
    check(fingerprint(downloaded) === baselineFingerprint, 'Downloaded JSON equals the authenticated export')
    check(downloaded.records.every(record => record.checksum), 'Every exported record has a checksum')

    await mutateResidentialTitle()
    const mutated = await exportPackage()
    check(fingerprint(mutated) !== baselineFingerprint, 'A client edit changes the content fingerprint')
    await restoreBackup()
    const restored = await exportPackage()
    if (fingerprint(restored) !== baselineFingerprint) {
      await writeFile(join(outputRoot, 'restored-debug.json'), `${JSON.stringify(restored, null, 2)}\n`)
    }
    check(fingerprint(restored) === baselineFingerprint, 'JSON re-import restores the complete content graph')

    await uploadReplacement('theme', themeZip)
    check(fingerprint(await exportPackage()) === baselineFingerprint, 'Content survives theme package replacement')

    await uploadReplacement('plugin', pluginZip)
    await openAdmin('/wp-admin/admin.php?page=spp-content')
    check(fingerprint(await exportPackage()) === baselineFingerprint, 'Content survives plugin package replacement')

    await switchThemeAndBack()
    await openAdmin('/wp-admin/admin.php?page=spp-content')
    check(fingerprint(await exportPackage()) === baselineFingerprint, 'Content survives theme switching')
  }

  await uninstallAndVerifyContent()

  const report = {
    generatedAt: new Date().toISOString(),
    target: base,
    baselineFingerprint,
    checks: checks.length,
    failures: checks.filter(item => !item.passed),
    results: checks,
  }
  await writeFile(join(outputRoot, 'lifecycle-report.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify({ checks: report.checks, failures: report.failures.length, result: 'PASS' }, null, 2))
} catch (error) {
  const report = {
    generatedAt: new Date().toISOString(),
    target: base,
    checks: checks.length,
    failures: [...checks.filter(item => !item.passed), { name: error.message, passed: false }],
    results: checks,
  }
  await writeFile(join(outputRoot, 'lifecycle-report.json'), `${JSON.stringify(report, null, 2)}\n`)
  throw error
} finally {
  await context.close()
  await browser.close()
}
