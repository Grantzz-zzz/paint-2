export const contact = {
  phoneDisplay: '0470 234 567',
  phone: '0470234567',
  email: 'sppainting.remodeling@gmail.com',
  location: 'Melbourne, Victoria',
}

export const suburbs = [
  'Chadstone', 'Mount Waverley', 'Glen Waverley', 'Oakleigh', 'Mulgrave',
  'Clayton', 'Burwood', 'Ashwood', 'Dandenong', 'Noble Park', 'Springvale',
  'Keysborough', 'Berwick', 'Narre Warren', 'Endeavour Hills',
]

export const masterProcess = [
  { title: 'Free consultation & quote', text: 'We inspect the site, understand your goals, discuss colours and finishes, and provide a detailed no-obligation quotation.' },
  { title: 'Surface preparation', text: 'We clean, scrape, sand, fill, repair, seal and prime as required to create the right foundation.' },
  { title: 'Protecting your property', text: 'Furniture, floors, windows, gardens and surrounding areas are carefully covered and masked.' },
  { title: 'Professional painting', text: 'Premium coatings are applied with brushes, rollers or spray equipment using proven techniques.' },
  { title: 'Quality inspection', text: 'Every surface is checked and any required touch-ups are completed before sign-off.' },
  { title: 'Clean-up & handover', text: 'We remove coverings, clean the work area and complete a final walkthrough with you.' },
]

export const testimonials = [
  { quote: 'Superior Plus Painting completed the work on time with excellent attention to detail. The finish was outstanding, and the team kept everything clean throughout the project.', label: 'Professional & reliable', placeholder: true },
  { quote: 'We were impressed with the preparation and workmanship. The painters were friendly, punctual and delivered exactly what they promised. Our home looks fantastic.', label: 'Excellent quality', placeholder: true },
  { quote: 'From the first quote to the final inspection, the communication was excellent. The project was completed on schedule and the quality exceeded our expectations.', label: 'Great communication', placeholder: true },
  { quote: 'We received honest advice, competitive pricing and a high-quality finish. We would definitely use Superior Plus Painting again.', label: 'Value for money', placeholder: true },
]

export const serviceList = [
  { slug: 'residential-painting-melbourne', title: 'Residential Painting', short: 'Complete home repaints, interior refreshes and exterior transformations.', tone: 'maroon' },
  { slug: 'commercial-painting-melbourne', title: 'Commercial Painting', short: 'Reliable, carefully scheduled painting for workplaces and managed properties.', tone: 'green' },
  { slug: 'interior-painting-melbourne', title: 'Interior Painting', short: 'Clean, modern finishes for walls, ceilings, trims and living spaces.', tone: 'teal' },
  { slug: 'exterior-painting-melbourne', title: 'Exterior Painting', short: 'Durable protection and renewed street appeal for Melbourne properties.', tone: 'terracotta' },
  { slug: 'roof-painting-melbourne', title: 'Roof Painting', short: 'Careful cleaning, preparation and protective roof coating systems.', tone: 'maroon' },
  { slug: 'fence-painting-melbourne', title: 'Fence Painting', short: 'Brush, spray and stain finishes for new and weathered fences.', tone: 'terracotta' },
  { slug: 'deck-painting-staining-melbourne', title: 'Deck Painting & Staining', short: 'Restore, protect and showcase the natural character of outdoor timber.', tone: 'gold' },
  { slug: 'wallpaper-removal-melbourne', title: 'Wallpaper Removal', short: 'Careful removal, adhesive cleaning and paint-ready wall preparation.', tone: 'teal' },
  { slug: 'plaster-repairs-melbourne', title: 'Plaster Repairs', short: 'Smooth, strong repairs for damaged walls and ceilings before painting.', tone: 'cream' },
]

const stock = {
  residential: asset('client/projects/exterior/exterior-07.webp'),
  commercial: asset('client/projects/commercial/commercial-02.webp'),
  interior: asset('client/projects/interior/interior-04.webp'),
  exterior: asset('client/projects/exterior/exterior-01.webp'),
  roof: asset('stock/roof.webp'),
  fence: asset('client/projects/fence/fence-03.webp'),
  deck: asset('client/projects/outdoor/outdoor-01.webp'),
  wallpaper: asset('stock/wallpaper.webp'),
  plaster: asset('client/projects/interior/interior-10.webp'),
}

