import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  contact as fallbackContact,
  faqs as fallbackFaqs,
  serviceList as fallbackServices,
  suburbs as fallbackAreas,
  testimonials as fallbackTestimonials,
} from '../data/siteData'
import { asset } from '../utils/assets'
import { toInternalAppPath } from '../utils/routes'

/**
 * @typedef {{url:string, alt?:string, srcset?:string, sizes?:string}} SppMedia
 * @typedef {{label:string, url:string}} SppLink
 * @typedef {{id:number|string, label:string, url:string, children?:SppLink[]}} SppNavigationItem
 * @typedef {{name:string, phone_display:string, phone_href:string, email:string, location:string, google_maps_url?:string, google_maps_embed_url?:string, facebook_url?:string, instagram_url?:string, logo?:SppMedia|null}} SppBusiness
 * @typedef {{business:SppBusiness, review_profile:{rating:number,count:number,url:string}, navigation:SppNavigationItem[], footer:{intro:string, columns:Array<{heading:string,links:SppLink[]}>, stats:Array<{value:string,label:string}>, copyright:string, closing_line:string}, trust_items:string[], location_band:{enabled:boolean,after_coloured:boolean,eyebrow:string,title:string,accent:string,text:string}, service_areas:string[], default_cta:{title:string,text:string,link:SppLink}}} SppBootstrap
 * @typedef {{id?:number,slug:string,title:string,short:string,url?:string,tone?:string}} SppServiceSummary
 */

const fallbackNavigation = [
  { id: 'home', label: 'Home', url: '/', children: [] },
  {
    id: 'services',
    label: 'Services',
    url: '/services',
    children: fallbackServices.map(service => ({
      id: service.slug,
      label: service.title,
      url: `/services/${service.slug}`,
    })),
  },
  { id: 'areas', label: 'Areas', url: '/service-areas', children: [] },
  { id: 'about', label: 'About', url: '/about', children: [] },
  { id: 'process', label: 'Our Process', url: '/our-process', children: [] },
  { id: 'faqs', label: 'FAQs', url: '/faqs', children: [] },
  { id: 'contact', label: 'Contact', url: '/contact', children: [] },
]

/** @type {SppBootstrap} */
export const fallbackBootstrap = {
  business: {
    name: 'Superior Plus Painting & Remodeling',
    phone_display: fallbackContact.phoneDisplay,
    phone_href: `tel:${fallbackContact.phone}`,
    email: fallbackContact.email,
    location: fallbackContact.location,
    street_address: '20 Rae Street, Chadstone VIC 3148, Australia',
    google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Superior%20plus%20painting%20%26%20remodeling',
    google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1574.426042956306!2d145.0931577603448!3d-37.88714169706206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad66b1a91253ba3%3A0x5219727b7db56b2d!2sSuperior%20plus%20painting%20%26%20remodeling!5e0!3m2!1sen!2sph!4v1785206391867!5m2!1sen!2sph',
    facebook_url: 'https://www.facebook.com/people/Superior-Plus-Painting-Remodeling-Services/100075874374049/',
    instagram_url: 'https://www.instagram.com/sppainting.remodeling',
    logo: { url: asset('logo.webp'), alt: 'Superior Plus Painting & Remodeling' },
  },
  review_profile: {
    rating: 5,
    count: 129,
    url: 'https://tinyurl.com/36jdkp9d',
  },
  navigation: fallbackNavigation,
  footer: {
    intro: 'Premium residential and commercial painting across Melbourne, with care in every coat.',
    columns: [],
    stats: [
      { value: '670+', label: 'Residential projects completed' },
      { value: '99%', label: 'Projects completed' },
      { value: '500+', label: 'Commercial projects completed' },
    ],
    copyright: `© ${new Date().getFullYear()} Superior Plus Painting & Remodeling`,
    closing_line: 'Made with care in Melbourne.',
  },
  trust_items: ['Fully insured', 'Free written quotes', 'Careful preparation', 'Clean, tidy sites'],
  location_band: {
    enabled: true,
    after_coloured: false,
    eyebrow: 'Melbourne-wide',
    title: 'Local service,',
    accent: 'carefully delivered.',
    text: 'A selection of Melbourne suburbs regularly serviced for this type of work.',
  },
  service_areas: fallbackAreas,
  default_cta: {
    title: 'Ready for a fresh start?',
    text: 'Tell us about your property and we’ll arrange a free, no-obligation quotation.',
    link: { label: 'Request my free quote', url: '/contact' },
  },
  quote_form: {
    enabled: false,
    privacy_text: '',
  },
}

