import { lazy, Suspense, useLayoutEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { routerBasePath } from './utils/routes'

const HomePage=lazy(()=>import('./App'))
const ServicePage=lazy(()=>import('./pages/ServicePage'))
const AboutPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.AboutPage})))
const ContactPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ContactPage})))
const FAQsPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.FAQsPage})))
const ProcessPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ProcessPage})))
const ServicesPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ServicesPage})))
const AdditionalServicesPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.AdditionalServicesPage})))
const ServiceAreasPage=lazy(()=>import('./pages/ServiceAreaPages').then(m=>({default:m.ServiceAreasPage})))
const ServiceAreaPage=lazy(()=>import('./pages/ServiceAreaPages').then(m=>({default:m.ServiceAreaPage})))
const PaintingGuidesPage=lazy(()=>import('./pages/GuidePages').then(m=>({default:m.PaintingGuidesPage})))
const PaintingGuidePage=lazy(()=>import('./pages/GuidePages').then(m=>({default:m.PaintingGuidePage})))
const DynamicContentPage=lazy(()=>import('./pages/DynamicPages').then(m=>({default:m.DynamicContentPage})))
const ProjectPage=lazy(()=>import('./pages/DynamicPages').then(m=>({default:m.ProjectPage})))
const GalleryPage=lazy(()=>import('./pages/GalleryPage'))

function RouteScrollReset() {
  const location=useLocation()
  useLayoutEffect(()=>{
    const root=document.documentElement
    const previous=root.style.scrollBehavior
    root.style.scrollBehavior='auto'
    window.scrollTo(0,0)
    root.style.scrollBehavior=previous
  },[location.pathname])
  return null
}

export default function RouterApp() {
  const cleanRoutes=Boolean(window.__SPP_CONTENT_API__)
  const Router=cleanRoutes?BrowserRouter:HashRouter
  const sitePath=cleanRoutes?routerBasePath({
    siteUrl:window.__SPP_SITE_URL__,
    explicitBase:window.__SPP_ROUTER_BASE__,
    pathname:window.location.pathname,
    origin:window.location.origin,
  }):''
  return <Router {...(cleanRoutes&&sitePath?{basename:sitePath}: {})}>
    <RouteScrollReset/>
    <button className="skip-link" onClick={()=>document.getElementById('main-content')?.focus()}>Skip to main content</button>
    <Suspense fallback={<div className="route-loader" role="status"><span/>Loading page…</div>}><Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/services" element={<ServicesPage/>}/>
      <Route path="/services/:slug" element={<ServicePage/>}/>
      <Route path="/additional-services" element={<AdditionalServicesPage/>}/>
      <Route path="/service-areas" element={<ServiceAreasPage/>}/>
      <Route path="/service-areas/:slug" element={<ServiceAreaPage/>}/>
      <Route path="/painting-guides" element={<PaintingGuidesPage/>}/>
      <Route path="/painting-guides/:slug" element={<PaintingGuidePage/>}/>
      <Route path="/our-process" element={<ProcessPage/>}/>
      <Route path="/faqs" element={<FAQsPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/gallery" element={<GalleryPage/>}/>
      <Route path="/projects/:slug" element={<ProjectPage/>}/>
      <Route path="*" element={<DynamicContentPage/>}/>
    </Routes></Suspense>
  </Router>
}
