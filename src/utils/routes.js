export function cleanBasePath(path = '') {
  const normalized = `/${String(path).replace(/^\/+|\/+$/g, '')}`
  return normalized === '/' ? '' : normalized
}

export function siteBasePath(siteUrl, origin) {
  try {
    return cleanBasePath(new URL(siteUrl || '/', origin).pathname)
  } catch {
    return ''
  }
}

export function normalizeDuplicatedSiteBase(pathname, basePath) {
  const base = cleanBasePath(basePath)
  const current = `/${String(pathname || '/').replace(/^\/+/, '')}`
  if (!base) return current
  const doubled = `${base}${base}`
  return current === doubled || current.startsWith(`${doubled}/`)
    ? current.slice(base.length) || '/'
    : current
}

export function routerBasePath({ siteUrl, explicitBase = '', pathname = '/', origin }) {
  const configured = cleanBasePath(explicitBase)
  const siteBase = siteBasePath(siteUrl, origin)
  const current = normalizeDuplicatedSiteBase(pathname, siteBase)
  if (configured && (current === configured || current.startsWith(`${configured}/`))) {
    return configured
  }
  const indexBase = `${siteBase}/index.php`
  return current === indexBase || current.startsWith(`${indexBase}/`) ? indexBase : siteBase
}

export function toInternalAppPath(url, fallback = '/', environment = {}) {
  if (!url) return fallback
  if (String(url).startsWith('#')) return String(url).slice(1) || '/'

  const origin = environment.origin || window.location.origin
  const siteUrl = environment.siteUrl || window.__SPP_SITE_URL__ || origin
  const explicitBase = environment.routerBase ?? window.__SPP_ROUTER_BASE__ ?? ''
  try {
    const parsed = new URL(url, origin)
    if (parsed.origin !== origin) return parsed.href

    const siteBase = siteBasePath(siteUrl, origin)
    const routerBase = routerBasePath({
      siteUrl,
      explicitBase,
      pathname: parsed.pathname,
      origin,
    })
    let pathname = normalizeDuplicatedSiteBase(parsed.pathname, siteBase)
    for (const base of [routerBase, siteBase].filter(Boolean).sort((a, b) => b.length - a.length)) {
      if (pathname === base) {
        pathname = '/'
        break
      }
      if (pathname.startsWith(`${base}/`)) {
        pathname = pathname.slice(base.length) || '/'
        break
      }
    }
    pathname = pathname.replace(/^\/index\.php(?=\/|$)/, '') || '/'
    return pathname.replace(/\/+$/, '') || '/'
  } catch {
    return String(url).startsWith('/') ? (String(url).replace(/\/+$/, '') || '/') : fallback
  }
}
