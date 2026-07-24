import { lazy, Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { routerBasePath } from './utils/routes'

const HomePage=lazy(()=>import('./App'))
const ServicePage=lazy(()=>import('./pages/ServicePage'))
const AboutPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.AboutPage})))
const ContactPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ContactPage})))
const FAQsPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.FAQsPage})))
const ProcessPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ProcessPage})))
const ServicesPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ServicesPage})))
const ServiceAreasPage=lazy(()=>import('./pages/ServiceAreaPages').then(m=>({default:m.ServiceAreasPage})))
const ServiceAreaPage=lazy(()=>import('./pages/ServiceAreaPages').then(m=>({default:m.ServiceAreaPage})))
const DynamicContentPage=lazy(()=>import('./pages/DynamicPages').then(m=>({default:m.DynamicContentPage})))
const ProjectPage=lazy(()=>import('./pages/DynamicPages').then(m=>({default:m.ProjectPage})))

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
    <button className="skip-link" onClick={()=>document.getElementById('main-content')?.focus()}>Skip to main content</button>
    <Suspense fallback={<div className="route-loader" role="status"><span/>Loading page…</div>}><Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/services" element={<ServicesPage/>}/>
      <Route path="/services/:slug" element={<ServicePage/>}/>
      <Route path="/service-areas" element={<ServiceAreasPage/>}/>
      <Route path="/service-areas/:slug" element={<ServiceAreaPage/>}/>
      <Route path="/our-process" element={<ProcessPage/>}/>
      <Route path="/faqs" element={<FAQsPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/projects/:slug" element={<ProjectPage/>}/>
      <Route path="*" element={<DynamicContentPage/>}/>
    </Routes></Suspense>
  </Router>
}
