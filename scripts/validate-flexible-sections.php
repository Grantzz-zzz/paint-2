<?php
/**
 * Stress-test the plugin's flexible-section save sanitization without WordPress.
 *
 * Run with: php scripts/validate-flexible-sections.php
 */

define( 'ABSPATH', __DIR__ );

class WP_Post {
	public $ID = 0;
	public $post_type = 'page';
	public $post_name = '';
}

$test_meta = array();

function sanitize_key( $value ) {
	$value = strtolower( (string) $value );
	return preg_replace( '/[^a-z0-9_\-]/', '', $value );
}

function sanitize_text_field( $value ) {
	$value = strip_tags( (string) $value );
	$value = preg_replace( '/[\r\n\t ]+/', ' ', $value );
	return trim( $value );
}

function sanitize_textarea_field( $value ) {
	$value = strip_tags( (string) $value );
	$value = str_replace( array( "\r\n", "\r" ), "\n", $value );
	return trim( $value );
}

function absint( $value ) {
	return abs( (int) $value );
}

function get_post_type( $id ) {
	return 99 === (int) $id ? 'attachment' : '';
}

function get_post_mime_type( $id ) {
	return 99 === (int) $id ? 'image/jpeg' : '';
}

function wp_generate_uuid4() {
	static $counter = 0;
	$counter++;
	return sprintf( '00000000-0000-4000-8000-%012d', $counter );
}

function wp_verify_nonce() {
	return true;
}

function wp_is_post_revision() {
	return false;
}

function current_user_can() {
	return true;
}

function wp_unslash( $value ) {
	return $value;
}

function get_post_meta( $post_id, $key, $single = true ) {
	global $test_meta;
	unset( $single );
	return isset( $test_meta[ $post_id ][ $key ] ) ? $test_meta[ $post_id ][ $key ] : '';
}

function metadata_exists( $type, $post_id, $key ) {
	global $test_meta;
	unset( $type );
	return isset( $test_meta[ $post_id ] ) && array_key_exists( $key, $test_meta[ $post_id ] );
}

function update_post_meta( $post_id, $key, $value ) {
	global $test_meta;
	$test_meta[ $post_id ][ $key ] = $value;
	return true;
}

require_once dirname( __DIR__ ) . '/wordpress-plugin/superior-plus-content/includes/class-spp-content-fields.php';

$reflection = new ReflectionClass( 'SPP_Content_Fields' );
$fields     = $reflection->newInstanceWithoutConstructor();
$sanitize   = $reflection->getMethod( 'sanitize_lines' );
$sanitize->setAccessible( true );

$failures = array();
$checks   = 0;

function check_result( $condition, $message ) {
	global $checks, $failures;
	$checks++;
	if ( ! $condition ) {
		$failures[] = $message;
	}
}

$sections = array();
for ( $section_index = 0; $section_index < 45; $section_index++ ) {
	$items = array();
	for ( $item_index = 0; $item_index < 65; $item_index++ ) {
		$items[] = array( 'text' => "Item {$section_index}-{$item_index}" );
	}
	$items[] = array( 'text' => '' );
	$sections[] = array(
		'id'      => "Section ID {$section_index}",
		'eyebrow' => "Eyebrow {$section_index} <script>bad()</script>",
		'title'   => "Heading {$section_index}",
		'text'    => "Paragraph one {$section_index}.\n\nParagraph two {$section_index}. <b>Bold</b>",
		'items'   => $items,
		'style'   => 0 === $section_index ? 'green' : ( 1 === $section_index ? 'unsafe-colour' : 'auto' ),
		'layout'  => 0 === $section_index ? 'image-left' : ( 1 === $section_index ? 'unsafe-layout' : 'text' ),
		'attachment_id' => 0 === $section_index ? 99 : 0,
		'image_alt' => 0 === $section_index ? 'Project <b>image</b>' : '',
		'image_position' => 0 === $section_index ? '35% 60%' : 'invalid',
	);
}

$saved = $sanitize->invoke( $fields, json_encode( $sections ), 'sections', 40, array() );