const ContentContext = createContext(null)
const inflight = new Map()
const resolved = new Map()

function configuredApiBase() {
  const configured = typeof window !== 'undefined' ? window.__SPP_CONTENT_API__ : ''
  const environment = import.meta.env.VITE_SPP_CONTENT_API || ''
  return String(configured || environment).replace(/\/+$/, '')
}

async function request(endpoint) {
  const base = configuredApiBase()
  const isPreview = endpoint.startsWith('/preview/')
  if (!base) throw new Error('WordPress content API is not configured')
  if (resolved.has(endpoint)) return resolved.get(endpoint)
  if (inflight.has(endpoint)) return inflight.get(endpoint)
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  const pending = fetch(`${base}${endpoint}`, {
    credentials: 'same-origin',
    cache: 'no-store',
    signal: controller.signal,
    headers: {
      Accept: 'application/json',
      ...(isPreview && window.__SPP_REST_NONCE__ ? { 'X-WP-Nonce': window.__SPP_REST_NONCE__ } : {}),
    },
  }).then(async response => {
    if (!response.ok) throw new Error(`Content request failed (${response.status})`)
    const payload = await response.json()
    if (payload?.schema_version !== '1.0.0' || !Object.hasOwn(payload, 'data')) {
      throw new Error('Unsupported Superior Plus content response')
    }
    resolved.set(endpoint, payload.data)
    return payload.data
  }).finally(() => {
    window.clearTimeout(timeout)
    inflight.delete(endpoint)
  })
  inflight.set(endpoint, pending)
  return pending
}

async function submitEnquiry(payload) {
  const base = configuredApiBase()
  if (!base) return { delivered: true, prototype: true }

  const fetchFormNonce = async () => {
    const response = await fetch(`${base}/quote-token?_=${Date.now()}`, {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || !result?.data?.nonce) {
      throw new Error('The secure form session could not be refreshed. Please reload the page and try again.')
    }
    return result.data.nonce
  }

  const postEnquiry = async nonce => fetch(`${base}/quote`, {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-SPP-Form-Nonce': nonce,
    },
    body: JSON.stringify(payload),
  })

  let nonce = window.__SPP_FORM_NONCE__ || ''
  try {
    nonce = await fetchFormNonce()
  } catch {
    // The embedded token remains a safe fallback when a host blocks the token refresh request.
  }

  let response = await postEnquiry(nonce)
  let result = await response.json().catch(() => ({}))
  if (response.status === 403 && result?.code === 'spp_quote_token') {
    nonce = await fetchFormNonce()
    response = await postEnquiry(nonce)
    result = await response.json().catch(() => ({}))
  }
  if (!response.ok) throw new Error(result?.message || 'We could not send your enquiry. Please try again.')
  if (result?.schema_version !== '1.0.0' || result?.data?.delivered !== true) {
    throw new Error('The website could not confirm delivery. Please try again.')
  }
  return result.data
}

/**
 * Merge CMS data into a complete local object.
 *
 * Only an absent value (`undefined`) may use the local fallback. Every value that
 * WordPress explicitly returns is authoritative, including an empty string, null,
 * an empty array, or false. This distinction lets an editor deliberately remove
 * optional text, media, cards, and relationships without the React theme silently
 * restoring bundled copy.
 */
export function mergeContent(fallback, incoming) {
  if (incoming === undefined) return fallback
  if (incoming === null) return null
  if (Array.isArray(fallback)) return Array.isArray(incoming) ? incoming : fallback
  if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) {
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return incoming
    const source = incoming
    return Object.keys({ ...fallback, ...source }).reduce((result, key) => {
      result[key] = mergeContent(fallback[key], source[key])
      return result
    }, {})
  }
  return incoming
}

export function mediaUrl(media, fallback = '') {
  if (media === undefined) return fallback
  if (media === null || media === '') return ''
  return typeof media === 'string' ? media : media?.url ?? fallback
}

/**
 * Read a generic page field without confusing an unsaved field with one the
 * editor intentionally cleared. Newer plugin responses expose `__configured`;
 * older responses remain compatible by treating an existing key as configured.
 */
export function fieldValue(fields, key, fallback) {
  if (!fields || !Object.hasOwn(fields, key)) return fallback
  const configured = fields.__configured
  if (Array.isArray(configured) && !configured.includes(key)) return fallback
  return fields[key]
}

