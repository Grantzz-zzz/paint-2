<?php
/**
 * Clean public routes, status handling, and XML sitemap.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Routing {
	/**
	 * Register hooks.
	 *
	 * @param bool $hooks Attach WordPress hooks.
	 */
	public function __construct( $hooks = true ) {
		if ( ! $hooks ) {
			return;
		}
		add_action( 'init', array( $this, 'register_rewrites' ), 20 );
		add_action( 'init', array( $this, 'maybe_refresh_rewrites' ), 99 );
		add_action( 'admin_init', array( $this, 'maybe_refresh_rewrites' ), 20 );
		add_action( 'after_switch_theme', array( $this, 'refresh_theme_rewrites' ) );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );
		add_action( 'template_redirect', array( $this, 'handle_request' ), 1 );
		add_filter( 'robots_txt', array( $this, 'robots_txt' ), 20, 2 );
	}

	/**
	 * Register routes that work before starter content has been imported.
	 */
	public function register_rewrites() {
		add_rewrite_rule( '^sitemap\.xml$', 'index.php?spp_sitemap=1', 'top' );
		if ( 'superior-plus' !== get_stylesheet() ) {
			return;
		}
		add_rewrite_rule( '^(about|services|our-process|faqs|contact)/?$', 'index.php?spp_react_route=$matches[1]', 'top' );
		add_rewrite_rule( '^services/([^/]+)/?$', 'index.php?spp_react_route=services/$matches[1]', 'top' );
		add_rewrite_rule( '^projects/([^/]+)/?$', 'index.php?spp_react_route=projects/$matches[1]', 'top' );
	}

	/**
	 * Refresh route rules once after a plugin update.
	 */
	public function maybe_refresh_rewrites() {
		if ( 'superior-plus' !== get_stylesheet() ) {
			return;
		}
		if ( SPP_CONTENT_VERSION === get_option( 'spp_content_routes_version' ) ) {
			return;
		}
		$this->register_rewrites();
		flush_rewrite_rules( false );
		update_option( 'spp_content_routes_version', SPP_CONTENT_VERSION, false );
	}

	/**
	 * Refresh route rules when the React theme becomes active.
	 */
	public function refresh_theme_rewrites() {
		if ( 'superior-plus' !== get_stylesheet() ) {
			return;
		}
		$this->register_rewrites();
		flush_rewrite_rules( false );
		update_option( 'spp_content_routes_version', SPP_CONTENT_VERSION, false );
	}

	/**
	 * Add routing query variables.
	 *
	 * @param array $vars Existing variables.
	 * @return array
	 */
	public function query_vars( $vars ) {
		$vars[] = 'spp_react_route';
		$vars[] = 'spp_sitemap';
		return $vars;
	}

	/**
	 * Return the sitemap or set the correct shell response status.
	 */
	public function handle_request() {
		if ( get_query_var( 'spp_sitemap' ) ) {
			$this->render_sitemap();
		}
		$route = trim( sanitize_text_field( (string) get_query_var( 'spp_react_route' ) ), '/' );
		if ( '' === $route ) {
			return;
		}
		global $wp_query;
		if ( $this->route_exists( $route ) ) {
			status_header( 200 );
			$wp_query->is_404 = false;
			return;
		}
		status_header( 404 );
		$wp_query->is_404 = true;
	}

	/**
	 * Determine whether a clean React route is public.
	 *
	 * @param string $route Relative route.
	 * @return bool
	 */
	private function route_exists( $route ) {
		if ( in_array( $route, array( 'about', 'services', 'our-process', 'faqs', 'contact' ), true ) ) {
			return true;
		}
		if ( 0 === strpos( $route, 'services/' ) ) {
			$slug = substr( $route, strlen( 'services/' ) );
			$post = get_page_by_path( $slug, OBJECT, 'spp_service' );
			if ( $post && 'publish' === $post->post_status ) {
				return true;
			}
			$defaults = function_exists( 'spp_default_services' ) ? spp_default_services() : array();
			return isset( $defaults[ $slug ] );
		}
		if ( 0 === strpos( $route, 'projects/' ) ) {
			$slug = substr( $route, strlen( 'projects/' ) );
			$post = get_page_by_path( $slug, OBJECT, 'spp_project' );
			return $post && 'publish' === $post->post_status;
		}
		return false;
	}

	/**
	 * Render every published public page in a compact XML sitemap.
	 */
	private function render_sitemap() {
		$urls = array();
		$add  = function ( $url, $modified = '' ) use ( &$urls ) {
			$urls[ untrailingslashit( $url ) ?: home_url( '/' ) ] = $modified;
		};
		$add( home_url( '/' ) );
		foreach ( array( 'about', 'services', 'our-process', 'faqs', 'contact' ) as $route ) {
			$add( home_url( '/' . $route . '/' ) );
		}

		$front_id = (int) get_option( 'page_on_front' );
		foreach ( get_posts( array( 'post_type' => 'page', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'ID', 'order' => 'ASC' ) ) as $page ) {
			$url = $front_id === (int) $page->ID ? home_url( '/' ) : get_permalink( $page );
			$add( $url, $page->post_modified_gmt );
		}
		foreach ( array( 'spp_service', 'spp_project' ) as $post_type ) {
			foreach ( get_posts( array( 'post_type' => $post_type, 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'ID', 'order' => 'ASC' ) ) as $post ) {
				$add( get_permalink( $post ), $post->post_modified_gmt );
			}
		}

		status_header( 200 );
		header( 'Content-Type: application/xml; charset=UTF-8' );
		header( 'Cache-Control: public, max-age=300' );
		echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
		echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
		foreach ( $urls as $url => $modified ) {
			echo "\t<url><loc>" . esc_xml( $url ) . '</loc>';
			if ( $modified && '0000-00-00 00:00:00' !== $modified ) {
				echo '<lastmod>' . esc_xml( mysql2date( DATE_W3C, $modified, false ) ) . '</lastmod>';
			}
			echo "</url>\n";
		}
		echo '</urlset>';
		exit;
	}

	/**
	 * Advertise the canonical sitemap.
	 *
	 * @param string $output Existing robots text.
	 * @param bool   $public Site visibility.
	 * @return string
	 */
	public function robots_txt( $output, $public ) {
		unset( $public );
		$line = 'Sitemap: ' . home_url( '/sitemap.xml' );
		return false === strpos( $output, $line ) ? rtrim( $output ) . "\n" . $line . "\n" : $output;
	}
}
