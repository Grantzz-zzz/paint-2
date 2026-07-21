<?php
/**
 * Site header.
 *
 * @package SuperiorPlus
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main-content"><?php esc_html_e( 'Skip to main content', 'superior-plus' ); ?></a>
<header class="nav-shell" role="banner">
	<div class="nav-inner">
		<?php spp_logo(); ?>
		<nav class="nav-links" data-site-navigation aria-label="<?php esc_attr_e( 'Primary navigation', 'superior-plus' ); ?>">
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'fallback_cb' => 'spp_fallback_menu', 'depth' => 2 ) ); ?>
		</nav>
		<div class="nav-actions"><a href="tel:<?php echo esc_attr( spp_phone_href() ); ?>"><?php echo spp_icon( 'phone' ); ?><?php echo esc_html( spp_phone() ); ?></a><a class="btn btn-small" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Free quote', 'superior-plus' ); ?><?php echo spp_icon( 'arrow' ); ?></a></div>
		<button class="menu-btn" data-menu-toggle aria-label="<?php esc_attr_e( 'Toggle menu', 'superior-plus' ); ?>" aria-expanded="false"><span class="menu-open-icon"><?php echo spp_icon( 'menu' ); ?></span><span class="menu-close-icon"><?php echo spp_icon( 'close' ); ?></span></button>
	</div>
</header>
<div class="site-content">

