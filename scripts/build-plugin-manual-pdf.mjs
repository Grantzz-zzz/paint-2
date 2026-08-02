import { readFile, writeFile } from 'node:fs/promises'

const sourcePath = new URL('../SUPERIOR_PLUS_PLUGIN_USER_MANUAL.md', import.meta.url)
const outputPath = new URL('../SUPERIOR_PLUS_PLUGIN_USER_MANUAL.html', import.meta.url)
const source = await readFile(sourcePath, 'utf8')

const escapeHtml = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const inline = value => escapeHtml(value)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')

const lines = source.split(/\r?\n/)
const body = []
let list = null

const closeList = () => {
  if (!list) return
  body.push(`</${list}>`)
  list = null
}

for (const rawLine of lines) {
  const line = rawLine.trim()
  if (!line) {
    closeList()
    continue
  }
  const heading = line.match(/^(#{1,4})\s+(.+)$/)
  if (heading) {
    closeList()
    const level = heading[1].length
    body.push(`<h${level}>${inline(heading[2])}</h${level}>`)
    continue
  }
  const ordered = line.match(/^\d+\.\s+(.+)$/)
  if (ordered) {
    if (list !== 'ol') {
      closeList()
      list = 'ol'
      body.push('<ol>')
    }
    body.push(`<li>${inline(ordered[1])}</li>`)
    continue
  }
  const unordered = line.match(/^-\s+(.+)$/)
  if (unordered) {
    if (list !== 'ul') {
      closeList()
      list = 'ul'
      body.push('<ul>')
    }
    body.push(`<li>${inline(unordered[1])}</li>`)
    continue
  }
  closeList()
  body.push(`<p>${inline(line)}</p>`)
}
closeList()

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Superior Plus Content Plugin User Manual</title>
<style>
  @page { size: A4; margin: 18mm 16mm 18mm; }
  :root { --green:#185641; --red:#97251f; --gold:#f2c318; --ink:#17221d; --cream:#f8f3e8; }
  * { box-sizing:border-box; }
  body { margin:0; color:var(--ink); font-family:Arial,Helvetica,sans-serif; font-size:11.5pt; line-height:1.55; }
  h1 { margin:0 0 14px; padding:22px 24px; background:var(--green); border-bottom:8px solid var(--gold); color:#fff; font-size:25pt; line-height:1.15; }
  h2 { break-after:avoid; margin:28px 0 10px; padding:9px 12px; background:var(--cream); border-left:5px solid var(--red); color:var(--green); font-size:18pt; line-height:1.25; }
  h3 { break-after:avoid; margin:20px 0 7px; color:var(--red); font-size:14pt; line-height:1.3; }
  h4 { break-after:avoid; margin:16px 0 6px; color:var(--green); font-size:12pt; }
  p { margin:7px 0 10px; }
  ul,ol { margin:8px 0 14px; padding-left:25px; }
  li { margin:4px 0; padding-left:3px; }
  li::marker { color:var(--red); font-weight:700; }
  strong { color:#0f4736; }
  code { padding:2px 5px; background:#f2eee5; border:1px solid #ded6c7; border-radius:3px; font-size:10pt; }
  h2, h3, h4, li { page-break-inside:avoid; }
  body::before { content:"Superior Plus Painting & Remodeling"; display:block; margin-bottom:12px; color:var(--red); font-size:9pt; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
  @media print {
    a { color:inherit; text-decoration:none; }
    h1 { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    h2 { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  }
</style>
</head>
<body>${body.join('\n')}</body>
</html>`

await writeFile(outputPath, html, 'utf8')
console.log(outputPath.pathname)
