<?php
/** Single project template. @package SuperiorPlus */
get_header(); the_post();
$image = has_post_thumbnail() ? get_the_post_thumbnail_url( get_the_ID(), 'full' ) : '';
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); spp_page_hero( array( 'eyebrow' => 'Superior Plus project', 'title' => get_the_title(), 'accent' => 'completed with care.', 'intro' => get_the_excerpt(), 'tone' => 'green', 'image' => 'projects/exterior/exterior-07.webp', 'image_url' => $image ) ); ?>
	<section class="page-content"><div class="container entry-content"><?php the_content(); ?></div></section>
	<?php spp_closing_cta( 'Planning something similar?' ); ?>
</main>
<?php get_footer(); ?>
