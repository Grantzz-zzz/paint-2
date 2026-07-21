<?php
/** Services directory. @package SuperiorPlus */
get_header(); the_post();
$services = get_posts( array( 'post_type' => 'spp_service', 'numberposts' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ) );
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'Everything under one careful eye', 'title' => 'Painting & property services', 'accent' => 'made beautifully simple.', 'intro' => get_the_excerpt() ?: 'From complete residential and commercial painting to the preparation and repairs behind a lasting finish, our team can coordinate more of your project from one place.', 'tone' => 'gold', 'image' => 'projects/commercial/commercial-02.webp' ) ); spp_trust_strip(); ?>
	<section class="inner-section"><div class="container"><?php spp_section_intro( 'Core painting services', 'Choose your surface.', 'We’ll handle the finish.', 'Explore each service for detailed scope, preparation and process information.' ); ?><div class="wp-service-grid"><?php foreach ( $services as $index => $service ) : $tone = get_post_meta( $service->ID, 'spp_tone', true ) ?: 'maroon'; ?><a class="wp-service-card tone-<?php echo esc_attr( $tone ); ?> reveal" href="<?php echo esc_url( get_permalink( $service ) ); ?>"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><h3><?php echo esc_html( get_the_title( $service ) ); ?></h3><p><?php echo esc_html( get_the_excerpt( $service ) ); ?></p><?php echo spp_icon( 'arrow' ); ?></a><?php endforeach; ?></div></div></section>
	<section class="inner-section cream"><div class="container"><?php spp_section_intro( 'More ways we can help', 'Preparation, repairs', 'and property care.', 'Complementary services make renovation and maintenance projects easier to coordinate.' ); ?><div class="extras-grid"><?php foreach ( array( 'Carpentry services', 'Caulking & gap sealing', 'Tiling services', 'Timber restoration', 'Surface preparation', 'Property maintenance' ) as $index => $item ) : ?><article class="reveal"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><h3><?php echo esc_html( $item ); ?></h3><p>Ask our team whether this supporting service is suitable for your project.</p></article><?php endforeach; ?></div></div></section>
	<?php spp_closing_cta( 'Not sure which service you need?', 'Tell us what you can see and what you want to change. We’ll recommend the right preparation and finish.' ); ?>
</main>
<?php get_footer(); ?>
