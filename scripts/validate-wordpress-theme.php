<?php
/** Standalone checks that do not require a WordPress installation. */

define( 'ABSPATH', __DIR__ );
require dirname( __DIR__ ) . '/wordpress-theme/superior-plus/inc/default-content.php';

$theme    = dirname( __DIR__ ) . '/wordpress-theme/superior-plus';
$services = spp_default_services();
$missing  = array();
$functions = file_get_contents( $theme . '/functions.php' );
$react_shell = file_get_contents( $theme . '/react-app.php' );
$seo_owner_guard = false !== strpos( $functions, "defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' )" )
	&& false !== strpos( $functions, 'window.__SPP_SEO_SERVER_MANAGED__' );
$wordpress_shell_hooks = false !== strpos( $react_shell, 'wp_head();' )
	&& false !== strpos( $react_shell, 'wp_body_open();' )
	&& false !== strpos( $react_shell, 'wp_footer();' )
	&& false !== strpos( $react_shell, 'spp-boot-fallback' );
$stable_module_identity = false !== strpos( $functions, "wp_enqueue_script( 'spp-react-app'" )
	&& false !== strpos( $functions, "array(), null, true" )
	&& false === strpos( $functions, "wp_add_inline_script(\n\t\t'spp-react-app'" );
$runtime_bridge = false !== strpos( $functions, "add_action( 'wp_head', 'spp_print_runtime_config', 1 )" )
	&& false !== strpos( $functions, "'id' => 'spp-react-runtime-config'" )
	&& false !== strpos( $functions, 'window.__SPP_CONTENT_API__' );
$builder_isolation = false !== strpos( $functions, "add_action( 'wp_enqueue_scripts', 'spp_dequeue_builder_assets', PHP_INT_MAX )" )
	&& false !== strpos( $functions, "'wp_print_footer_scripts'" )
	&& false !== strpos( $functions, "'elementor'" );

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
	'seo_owner_guard' => $seo_owner_guard,
	'wordpress_shell_hooks' => $wordpress_shell_hooks,
	'stable_module_identity' => $stable_module_identity,
	'runtime_bridge' => $runtime_bridge,
	'builder_isolation' => $builder_isolation,
);

echo json_encode( $result, JSON_PRETTY_PRINT );

if ( 9 !== count( $services ) || 6 !== count( spp_default_process() ) || 10 !== count( spp_default_faqs() ) || $missing || ! $seo_owner_guard || ! $wordpress_shell_hooks || ! $stable_module_identity || ! $runtime_bridge || ! $builder_isolation ) {
	exit( 1 );
}