check_result( 40 === count( $saved ), 'Section maximum was not enforced at 40.' );
check_result( 'green' === $saved[0]['style'] && 'image-left' === $saved[0]['layout'], 'Valid section design choices were not retained.' );
check_result( 99 === $saved[0]['attachment_id'], 'Valid section image was not retained.' );
check_result( 'Project image' === $saved[0]['image_alt'] && '35% 60%' === $saved[0]['image_position'], 'Section image accessibility/crop data was not sanitized correctly.' );
check_result( 'auto' === $saved[1]['style'] && 'text' === $saved[1]['layout'], 'Unsafe section design choices were not reset.' );
check_result( '50% 50%' === $saved[1]['image_position'], 'Unsafe image position was not reset.' );
foreach ( $saved as $index => $section ) {
	check_result( "sectionid{$index}" === $section['id'], "Section {$index} did not retain its sanitized stable ID." );
	check_result( $index === $section['order'], "Section {$index} order was not retained." );
	check_result( "Heading {$index}" === $section['title'], "Section {$index} title changed unexpectedly." );
	check_result( false !== strpos( $section['text'], "\n\n" ), "Section {$index} lost its paragraph break." );
	check_result( false === strpos( $section['text'], '<b>' ), "Section {$index} retained unsafe HTML." );
	check_result( false === strpos( $section['eyebrow'], '<script>' ), "Section {$index} retained script markup." );
	check_result( 60 === count( $section['items'] ), "Section {$index} list maximum was not enforced at 60." );
	check_result( "Item {$index}-0" === $section['items'][0], "Section {$index} first list item changed." );
	check_result( "Item {$index}-59" === $section['items'][59], "Section {$index} list ordering changed." );
}

$with_empty = array(
	array( 'id' => 'empty', 'eyebrow' => '', 'title' => '', 'text' => '', 'items' => array( '', array( 'text' => '' ) ) ),
	array( 'id' => 'list-only', 'eyebrow' => '', 'title' => '', 'text' => '', 'items' => "First\n\nSecond" ),
);
$empty_result = $sanitize->invoke( $fields, json_encode( $with_empty ), 'sections', 40, array() );
check_result( 1 === count( $empty_result ), 'A completely empty section was not discarded.' );
check_result( array( 'First', 'Second' ) === $empty_result[0]['items'], 'Newline-separated list items were not saved correctly.' );

$legacy = $sanitize->invoke( $fields, "Legacy heading | Legacy description", 'sections', 40, array() );
check_result( 1 === count( $legacy ), 'Legacy section input was not accepted.' );
check_result( 'Legacy heading' === $legacy[0]['title'], 'Legacy section heading changed.' );
check_result( 'Legacy description' === $legacy[0]['text'], 'Legacy section description changed.' );
check_result( '' === $legacy[0]['eyebrow'] && array() === $legacy[0]['items'], 'Legacy section did not receive safe flexible-section defaults.' );
check_result( 'auto' === $legacy[0]['style'] && 'text' === $legacy[0]['layout'] && 0 === $legacy[0]['attachment_id'], 'Legacy section did not receive backward-compatible design defaults.' );

class SPP_Content_Fields_Save_Test extends SPP_Content_Fields {
	public function __construct() {}

	public function definitions_for_post( $post ) {
		unset( $post );
		return array(
			'spp_test_checkbox' => array( 'label' => 'Test checkbox', 'type' => 'checkbox', 'default' => 1 ),
			'spp_test_text'     => array( 'label' => 'Test text', 'type' => 'text', 'max' => 100 ),
			'spp_test_textarea' => array( 'label' => 'Test textarea', 'type' => 'textarea', 'max' => 500 ),
			'spp_test_sections' => array( 'label' => 'Test sections', 'type' => 'sections', 'max_items' => 40 ),
			'spp_changed_text'  => array( 'label' => 'Changed text', 'type' => 'text', 'max' => 100 ),
		);
	}
}