export const servicePages = {
  'residential-painting-melbourne': {
    eyebrow: 'Painting for the way you live', title: 'Residential Painting', accent: 'that feels like home.', tone: 'maroon', image: stock.residential,
    intro: 'Superior Plus Painting provides professional residential painting across Melbourne for homeowners, landlords, builders and property managers. From a complete repaint to one carefully refreshed space, we deliver finishes that enhance the beauty, value and protection of your home.',
    scopeTitle: 'Complete residential painting services',
    scope: ['Interior house painting', 'Exterior house painting', 'New home painting', 'Repainting existing homes', 'Ceilings, walls and trims', 'Doors and window frames', 'Feature walls', 'Garage and roof painting', 'Fence and deck painting', 'Plaster repairs and preparation'],
    process: ['Free consultation and written quote', 'Surface preparation and repairs', 'Priming where required', 'Professional paint application', 'Final inspection and site clean-up'],
    why: 'Every project begins with a thorough inspection. We repair minor defects, fill cracks, sand surfaces and protect your furniture and flooring before applying high-quality coatings for a smooth, durable finish.',
    benefits: ['A fresh, cohesive home', 'Protection from everyday wear', 'Improved property presentation', 'Careful, low-disruption delivery'],
    related: ['interior-painting-melbourne', 'exterior-painting-melbourne', 'roof-painting-melbourne', 'plaster-repairs-melbourne'],
  },
  'commercial-painting-melbourne': {
    eyebrow: 'Commercial painting specialists', title: 'Commercial Painting', accent: 'planned around business.', tone: 'green', image: stock.commercial,
    intro: 'We deliver reliable commercial painting across Melbourne for businesses, builders, property managers, body corporates and industrial facilities. Every project is carefully planned to reduce disruption while achieving a professional, durable result.',
    scopeTitle: 'Spaces and industries we paint',
    scope: ['Offices and workplaces', 'Retail shops and shopping centres', 'Warehouses and factories', 'Medical centres and clinics', 'Schools and childcare centres', 'Restaurants and cafés', 'Apartment complexes', 'Body corporate and strata', 'Interior and exterior commercial painting', 'Scheduled maintenance painting'],
    process: ['Site inspection and detailed quote', 'Planning around business hours', 'Preparation, repairs and priming', 'Application of commercial coatings', 'Inspection, touch-ups and clean-up'],
    why: 'Our painters maintain organised work sites, communicate clearly and work efficiently to reduce downtime. We select durable paint systems suited to busy commercial environments and the demands of each surface.',
    benefits: ['Flexible project scheduling', 'Minimal operational disruption', 'Consistent professional finish', 'Clear communication throughout'],
    related: ['interior-painting-melbourne', 'exterior-painting-melbourne', 'plaster-repairs-melbourne'],
  },
  'interior-painting-melbourne': {
    eyebrow: 'Clean lines, considered colour', title: 'Interior Painting', accent: 'made beautifully simple.', tone: 'teal', image: stock.interior,
    intro: 'We provide professional interior painting for homeowners, builders, landlords, property managers and businesses throughout Melbourne. Whether you are renovating, moving, preparing to sell or refreshing your space, we deliver clean modern finishes with careful preparation.',
    scopeTitle: 'Interior spaces and surfaces',
    scope: ['Walls and ceilings', 'Bedrooms and living rooms', 'Kitchens and dining areas', 'Bathrooms and laundries', 'Hallways and staircases', 'Doors and skirting boards', 'Architraves and window trims', 'Home offices and studies', 'Apartments and townhouses', 'Complete family homes'],
    process: ['On-site consultation and quote', 'Fill cracks, sand and repair plaster', 'Prime where required', 'Apply premium paint systems', 'Inspect, touch up and clean'],
    why: 'We take the time to protect furniture, floors and fixtures, then prepare each surface correctly. The result is an even, polished finish with crisp details and minimal disruption to your routine.',
    benefits: ['Brighter living spaces', 'Modernised colour and character', 'Protection from daily wear', 'A welcoming, sale-ready finish'],
    related: ['residential-painting-melbourne', 'plaster-repairs-melbourne', 'wallpaper-removal-melbourne'],
  },
  'exterior-painting-melbourne': {
    eyebrow: 'Protection with street appeal', title: 'Exterior Painting', accent: 'built for Melbourne.', tone: 'terracotta', image: stock.exterior,
    intro: 'Superior Plus Painting provides exterior painting for homes, townhouses, apartments and commercial properties. A professionally finished exterior improves street appeal while protecting surfaces from moisture, UV exposure and Melbourne’s changing weather.',
    scopeTitle: 'Complete exterior painting',
    scope: ['Weatherboards', 'Brick and rendered homes', 'Cladding', 'Fascia boards and eaves', 'Gutters and downpipes', 'Garage and front doors', 'Window frames and timber trims', 'Pergolas and outdoor structures', 'Full exterior house repaints'],
    process: ['Site inspection and quote', 'Pressure wash and clean', 'Scrape, sand and complete minor repairs', 'Prime bare surfaces', 'Apply premium exterior coatings', 'Inspect, touch up and clean'],
    why: 'Proper preparation is the foundation of a long-lasting exterior. We use proven techniques and quality materials, communicate clearly, work safely and leave every property clean and tidy.',
    benefits: ['Weather and UV protection', 'Longer material life', 'Reduced maintenance', 'Stronger street appeal and value'],
    related: ['residential-painting-melbourne', 'roof-painting-melbourne', 'fence-painting-melbourne', 'deck-painting-staining-melbourne'],
  },
  'roof-painting-melbourne': {
    eyebrow: 'Restore the view from the street', title: 'Roof Painting', accent: 'protection from the top down.', tone: 'maroon', image: stock.roof,
    intro: 'Our roof painting services help Melbourne homeowners protect, restore and update the appearance of suitable roofing. Careful cleaning and preparation support strong adhesion and a durable, high-quality finish.',
    scopeTitle: 'Roof painting and preparation',
    scope: ['Concrete tile roofs', 'Metal roof painting', 'Suitable Colorbond repainting', 'Pressure washing', 'Suitable minor repairs before painting', 'Roof priming and sealing', 'Protective roof coatings', 'Roof restoration painting'],
    process: ['Roof inspection and quote', 'Pressure clean dirt, moss and loose coatings', 'Complete suitable minor repairs', 'Prime and seal where required', 'Apply premium roof coatings', 'Quality inspection and clean-up'],
    why: 'We place safety, preparation and attention to detail at the centre of every roof project. The coating system is selected for the roof material and current surface condition.',
    benefits: ['Cleaner, modern appearance', 'Protection from weather exposure', 'Longer roofing-material life', 'Improved street appeal'],
    related: ['exterior-painting-melbourne', 'residential-painting-melbourne'],
  },
  'fence-painting-melbourne': {
    eyebrow: 'A better boundary', title: 'Fence Painting', accent: 'fresh, even, protected.', tone: 'terracotta', image: stock.fence,
    intro: 'We paint new and weathered fences for residential and commercial properties across Melbourne. Brush and spray techniques create smooth, even coverage while surrounding gardens, paving and landscaping are carefully protected.',
    scopeTitle: 'Fence finishes for every property',
    scope: ['Timber paling fences', 'Fence spraying', 'New fence staining', 'Repainting and restoration', 'Boundary fences', 'Picket fences', 'Suitable Colorbond fence painting', 'Gates and timber screens', 'Pergolas and outdoor timber'],
    process: ['Inspection and written quote', 'Clean or pressure wash', 'Sand and complete minor repairs', 'Protect plants, paving and surroundings', 'Apply premium exterior finish', 'Inspect and clean the site'],
    why: 'Our team focuses on surface preparation, even coverage and durable coatings designed for Australian conditions, delivered with clear communication and minimal disruption.',
    benefits: ['Protection from moisture and UV', 'Longer timber lifespan', 'Reduced ongoing maintenance', 'A cohesive outdoor appearance'],
    related: ['exterior-painting-melbourne', 'deck-painting-staining-melbourne', 'residential-painting-melbourne'],
  },
  'deck-painting-staining-melbourne': {
    eyebrow: 'Bring outdoor timber back to life', title: 'Deck Painting & Staining', accent: 'made for living outside.', tone: 'gold', image: stock.deck,
    intro: 'We restore, protect and enhance Melbourne decks and outdoor timber. Regular maintenance helps timber stand up to sunlight, rain, moisture and foot traffic while preserving its natural character.',
    scopeTitle: 'Deck and timber services',
    scope: ['Timber deck painting', 'Deck staining and re-staining', 'Deck oiling', 'New timber finishes', 'Cleaning and pressure washing', 'Sanding and preparation', 'Suitable minor timber repairs', 'Pergola and outdoor timber coating'],
    process: ['Inspection and written quote', 'Clean dirt, mould and old coatings', 'Sand the timber surface', 'Complete suitable minor repairs', 'Apply stain, oil or paint', 'Inspect and clean the site'],
    why: 'Professional equipment, quality products and methodical preparation help create a durable result that suits the timber and Melbourne’s changing weather.',
    benefits: ['Moisture and UV protection', 'Enhanced natural grain', 'Improved outdoor presentation', 'Longer timber life'],
    related: ['fence-painting-melbourne', 'exterior-painting-melbourne', 'residential-painting-melbourne'],
  },
  'wallpaper-removal-melbourne': {
    eyebrow: 'A clean start for your walls', title: 'Wallpaper Removal', accent: 'ready for what comes next.', tone: 'teal', image: stock.wallpaper,
    intro: 'Professional wallpaper removal protects the plaster underneath and creates the smooth foundation required for a quality repaint. We remove old coverings, adhesive residue and minor surface damage with care.',
    scopeTitle: 'Wallpaper removal and preparation',
    scope: ['Wallpaper stripping', 'Vinyl wallpaper removal', 'Feature-wall removal', 'Adhesive and glue removal', 'Steam removal where appropriate', 'Surface cleaning', 'Minor plaster repairs', 'Sanding and priming before paint'],
    process: ['Inspect and quote', 'Protect floors and furniture', 'Use the suitable removal method', 'Remove adhesive and clean', 'Repair, sand and prepare', 'Prime ready for the next finish'],
    why: 'Our team selects a method suited to the wall covering and substrate, works carefully to minimise damage, and leaves the room clean and ready for painting or a new covering.',
    benefits: ['Less risk of plaster damage', 'Complete adhesive removal', 'Smooth paint-ready walls', 'Better long-term paint results'],
    related: ['interior-painting-melbourne', 'plaster-repairs-melbourne', 'residential-painting-melbourne'],
  },
  'plaster-repairs-melbourne': {
    eyebrow: 'Repair first. Finish beautifully.', title: 'Plaster Repairs', accent: 'smooth from every angle.', tone: 'cream', image: stock.plaster,
    intro: 'Damaged plaster affects both the appearance and durability of a painted finish. We restore walls and ceilings across Melbourne so surfaces are smooth, strong and properly prepared for painting.',
    scopeTitle: 'Wall and ceiling repairs',
    scope: ['Wall and ceiling cracks', 'Hole patching', 'Water-damaged plaster', 'Cornice repairs', 'Minor plasterboard replacement', 'Joint setting and sanding', 'Pre-paint surface preparation', 'Renovation touch-ups'],
    process: ['Inspect and quote', 'Assess the repair method', 'Remove loose material', 'Patch, set and sand', 'Prime and prepare for paint', 'Complete a final inspection'],
    why: 'Because quality painting starts with a stable, even surface, we take time to complete repairs correctly and blend them cleanly into the surrounding wall or ceiling.',
    benefits: ['Smooth, seamless appearance', 'Stronger walls and ceilings', 'A sound base for paint', 'Reduced further deterioration'],
    related: ['interior-painting-melbourne', 'wallpaper-removal-melbourne', 'residential-painting-melbourne'],
  },
}

