<?php
/**
 * Yoast compatibility, index controls, and exact legacy redirects.
 *
 * This layer deliberately does not delete posts or rewrite client content.
 * Removing the plugin restores the previous routing/index behaviour while all
 * saved WordPress posts, metadata, media and relationships remain intact.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_SEO {
	/**
	 * Attach WordPress and Yoast hooks.
	 *
	 * @param bool $hooks Whether to attach runtime hooks.
	 */
	public function __construct( $hooks = true ) {
		if ( ! $hooks ) {
			return;
		}

		add_action( 'template_redirect', array( $this, 'redirect_legacy_request' ), 0 );
		add_filter( 'wp_robots', array( $this, 'core_robots' ), 20 );
		add_filter( 'wpseo_robots_array', array( $this, 'yoast_robots' ), 20 );
		add_filter( 'wpseo_sitemap_exclude_post_type', array( $this, 'exclude_embedded_post_types' ), 10, 2 );
		add_filter( 'wpseo_exclude_from_sitemap_by_post_ids', array( $this, 'exclude_post_ids_from_sitemap' ) );
		add_filter( 'wpseo_sitemap_exclude_author', '__return_empty_array' );
		add_filter( 'wpseo_exclude_from_sitemap_by_term_ids', array( $this, 'exclude_archive_terms' ) );
		add_filter( 'wpseo_title', array( $this, 'yoast_title' ), 20 );
		add_filter( 'wpseo_metadesc', array( $this, 'yoast_description' ), 20 );
		add_filter( 'wpseo_canonical', array( $this, 'yoast_canonical' ), 20 );
	}

	/**
	 * Exact legacy path map. No wildcard or catch-all redirects are used.
	 *
	 * @return array<string,string>
	 */
	public static function legacy_redirects() {
		$map = array(
			'/roof-painting-melbourne/' => '/services/roof-painting-melbourne/',
			'/painting-services-melbourne/' => '/services/',
			'/professional-painters-in-melbourne-eastern-suburbs/' => '/service-areas/',
			'/painting-guides/' => '/blog/',
			'/commercial-painting-melbourne/' => '/services/commercial-painting-melbourne/',
			'/residential-painting-melbourne-house-painters-melbourne/' => '/services/residential-painting-melbourne/',
			'/service-areas/painters-camberwell-house-painters-camberwell/' => '/service-areas/camberwell/',
			'/service-areas/painters-hawthorn-east-house-painters-hawthorn-east/' => '/service-areas/hawthorn-east/',
			'/property-improvement-services-melbourne/' => '/additional-services/',
			'/painting-guides-melbourne/' => '/blog/',
		);

		foreach ( self::article_slugs() as $slug ) {
			$map[ '/painting-guides/' . $slug . '/' ] = '/blog/' . $slug . '/';
		}

		return $map;
	}

	/**
	 * Redirect only known duplicate URLs and embedded-record query URLs.
	 */
	public function redirect_legacy_request() {
		if ( is_admin() || ( function_exists( 'wp_doing_ajax' ) && wp_doing_ajax() ) || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return;
		}

		if ( isset( $_GET['spp_faq'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$this->redirect( '/faqs/' );
		}
		if ( isset( $_GET['spp_testimonial'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$this->redirect( '/#reviews' );
		}

		$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '/';
		$path        = (string) wp_parse_url( $request_uri, PHP_URL_PATH );
		$home_path   = (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH );
		if ( $home_path && '/' !== $home_path && 0 === strpos( $path, rtrim( $home_path, '/' ) . '/' ) ) {
			$path = substr( $path, strlen( rtrim( $home_path, '/' ) ) );
		}
		$path = '/' . trim( rawurldecode( $path ), '/' ) . '/';
		if ( '//' === $path ) {
			$path = '/';
		}

		if ( '/sitemap.xml/' === $path && self::yoast_active() ) {
			$this->redirect( '/sitemap_index.xml' );
		}

		$redirects = self::legacy_redirects();
		if ( isset( $redirects[ $path ] ) ) {
			$this->redirect( $redirects[ $path ] );
		}
	}

	/**
	 * Add core noindex protection when Yoast is unavailable or disabled.
	 *
	 * @param array $robots Existing robots directives.
	 * @return array
	 */
	public function core_robots( $robots ) {
		if ( ! self::yoast_active() && $this->current_request_should_be_noindex() ) {
			$robots['noindex'] = true;
			$robots['follow']  = true;
			unset( $robots['index'], $robots['nofollow'] );
		}
		return $robots;
	}

	/**
	 * Apply the same decision to Yoast's single robots meta tag.
	 *
	 * @param array $robots Yoast robots directives.
	 * @return array
	 */
	public function yoast_robots( $robots ) {
		if ( $this->current_request_should_be_noindex() ) {
			$robots['index']  = 'noindex';
			$robots['follow'] = 'follow';
		}
		return $robots;
	}

	/**
	 * Embedded records are editable data, not standalone search pages.
	 *
	 * @param bool   $excluded Existing decision.
	 * @param string $post_type Post type key.
	 * @return bool
	 */
	public function exclude_embedded_post_types( $excluded, $post_type ) {
		return in_array( $post_type, array( 'spp_faq', 'spp_testimonial' ), true ) ? true : $excluded;
	}

	/**
	 * Remove legacy Page records and incomplete projects from Yoast sitemaps.
	 *
	 * @param int[] $ids Existing excluded IDs.
	 * @return int[]
	 */
	public function exclude_post_ids_from_sitemap( $ids ) {
		$ids = array_map( 'absint', (array) $ids );

		foreach ( array_keys( self::legacy_redirects() ) as $path ) {
			$post = get_page_by_path( trim( $path, '/' ), OBJECT, 'page' );
			if ( $post ) {
				$ids[] = (int) $post->ID;
			}
		}

		$project_ids = get_posts(
			array(
				'post_type'      => 'spp_project',
				'post_status'    => array( 'publish', 'draft', 'private' ),
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);
		foreach ( $project_ids as $project_id ) {
			if ( '1' !== (string) get_post_meta( $project_id, 'spp_seo_indexable', true ) ) {
				$ids[] = (int) $project_id;
			}
		}

		return array_values( array_unique( array_filter( $ids ) ) );
	}

	/**
	 * Exclude only the generic Uncategorized term from Yoast's taxonomy sitemap.
	 *
	 * @param int[] $terms Existing excluded term IDs.
	 * @return int[]
	 */
	public function exclude_archive_terms( $terms ) {
		$term = get_term_by( 'slug', 'uncategorized', 'category' );
		if ( $term && ! is_wp_error( $term ) ) {
			$terms[] = (int) $term->term_id;
		}
		return array_values( array_unique( array_map( 'absint', (array) $terms ) ) );
	}

	/**
	 * Let explicit Yoast fields win, otherwise reuse the existing plugin SEO title.
	 *
	 * @param string $title Yoast title.
	 * @return string
	 */
	public function yoast_title( $title ) {
		return $this->yoast_or_spp_value( $title, '_yoast_wpseo_title', 'spp_seo_title' );
	}

	/**
	 * Let explicit Yoast fields win, otherwise reuse the plugin description.
	 *
	 * @param string $description Yoast description.
	 * @return string
	 */
	public function yoast_description( $description ) {
		return $this->yoast_or_spp_value( $description, '_yoast_wpseo_metadesc', 'spp_seo_description' );
	}

	/**
	 * Let explicit Yoast canonicals win, otherwise reuse the plugin canonical.
	 *
	 * @param string $canonical Yoast canonical.
	 * @return string
	 */
	public function yoast_canonical( $canonical ) {
		$resolved = $this->yoast_or_spp_value( $canonical, '_yoast_wpseo_canonical', 'spp_canonical_url' );
		if ( '' !== trim( (string) $resolved ) ) {
			return $resolved;
		}

		return $this->current_canonical_fallback();
	}

	/**
	 * Supply Yoast with a canonical for managed pages when neither Yoast nor the
	 * Superior Plus editor has an explicit value. WordPress permalinks cover
	 * stored Pages and public plugin records; the route fallback covers valid
	 * React routes that intentionally have no backing post. Never canonicalize a
	 * genuine 404 response.
	 *
	 * @return string
	 */
	private function current_canonical_fallback() {
		if ( function_exists( 'is_404' ) && is_404() ) {
			return '';
		}

		$post_id = get_queried_object_id();
		if ( $post_id && function_exists( 'is_singular' ) && is_singular( array( 'page', 'spp_service', 'spp_project', 'spp_article' ) ) ) {
			$permalink = get_permalink( $post_id );
			if ( $permalink ) {
				return $permalink;
			}
		}

		$route = function_exists( 'get_query_var' ) ? trim( sanitize_text_field( (string) get_query_var( 'spp_react_route' ) ), '/' ) : '';
		return '' !== $route ? home_url( '/' . $route . '/' ) : '';
	}

	/**
	 * Whether Yoast is active for the current request.
	 *
	 * @return bool
	 */
	public static function yoast_active() {
		return defined( 'WPSEO_VERSION' );
	}

	/**
	 * Canonical article slugs supplied with the site.
	 *
	 * @return string[]
	 */
	private static function article_slugs() {
		return array(
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
	}

	/**
	 * Redirect to a verified same-site path.
	 *
	 * @param string $path Destination path.
	 */
	private function redirect( $path ) {
		wp_safe_redirect( home_url( $path ), 301, 'Superior Plus SEO cleanup' );
		exit;
	}

	/**
	 * Whether the current request should remain out of search results.
	 *
	 * @return bool
	 */
	private function current_request_should_be_noindex() {
		if ( function_exists( 'is_singular' ) && is_singular( 'spp_project' ) ) {
			return '1' !== (string) get_post_meta( get_queried_object_id(), 'spp_seo_indexable', true );
		}
		if ( function_exists( 'is_author' ) && is_author() ) {
			return true;
		}
		return function_exists( 'is_category' ) && is_category( 'uncategorized' );
	}

	/**
	 * Use an explicit Yoast value first, then the existing Superior Plus field.
	 *
	 * @param string $current Current Yoast value.
	 * @param string $yoast_key Yoast metadata key.
	 * @param string $spp_key Superior Plus metadata key.
	 * @return string
	 */
	private function yoast_or_spp_value( $current, $yoast_key, $spp_key ) {
		$post_id = get_queried_object_id();
		if ( ! $post_id || trim( (string) get_post_meta( $post_id, $yoast_key, true ) ) ) {
			return $current;
		}
		$value = trim( (string) get_post_meta( $post_id, $spp_key, true ) );
		return '' !== $value ? $value : $current;
	}
}
