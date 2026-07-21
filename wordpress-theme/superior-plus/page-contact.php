<?php
/** Contact page. @package SuperiorPlus */
get_header(); the_post();
$shortcode = get_theme_mod( 'spp_form_shortcode', '' );
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'Tell us what you’re planning', 'title' => 'Get in touch', 'accent' => 'and get a fresh start.', 'intro' => get_the_excerpt() ?: 'Share a few details about your property and the work you have in mind.', 'tone' => 'green', 'image' => 'projects/exterior/exterior-07.webp' ) ); ?>
	<section class="quote-page"><div class="container quote-page-grid"><div class="quote-side reveal"><h2>What happens next?</h2><ol><li><b>We review your enquiry.</b><span>We confirm the service, property and best way to reach you.</span></li><li><b>We arrange an inspection.</b><span>Our team assesses the surfaces and discusses colours, finishes and timing.</span></li><li><b>You receive a written quote.</b><span>Clear scope, preparation and pricing—with no obligation.</span></li></ol><a href="tel:<?php echo esc_attr( spp_phone_href() ); ?>"><?php echo spp_icon( 'phone' ); ?><?php echo esc_html( spp_phone() ); ?></a><a href="mailto:<?php echo esc_attr( antispambot( spp_email() ) ); ?>"><?php echo esc_html( antispambot( spp_email() ) ); ?></a></div><div class="reveal"><?php if ( $shortcode ) : ?><div class="spp-contact-form"><?php echo do_shortcode( $shortcode ); ?></div><?php else : ?><form class="spp-contact-form" onsubmit="return false"><div class="form-heading"><span>Free quote request</span><small>Frontend preview</small></div><div class="form-row"><label>Name *<input required></label><label>Phone number *<input type="tel" required></label></div><div class="form-row"><label>Email *<input type="email" required></label><label>Suburb *<input required></label></div><label>Service required<select><option>Residential Painting</option><option>Commercial Painting</option><option>Interior Painting</option><option>Exterior Painting</option></select></label><label>Project details<textarea rows="5"></textarea></label><button class="btn btn-wide">Request my free quote<?php echo spp_icon( 'arrow' ); ?></button><p class="form-provider-note">Add a form shortcode under Appearance → Customize → Superior Plus business details to enable delivery.</p></form><?php endif; ?></div></div></section>
	<?php spp_areas_band(); ?>
</main>
<?php get_footer(); ?>
