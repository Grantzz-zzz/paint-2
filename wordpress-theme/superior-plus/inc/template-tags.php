<?php
/**
 * Shared presentation helpers.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_asset( $path ) {
	return SPP_URI . '/assets/images/' . ltrim( $path, '/' );
}

function spp_icon( $name ) {
	$icons = array(
		'arrow' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
		'check' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
		'phone' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
		'menu' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
		'close' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
		'plus' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
	);
	return $icons[ $name ] ?? '';
}

function spp_logo() {
	$custom_logo = get_theme_mod( 'custom_logo' );
	$image       = $custom_logo ? wp_get_attachment_image_url( $custom_logo, 'full' ) : spp_asset( 'logo.jpeg' );
	?>
	<a class="site-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
		<img src="<?php echo esc_url( $image ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
		<span class="site-brand-copy"><b><?php esc_html_e( 'Superior Plus', 'superior-plus' ); ?></b><small><?php esc_html_e( 'Painting & Remodeling', 'superior-plus' ); ?></small></span>
	</a>
	<?php
}

function spp_add_submenu_toggle( $item_output, $item ) {
	if ( in_array( 'menu-item-has-children', $item->classes, true ) ) {
		$item_output .= '<button class="submenu-toggle" aria-expanded="false" aria-label="' . esc_attr__( 'Toggle submenu', 'superior-plus' ) . '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>';
	}
	return $item_output;
}
add_filter( 'walker_nav_menu_start_el', 'spp_add_submenu_toggle', 10, 2 );

function spp_fallback_menu() {
	$pages = array( 'home' => 'Home', 'services' => 'Services', 'about' => 'About', 'our-process' => 'Our Process', 'faqs' => 'FAQs', 'contact' => 'Contact' );
	echo '<ul class="menu">';
	foreach ( $pages as $slug => $label ) {
		$children = 'services' === $slug ? get_posts( array( 'post_type' => 'spp_service', 'numberposts' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ) ) : array();
		echo '<li class="menu-item ' . ( $children ? 'menu-item-has-children' : '' ) . '"><a href="' . esc_url( 'home' === $slug ? home_url( '/' ) : home_url( '/' . $slug . '/' ) ) . '">' . esc_html( $label ) . '</a>';
		if ( $children ) {
			echo '<button class="submenu-toggle" aria-expanded="false" aria-label="' . esc_attr__( 'Toggle submenu', 'superior-plus' ) . '"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button><ul class="sub-menu">';
			foreach ( $children as $service ) {
				echo '<li><a href="' . esc_url( get_permalink( $service ) ) . '">' . esc_html( get_the_title( $service ) ) . '</a></li>';
			}
			echo '</ul>';
		}
		echo '</li>';
	}
	echo '</ul>';
}

function spp_breadcrumbs() {
	if ( is_front_page() ) {
		return;
	}
	echo '<nav class="breadcrumbs" aria-label="' . esc_attr__( 'Breadcrumb', 'superior-plus' ) . '"><div class="container"><span><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'superior-plus' ) . '</a><i>/</i>';
	if ( is_singular( 'spp_service' ) ) {
		echo '<a href="' . esc_url( home_url( '/services/' ) ) . '">' . esc_html__( 'Services', 'superior-plus' ) . '</a><i>/</i>';
	}
	echo '<span aria-current="page">' . esc_html( get_the_title() ) . '</span></span></div></nav>';
}

function spp_eyebrow( $text, $light = false ) {
	echo '<div class="eyebrow ' . ( $light ? 'text-white/75' : 'text-maroon' ) . '"><span class="eyebrow-line"></span>' . esc_html( $text ) . '</div>';
}

function spp_section_intro( $eyebrow, $title, $accent, $text = '', $light = false ) {
	?>
	<div class="inner-section-heading reveal">
		<div><?php spp_eyebrow( $eyebrow, $light ); ?><h2><?php echo esc_html( $title ); ?><br><em><?php echo esc_html( $accent ); ?></em></h2></div>
		<?php if ( $text ) : ?><p><?php echo esc_html( $text ); ?></p><?php endif; ?>
	</div>
	<?php
}

function spp_page_hero( $args ) {
	$args = wp_parse_args(
		$args,
		array( 'eyebrow' => '', 'title' => get_the_title(), 'accent' => '', 'intro' => '', 'tone' => 'maroon', 'image' => 'stock/residential.webp', 'image_url' => '', 'alt' => '' )
	);
	$image_url = $args['image_url'] ?: spp_asset( $args['image'] );
	?>
	<section class="page-hero page-hero-<?php echo esc_attr( $args['tone'] ); ?>">
		<div class="page-hero-paint paint-one"></div><div class="page-hero-paint paint-two"></div>
		<div class="container page-hero-grid">
			<div class="page-hero-copy"><?php spp_eyebrow( $args['eyebrow'] ); ?><h1><?php echo esc_html( $args['title'] ); ?><br><em><?php echo esc_html( $args['accent'] ); ?></em></h1><p><?php echo esc_html( $args['intro'] ); ?></p><div class="page-hero-actions"><a class="btn" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Get a free quote', 'superior-plus' ); ?><?php echo spp_icon( 'arrow' ); ?></a><a href="tel:<?php echo esc_attr( spp_phone_href() ); ?>" class="text-link"><?php echo spp_icon( 'phone' ); ?><?php echo esc_html( spp_phone() ); ?></a></div></div>
			<div class="page-hero-visual"><div class="page-image-frame"></div><img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $args['alt'] ?: $args['title'] ); ?>" fetchpriority="high"><span class="image-placeholder-note"><?php echo ( $args['image_url'] || str_starts_with( $args['image'], 'projects/' ) ) ? esc_html__( 'Superior Plus project', 'superior-plus' ) : esc_html__( 'Stock image · replace with project photography', 'superior-plus' ); ?></span></div>
		</div>
	</section>
	<?php
}

function spp_trust_strip() {
	$items = array( 'Fully insured', 'Free written quotes', 'Careful preparation', 'Clean, tidy sites' );
	echo '<section class="trust-strip"><div class="container">';
	foreach ( $items as $item ) {
		echo '<span>' . spp_icon( 'check' ) . esc_html( $item ) . '</span>';
	}
	echo '</div></section>';
}

function spp_closing_cta( $title = 'Ready for a fresh start?', $text = 'Tell us about your property and we’ll arrange a free, no-obligation quotation.' ) {
	?>
	<section class="closing-cta"><div class="closing-splash"></div><div class="container closing-cta-grid"><div class="reveal"><?php spp_eyebrow( 'Let’s talk colour', true ); ?><h2><?php echo esc_html( $title ); ?></h2><p><?php echo esc_html( $text ); ?></p></div><div class="closing-actions reveal"><a class="btn" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Request my free quote', 'superior-plus' ); ?><?php echo spp_icon( 'arrow' ); ?></a><a href="tel:<?php echo esc_attr( spp_phone_href() ); ?>"><?php echo spp_icon( 'phone' ); ?><?php echo esc_html( spp_phone() ); ?></a></div></div></section>
	<?php
}

function spp_areas_band() {
	?>
	<section class="inner-areas"><div class="container"><?php spp_section_intro( 'Melbourne-wide', 'Local service,', 'carefully delivered.', 'We work across Melbourne’s south-east and surrounding suburbs.' ); ?><div class="inner-suburbs"><?php foreach ( spp_suburbs() as $suburb ) : ?><span><?php echo esc_html( $suburb ); ?></span><?php endforeach; ?></div></div></section>
	<?php
}

function spp_testimonial_band() {
	?>
	<section class="testimonial-band"><div class="container testimonial-band-grid"><div class="reveal"><?php spp_eyebrow( 'Client feedback', true ); ?><h2>Work people feel<br><em>good about.</em></h2><p class="placeholder-disclosure">Placeholder testimonial — replace with a verified client review before launch.</p></div><div class="testimonial-band-card reveal"><blockquote>“The preparation and workmanship were excellent. The painters were friendly, punctual and delivered a high-quality finish.”</blockquote><b>Placeholder client review</b></div></div></section>
	<?php
}

function spp_quote_form_preview( $class = 'quote-form' ) {
	$shortcode = get_theme_mod( 'spp_form_shortcode', '' );
	if ( $shortcode ) {
		echo '<div class="' . esc_attr( $class ) . '">' . do_shortcode( $shortcode ) . '</div>';
		return;
	}
	?>
	<form class="<?php echo esc_attr( $class ); ?>" onsubmit="return false">
		<div class="form-title"><span><?php esc_html_e( 'Tell us about your project', 'superior-plus' ); ?></span><small><?php esc_html_e( 'Free · No obligation', 'superior-plus' ); ?></small></div>
		<div class="form-row"><label><?php esc_html_e( 'Your name', 'superior-plus' ); ?><input required></label><label><?php esc_html_e( 'Phone number', 'superior-plus' ); ?><input type="tel" required></label></div>
		<label><?php esc_html_e( 'Email address', 'superior-plus' ); ?><input type="email" required></label>
		<label><?php esc_html_e( 'What can we help with?', 'superior-plus' ); ?><textarea rows="4"></textarea></label>
		<button class="btn btn-wide"><?php esc_html_e( 'Request my free quote', 'superior-plus' ); ?><?php echo spp_icon( 'arrow' ); ?></button>
		<p class="form-note"><?php esc_html_e( 'Connect a form shortcode in the Customizer before launch.', 'superior-plus' ); ?></p>
	</form>
	<?php
}

function spp_project_gallery( $category ) {
	$counts = array( 'commercial' => 8, 'interior' => 10, 'exterior' => 9, 'fence' => 21, 'outdoor' => 2 );
	if ( empty( $counts[ $category ] ) ) {
		return;
	}
	$labels = array( 'commercial' => 'Commercial portfolio', 'interior' => 'Interior portfolio', 'exterior' => 'Exterior portfolio', 'fence' => 'Fence portfolio', 'outdoor' => 'Outdoor portfolio' );
	$projects = get_posts(
		array(
			'post_type'      => 'spp_project',
			'posts_per_page' => -1,
			'orderby'        => 'menu_order date',
			'order'          => 'DESC',
			'tax_query'      => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				array( 'taxonomy' => 'spp_project_category', 'field' => 'slug', 'terms' => $category ),
			),
		)
	);
	$custom_items = array_values( array_filter( $projects, static fn( $project ) => has_post_thumbnail( $project ) ) );
	$total = $custom_items ? count( $custom_items ) : $counts[ $category ];
	?>
	<section class="client-work"><div class="container"><?php spp_section_intro( $labels[ $category ], 'Real project work.', 'Completed with care.', 'Browse genuine project photography supplied by the Superior Plus team.' ); ?><div class="client-gallery-grid">
	<?php for ( $index = 1; $index <= $total; $index++ ) :
		if ( $custom_items ) {
			$project = $custom_items[ $index - 1 ];
			$url     = get_the_post_thumbnail_url( $project, 'large' );
			$alt     = get_the_title( $project );
		} else {
			$path = 'projects/' . $category . '/' . $category . '-' . str_pad( (string) $index, 2, '0', STR_PAD_LEFT ) . '.webp';
			$url  = spp_asset( $path );
			$alt  = ucfirst( $category ) . ' painting project by Superior Plus Painting';
		}
		?>
		<div class="reveal" <?php echo $index > 8 ? 'data-gallery-hidden hidden' : ''; ?>><button class="client-media-card <?php echo 1 === $index ? 'featured' : ''; ?>" data-gallery-open="<?php echo esc_url( $url ); ?>" data-gallery-alt="<?php echo esc_attr( $alt ); ?>"><img src="<?php echo esc_url( $url ); ?>" alt="<?php echo esc_attr( $alt ); ?>" loading="lazy"><span class="client-media-badge"><?php esc_html_e( 'Project photo', 'superior-plus' ); ?></span><i><?php echo spp_icon( 'plus' ); ?></i></button></div>
	<?php endfor; ?>
	</div><?php if ( $total > 8 ) : ?><button class="gallery-more" data-gallery-more><?php echo esc_html( sprintf( __( 'View all %d project photos', 'superior-plus' ), $total ) ); ?><?php echo spp_icon( 'plus' ); ?></button><?php endif; ?></div></section>
	<div class="media-lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Project image viewer', 'superior-plus' ); ?>" hidden><button class="lightbox-close" data-lightbox-close aria-label="<?php esc_attr_e( 'Close project viewer', 'superior-plus' ); ?>"><?php echo spp_icon( 'close' ); ?></button><div class="lightbox-media"><img alt=""><p></p></div></div>
	<?php
}
