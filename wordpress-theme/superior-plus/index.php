<?php
/** Fallback and posts index. @package SuperiorPlus */
get_header();
?>
<main id="main-content" class="inner-main">
	<section class="page-content"><div class="container"><h1><?php echo esc_html( is_home() ? get_the_title( get_option( 'page_for_posts' ) ) : __( 'Latest updates', 'superior-plus' ) ); ?></h1>
	<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?><article <?php post_class( 'wp-content-band' ); ?>><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_excerpt(); ?></article><?php endwhile; the_posts_pagination(); else : ?><p class="empty-state"><?php esc_html_e( 'No content was found.', 'superior-plus' ); ?></p><?php endif; ?>
	</div></section>
</main>
<?php get_footer(); ?>
