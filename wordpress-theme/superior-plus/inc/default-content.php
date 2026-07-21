<?php
/**
 * Default content used to seed an empty WordPress installation.
 * Existing content is never overwritten.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_default_services() {
	return array(
		'residential-painting-melbourne' => array(
			'title' => 'Residential Painting', 'eyebrow' => 'Painting for the way you live', 'accent' => 'that feels like home.', 'tone' => 'maroon', 'image' => 'projects/exterior/exterior-07.webp',
			'intro' => 'Superior Plus Painting provides professional residential painting across Melbourne for homeowners, landlords, builders and property managers. From a complete repaint to one carefully refreshed space, we deliver finishes that enhance the beauty, value and protection of your home.',
			'scope_title' => 'Complete residential painting services',
			'scope' => array( 'Interior house painting', 'Exterior house painting', 'New home painting', 'Repainting existing homes', 'Ceilings, walls and trims', 'Doors and window frames', 'Feature walls', 'Garage and roof painting', 'Fence and deck painting', 'Plaster repairs and preparation' ),
			'process' => array( 'Free consultation and written quote', 'Surface preparation and repairs', 'Priming where required', 'Professional paint application', 'Final inspection and site clean-up' ),
			'why' => 'Every project begins with a thorough inspection. We repair minor defects, fill cracks, sand surfaces and protect your furniture and flooring before applying high-quality coatings for a smooth, durable finish.',
			'benefits' => array( 'A fresh, cohesive home', 'Protection from everyday wear', 'Improved property presentation', 'Careful, low-disruption delivery' ),
		),
		'commercial-painting-melbourne' => array(
			'title' => 'Commercial Painting', 'eyebrow' => 'Commercial painting specialists', 'accent' => 'planned around business.', 'tone' => 'green', 'image' => 'projects/commercial/commercial-02.webp', 'gallery' => 'commercial',
			'intro' => 'We deliver reliable commercial painting across Melbourne for businesses, builders, property managers, body corporates and industrial facilities. Every project is carefully planned to reduce disruption while achieving a professional, durable result.',
			'scope_title' => 'Spaces and industries we paint',
			'scope' => array( 'Offices and workplaces', 'Retail shops and shopping centres', 'Warehouses and factories', 'Medical centres and clinics', 'Schools and childcare centres', 'Restaurants and cafés', 'Apartment complexes', 'Body corporate and strata', 'Interior and exterior commercial painting', 'Scheduled maintenance painting' ),
			'process' => array( 'Site inspection and detailed quote', 'Planning around business hours', 'Preparation, repairs and priming', 'Application of commercial coatings', 'Inspection, touch-ups and clean-up' ),
			'why' => 'Our painters maintain organised work sites, communicate clearly and work efficiently to reduce downtime. We select durable paint systems suited to busy commercial environments and the demands of each surface.',
			'benefits' => array( 'Flexible project scheduling', 'Minimal operational disruption', 'Consistent professional finish', 'Clear communication throughout' ),
		),
		'interior-painting-melbourne' => array(
			'title' => 'Interior Painting', 'eyebrow' => 'Clean lines, considered colour', 'accent' => 'made beautifully simple.', 'tone' => 'teal', 'image' => 'projects/interior/interior-04.webp', 'gallery' => 'interior',
			'intro' => 'We provide professional interior painting for homeowners, builders, landlords, property managers and businesses throughout Melbourne. Whether you are renovating, moving, preparing to sell or refreshing your space, we deliver clean modern finishes with careful preparation.',
			'scope_title' => 'Interior spaces and surfaces',
			'scope' => array( 'Walls and ceilings', 'Bedrooms and living rooms', 'Kitchens and dining areas', 'Bathrooms and laundries', 'Hallways and staircases', 'Doors and skirting boards', 'Architraves and window trims', 'Home offices and studies', 'Apartments and townhouses', 'Complete family homes' ),
			'process' => array( 'On-site consultation and quote', 'Fill cracks, sand and repair plaster', 'Prime where required', 'Apply premium paint systems', 'Inspect, touch up and clean' ),
			'why' => 'We take the time to protect furniture, floors and fixtures, then prepare each surface correctly. The result is an even, polished finish with crisp details and minimal disruption to your routine.',
			'benefits' => array( 'Brighter living spaces', 'Modernised colour and character', 'Protection from daily wear', 'A welcoming, sale-ready finish' ),
		),
		'exterior-painting-melbourne' => array(
			'title' => 'Exterior Painting', 'eyebrow' => 'Protection with street appeal', 'accent' => 'built for Melbourne.', 'tone' => 'terracotta', 'image' => 'projects/exterior/exterior-01.webp', 'gallery' => 'exterior',
			'intro' => 'Superior Plus Painting provides exterior painting for homes, townhouses, apartments and commercial properties. A professionally finished exterior improves street appeal while protecting surfaces from moisture, UV exposure and Melbourne’s changing weather.',
			'scope_title' => 'Complete exterior painting',
			'scope' => array( 'Weatherboards', 'Brick and rendered homes', 'Cladding', 'Fascia boards and eaves', 'Gutters and downpipes', 'Garage and front doors', 'Window frames and timber trims', 'Pergolas and outdoor structures', 'Full exterior house repaints' ),
			'process' => array( 'Site inspection and quote', 'Pressure wash and clean', 'Scrape, sand and complete minor repairs', 'Prime bare surfaces', 'Apply premium exterior coatings', 'Inspect, touch up and clean' ),
			'why' => 'Proper preparation is the foundation of a long-lasting exterior. We use proven techniques and quality materials, communicate clearly, work safely and leave every property clean and tidy.',
			'benefits' => array( 'Weather and UV protection', 'Longer material life', 'Reduced maintenance', 'Stronger street appeal and value' ),
		),
		'roof-painting-melbourne' => array(
			'title' => 'Roof Painting', 'eyebrow' => 'Restore the view from the street', 'accent' => 'protection from the top down.', 'tone' => 'maroon', 'image' => 'stock/roof.webp',
			'intro' => 'Our roof painting services help Melbourne homeowners protect, restore and update the appearance of suitable roofing. Careful cleaning and preparation support strong adhesion and a durable, high-quality finish.',
			'scope_title' => 'Roof painting and preparation',
			'scope' => array( 'Concrete tile roofs', 'Metal roof painting', 'Suitable Colorbond repainting', 'Pressure washing', 'Suitable minor repairs before painting', 'Roof priming and sealing', 'Protective roof coatings', 'Roof restoration painting' ),
			'process' => array( 'Roof inspection and quote', 'Pressure clean dirt, moss and loose coatings', 'Complete suitable minor repairs', 'Prime and seal where required', 'Apply premium roof coatings', 'Quality inspection and clean-up' ),
			'why' => 'We place safety, preparation and attention to detail at the centre of every roof project. The coating system is selected for the roof material and current surface condition.',
			'benefits' => array( 'Cleaner, modern appearance', 'Protection from weather exposure', 'Longer roofing-material life', 'Improved street appeal' ),
		),
		'fence-painting-melbourne' => array(
			'title' => 'Fence Painting', 'eyebrow' => 'A better boundary', 'accent' => 'fresh, even, protected.', 'tone' => 'terracotta', 'image' => 'projects/fence/fence-03.webp', 'gallery' => 'fence',
			'intro' => 'We paint new and weathered fences for residential and commercial properties across Melbourne. Brush and spray techniques create smooth, even coverage while surrounding gardens, paving and landscaping are carefully protected.',
			'scope_title' => 'Fence finishes for every property',
			'scope' => array( 'Timber paling fences', 'Fence spraying', 'New fence staining', 'Repainting and restoration', 'Boundary fences', 'Picket fences', 'Suitable Colorbond fence painting', 'Gates and timber screens', 'Pergolas and outdoor timber' ),
			'process' => array( 'Inspection and written quote', 'Clean or pressure wash', 'Sand and complete minor repairs', 'Protect plants, paving and surroundings', 'Apply premium exterior finish', 'Inspect and clean the site' ),
			'why' => 'Our team focuses on surface preparation, even coverage and durable coatings designed for Australian conditions, delivered with clear communication and minimal disruption.',
			'benefits' => array( 'Protection from moisture and UV', 'Longer timber lifespan', 'Reduced ongoing maintenance', 'A cohesive outdoor appearance' ),
		),
		'deck-painting-staining-melbourne' => array(
			'title' => 'Deck Painting & Staining', 'eyebrow' => 'Bring outdoor timber back to life', 'accent' => 'made for living outside.', 'tone' => 'gold', 'image' => 'projects/outdoor/outdoor-01.webp', 'gallery' => 'outdoor',
			'intro' => 'We restore, protect and enhance Melbourne decks and outdoor timber. Regular maintenance helps timber stand up to sunlight, rain, moisture and foot traffic while preserving its natural character.',
			'scope_title' => 'Deck and timber services',
			'scope' => array( 'Timber deck painting', 'Deck staining and re-staining', 'Deck oiling', 'New timber finishes', 'Cleaning and pressure washing', 'Sanding and preparation', 'Suitable minor timber repairs', 'Pergola and outdoor timber coating' ),
			'process' => array( 'Inspection and written quote', 'Clean dirt, mould and old coatings', 'Sand the timber surface', 'Complete suitable minor repairs', 'Apply stain, oil or paint', 'Inspect and clean the site' ),
			'why' => 'Professional equipment, quality products and methodical preparation help create a durable result that suits the timber and Melbourne’s changing weather.',
			'benefits' => array( 'Moisture and UV protection', 'Enhanced natural grain', 'Improved outdoor presentation', 'Longer timber life' ),
		),
		'wallpaper-removal-melbourne' => array(
			'title' => 'Wallpaper Removal', 'eyebrow' => 'A clean start for your walls', 'accent' => 'ready for what comes next.', 'tone' => 'teal', 'image' => 'stock/wallpaper.webp',
			'intro' => 'Professional wallpaper removal protects the plaster underneath and creates the smooth foundation required for a quality repaint. We remove old coverings, adhesive residue and minor surface damage with care.',
			'scope_title' => 'Wallpaper removal and preparation',
			'scope' => array( 'Wallpaper stripping', 'Vinyl wallpaper removal', 'Feature-wall removal', 'Adhesive and glue removal', 'Steam removal where appropriate', 'Surface cleaning', 'Minor plaster repairs', 'Sanding and priming before paint' ),
			'process' => array( 'Inspect and quote', 'Protect floors and furniture', 'Use the suitable removal method', 'Remove adhesive and clean', 'Repair, sand and prepare', 'Prime ready for the next finish' ),
			'why' => 'Our team selects a method suited to the wall covering and substrate, works carefully to minimise damage, and leaves the room clean and ready for painting or a new covering.',
			'benefits' => array( 'Less risk of plaster damage', 'Complete adhesive removal', 'Smooth paint-ready walls', 'Better long-term paint results' ),
		),
		'plaster-repairs-melbourne' => array(
			'title' => 'Plaster Repairs', 'eyebrow' => 'Repair first. Finish beautifully.', 'accent' => 'smooth from every angle.', 'tone' => 'cream', 'image' => 'projects/interior/interior-10.webp',
			'intro' => 'Damaged plaster affects both the appearance and durability of a painted finish. We restore walls and ceilings across Melbourne so surfaces are smooth, strong and properly prepared for painting.',
			'scope_title' => 'Wall and ceiling repairs',
			'scope' => array( 'Wall and ceiling cracks', 'Hole patching', 'Water-damaged plaster', 'Cornice repairs', 'Minor plasterboard replacement', 'Joint setting and sanding', 'Pre-paint surface preparation', 'Renovation touch-ups' ),
			'process' => array( 'Inspect and quote', 'Assess the repair method', 'Remove loose material', 'Patch, set and sand', 'Prime and prepare for paint', 'Complete a final inspection' ),
			'why' => 'Because quality painting starts with a stable, even surface, we take time to complete repairs correctly and blend them cleanly into the surrounding wall or ceiling.',
			'benefits' => array( 'Smooth, seamless appearance', 'Stronger walls and ceilings', 'A sound base for paint', 'Reduced further deterioration' ),
		),
	);
}

function spp_default_process() {
	return array(
		array( 'Free consultation & quote', 'We inspect the site, understand your goals, discuss colours and finishes, and provide a detailed no-obligation quotation.' ),
		array( 'Surface preparation', 'We clean, scrape, sand, fill, repair, seal and prime as required to create the right foundation.' ),
		array( 'Protecting your property', 'Furniture, floors, windows, gardens and surrounding areas are carefully covered and masked.' ),
		array( 'Professional painting', 'Premium coatings are applied with brushes, rollers or spray equipment using proven techniques.' ),
		array( 'Quality inspection', 'Every surface is checked and any required touch-ups are completed before sign-off.' ),
		array( 'Clean-up & handover', 'We remove coverings, clean the work area and complete a final walkthrough with you.' ),
	);
}

function spp_default_faqs() {
	return array(
		array( 'Do you provide free quotes?', 'Yes. We provide free, no-obligation quotes across Melbourne, including a project inspection, discussion of your requirements and a detailed written quotation.' ),
		array( 'What areas do you service?', 'We service Melbourne and surrounding suburbs including Chadstone, Mount Waverley, Glen Waverley, Oakleigh, Mulgrave, Clayton, Dandenong, Berwick, Narre Warren and Endeavour Hills.' ),
		array( 'Are you fully insured?', 'Yes. Superior Plus Painting is fully insured, giving you confidence that your property is protected throughout the project.' ),
		array( 'What painting services do you offer?', 'We provide residential, commercial, interior, exterior, roof and fence painting, deck painting and staining, plaster repairs, wallpaper removal and related preparation services.' ),
		array( 'How long will my project take?', 'Timing depends on the property size and surface condition. Most residential projects take several days to two weeks. We provide an estimated schedule before work begins.' ),
		array( 'Do I need to move my furniture?', 'We recommend removing smaller personal items. Our team carefully protects furniture, flooring and fixtures before painting begins.' ),
		array( 'Can you repair walls before painting?', 'Yes. We repair suitable plaster damage, fill cracks and holes, sand surfaces and prepare walls for a smooth professional finish.' ),
		array( 'What type of paint do you use?', 'We use high-quality paint systems from trusted manufacturers and recommend products based on the surface, expected wear and your budget.' ),
		array( 'Do you clean up after the project?', 'Absolutely. We remove masking and coverings, leave the property tidy and complete a final inspection before handover.' ),
		array( 'How do I book my project?', 'Contact us to arrange a free consultation. Once you approve the written quotation, we schedule the project for a suitable time.' ),
	);
}

function spp_suburbs() {
	return array( 'Chadstone', 'Mount Waverley', 'Glen Waverley', 'Oakleigh', 'Mulgrave', 'Clayton', 'Burwood', 'Ashwood', 'Dandenong', 'Noble Park', 'Springvale', 'Keysborough', 'Berwick', 'Narre Warren', 'Endeavour Hills' );
}

