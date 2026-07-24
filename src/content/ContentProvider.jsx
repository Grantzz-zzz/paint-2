import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  contact as fallbackContact,
  faqs as fallbackFaqs,
  serviceList as fallbackServices,
  suburbs as fallbackAreas,
  testimonials as fallbackTestimonials,
} from '../data/siteData'
import { asset } from '../utils/assets'

/**
 * @typedef {{url:string, alt?:string, srcset?:string, sizes?:string}} SppMedia
 * @typedef {{label:string, url:string}} SppLink
 * @typedef {{id:number|string, label:string, url:string, children?:SppLink[]}} SppNavigationItem
 * @typedef {{name:string, phone_display:string, phone_href:string, email:string, location:string, instagram_url?:string, logo?:SppMedia|null}} SppBusiness
 * @typedef {{business:SppBusiness, navigation:SppNavigationItem[], footer:{intro:string, columns:Array<{heading:string,links:SppLink[]}>, copyright:string, closing_line:string}, trust_items:string[], service_areas:string[], default_cta:{title:string,text:string,link:SppLink}}} SppBootstrap
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
    instagram_url: '',
    logo: { url: asset('logo.jpeg'), alt: 'Superior Plus Painting & Remodeling' },
  },
  navigation: fallbackNavigation,
  footer: {
    intro: 'Premium residential and commercial painting across Melbourne, with care in every coat.',
    columns: [],
    copyright: `© ${new Date().getFullYear()} Superior Plus Painting & Remodeling`,
    closing_line: 'Made with care in Melbourne.',
  },
  trust_items: ['Fully insured', 'Free written quotes', 'Careful preparation', 'Clean, tidy sites'],
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
const memoryCache = new Map()
const inflight = new Map()
const CACHE_TTL = 5 * 60 * 1000

function configuredApiBase() {
  const configured = typeof window !== 'undefined' ? window.__SPP_CONTENT_API__ : ''
  const environment = import.meta.env.VITE_SPP_CONTENT_API || ''
  return String(configured || environment).replace(/\/+$/, '')
}

function cacheKey(endpoint) {
  return `spp-content:${endpoint}`
}

function readSession(endpoint) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey(endpoint)))
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return cached.data
  } catch {
    // Storage may be unavailable in privacy modes; memory caching still works.
  }
  return null
}

function writeSession(endpoint, data) {
  try {
    sessionStorage.setItem(cacheKey(endpoint), JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // A full or disabled session store must never prevent content rendering.
  }
}

async function request(endpoint) {
  const base = configuredApiBase()
  const isPreview = endpoint.startsWith('/preview/')
  if (!base) throw new Error('WordPress content API is not configured')
  if (!isPreview && memoryCache.has(endpoint)) return memoryCache.get(endpoint)
  const stored = isPreview ? null : readSession(endpoint)
  if (stored) {
    memoryCache.set(endpoint, stored)
    return stored
  }
  if (inflight.has(endpoint)) return inflight.get(endpoint)
  const pending = fetch(`${base}${endpoint}`, {
    credentials: 'same-origin',
    cache: isPreview ? 'no-store' : 'default',
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
    if (!isPreview) {
      memoryCache.set(endpoint, payload.data)
      writeSession(endpoint, payload.data)
    }
    return payload.data
  }).finally(() => inflight.delete(endpoint))
  inflight.set(endpoint, pending)
  return pending
}

async function submitEnquiry(payload) {
  const base = configuredApiBase()
  if (!base) return { delivered: true, prototype: true }
  const response = await fetch(`${base}/quote`, {
    method: 'POST',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-SPP-Form-Nonce': window.__SPP_FORM_NONCE__ || '',
    },
    body: JSON.stringify(payload),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result?.message || 'We could not send your enquiry. Please try again.')
  if (result?.schema_version !== '1.0.0' || result?.data?.delivered !== true) {
    throw new Error('The website could not confirm delivery. Please try again.')
  }
  return result.data
}

function hasContent(value) {
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Merge CMS data into a complete local object. Empty optional CMS fields retain
 * their designed fallback so a section cannot disappear accidentally.
 */
