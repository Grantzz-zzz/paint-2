<?php
/**
 * Superior Plus Painting theme functions.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SPP_VERSION', '3.6.6' );
define( 'SPP_PATH', get_template_directory() );
define( 'SPP_URI', get_template_directory_uri() );

require_once SPP_PATH . '/inc/default-content.php';
require_once SPP_PATH . '/inc/template-tags.php';
// The companion plugin owns editable content whenever it is active. These
// legacy registrations remain only as a safe fallback for older installations.
if ( ! defined( 'SPP_CONTENT_VERSION' ) ) {
	require_once SPP_PATH . '/inc/service-post-type.php';
	require_once SPP_PATH . '/inc/project-post-type.php';
}
require_once SPP_PATH . '/inc/customizer.php';
require_once SPP_PATH . '/inc/installer.php';

function spp_router_basename() {
	$base_path = untrailingslashit( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ) );
	if ( false !== strpos( (string) get_option( 'permalink_structure' ), 'index.php' ) ) {
		$base_path .= '/index.php';
	}
	return $base_path;
}

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
	$manifest_path = SPP_PATH . '/react-dist/.vite/manifest.json';
	if ( ! file_exists( $manifest_path ) ) {
		return;
	}
	$manifest = json_decode( file_get_contents( $manifest_path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$entry    = isset( $manifest['index.html'] ) ? $manifest['index.html'] : array();
	if ( empty( $entry['file'] ) ) {
		return;
	}
	foreach ( isset( $entry['css'] ) ? $entry['css'] : array() as $index => $stylesheet ) {
		wp_enqueue_style( 'spp-react-' . $index, SPP_URI . '/react-dist/' . ltrim( $stylesheet, '/' ), array(), SPP_VERSION );
	}
	// The hashed Vite entry is also imported by lazy chunks. A WordPress
	// ?ver= query would give that same file two different module identities,
	// loading React twice and causing error #321. The content hash already
	// provides cache busting, so the module URL must remain query-free.
	wp_enqueue_script( 'spp-react-app', SPP_URI . '/react-dist/' . ltrim( $entry['file'], '/' ), array(), null, true );
}
add_action( 'wp_enqueue_scripts', 'spp_enqueue_assets' );

/**
 * Print the runtime bridge before the deferred React module executes.
 *
 * Keeping this independent from the module handle prevents optimisation or
 * script-tag filters from dropping the configuration required to load saved
 * WordPress content.
 */
function spp_print_runtime_config() {
	$config = 'window.__SPP_SITE_URL__=' . wp_json_encode( trailingslashit( home_url( '/' ) ) ) .
		';window.__SPP_ROUTER_BASE__=' . wp_json_encode( spp_router_basename() ) .
		';window.__SPP_CONTENT_API__=' . wp_json_encode( untrailingslashit( rest_url( 'spp/v1' ) ) ) .
		';window.__SPP_REST_NONCE__=' . wp_json_encode( wp_create_nonce( 'wp_rest' ) ) .
		';window.__SPP_FORM_NONCE__=' . wp_json_encode( wp_create_nonce( 'spp_quote_form' ) ) .
		';window.__SPP_SEO_SERVER_MANAGED__=' . wp_json_encode( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ) . ';';

	wp_print_inline_script_tag( $config, array( 'id' => 'spp-react-runtime-config' ) );
}
add_action( 'wp_head', 'spp_print_runtime_config', 1 );

/**
 * Remove page-builder assets from the public React shell.
 *
 * Elementor content stays in the database and remains editable in wp-admin;
 * its frontend runtime is unnecessary here and can otherwise throw before
 * React starts or leak builder CSS into the approved design.
 *
 * @param bool $scripts_only Whether to leave queued styles untouched.
 */
function spp_dequeue_builder_assets( $scripts_only = false ) {
	$prefixes = array( 'elementor', 'elementor-pro', 'uael', 'uae-', 'hfe-', 'header-footer-elementor' );
	$matches  = static function ( $handle ) use ( $prefixes ) {
		foreach ( $prefixes as $prefix ) {
			if ( 0 === strpos( (string) $handle, $prefix ) ) {
				return true;
			}
		}
		return false;
	};

	global $wp_scripts, $wp_styles;
	if ( $wp_scripts instanceof WP_Scripts ) {
		foreach ( (array) $wp_scripts->queue as $handle ) {
			if ( $matches( $handle ) ) {
				wp_dequeue_script( $handle );
			}
		}
	}
	if ( ! $scripts_only && $wp_styles instanceof WP_Styles ) {
		foreach ( (array) $wp_styles->queue as $handle ) {
			if ( $matches( $handle ) ) {
				wp_dequeue_style( $handle );
			}
		}
	}
}
add_action( 'wp_enqueue_scripts', 'spp_dequeue_builder_assets', PHP_INT_MAX );
add_action(
	'wp_print_footer_scripts',
	static function () {
		spp_dequeue_builder_assets( true );
	},
	0
);

function spp_react_module_script( $tag, $handle, $src ) {
	if ( 'spp-react-app' !== $handle ) {
		return $tag;
	}
	return '<script type="module" src="' . esc_url( $src ) . '" id="spp-react-app-js"></script>';
}
add_filter( 'script_loader_tag', 'spp_react_module_script', 10, 3 );

function spp_body_classes( $classes ) {
	$classes[] = 'spp-site';
	return $classes;
}
add_filter( 'body_class', 'spp_body_classes' );

// The exact React frontend contains its own header and footer. Keep installed
// Elementor/UAE templates in the database, but do not render them on the site.
if ( ! is_admin() ) {
	add_filter( 'hfe_header_enabled', '__return_false', 100 );
	add_filter( 'hfe_footer_enabled', '__return_false', 100 );
}

