import { routerBasePath } from './routes.js'

const moduleAssetBase = new URL('./', import.meta.url)
const browserWindow = typeof window === 'undefined'
  ? {
      location: { origin: 'http://localhost', pathname: '/' },
      __SPP_SITE_URL__: '',
      __SPP_CONTENT_API__: '',
      __SPP_ROUTER_BASE__: '',
    }
  : window

export function asset(path) {
  const cleanPath = String(path).replace(/^\.?\/?assets\//, '')

  // Vite serves files from public/assets at /assets during local development.
  // Production bundles live beside the copied asset directory, including when
  // deployed below /paint-2/ or inside a WordPress theme.
  if (import.meta.env?.DEV) {
    return `/assets/${cleanPath}`
  }

  return new URL(cleanPath, moduleAssetBase).href
}

export const remoteProjectVideo = path =>
  `https://grantzz-zzz.github.io/paint-2/assets/${String(path).replace(/^\/+/, '')}`

export const siteUrl = (() => {
  const configured = browserWindow.__SPP_SITE_URL__ || (import.meta.env?.DEV
    ? `${browserWindow.location.origin}${browserWindow.location.pathname}`
    : 'https://grantzz-zzz.github.io/paint-2/')
  return configured.endsWith('/') ? configured : `${configured}/`
})()

export const usesCleanRoutes = Boolean(browserWindow.__SPP_CONTENT_API__)

export function publicRouteUrl(path = '/') {
  const normalized=`/${String(path).replace(/^\/+|\/+$/g,'')}`
  const route=normalized==='/'?'/':normalized
  if(!usesCleanRoutes)return `${siteUrl}#${route}`
  const base=routerBasePath({
    siteUrl:browserWindow.__SPP_SITE_URL__,
    explicitBase:browserWindow.__SPP_ROUTER_BASE__,
    pathname:browserWindow.location.pathname,
    origin:browserWindow.location.origin,
  })
  return `${browserWindow.location.origin}${base}${route==='/'?'':route}`
}