$save_fields = new SPP_Content_Fields_Save_Test();
$test_post   = new WP_Post();
$test_post->ID = 501;
$_POST = array(
	'spp_content_nonce' => 'valid',
	'spp_test_checkbox' => '0',
	'spp_test_text'     => '',
	'spp_test_textarea' => '',
	'spp_test_sections' => '[]',
	'spp_changed_text'  => 'Only this heading changed',
);
$test_meta = array();
$save_fields->save( 501, $test_post );
check_result( ! metadata_exists( 'post', 501, 'spp_test_text' ), 'An untouched blank field incorrectly replaced its original fallback.' );
check_result( ! metadata_exists( 'post', 501, 'spp_test_textarea' ), 'An untouched blank textarea incorrectly replaced its original fallback.' );
check_result( ! metadata_exists( 'post', 501, 'spp_test_sections' ), 'An untouched empty section collection incorrectly replaced its original fallback.' );
check_result( 'Only this heading changed' === $test_meta[501]['spp_changed_text'], 'The field intentionally edited alongside untouched blanks was not saved.' );

$test_meta = array( 501 => array(
	'spp_test_checkbox' => 1,
	'spp_test_text'     => 'Previously saved copy',
	'spp_test_textarea' => 'Previously saved paragraph',
	'spp_test_sections' => array( array( 'id' => 'saved', 'title' => 'Previously saved section', 'text' => '', 'items' => array() ) ),
) );
$save_fields->save( 501, $test_post );
check_result( 0 === $test_meta[501]['spp_test_checkbox'], 'An unchecked configured checkbox did not save as disabled.' );
check_result( metadata_exists( 'post', 501, 'spp_test_text' ) && '' === $test_meta[501]['spp_test_text'], 'A configured text field could not be intentionally cleared.' );
check_result( metadata_exists( 'post', 501, 'spp_test_textarea' ) && '' === $test_meta[501]['spp_test_textarea'], 'A configured textarea could not be intentionally cleared.' );
check_result( metadata_exists( 'post', 501, 'spp_test_sections' ) && array() === $test_meta[501]['spp_test_sections'], 'A configured section collection could not be intentionally cleared.' );
check_result( in_array( 'spp_test_text', $test_meta[501]['spp_explicit_blank_fields'], true ), 'An intentional blank was not recorded.' );

$_POST['spp_test_checkbox'] = '1';
$save_fields->save( 501, $test_post );
check_result( 1 === $test_meta[501]['spp_test_checkbox'], 'A checked checkbox did not save as enabled.' );

$definition_post = new WP_Post();
$definition_post->ID = 601;
$definition_post->post_name = 'about';
$test_meta[601]['spp_template_key'] = 'about';
$about_definitions = $fields->definitions_for_post( $definition_post );
check_result( 'spp_about_standards_enabled' === array_key_first( $about_definitions ), 'The About standards visibility control is not the first editor field.' );
check_result( 5 === $about_definitions['spp_content_sections']['section_design_start'], 'About original sections incorrectly expose added-section design controls.' );

$definition_post->ID = 602;
$definition_post->post_name = 'additional-services';
$test_meta[602]['spp_template_key'] = 'additional_services';
$additional_definitions = $fields->definitions_for_post( $definition_post );
check_result( 2 === $additional_definitions['spp_content_sections']['section_design_start'], 'Additional Services original sections incorrectly expose added-section design controls.' );

$definition_post->ID = 603;
$definition_post->post_name = 'our-process';
$test_meta[603]['spp_template_key'] = 'process';
$process_definitions = $fields->definitions_for_post( $definition_post );
check_result( 2 === $process_definitions['spp_content_sections']['section_design_start'], 'Process original sections incorrectly expose added-section design controls.' );

$definition_post->ID = 604;
$definition_post->post_name = 'home';
$test_meta[604]['spp_template_key'] = 'home';
$home_definitions = $fields->definitions_for_post( $definition_post );
check_result( isset( $home_definitions['spp_home_trust_points_enabled'] ) && 'checkbox' === $home_definitions['spp_home_trust_points_enabled']['type'], 'Homepage trust-point visibility control is missing.' );

echo "Flexible-section PHP save checks: {$checks}\n";
echo 'Failures: ' . count( $failures ) . "\n";

if ( $failures ) {
	foreach ( $failures as $failure ) {
		echo "- {$failure}\n";
	}
	exit( 1 );
}

echo "Result: PASS\n";
