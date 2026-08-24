<?php
/**
 * Standalone behavioural checks for the SEO cleanup layer.
 */

define( 'ABSPATH', __DIR__ . '/' );
define( 'OBJECT', 'OBJECT' );

$registered_types = array();

function add_action() {}
function add_filter() {}
function register_taxonomy() {}
function __( $value ) { return $value; }
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

if ( $failures ) {
	echo "SEO cleanup validation: FAIL\n- " . implode( "\n- ", $failures ) . "\n";
	exit( 1 );
}

echo 'SEO cleanup validation: PASS (' . count( $registered_types ) . ' content types, ' . count( $redirects ) . " exact redirects)\n";
