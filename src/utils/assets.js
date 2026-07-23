const moduleAssetBase = new URL('./', import.meta.url)

export function asset(path) {
  const cleanPath = String(path).replace(/^\.?\/?assets\//, '')

  // Vite serves files from public/assets at /assets during local development.
  // Production bundles live beside the copied asset directory, including when
  // deployed below /paint-2/ or inside a WordPress theme.
  if (import.meta.env.DEV) {
    return `/assets/${cleanPath}`
  }

  return new URL(cleanPath, moduleAssetBase).href
}

export const remoteProjectVideo = path =>
  `https://grantzz-zzz.github.io/paint-2/assets/${String(path).replace(/^\/+/, '')}`

export const siteUrl = (() => {
  const configured = window.__SPP_SITE_URL__ || `${window.location.origin}${window.location.pathname}`
  return configured.endsWith('/') ? configured : `${configured}/`
})()
