<?php
/** Not found template. @package SuperiorPlus */
get_header();
?>
<main id="main-content" class="inner-main"><section class="page-hero page-hero-maroon"><div class="container page-hero-grid"><div class="page-hero-copy"><?php spp_eyebrow( '404 error' ); ?><h1>That page has<br><em>moved on.</em></h1><p>Let’s get you back to the services and project information you need.</p><a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>">Return home<?php echo spp_icon( 'arrow' ); ?></a></div><div class="page-hero-visual"><img src="<?php echo esc_url( spp_asset( 'projects/exterior/exterior-07.webp' ) ); ?>" alt="Superior Plus exterior painting project"></div></div></section></main>
<?php get_footer(); ?>
