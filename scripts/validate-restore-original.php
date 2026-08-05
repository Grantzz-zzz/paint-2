<?php
/**
 * Focused restore-defaults regression harness without booting WordPress.
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'SPP_CONTENT_PATH', dirname( __DIR__ ) . '/wordpress-plugin/superior-plus-content/' );

$GLOBALS['spp_restore_updates'] = array();

function add_action() {}
function wp_update_post( $update ) {
	$GLOBALS['spp_restore_updates'][] = $update;
	return isset( $update['ID'] ) ? $update['ID'] : 0;
}
function is_wp_error() { return false; }
function sanitize_text_field( $value ) { return trim( (string) $value ); }
function sanitize_textarea_field( $value ) { return trim( (string) $value ); }
function sanitize_title( $value ) { return strtolower( preg_replace( '/[^a-z0-9]+/i', '-', trim( (string) $value ) ) ); }
function wp_kses_post( $value ) { return (string) $value; }
function absint( $value ) { return abs( (int) $value ); }
function spp_default_process() { return array( array( 'Inspect', 'Quote' ) ); }
function spp_suburbs() { return array( 'Chadstone' ); }
function spp_default_faqs() { return array( array( 'Original FAQ?', 'Original answer.' ) ); }
function spp_default_services() {
	return array(
		'residential-painting-melbourne' => array(
			'title' => 'Residential Painting',
			'intro' => 'Original residential introduction.',
		),
	);
}

require_once SPP_CONTENT_PATH . 'includes/class-spp-content-migration.php';

$migration = new SPP_Content_Migration( new stdClass() );
$method    = new ReflectionMethod( SPP_Content_Migration::class, 'restore_post_fields' );
$method->setAccessible( true );

$cases = array(
	array( (object) array( 'ID' => 11, 'post_type' => 'page' ), 'page:contact', 'Contact' ),
	array( (object) array( 'ID' => 12, 'post_type' => 'spp_service' ), 'service:residential-painting-melbourne', 'Residential Painting' ),
	array( (object) array( 'ID' => 13, 'post_type' => 'spp_article' ), 'article:how-often-repaint-house-melbourne', 'How Often Should You Repaint Your House in Melbourne? A Complete Guide' ),
	array( (object) array( 'ID' => 14, 'post_type' => 'spp_faq' ), 'faq:1', 'Original FAQ?' ),
	array( (object) array( 'ID' => 15, 'post_type' => 'spp_testimonial' ), 'testimonial:1', 'chen yangyang' ),
	array( (object) array( 'ID' => 16, 'post_type' => 'spp_project' ), 'project:roof', 'Roof Painting Showcase' ),
);

$failures = array();
foreach ( $cases as $case ) {
	$before = count( $GLOBALS['spp_restore_updates'] );
	$result = $method->invoke( $migration, $case[0], $case[1] );
	$update = count( $GLOBALS['spp_restore_updates'] ) > $before ? end( $GLOBALS['spp_restore_updates'] ) : array();
	if ( ! $result || ! isset( $update['post_title'] ) || $case[2] !== $update['post_title'] || 'publish' !== $update['post_status'] ) {
		$failures[] = $case[1];
	}
}

$before = count( $GLOBALS['spp_restore_updates'] );
$unsupported = $method->invoke( $migration, (object) array( 'ID' => 17, 'post_type' => 'spp_site_config' ), 'site-config' );
if ( $unsupported || count( $GLOBALS['spp_restore_updates'] ) !== $before ) {
	$failures[] = 'site-config-must-not-reset';
}

$result = array(
	'checked_record_types' => count( $cases ),
	'site_settings_protected' => ! in_array( 'site-config-must-not-reset', $failures, true ),
	'failures' => $failures,
);
echo json_encode( $result, JSON_PRETTY_PRINT ) . PHP_EOL;
exit( $failures ? 1 : 0 );
