<?php
/**
 * Standalone structural checks for the companion plugin.
 */

$root   = dirname( __DIR__ );
$plugin = $root . '/wordpress-plugin/superior-plus-content';
$theme  = $root . '/wordpress-theme/superior-plus';

$required = array(
	'superior-plus-content.php',
	'uninstall.php',
	'readme.txt',
	'assets/admin.css',
	'assets/admin.js',
	'includes/class-spp-content-plugin.php',
	'includes/class-spp-content-types.php',
	'includes/class-spp-content-fields.php',
	'includes/class-spp-content-rest.php',
	'includes/class-spp-content-workflow.php',
	'includes/class-spp-content-routing.php',
);

$missing = array_values(
	array_filter(
		$required,
		function ( $path ) use ( $plugin ) {
			return ! file_exists( $plugin . '/' . $path );
		}
	)
);

$all_php = '';
foreach ( glob( $plugin . '/includes/*.php' ) as $file ) {
	$all_php .= file_get_contents( $file );
}
$all_php .= file_get_contents( $plugin . '/superior-plus-content.php' );

$checks = array(
	'content_types' => array(
		'spp_service',
		'spp_project',
		'spp_testimonial',
		'spp_faq',
		'spp_site_config',
	),
	'rest_routes'   => array(
		'/bootstrap',
		'/routes',
		'/services',
		"'projects', 'faqs', 'testimonials'",
		'/export',
		'/preview/',
	),
	'protections'   => array(
		'manage_spp_content',
		'manage_spp_system',
		'wp_verify_nonce',
		'sanitize_email',
		'esc_url_raw',
		'sanitize_attachment',
		'_spp_client_modified_at',
		'_spp_managed_content',
		'_spp_design_variant',
		'check_admin_referer',
		'spp_react_route',
		'spp_sitemap',
		'robots_txt',
		'spp_content_routes_version',
		'after_switch_theme',
		'maybe_refresh_rewrites',
	),
	'media'         => array(
		'wp_enqueue_media',
		'spp_gallery_items',
		'poster_attachment_id',
		'object_position',
	),
);

$failed_checks = array();
foreach ( $checks as $group => $needles ) {
	foreach ( $needles as $needle ) {
		if ( false === strpos( $all_php, $needle ) ) {
			$failed_checks[] = $group . ': ' . $needle;
		}
	}
}

$theme_functions = file_get_contents( $theme . '/functions.php' );
$installer       = file_get_contents( $theme . '/inc/installer.php' );
$theme_compatible = false !== strpos( $theme_functions, "defined( 'SPP_CONTENT_VERSION' )" )
	&& false !== strpos( $installer, 'spp_ensure_content_types_registered' );

$result = array(
	'plugin_version'       => preg_match( '/Version:\s*([0-9.]+)/', file_get_contents( $plugin . '/superior-plus-content.php' ), $matches ) ? $matches[1] : null,
	'required_files'       => count( $required ),
	'missing_files'        => $missing,
	'failed_checks'        => $failed_checks,
	'theme_compatibility'  => $theme_compatible,
	'content_type_count'   => count( $checks['content_types'] ),
	'public_route_count'   => 8,
	'protected_route_count' => 2,
);

echo json_encode( $result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . PHP_EOL;

if ( $missing || $failed_checks || ! $theme_compatible || '0.4.0' !== $result['plugin_version'] ) {
	exit( 1 );
}