function spp_use_react_frontend_template( $template ) {
	if ( is_admin() || is_feed() || is_embed() || get_query_var( 'spp_sitemap' ) ) {
		return $template;
	}
	$react_template = SPP_PATH . '/react-app.php';
	return file_exists( $react_template ) ? $react_template : $template;
}
add_filter( 'template_include', 'spp_use_react_frontend_template', 999 );

function spp_react_route_for_request() {
	$rewritten_route = trim( sanitize_text_field( (string) get_query_var( 'spp_react_route' ) ), '/' );
	if ( $rewritten_route ) {
		return '/' . $rewritten_route;
	}
	if ( is_singular( 'spp_service' ) ) {
		return '/services/' . get_post_field( 'post_name', get_queried_object_id() );
	}
	if ( is_singular( 'spp_project' ) ) {
		return '/projects/' . get_post_field( 'post_name', get_queried_object_id() );
	}
	if ( is_singular( 'spp_article' ) ) {
		return '/blog/' . get_post_field( 'post_name', get_queried_object_id() );
	}
	if ( is_page() ) {
		$page_id = get_queried_object_id();
		return (int) get_option( 'page_on_front' ) === (int) $page_id ? '/' : '/' . trim( get_page_uri( $page_id ), '/' );
	}

	// Resolve friendly URLs even before the optional starter pages have been
	// created in WordPress. React remains the single source of frontend routes.
	$request_path = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/', PHP_URL_PATH );
	$home_path    = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	if ( $home_path && '/' !== $home_path && 0 === strpos( $request_path, $home_path ) ) {
		$request_path = substr( $request_path, strlen( rtrim( $home_path, '/' ) ) );
	}
	$request_path = '/' . trim( (string) $request_path, '/' );
	return $request_path;
}

function spp_canonical_url_for_route( $route ) {
	$route = '/' . trim( (string) $route, '/' );
	return '/' === $route ? home_url( '/' ) : home_url( $route . '/' );
}

function spp_server_seo_data() {
	$post_id = get_queried_object_id();
	if ( ! $post_id || ! is_singular( array( 'page', 'spp_service', 'spp_project', 'spp_article' ) ) ) {
		return array();
	}
	$title = trim( (string) get_post_meta( $post_id, 'spp_seo_title', true ) );
	$description = trim( (string) get_post_meta( $post_id, 'spp_seo_description', true ) );
	if ( ! $description ) {
		$description = wp_strip_all_tags( get_the_excerpt( $post_id ) );
	}
	$canonical = trim( (string) get_post_meta( $post_id, 'spp_canonical_url', true ) );
	if ( ! $canonical ) {
		$canonical = spp_canonical_url_for_route( spp_react_route_for_request() );
	}
	$image_id = absint( get_post_meta( $post_id, 'spp_social_image_id', true ) );
	if ( ! $image_id ) {
		$image_id = absint( get_post_meta( $post_id, 'spp_hero_image_id', true ) );
	}
	$page_uri = is_page( $post_id ) ? trim( get_page_uri( $post_id ), '/' ) : '';
	$is_guide = $page_uri && ( 0 === strpos( $page_uri, 'painting-guides/' ) || 0 === strpos( $page_uri, 'blog/' ) );
	return array(
		'title'       => $title ?: wp_strip_all_tags( get_the_title( $post_id ) ),
		'description' => $description,
		'canonical'   => $canonical,
		'image'       => $image_id ? wp_get_attachment_image_url( $image_id, 'full' ) : '',
		'type'        => ( in_array( get_post_type( $post_id ), array( 'post', 'spp_article' ), true ) || $is_guide ) ? 'article' : 'website',
	);
}

function spp_server_document_title( $title ) {
	if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ) {
		return $title;
	}
	$data = spp_server_seo_data();
	return ! empty( $data['title'] ) ? $data['title'] : $title;
}
add_filter( 'pre_get_document_title', 'spp_server_document_title', 20 );

function spp_replace_core_canonical() {
	if ( ! defined( 'WPSEO_VERSION' ) && ! defined( 'RANK_MATH_VERSION' ) && spp_server_seo_data() ) {
		remove_action( 'wp_head', 'rel_canonical' );
	}
}
add_action( 'template_redirect', 'spp_replace_core_canonical' );

function spp_server_meta_tags() {
	if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ) {
		return;
	}
	$data = spp_server_seo_data();
	if ( ! $data ) {
		return;
	}
	echo '<meta name="description" content="' . esc_attr( $data['description'] ) . '">' . "\n";
	echo '<link rel="canonical" href="' . esc_url( $data['canonical'] ) . '">' . "\n";
	echo '<meta property="og:type" content="' . esc_attr( $data['type'] ) . '">' . "\n";
	echo '<meta property="og:title" content="' . esc_attr( $data['title'] ) . '">' . "\n";
	echo '<meta property="og:description" content="' . esc_attr( $data['description'] ) . '">' . "\n";
	echo '<meta property="og:url" content="' . esc_url( $data['canonical'] ) . '">' . "\n";
	if ( $data['image'] ) {
		echo '<meta property="og:image" content="' . esc_url( $data['image'] ) . '">' . "\n";
	}
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
	echo '<meta name="twitter:title" content="' . esc_attr( $data['title'] ) . '">' . "\n";
	echo '<meta name="twitter:description" content="' . esc_attr( $data['description'] ) . '">' . "\n";
	if ( $data['image'] ) {
		echo '<meta name="twitter:image" content="' . esc_url( $data['image'] ) . '">' . "\n";
	}
}
add_action( 'wp_head', 'spp_server_meta_tags', 2 );

function spp_excerpt_length() {
	return 28;
}
add_filter( 'excerpt_length', 'spp_excerpt_length' );
