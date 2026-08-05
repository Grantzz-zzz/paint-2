<?php
/**
 * Standalone regression for the service-edit publishing safeguard.
 */

define( 'ABSPATH', __DIR__ );
define( 'OBJECT', 'OBJECT' );
define( 'SPP_CONTENT_VERSION', '2.5.4' );
define( 'SPP_CONTENT_PATH', dirname( __DIR__ ) . '/wordpress-plugin/superior-plus-content/' );

$records = array(
	'residential-painting-melbourne' => (object) array(
		'ID'          => 101,
		'post_title'  => 'Residential Painting',
		'post_status' => 'draft',
	),
	'commercial-painting-melbourne' => (object) array(
		'ID'          => 102,
		'post_title'  => 'Commercial Painting',
		'post_status' => 'draft',
	),
	'interior-painting-melbourne' => (object) array(
		'ID'          => 103,
		'post_title'  => 'Interior Painting',
		'post_status' => 'publish',
	),
	'exterior-painting-melbourne' => (object) array(
		'ID'          => 104,
		'post_title'  => '',
		'post_status' => 'draft',
	),
	'roof-painting-melbourne' => (object) array(
		'ID'          => 105,
		'post_title'  => 'Roof Painting',
		'post_status' => 'draft',
	),
);
$meta = array(
	101 => array( '_spp_source_key' => 'service:residential-painting-melbourne', '_spp_managed_content' => 1 ),
	102 => array( '_spp_source_key' => 'service:commercial-painting-melbourne', '_spp_managed_content' => 0 ),
	103 => array( '_spp_source_key' => 'service:interior-painting-melbourne', '_spp_managed_content' => 1 ),
	104 => array( '_spp_source_key' => 'service:exterior-painting-melbourne', '_spp_managed_content' => 1 ),
	105 => array( '_spp_source_key' => 'custom:roof-painting-melbourne', '_spp_managed_content' => 1 ),
);
$post_updates = array();
$meta_updates = array();

function sanitize_title( $value ) {
	return strtolower( trim( preg_replace( '/[^a-z0-9-]+/i', '-', $value ), '-' ) );
}

function get_page_by_path( $slug, $output, $post_type ) {
	unset( $output, $post_type );
	global $records;
	return isset( $records[ $slug ] ) ? $records[ $slug ] : null;
}

function get_post_meta( $post_id, $key, $single ) {
	unset( $single );
	global $meta;
	return isset( $meta[ $post_id ][ $key ] ) ? $meta[ $post_id ][ $key ] : '';
}

function wp_update_post( $values ) {
	global $records, $post_updates;
	$post_updates[] = $values;
	foreach ( $records as $record ) {
		if ( (int) $record->ID === (int) $values['ID'] ) {
			$record->post_status = $values['post_status'];
		}
	}
	return (int) $values['ID'];
}

function update_post_meta( $post_id, $key, $value ) {
	global $meta, $meta_updates;
	$meta[ $post_id ][ $key ] = $value;
	$meta_updates[] = array( $post_id, $key, $value );
	return true;
}

require_once SPP_CONTENT_PATH . 'includes/class-spp-content-plugin.php';

$method = new ReflectionMethod( 'SPP_Content_Plugin', 'restore_canonical_services' );
$method->setAccessible( true );
$method->invoke( null );

$failures = array();
if ( 1 !== count( $post_updates ) || 101 !== (int) $post_updates[0]['ID'] || 'publish' !== $post_updates[0]['post_status'] ) {
	$failures[] = 'Only the original managed service auto-drafted by the old validator should be republished.';
}
if ( 'draft' !== $records['commercial-painting-melbourne']->post_status ) {
	$failures[] = 'An unmanaged draft was unexpectedly published.';
}
if ( 'publish' !== $records['interior-painting-melbourne']->post_status ) {
	$failures[] = 'An already-published service was changed.';
}
if ( 'draft' !== $records['exterior-painting-melbourne']->post_status ) {
	$failures[] = 'A blank-title service was unexpectedly published.';
}
if ( 'draft' !== $records['roof-painting-melbourne']->post_status ) {
	$failures[] = 'A record with a noncanonical source key was unexpectedly published.';
}
if ( '2.5.4' !== get_post_meta( 101, '_spp_recovered_by_version', true ) ) {
	$failures[] = 'The recovered service was not marked with the recovery version.';
}

echo json_encode(
	array(
		'checks'   => 6,
		'updates'  => count( $post_updates ),
		'failures' => $failures,
	),
	JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
) . PHP_EOL;

if ( $failures ) {
	exit( 1 );
}
