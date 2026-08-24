<?php
/**
 * Standalone behavioural checks for the SEO cleanup layer.
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'OBJECT', 'OBJECT' );

$registered_types = array();
$spp_test_queried_id = 0;
$spp_test_meta = array();
$spp_test_singular = false;
$spp_test_is_404 = false;
$spp_test_permalink = '';
$spp_test_route = '';

function add_action() {}
function add_filter() {}
function register_taxonomy() {}
function __( $value ) { return $value; }
function get_queried_object_id() {
	global $spp_test_queried_id;
	return $spp_test_queried_id;
}
function get_post_meta( $post_id, $key, $single = false ) {
	global $spp_test_meta;
	unset( $single );
	return isset( $spp_test_meta[ $post_id ][ $key ] ) ? $spp_test_meta[ $post_id ][ $key ] : '';
}
function is_singular( $post_types = '' ) {
	global $spp_test_singular;
	unset( $post_types );
	return $spp_test_singular;
}
function is_404() {
	global $spp_test_is_404;
	return $spp_test_is_404;
}
function get_permalink( $post_id ) {
	global $spp_test_permalink;
	unset( $post_id );
	return $spp_test_permalink;
}
function get_query_var( $key ) {
	global $spp_test_route;
	return 'spp_react_route' === $key ? $spp_test_route : '';
}
function sanitize_text_field( $value ) { return trim( strip_tags( $value ) ); }
function home_url( $path = '/' ) { return 'https://sppaintingremodeling.com.au' . $path; }
function register_post_type( $name, $args ) {
	global $registered_types;
	$registered_types[ $name ] = $args;
}

require dirname( __DIR__ ) . '/wordpress-plugin/superior-plus-content/includes/class-spp-content-types.php';
require dirname( __DIR__ ) . '/wordpress-plugin/superior-plus-content/includes/class-spp-content-seo.php';

$types = new SPP_Content_Types( false );
$types->register();

$failures = array();
$check = function ( $condition, $message ) use ( &$failures ) {
	if ( ! $condition ) {
		$failures[] = $message;
	}
};

foreach ( array( 'spp_service', 'spp_project', 'spp_article' ) as $type ) {
	$check( true === $registered_types[ $type ]['public'], $type . ' must remain public' );
	$check( true === $registered_types[ $type ]['show_in_rest'], $type . ' must remain REST editable' );
}
foreach ( array( 'spp_faq', 'spp_testimonial' ) as $type ) {
	$args = $registered_types[ $type ];
	$check( false === $args['public'], $type . ' must not create a standalone thin page' );
	$check( false === $args['publicly_queryable'], $type . ' must not be publicly queryable' );
	$check( true === $args['exclude_from_search'], $type . ' must be excluded from search' );
	$check( true === $args['show_ui'], $type . ' must remain editable in wp-admin' );
	$check( true === $args['show_in_rest'], $type . ' must remain available to the site REST layer' );
}

$redirects = SPP_Content_SEO::legacy_redirects();
$check( 29 === count( $redirects ), 'expected 29 exact legacy redirects' );
$check( count( $redirects ) === count( array_unique( array_keys( $redirects ) ) ), 'legacy redirect sources must be unique' );
foreach ( $redirects as $source => $target ) {
	$check( '/' === substr( $source, 0, 1 ) && '/' === substr( $target, 0, 1 ), 'redirect paths must stay site-relative' );
	$check( false === strpos( $source, '*' ) && false === strpos( $source, '?' ), 'redirect sources must not use wildcards or query patterns' );
	$check( $source !== $target, 'redirects must not loop' );
	$check( ! isset( $redirects[ $target ] ), 'redirects must not form chains' );
}
$check( '/blog/' === $redirects['/painting-guides/'], 'painting guide hub must redirect to /blog/' );
$check( '/services/roof-painting-melbourne/' === $redirects['/roof-painting-melbourne/'], 'roof legacy URL must redirect to canonical service URL' );

$seo = new SPP_Content_SEO( false );
$check( 'https://example.com/yoast/' === $seo->yoast_canonical( 'https://example.com/yoast/' ), 'Yoast canonical must remain authoritative' );

$spp_test_queried_id = 42;
$spp_test_meta[42]['spp_canonical_url'] = 'https://example.com/editor-canonical/';
$check( 'https://example.com/editor-canonical/' === $seo->yoast_canonical( '' ), 'Superior Plus canonical must be used when Yoast is empty' );

$spp_test_meta = array();
$spp_test_singular = true;
$spp_test_permalink = 'https://sppaintingremodeling.com.au/about/';
$check( $spp_test_permalink === $seo->yoast_canonical( '' ), 'stored managed page must fall back to its WordPress permalink' );

$spp_test_queried_id = 0;
$spp_test_singular = false;
$spp_test_permalink = '';
$spp_test_route = 'service-areas/bayswater';
$check( 'https://sppaintingremodeling.com.au/service-areas/bayswater/' === $seo->yoast_canonical( '' ), 'valid virtual React route must receive a canonical' );

$spp_test_is_404 = true;
$check( '' === $seo->yoast_canonical( '' ), 'genuine 404 must not receive a canonical' );

if ( $failures ) {
	echo "SEO cleanup validation: FAIL\n- " . implode( "\n- ", $failures ) . "\n";
	exit( 1 );
}

echo 'SEO cleanup validation: PASS (' . count( $registered_types ) . ' content types, ' . count( $redirects ) . " exact redirects)\n";