export function mergeContent(fallback, incoming) {
  if (!hasContent(incoming)) return fallback
  if (Array.isArray(fallback)) return Array.isArray(incoming) && incoming.length ? incoming : fallback
  if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) {
    const source = incoming && typeof incoming === 'object' ? incoming : {}
    return Object.keys({ ...fallback, ...source }).reduce((result, key) => {
      result[key] = mergeContent(fallback[key], source[key])
      return result
    }, {})
  }
  return incoming
}

export function mediaUrl(media, fallback = '') {
  return typeof media === 'string' ? media : media?.url || fallback
}

export function textItems(items, fallback = []) {
  if (!Array.isArray(items) || !items.length) return fallback
  const values = items.map(item => typeof item === 'string' ? item : item?.text).filter(Boolean)
  return values.length ? values : fallback
}

export function pairItems(items, fallback = []) {
  if (!Array.isArray(items) || !items.length) return fallback
  const values = items.map(item => {
    if (Array.isArray(item)) return item
    return [item?.title || item?.heading || item?.label || '', item?.text || item?.description || item?.body || '']
  }).filter(item => item[0] || item[1])
  return values.length ? values : fallback
}

export function toAppPath(url, fallback = '/') {
  if (!url) return fallback
  if (String(url).startsWith('#')) return String(url).slice(1) || '/'
  try {
    const parsed = new URL(url, window.location.origin)
    return parsed.origin === window.location.origin ? (parsed.pathname.replace(/\/+$/, '') || '/') : parsed.href
  } catch {
    return String(url).startsWith('/') ? (String(url).replace(/\/+$/, '') || '/') : fallback
  }
}

function normalizeServices(incoming) {
  if (!Array.isArray(incoming) || !incoming.length) return fallbackServices
  return incoming.map((service, index) => {
    const matchingFallback = fallbackServices.find(item => item.slug === service.slug) || fallbackServices[index % fallbackServices.length]
    return mergeContent(matchingFallback, {
      ...service,
      url: toAppPath(service.url, `/services/${service.slug}`),
    })
  })
}

export function ContentProvider({ children }) {
  const enabled = Boolean(configuredApiBase())
  const [bootstrap, setBootstrap] = useState(fallbackBootstrap)
  const [services, setServices] = useState(fallbackServices)
  const [status, setStatus] = useState(enabled ? 'loading' : 'fallback')

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
  }), [bootstrap, services, enabled, status])

  return <ContentContext.Provider value={value}>
    <div className="content-status" aria-live="polite" data-content-state={status}>
      {status === 'loading' ? 'Loading current website content.' : status === 'error' ? 'Current saved website content is temporarily unavailable; showing the complete site fallback.' : ''}
    </div>
    {children}
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

export function useCollection(name, fallback) {
  const { enabled } = useSiteContent()
  const [data, setData] = useState(fallback)
  const [status, setStatus] = useState(enabled ? 'loading' : 'fallback')
  useEffect(() => {
    if (!enabled) {
      setData(fallback)
      setStatus('fallback')
      return
    }
    let active = true
    request(`/${name}`)
      .then(next => {
        if (active) {
          setData(Array.isArray(next) && next.length ? next : fallback)
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
  }, [enabled, name, fallback])
  return { data, status }
}

export function useRouteContent(path, fallback = null) {
  const { enabled } = useSiteContent()
  const [data, setData] = useState(fallback)
  const [status, setStatus] = useState(enabled ? 'loading' : 'fallback')
  useEffect(() => {
    if (!enabled) {
      setData(fallback)
      setStatus('fallback')
      return
    }
    let active = true
    const normalized = String(path || '/').replace(/^\/+|\/+$/g, '')
    const previewId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('spp_preview') : ''
    request(previewId && /^\d+$/.test(previewId) ? `/preview/${previewId}` : normalized ? `/routes/${encodeURI(normalized)}` : '/routes')
      .then(next => {
        if (active) {
          setData(next)
          setStatus('ready')
        }
      })
      .catch(error => {
        if (active) {
          setData(fallback)
          setStatus(error.message.includes('(404)') ? 'not-found' : 'error')
        }
      })
    return () => { active = false }
  }, [enabled, path, fallback])
  return { data, status }
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
