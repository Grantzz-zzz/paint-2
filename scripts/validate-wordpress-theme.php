<?php
/** Standalone checks that do not require a WordPress installation. */

define( 'ABSPATH', __DIR__ );
require dirname( __DIR__ ) . '/wordpress-theme/superior-plus/inc/default-content.php';

$theme    = dirname( __DIR__ ) . '/wordpress-theme/superior-plus';
$services = spp_default_services();
$missing  = array();

foreach ( $services as $slug => $service ) {
	$path = $theme . '/assets/images/' . $service['image'];
	if ( ! file_exists( $path ) ) {
		$missing[] = $slug . ': ' . $service['image'];
	}
}

$result = array(
	'services'       => count( $services ),
	'process_steps'  => count( spp_default_process() ),
	'faqs'           => count( spp_default_faqs() ),
	'missing_assets' => $missing,
);

echo json_encode( $result, JSON_PRETTY_PRINT );

if ( 9 !== count( $services ) || 6 !== count( spp_default_process() ) || 10 !== count( spp_default_faqs() ) || $missing ) {
	exit( 1 );
}
