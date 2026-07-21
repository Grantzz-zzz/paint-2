<?php
/** Generic page template. @package SuperiorPlus */
get_header(); the_post();
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'Superior Plus Painting', 'title' => get_the_title(), 'accent' => 'made with care.', 'intro' => get_the_excerpt(), 'image' => 'stock/residential.webp' ) ); ?>
	<section class="page-content"><div class="container entry-content"><?php the_content(); wp_link_pages(); ?></div></section>
	<?php spp_closing_cta(); ?>
</main>
<?php get_footer(); ?>
