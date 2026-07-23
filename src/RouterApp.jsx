import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

const HomePage=lazy(()=>import('./App'))
const ServicePage=lazy(()=>import('./pages/ServicePage'))
const AboutPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.AboutPage})))
const ContactPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ContactPage})))
const FAQsPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.FAQsPage})))
const ProcessPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ProcessPage})))
const ServicesPage=lazy(()=>import('./pages/ContentPages').then(m=>({default:m.ServicesPage})))
const NotFoundPage=lazy(()=>import('./pages/NotFoundPage'))
const DynamicContentPage=lazy(()=>import('./pages/DynamicPages').then(m=>({default:m.DynamicContentPage})))
const ProjectPage=lazy(()=>import('./pages/DynamicPages').then(m=>({default:m.ProjectPage})))

export default function RouterApp() {
  return <HashRouter>
    <button className="skip-link" onClick={()=>document.getElementById('main-content')?.focus()}>Skip to main content</button>
    <Suspense fallback={<div className="route-loader" role="status"><span/>Loading page…</div>}><Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/services" element={<ServicesPage/>}/>
      <Route path="/services/:slug" element={<ServicePage/>}/>
      <Route path="/our-process" element={<ProcessPage/>}/>
      <Route path="/faqs" element={<FAQsPage/>}/>
      <Route path="/contact" element={<ContactPage/>}/>
      <Route path="/projects/:slug" element={<ProjectPage/>}/>
      <Route path="/:slug" element={<DynamicContentPage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes></Suspense>
  </HashRouter>
}
