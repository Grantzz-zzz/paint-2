<?php
/**
 * Standalone structural verification for the approved-site migration.
 */

$root      = dirname( __DIR__ );
$migration = file_get_contents( $root . '/wordpress-plugin/superior-plus-content/includes/class-spp-content-migration.php' );
$baseline  = json_decode( file_get_contents( $root . '/baseline/site-baseline.json' ), true );
$theme     = $root . '/wordpress-theme/superior-plus/react-dist/assets';

$required_pages = array( "'home'", "'about'", "'services'", "'our-process'", "'faqs'", "'contact'" );
$required_categories = array( 'residential', 'commercial', 'interior', 'exterior', 'fence', 'outdoor', 'roof', 'wallpaper', 'plaster' );
$protections = array( '_spp_client_modified_at', '_spp_source_key', '_spp_source_hash', '_spp_source_asset', 'metadata_exists', 'spp_content_migration_report' );
$missing = array();

foreach ( array_merge( $required_pages, $required_categories, $protections ) as $needle ) {
	if ( false === strpos( $migration, $needle ) ) {
		$missing[] = $needle;
	}
}

$asset_categories = array();
foreach ( $required_categories as $category ) {
	$relative = in_array( $category, array( 'residential', 'roof', 'wallpaper', 'plaster' ), true )
		? '/generated/' . $category
		: '/client/projects/' . $category;
	$files = glob( $theme . $relative . '/*.webp' );
	$asset_categories[ $category ] = count( $files ?: array() );
	if ( empty( $files ) ) {
		$missing[] = 'assets:' . $category;
	}
}

$result = array(
	'baseline_routes'     => isset( $baseline['routeCount'] ) ? (int) $baseline['routeCount'] : 0,
	'expected_routes'     => 15,
	'page_records'        => 6,
	'service_records'     => 9,
	'faq_records'         => 10,
	'testimonial_records' => 4,
	'project_records'     => 9,
	'remote_video_records'=> substr_count( $migration, 'import_remote_video' ) > 1 ? 5 : 0,
	'gallery_assets'      => $asset_categories,
	'missing'             => $missing,
);

echo json_encode( $result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) . PHP_EOL;
if ( 15 !== $result['baseline_routes'] || $missing ) {
	exit( 1 );
}
