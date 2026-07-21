<?php
/**
 * Homepage template.
 *
 * @package SuperiorPlus
 */
get_header();
$home_id        = (int) get_option( 'page_on_front' );
$elementor_data = $home_id ? get_post_meta( $home_id, '_elementor_data', true ) : '';
if ( $home_id && ! empty( $elementor_data ) ) {
	while ( have_posts() ) {
		the_post();
		echo '<main id="main-content" class="spp-elementor-page">';
		the_content();
		echo '</main>';
	}
	get_footer();
	return;
}
$services = get_posts( array( 'post_type' => 'spp_service', 'numberposts' => 8, 'orderby' => 'menu_order', 'order' => 'ASC' ) );
?>
<main id="main-content">
	<section class="wp-home-hero">
		<div class="hero-bg"><img src="<?php echo esc_url( spp_asset( 'hero-painter.png' ) ); ?>" alt="<?php esc_attr_e( 'Professional painter applying a deep red finish', 'superior-plus' ); ?>" fetchpriority="high"></div>
		<div class="paint-ribbon ribbon-green"></div><div class="paint-ribbon ribbon-gold"></div>
		<div class="container hero-content"><div class="hero-copy reveal"><?php spp_eyebrow( 'Melbourne painters who care' ); ?><h1>Made to feel<br><em>beautiful.</em><br>Made to last.</h1><p>Premium residential and commercial painting, delivered with careful preparation, honest advice and a finish we’re proud to put our name on.</p><div class="hero-buttons"><a class="btn" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Get a free quote<?php echo spp_icon( 'arrow' ); ?></a><a class="text-link" href="#projects">See our work <span>↘</span></a></div><div class="hero-trust"><span><?php echo spp_icon( 'check' ); ?>Fully insured</span><span><?php echo spp_icon( 'check' ); ?>Free colour advice</span><span><?php echo spp_icon( 'check' ); ?>Melbourne-wide</span></div></div></div>
		<div class="hero-stamp"><span>Quality finish</span><b>100%</b><small>Every detail</small></div>
	</section>

	<section class="section services-section"><div class="container"><?php spp_section_intro( 'What we do', 'Every surface.', 'Finished with care.', 'From family homes to active commercial spaces, we prepare properly, protect carefully and finish beautifully.' ); ?><div class="wp-service-grid home-service-grid">
		<?php foreach ( $services as $index => $service ) : $tone = get_post_meta( $service->ID, 'spp_tone', true ) ?: 'maroon'; ?>
			<a class="wp-service-card tone-<?php echo esc_attr( $tone ); ?> reveal" href="<?php echo esc_url( get_permalink( $service ) ); ?>"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><h3><?php echo esc_html( get_the_title( $service ) ); ?></h3><p><?php echo esc_html( get_the_excerpt( $service ) ); ?></p><?php echo spp_icon( 'arrow' ); ?></a>
		<?php endforeach; ?>
	</div></div></section>

	<section class="commercial"><div class="texture"></div><div class="container"><div class="commercial-top"><div><?php spp_eyebrow( 'Commercial capability', true ); ?><h2>Big spaces.<br><em>Minimal disruption.</em></h2></div><div><p>Reliable painting for offices, retail, warehouses, strata and managed properties—scheduled around the way your organisation works.</p><div class="business-tags"><span>Offices</span><span>Retail</span><span>Warehouses</span><span>Strata</span><span>Property management</span></div></div></div><div class="process-wrap"><div class="process-label"><span>Our approach</span><p>A clear path from quote to handover.</p></div><div class="process-grid"><?php foreach ( array_slice( spp_default_process(), 0, 5 ) as $index => $step ) : ?><div class="process-step"><b><?php echo esc_html( '0' . ( $index + 1 ) ); ?></b><span><?php echo esc_html( $step[0] ); ?></span><?php if ( $index < 4 ) : ?><i></i><?php endif; ?></div><?php endforeach; ?></div></div></div>
	</section>

	<section id="projects" class="wp-projects"><div class="container"><?php spp_section_intro( 'Recent work', 'Real properties.', 'Real transformations.', 'Client-supplied photography from completed Superior Plus projects across Melbourne.' ); ?><div class="wp-project-grid"><article class="wp-project-card"><img src="<?php echo esc_url( spp_asset( 'projects/interior/interior-04.webp' ) ); ?>" alt="Completed modern interior painting project" loading="lazy"><span>Interior project · Melbourne</span></article><article class="wp-project-card"><img src="<?php echo esc_url( spp_asset( 'projects/exterior/exterior-07.webp' ) ); ?>" alt="Completed exterior house painting project" loading="lazy"><span>Exterior transformation</span></article><article class="wp-project-card"><img src="<?php echo esc_url( spp_asset( 'projects/commercial/commercial-02.webp' ) ); ?>" alt="Commercial painting project" loading="lazy"><span>Commercial precision</span></article></div></div></section>

	<section class="wp-content-band"><div class="container wp-two-column"><div class="reveal"><?php spp_eyebrow( 'Why Superior Plus' ); ?><h2>Good work is<br><em>in the details.</em></h2><p>We combine thoughtful preparation, reliable communication and professional application to make each project feel straightforward from the first quote to the final walkthrough.</p><a class="btn" href="<?php echo esc_url( home_url( '/about/' ) ); ?>">Meet Superior Plus<?php echo spp_icon( 'arrow' ); ?></a></div><div class="trust-cards"><?php foreach ( array( 'Careful preparation' => 'A lasting finish starts before the first coat.', 'Clear communication' => 'Practical updates and reliable scheduling.', 'Respectful sites' => 'Protection, organisation and a clean handover.', 'Quality materials' => 'Paint systems selected for each surface.' ) as $title => $text ) : ?><article class="reveal"><span><?php echo spp_icon( 'check' ); ?></span><h3><?php echo esc_html( $title ); ?></h3><p><?php echo esc_html( $text ); ?></p></article><?php endforeach; ?></div></div></section>

	<section class="areas"><div class="container areas-layout"><div class="reveal"><?php spp_eyebrow( 'Where we work', true ); ?><h2>Melbourne-wide.<br><em>Locally focused.</em></h2><p>Based in Melbourne and working throughout the south-east, we bring the same care and communication to every suburb.</p></div><div class="suburb-cloud"><?php foreach ( spp_suburbs() as $index => $suburb ) : ?><span class="chip chip-<?php echo esc_attr( ( $index % 3 ) + 1 ); ?>"><?php echo esc_html( $suburb ); ?></span><?php endforeach; ?></div></div></section>

	<section class="section testimonials"><div class="container testimonial-layout"><div class="reveal"><?php spp_eyebrow( 'What clients say' ); ?><h2>Work people feel<br><em>good about.</em></h2><p class="placeholder-disclosure">Placeholder testimonial — replace with a verified client review before launch.</p></div><div class="quote-card reveal"><div class="stars">★★★★★</div><blockquote>“The preparation and workmanship were excellent. The painters were friendly, punctual and delivered a high-quality finish.”</blockquote><div class="quote-by"><b>Placeholder client review</b><span>Residential painting</span></div></div></div></section>

	<section class="contact"><div class="contact-blob"></div><div class="container contact-layout"><div class="contact-copy reveal"><?php spp_eyebrow( 'Start with a conversation', true ); ?><h2>Let’s make your<br><em>space feel new.</em></h2><p>Tell us what you are planning and we’ll arrange a free consultation and written quotation.</p><div class="contact-direct"><a href="tel:<?php echo esc_attr( spp_phone_href() ); ?>"><span><?php echo spp_icon( 'phone' ); ?></span><div><small>Call us</small><b><?php echo esc_html( spp_phone() ); ?></b></div></a><a href="mailto:<?php echo esc_attr( antispambot( spp_email() ) ); ?>"><div><small>Email us</small><b><?php echo esc_html( antispambot( spp_email() ) ); ?></b></div></a></div></div><div class="reveal"><?php spp_quote_form_preview(); ?></div></div></section>
</main>
<?php get_footer(); ?>
