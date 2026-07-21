<?php
/** About page. @package SuperiorPlus */
get_header(); the_post();
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'Your trusted Melbourne painters', 'title' => 'Care in every coat.', 'accent' => 'Pride in every detail.', 'intro' => get_the_excerpt() ?: 'A Melbourne-based team dedicated to high-quality residential and commercial painting with reliable service and honest communication.', 'tone' => 'green', 'image' => 'projects/fence/fence-03.webp', 'alt' => 'Superior Plus painter spray painting a residential fence' ) ); ?>
	<?php spp_trust_strip(); ?>
	<section class="inner-section"><div class="container editorial-grid"><div class="reveal"><?php spp_section_intro( 'Our approach', 'Quality begins', 'before the first coat.' ); ?><div class="entry-content"><?php the_content(); ?></div><p>From small residential touch-ups to complete home repaints and large commercial projects, we approach every job with professionalism, honesty and pride.</p><p>Clear communication, reliable scheduling and a clean handover matter just as much as the paint itself.</p></div><div class="editorial-image reveal"><img src="<?php echo esc_url( spp_asset( 'projects/fence/fence-03.webp' ) ); ?>" alt="Superior Plus painter at work" loading="lazy"><span>Superior Plus project</span></div></div></section>
	<section class="inner-section cream"><div class="container brand-archive"><div class="reveal"><img src="<?php echo esc_url( spp_asset( 'projects/brand/brand-01.webp' ) ); ?>" alt="Original Superior Plus promotional artwork" loading="lazy"></div><div class="reveal"><?php spp_section_intro( 'Our local roots', 'Built through', 'hands-on service.' ); ?><p>Superior Plus has grown through practical local promotion, direct client relationships and work that can be seen across Melbourne homes and businesses.</p><small>Original client-supplied promotional artwork retained as part of the company archive.</small></div></div></section>
	<section class="inner-section"><div class="container"><?php spp_section_intro( 'Why Superior Plus', 'Standards you can see.', 'Service you can feel.' ); ?><div class="quality-grid"><?php foreach ( array( 'Experienced, professional painters', 'High-quality workmanship', 'Attention to every detail', 'Reliable communication', 'Clean and tidy sites', 'Competitive, transparent pricing', 'Fully insured', 'Free, no-obligation quotes' ) as $index => $item ) : ?><article class="reveal"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><h3><?php echo esc_html( $item ); ?></h3></article><?php endforeach; ?></div></div></section>
	<?php spp_testimonial_band(); spp_areas_band(); spp_closing_cta(); ?>
</main>
<?php get_footer(); ?>