export function booleanValue(value, fallback = false) {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  const normalized = String(value).trim().toLowerCase()
  if (['0', 'false', 'off', 'no', ''].includes(normalized)) return false
  if (['1', 'true', 'on', 'yes'].includes(normalized)) return true
  return Boolean(value)
}

export function textItems(items, fallback = []) {
  if (items === undefined) return fallback
  if (!Array.isArray(items)) return fallback
  const values = items.map(item => typeof item === 'string' ? item : item?.text).filter(Boolean)
  return values
}

export function pairItems(items, fallback = []) {
  if (items === undefined) return fallback
  if (!Array.isArray(items)) return fallback
  const values = items.map(item => {
    if (Array.isArray(item)) return item
    return [item?.title || item?.heading || item?.label || '', item?.text || item?.description || item?.body || '']
  }).filter(item => item[0] || item[1])
  return values
}

export function toAppPath(url, fallback = '/') {
  return toInternalAppPath(url, fallback)
}

export function normalizeServices(incoming) {
  if (!Array.isArray(incoming) || !incoming.length) return fallbackServices
  const managedBySlug = new Map(
    incoming
      .filter(service => service?.slug)
      .map(service => [service.slug, service]),
  )
  const canonical = fallbackServices.map(service => mergeContent(service, {
    ...managedBySlug.get(service.slug),
    url: toAppPath(managedBySlug.get(service.slug)?.url, `/services/${service.slug}`),
  }))
  const additions = incoming
    .filter(service => service?.slug && !fallbackServices.some(item => item.slug === service.slug))
    .map((service, index) => {
      const safeFallback = {
        id: service.slug,
        slug: service.slug,
        title: service.title || service.slug.replace(/-/g, ' '),
        short: '',
        tone: fallbackServices[index % fallbackServices.length].tone,
        url: `/services/${service.slug}`,
      }
      return mergeContent(safeFallback, {
        ...service,
        url: toAppPath(service.url, `/services/${service.slug}`),
      })
    })
  return [...canonical, ...additions]
}

