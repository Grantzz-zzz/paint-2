<?php
/**
 * Exact React frontend shell.
 *
 * @package SuperiorPlus
 */

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#8f2824">
	<style id="spp-boot-fallback-style">.spp-boot-fallback{min-height:100vh;display:grid;place-items:center;padding:32px;background:#fbf6ec;color:#18211e;font-family:Arial,sans-serif;text-align:center}.spp-boot-fallback div{max-width:440px}.spp-boot-fallback img{display:block;width:min(220px,70vw);height:auto;margin:0 auto 24px}.spp-boot-fallback strong{display:block;font-size:1.5rem}.spp-boot-fallback p{line-height:1.6}.spp-boot-fallback a{display:inline-block;margin:5px 8px;color:#8f2824;font-weight:700}</style>
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'spp-react-frontend' ); ?>>
	<?php wp_body_open(); ?>
	<div id="root"><div class="spp-boot-fallback" role="status"><div><img src="<?php echo esc_url( SPP_URI . '/assets/images/logo.jpeg' ); ?>" alt="Superior Plus Painting &amp; Remodeling"><strong><?php esc_html_e( 'Superior Plus Painting', 'superior-plus' ); ?></strong><p><?php esc_html_e( 'Loading the current website content…', 'superior-plus' ); ?></p><a href="tel:0470234567"><?php esc_html_e( 'Call 0470 234 567', 'superior-plus' ); ?></a><a href="mailto:sppainting.remodeling@gmail.com"><?php esc_html_e( 'Email our team', 'superior-plus' ); ?></a></div></div></div>
	<?php wp_footer(); ?>
</body>
</html>
