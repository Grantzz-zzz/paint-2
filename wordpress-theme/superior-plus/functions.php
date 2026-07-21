<?php
/**
 * Superior Plus Painting theme functions.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SPP_VERSION', '1.0.0' );
define( 'SPP_PATH', get_template_directory() );
define( 'SPP_URI', get_template_directory_uri() );

require_once SPP_PATH . '/inc/default-content.php';
require_once SPP_PATH . '/inc/template-tags.php';
require_once SPP_PATH . '/inc/service-post-type.php';
require_once SPP_PATH . '/inc/project-post-type.php';
require_once SPP_PATH . '/inc/customizer.php';
require_once SPP_PATH . '/inc/installer.php';

function spp_theme_setup() {
	load_theme_textdomain( 'superior-plus', SPP_PATH . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 96,
			'width'       => 136,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	register_nav_menus(
		array(
			'primary' => __( 'Primary navigation', 'superior-plus' ),
			'footer'  => __( 'Footer navigation', 'superior-plus' ),
		)
	);
	add_editor_style( array( 'assets/css/site.css', 'assets/css/wordpress.css' ) );
}
add_action( 'after_setup_theme', 'spp_theme_setup' );

function spp_enqueue_assets() {
	wp_enqueue_style( 'spp-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap', array(), null );
	wp_enqueue_style( 'spp-design', SPP_URI . '/assets/css/site.css', array( 'spp-fonts' ), SPP_VERSION );
	wp_enqueue_style( 'spp-wordpress', SPP_URI . '/assets/css/wordpress.css', array( 'spp-design' ), SPP_VERSION );
	wp_enqueue_script( 'spp-theme', SPP_URI . '/assets/js/theme.js', array(), SPP_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'spp_enqueue_assets' );

function spp_body_classes( $classes ) {
	$classes[] = 'spp-site';
	return $classes;
}
add_filter( 'body_class', 'spp_body_classes' );

function spp_excerpt_length() {
	return 28;
}
add_filter( 'excerpt_length', 'spp_excerpt_length' );