export function ContentProvider({ children }) {
  const enabled = Boolean(configuredApiBase())
  const [bootstrap, setBootstrap] = useState(fallbackBootstrap)
  const [services, setServices] = useState(fallbackServices)
  const [status, setStatus] = useState(enabled ? 'loading' : 'fallback')
  const [routeRequest, setRouteRequest] = useState({ key: '', status: enabled ? 'loading' : 'fallback' })
  const [initialContentReady, setInitialContentReady] = useState(!enabled)

  const reportRouteStatus = useCallback((key, nextStatus) => {
    setRouteRequest(current => {
      if (nextStatus !== 'loading' && current.key && current.key !== key) return current
      if (current.key === key && current.status === nextStatus) return current
      return { key, status: nextStatus }
    })
  }, [])

  useEffect(() => {
    if (!enabled) return
    let active = true
    Promise.all([request('/bootstrap'), request('/services')])
      .then(([nextBootstrap, nextServices]) => {
        if (!active) return
        setBootstrap(mergeContent(fallbackBootstrap, nextBootstrap))
        setServices(normalizeServices(nextServices))
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => { active = false }
  }, [enabled])

  const value = useMemo(() => ({
    ...bootstrap,
    services,
    enabled,
    status,
    reportRouteStatus,
  }), [bootstrap, services, enabled, status, reportRouteStatus])

  const awaitingContent = enabled && (status === 'loading' || routeRequest.status === 'loading')
  useEffect(() => {
    if (!awaitingContent) setInitialContentReady(true)
  }, [awaitingContent])
  const initialLoading = enabled && !initialContentReady
  const routeLoading = enabled && initialContentReady && routeRequest.status === 'loading'

  return <ContentContext.Provider value={value}>
    <div className="content-status" aria-live="polite" data-content-state={status}>
      {status === 'loading' ? 'Loading current website content.' : status === 'error' ? 'Current saved website content is temporarily unavailable; showing the complete site fallback.' : ''}
    </div>
    {initialLoading && <div className="content-loading-gate" role="status" aria-live="polite">
      <div className="content-loading-brand"><span/><strong>Superior Plus</strong><small>Loading current website content</small></div>
      <div className="content-loading-preview" aria-hidden="true"><i/><b/><b/><em/><em/><em/></div>
    </div>}
    {routeLoading && <div className="content-route-progress" role="status" aria-label="Loading saved page content"><span/></div>}
    <div className={`content-application ${initialLoading ? 'is-loading' : routeLoading ? 'is-route-loading' : 'is-ready'}`} aria-hidden={initialLoading ? 'true' : undefined}>
      {children}
    </div>
  </ContentContext.Provider>
}

export function useSiteContent() {
  return useContext(ContentContext) || { ...fallbackBootstrap, services: fallbackServices, enabled: false, status: 'fallback' }
}

export function useEnquirySubmission() {
  const site = useSiteContent()
  const startedAt = useRef(Date.now())
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const submit = useCallback(async event => {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setError('')
    if (site.enabled && !site.quote_form?.enabled) {
      setStatus('error')
      setError('Email delivery is not configured yet. Please call or email us directly.')
      return
    }
    setStatus('submitting')
    try {
      await submitEnquiry({
        ...values,
        consent: values.consent === 'yes',
        started_at: startedAt.current,
        page_path: window.location.pathname,
      })
      form.reset()
      setStatus('sent')
    } catch (submissionError) {
      setStatus('error')
      setError(submissionError.message || 'We could not send your enquiry. Please try again.')
    }
  }, [site.enabled, site.quote_form?.enabled])

  const reset = useCallback(() => {
    startedAt.current = Date.now()
    setError('')
    setStatus('idle')
  }, [])

  return {
    submit,
    reset,
    status,
    error,
    pending: status === 'submitting',
    sent: status === 'sent',
    privacyText: site.quote_form?.privacy_text || '',
  }
}

export function useCollection(name, fallback, options = {}) {
  const { enabled } = useSiteContent()
  const preserveEmpty=Boolean(options.preserveEmpty)
  const [data, setData] = useState(enabled ? [] : fallback)
  const [status, setStatus] = useState(enabled ? 'loading' : 'fallback')
  useEffect(() => {
    if (!enabled) {
      setData(fallback)
      setStatus('fallback')
      return
    }
    let active = true
    setData([])
    setStatus('loading')
    request(`/${name}`)
      .then(next => {
        if (active) {
          setData(Array.isArray(next) && (next.length || preserveEmpty) ? next : fallback)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (active) {
          setData(fallback)
          setStatus('error')
        }
      })
    return () => { active = false }
  }, [enabled, name, fallback, preserveEmpty])
  return { data, status }
}

export function useRouteContent(path, fallback = null) {
  const { enabled, reportRouteStatus } = useSiteContent()
  const normalized = String(path || '/').replace(/^\/+|\/+$/g, '')
  const previewId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('spp_preview') : ''
  const endpoint = previewId && /^\d+$/.test(previewId) ? `/preview/${previewId}` : normalized ? `/routes/${encodeURI(normalized)}` : '/routes'
  const [state, setState] = useState(() => ({
    key: enabled ? '' : endpoint,
    data: enabled ? null : fallback,
    status: enabled ? 'loading' : 'fallback',
  }))

  useLayoutEffect(() => {
    if (enabled) reportRouteStatus?.(endpoint, 'loading')
  }, [enabled, endpoint, reportRouteStatus])

  useEffect(() => {
    if (!enabled) {
      setState({ key: endpoint, data: fallback, status: 'fallback' })
      return
    }
    let active = true
    setState({ key: endpoint, data: null, status: 'loading' })
    request(endpoint)
      .then(next => {
        if (active) {
          setState({ key: endpoint, data: next, status: 'ready' })
          reportRouteStatus?.(endpoint, 'ready')
        }
      })
      .catch(error => {
        if (active) {
          const nextStatus = error.message.includes('(404)') ? 'not-found' : 'error'
          setState({ key: endpoint, data: fallback, status: nextStatus })
          reportRouteStatus?.(endpoint, nextStatus)
        }
      })
    return () => { active = false }
  }, [enabled, endpoint, fallback, reportRouteStatus])

  if (enabled && state.key !== endpoint) return { data: null, status: 'loading' }
  return { data: state.data, status: state.status }
}

export const collectionFallbacks = {
  faqs: fallbackFaqs.map(([question, answer], index) => ({ id: `fallback-faq-${index}`, question, answer })),
  testimonials: fallbackTestimonials.map((item, index) => ({
    id: `fallback-testimonial-${index}`,
    ...item,
    name: item.name || item.label,
    project: item.project || item.label,
    rating: 5,
    is_placeholder: item.placeholder !== false,
  })),
}
