import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

let sequence = 5000
const id = () => (++sequence).toString(16).padStart(8, '0')
const container = (css, elements = [], settings = {}) => ({
  id: id(), elType: 'container', isInner: false,
  settings: { content_width: 'full', css_classes: css, ...settings }, elements,
})
const widget = (widgetType, settings, css = '') => ({
  id: id(), elType: 'widget', widgetType,
  settings: { _css_classes: css, ...settings }, elements: [],
})
const heading = (title, css = '', header_size = 'div') => widget('heading', { title, header_size }, css)
const text = (editor, css = '') => widget('text-editor', { editor }, css)
const image = (url, alt, css = '') => widget('image', { image: { url, id: '', alt, source: 'library' }, image_size: 'full', link_to: 'custom', link: { url: '{{SPP_HOME_URL}}/' } }, css)
const button = (label, url, css = '') => widget('button', { text: label, link: { url }, size: 'sm' }, css)

const brand = () => container('spp-uae-brand', [
  image('{{SPP_THEME_URI}}/assets/images/logo.jpeg', 'Superior Plus Painting and Remodeling', 'spp-uae-logo'),
  heading('<a href="{{SPP_HOME_URL}}/">Superior Plus Painting<small>Painting &amp; Remodeling</small></a>', 'spp-uae-brand-copy'),
])

const header = {
  version: '0.4', title: 'Superior Plus Global Header', type: 'container', page_settings: {},
  content: [container('spp-uae-header', [container('spp-uae-header-inner', [
    brand(),
    widget('uael-nav-menu', {
      menu: 'superior-plus-primary', layout: 'horizontal', navmenu_align: 'center', dropdown: 'tablet',
      full_width_dropdown: 'yes', submenu_icon: 'arrow', submenu_animation: 'slide_up',
      menu_last_item: 'none', link_redirect: 'child', resp_align: 'right',
    }, 'spp-uae-nav'),
    container('spp-uae-actions', [
      heading('<a href="tel:0470234567">0470 234 567</a>', 'spp-uae-phone'),
      button('Free quote →', '{{SPP_HOME_URL}}/contact/', 'spp-uae-quote'),
    ]),
  ])])],
}

const linkList = (items, css = '') => container(css, items.map(([label, url]) => heading(`<a href="${url}">${label}</a>`, 'spp-uae-footer-link')))
const footer = {
  version: '0.4', title: 'Superior Plus Global Footer', type: 'container', page_settings: {},
  content: [container('spp-uae-footer', [
    container('spp-uae-footer-grid', [
      container('spp-uae-footer-brand', [brand(), text('<p>Premium residential and commercial painting across Melbourne, with care in every coat.</p>')]),
      container('spp-uae-footer-column', [heading('Explore', 'spp-uae-footer-title', 'h4'), linkList([
        ['About', '{{SPP_HOME_URL}}/about/'], ['Services', '{{SPP_HOME_URL}}/services/'], ['Our Process', '{{SPP_HOME_URL}}/our-process/'], ['FAQs', '{{SPP_HOME_URL}}/faqs/'], ['Contact', '{{SPP_HOME_URL}}/contact/'],
      ])]),
      container('spp-uae-footer-column', [heading('Services', 'spp-uae-footer-title', 'h4'), linkList([
        ['Residential painting', '{{SPP_HOME_URL}}/services/residential-painting-melbourne/'],
        ['Commercial painting', '{{SPP_HOME_URL}}/services/commercial-painting-melbourne/'],
        ['Roof painting', '{{SPP_HOME_URL}}/services/roof-painting-melbourne/'],
        ['Plaster repairs', '{{SPP_HOME_URL}}/services/plaster-repairs-melbourne/'],
      ])]),
      container('spp-uae-footer-column', [heading('Get in touch', 'spp-uae-footer-title', 'h4'), linkList([
        ['0470 234 567', 'tel:0470234567'],
        ['sppainting.remodeling@gmail.com', 'mailto:sppainting.remodeling@gmail.com'],
        ['Melbourne, Victoria', '#'],
      ])]),
    ]),
    container('spp-uae-footer-bottom', [text('<p>© {{CURRENT_YEAR}} Superior Plus Painting &amp; Remodeling</p>'), text('<p>Made with care in Melbourne.</p>')]),
  ])],
}

const field = (widgetType, name, label, placeholder, extra = {}) => widget(widgetType, {
  mf_input_label_status: 'yes', mf_input_label: label, mf_input_name: name,
  mf_input_placeholder: placeholder, mf_input_required: 'yes', ...extra,
}, 'spp-mf-field')
const form = {
  version: '0.4', title: 'Superior Plus Quote Form', type: 'container', page_settings: {},
  content: [container('spp-mf-form', [
    container('spp-mf-title', [heading('Free quote request', '', 'h3'), text('<p>Usually replies within 2 hours</p>')]),
    container('spp-mf-row', [field('mf-text', 'name', 'Name', 'Your name'), field('mf-telephone', 'phone', 'Phone', '04xx xxx xxx')]),
    container('spp-mf-row', [field('mf-email', 'email', 'Email', 'you@email.com'), field('mf-text', 'suburb', 'Suburb', 'Your suburb')]),
    field('mf-select', 'service', 'Service', 'Choose a service', { mf_input_list: [
      { mf_input_option_text: 'Residential painting', mf_input_option_value: 'residential' },
      { mf_input_option_text: 'Commercial painting', mf_input_option_value: 'commercial' },
      { mf_input_option_text: 'Interior or exterior painting', mf_input_option_value: 'interior-exterior' },
      { mf_input_option_text: 'Roof, deck or fence painting', mf_input_option_value: 'outdoor' },
      { mf_input_option_text: 'Repairs or other work', mf_input_option_value: 'other' },
    ] }),
    field('mf-textarea', 'project', 'Tell us about your project', 'What would you like painted?', { mf_textarea_field_height: { unit: 'px', size: 120 } }),
    widget('mf-button', { mf_btn_text: 'Request my free quote →', mf_btn_align: 'justify', mf_btn_icon_align: 'right' }, 'spp-mf-submit'),
    text('<p>✓ No obligation. Your details stay private.</p>', 'spp-mf-note'),
  ])],
}

const output = join(process.cwd(), 'wordpress-theme', 'superior-plus', 'elementor-templates')
await mkdir(output, { recursive: true })
await Promise.all([
  writeFile(join(output, 'superior-plus-header-uae-2.9.2.json'), JSON.stringify(header, null, 2)),
  writeFile(join(output, 'superior-plus-footer-uae-2.9.2.json'), JSON.stringify(footer, null, 2)),
  writeFile(join(output, 'superior-plus-quote-metform-4.1.7.json'), JSON.stringify(form, null, 2)),
])
console.log('Created UAE header/footer and MetForm templates.')
