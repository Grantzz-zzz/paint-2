<?php
/** Process page. @package SuperiorPlus */
get_header(); the_post();
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'A proven path to a better finish', 'title' => 'Our painting process', 'accent' => 'planned down to the detail.', 'intro' => get_the_excerpt() ?: 'Outstanding painting starts with careful planning, detailed preparation and clear communication.', 'tone' => 'gold', 'image' => 'projects/commercial/commercial-06.webp' ) ); spp_trust_strip(); ?>
	<section class="inner-section"><div class="container"><?php spp_section_intro( 'Six considered steps', 'Simple for you.', 'Meticulous from us.' ); ?><div class="wp-process-list"><?php foreach ( spp_default_process() as $index => $step ) : ?><article class="reveal"><b><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></b><div><h3><?php echo esc_html( $step[0] ); ?></h3><p><?php echo esc_html( $step[1] ); ?></p></div></article><?php endforeach; ?></div></div></section>
	<section class="process-proof"><div class="container"><?php spp_section_intro( 'Why it works', 'Preparation protects', 'the final result.', '', true ); ?><div class="quality-grid"><?php foreach ( array( 'Clear communication', 'Thorough preparation', 'High-quality workmanship', 'Respect for your property', 'Reliable scheduling', 'Attention to detail' ) as $item ) : ?><article class="reveal"><h3><?php echo esc_html( $item ); ?></h3></article><?php endforeach; ?></div></div></section>
	<?php spp_closing_cta( 'Ready to start the process?' ); ?>
</main>
<?php get_footer(); ?>
