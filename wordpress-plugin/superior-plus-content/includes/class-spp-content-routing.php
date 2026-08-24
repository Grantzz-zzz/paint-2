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
		if ( ! class_exists( 'SPP_Content_SEO' ) || ! SPP_Content_SEO::yoast_active() ) {
			add_rewrite_rule( '^sitemap\.xml$', 'index.php?spp_sitemap=1', 'top' );
		}
		if ( 'superior-plus' !== get_stylesheet() ) {
			return;
		}
		add_rewrite_rule( '^(about|services|our-process|faqs|contact|blog)/?$', 'index.php?spp_react_route=$matches[1]', 'top' );
		add_rewrite_rule( '^blog/([^/]+)/?$', 'index.php?spp_react_route=blog/$matches[1]', 'top' );
		add_rewrite_rule( '^service-areas/?$', 'index.php?spp_react_route=service-areas', 'top' );
		add_rewrite_rule( '^service-areas/([^/]+)/?$', 'index.php?spp_react_route=service-areas/$matches[1]', 'top' );
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
		if ( in_array( $route, array( 'about', 'services', 'our-process', 'faqs', 'contact', 'blog' ), true ) ) {
			return true;
		}
		if ( 0 === strpos( $route, 'blog/' ) ) {
			$slug = substr( $route, strlen( 'blog/' ) );
			return in_array( $slug, $this->blog_slugs(), true );
		}
		if ( 'service-areas' === $route ) {
			return true;
		}
		if ( 0 === strpos( $route, 'service-areas/' ) ) {
			$slug = substr( $route, strlen( 'service-areas/' ) );
			return in_array( $slug, $this->service_area_slugs(), true );
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
		if ( class_exists( 'SPP_Content_SEO' ) && SPP_Content_SEO::yoast_active() ) {
			wp_safe_redirect( home_url( '/sitemap_index.xml' ), 301, 'Superior Plus SEO cleanup' );
			exit;
		}
		$urls = array();
		$add  = function ( $url, $modified = '' ) use ( &$urls ) {
			$urls[ untrailingslashit( $url ) ?: home_url( '/' ) ] = $modified;
		};
		$add( home_url( '/' ) );
		foreach ( array( 'about', 'services', 'our-process', 'faqs', 'contact' ) as $route ) {
			$add( home_url( '/' . $route . '/' ) );
		}
		$add( home_url( '/blog/' ) );
		foreach ( $this->blog_slugs() as $slug ) {
			$add( home_url( '/blog/' . $slug . '/' ) );
		}
		$add( home_url( '/service-areas/' ) );
		foreach ( $this->service_area_slugs() as $slug ) {
			$add( home_url( '/service-areas/' . $slug . '/' ) );
		}

		$front_id = (int) get_option( 'page_on_front' );
		$legacy_paths = class_exists( 'SPP_Content_SEO' ) ? array_keys( SPP_Content_SEO::legacy_redirects() ) : array();
		foreach ( get_posts( array( 'post_type' => 'page', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'ID', 'order' => 'ASC' ) ) as $page ) {
			$url = $front_id === (int) $page->ID ? home_url( '/' ) : get_permalink( $page );
			$page_path = '/' . trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' ) . '/';
			if ( in_array( $page_path, $legacy_paths, true ) ) {
				continue;
			}
			$add( $url, $page->post_modified_gmt );
		}
		foreach ( array( 'spp_service', 'spp_project', 'spp_article' ) as $post_type ) {
			foreach ( get_posts( array( 'post_type' => $post_type, 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'ID', 'order' => 'ASC' ) ) as $post ) {
				if ( 'spp_project' === $post_type && '1' !== (string) get_post_meta( $post->ID, 'spp_seo_indexable', true ) ) {
					continue;
				}
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
	 * Client-supplied and expanded Melbourne painting blog slugs.
	 *
	 * @return string[]
	 */
	private function blog_slugs() {
		$fallbacks = array(
			'how-often-repaint-house-melbourne',
			'interior-vs-exterior-painting',
			'professional-painting-services-melbourne',
			'experienced-painting-contractors-melbourne',
			'prepare-house-before-professional-painters-melbourne',
			'interior-house-painting-melbourne-complete-guide',
			'exterior-house-painting-melbourne-weather-protection',
			'commercial-painting-contractors-melbourne-businesses',
			'roof-painting-melbourne-benefits-process-cost-guide',
			'how-professional-painters-repair-cracks-before-painting',
			'best-paint-colours-australian-homes-2026',
			'dulux-paint-systems-quality-paint-matters',
			'new-home-painting-melbourne-builders',
			'before-after-professional-painting-melbourne-homes',
			'fence-painting-melbourne-outdoor-protection',
			'strata-body-corporate-painting-melbourne-guide',
			'how-long-professional-paint-job-lasts-melbourne',
			'why-hiring-insured-painting-contractor-matters',
			'painter-melbourne-near-me-choose-local-company',
		);
		$posts = get_posts(
			array(
				'post_type'      => 'spp_article',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);
		foreach ( $posts as $post_id ) {
			$fallbacks[] = get_post_field( 'post_name', $post_id );
		}
		return array_values( array_unique( array_filter( $fallbacks ) ) );
	}

	/**
	 * Client-approved Melbourne service-area slugs.
	 *
	 * @return string[]
	 */
	private function service_area_slugs() {
		return array(
			'hawthorn', 'hawthorn-east', 'kew', 'kew-east', 'camberwell', 'canterbury',
			'balwyn', 'balwyn-north', 'surrey-hills', 'mont-albert', 'deepdene', 'box-hill',
			'box-hill-north', 'box-hill-south', 'malvern', 'malvern-east', 'glen-iris',
			'burwood-east', 'wheelers-hill', 'hughesdale', 'oakleigh-east', 'oakleigh-south',
			'clayton-south', 'vermont', 'vermont-south', 'forest-hill', 'blackburn',
			'blackburn-north', 'blackburn-south', 'nunawading', 'mitcham', 'ringwood',
			'ringwood-east', 'ringwood-north', 'heathmont', 'bayswater', 'boronia',
			'wantirna', 'wantirna-south', 'knoxfield', 'ferntree-gully', 'scoresby',
			'rowville', 'lysterfield', 'the-basin', 'croydon', 'croydon-hills', 'kilsyth',
			'montrose', 'lilydale', 'mooroolbark', 'chirnside-park', 'chadstone',
			'mount-waverley', 'glen-waverley', 'oakleigh', 'mulgrave', 'clayton', 'burwood',
			'ashwood', 'dandenong', 'noble-park', 'springvale', 'keysborough', 'berwick',
			'narre-warren', 'endeavour-hills',
		);
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
		if ( class_exists( 'SPP_Content_SEO' ) && SPP_Content_SEO::yoast_active() ) {
			return $output;
		}
		$line = 'Sitemap: ' . home_url( '/sitemap.xml' );
		return false === strpos( $output, $line ) ? rtrim( $output ) . "\n" . $line . "\n" : $output;
	}
}