export const faqs = [
  ['Do you provide free quotes?', 'Yes. We provide free, no-obligation quotes across Melbourne, including a project inspection, discussion of your requirements and a detailed written quotation.'],
  ['What areas do you service?', 'We service Melbourne and surrounding suburbs including Chadstone, Mount Waverley, Glen Waverley, Oakleigh, Mulgrave, Clayton, Dandenong, Berwick, Narre Warren and Endeavour Hills.'],
  ['Are you fully insured?', 'Yes. Superior Plus Painting is fully insured, giving you confidence that your property is protected throughout the project.'],
  ['What painting services do you offer?', 'We provide residential, commercial, interior, exterior, roof and fence painting, deck painting and staining, plaster repairs, wallpaper removal and related preparation services.'],
  ['How long will my project take?', 'Timing depends on the property size and surface condition. Most residential projects take several days to two weeks. We provide an estimated schedule before work begins.'],
  ['Do I need to move my furniture?', 'We recommend removing smaller personal items. Our team carefully protects furniture, flooring and fixtures before painting begins.'],
  ['Can you repair walls before painting?', 'Yes. We repair suitable plaster damage, fill cracks and holes, sand surfaces and prepare walls for a smooth professional finish.'],
  ['What type of paint do you use?', 'We use high-quality paint systems from trusted manufacturers and recommend products based on the surface, expected wear and your budget.'],
  ['Do you clean up after the project?', 'Absolutely. We remove masking and coverings, leave the property tidy and complete a final inspection before handover.'],
  ['How do I book my project?', 'Contact us to arrange a free consultation. Once you approve the written quotation, we schedule the project for a suitable time.'],
]
import { asset } from '../utils/assets'
