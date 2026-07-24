<?php
/** Generic page template. @package SuperiorPlus */
get_header(); the_post();
if ( 'builder' === get_post_meta( get_the_ID(), '_elementor_edit_mode', true ) ) {
	echo '<main id="main-content" class="spp-elementor-page">';
	the_content();
	echo '</main>';
	get_footer();
	return;
}
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'Superior Plus Painting', 'title' => get_the_title(), 'accent' => 'made with care.', 'intro' => get_the_excerpt(), 'image' => 'projects/exterior/exterior-07.webp' ) ); ?>
	<section class="page-content"><div class="container entry-content"><?php the_content(); wp_link_pages(); ?></div></section>
	<?php spp_closing_cta(); ?>
</main>
<?php get_footer(); ?>
