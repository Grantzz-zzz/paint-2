<?php
/**
 * Exact React frontend shell.
 *
 * @package SuperiorPlus
 */

$spp_route    = spp_react_route_for_request();
$spp_manifest = json_decode( file_get_contents( SPP_PATH . '/react-dist/.vite/manifest.json' ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
$spp_entry    = isset( $spp_manifest['index.html'] ) ? $spp_manifest['index.html'] : array();
$spp_script   = isset( $spp_entry['file'] ) ? SPP_URI . '/react-dist/' . ltrim( $spp_entry['file'], '/' ) : '';
$spp_styles   = isset( $spp_entry['css'] ) ? $spp_entry['css'] : array();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#8f2824">
	<meta name="description" content="Premium residential and commercial painting across Melbourne, delivered with careful preparation, honest advice and quality workmanship.">
	<title><?php echo esc_html( get_bloginfo( 'name' ) ); ?></title>
	<?php foreach ( $spp_styles as $spp_stylesheet ) : ?>
		<link rel="stylesheet" href="<?php echo esc_url( SPP_URI . '/react-dist/' . ltrim( $spp_stylesheet, '/' ) ); ?>?ver=<?php echo esc_attr( SPP_VERSION ); ?>">
	<?php endforeach; ?>
	<script>window.__SPP_SITE_URL__=<?php echo wp_json_encode( trailingslashit( home_url( '/' ) ) ); ?>;</script>
</head>
<body <?php body_class( 'spp-react-frontend' ); ?>>
<?php if ( '/' !== $spp_route ) : ?>
	<script>
	if (!window.location.hash) {
		window.location.replace(<?php echo wp_json_encode( home_url( '/#' . $spp_route ) ); ?>);
	}
	</script>
<?php endif; ?>
<div id="root"></div>
<?php if ( $spp_script ) : ?>
	<script type="module" src="<?php echo esc_url( $spp_script ); ?>"></script>
<?php endif; ?>
</body>
</html>
