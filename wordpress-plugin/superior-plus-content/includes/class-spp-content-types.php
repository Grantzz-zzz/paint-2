<?php
/**
 * Content type registration.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Types {
	/**
	 * Register hooks.
	 *
	 * @param bool $hooks Whether to attach WordPress hooks.
	 */
	public function __construct( $hooks = true ) {
		if ( $hooks ) {
			add_action( 'init', array( $this, 'register' ), 5 );
			add_action( 'admin_init', array( $this, 'ensure_site_config' ) );
			add_action( 'admin_head', array( $this, 'protect_site_config' ) );
		}
	}

	/**
	 * Register all plugin-owned post types.
	 */
	public function register() {
		$this->register_public_type(
			'spp_service',
			__( 'Services', 'superior-plus-content' ),
			__( 'Service', 'superior-plus-content' ),
			'art',
			array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'author' ),
			array( 'slug' => 'services', 'with_front' => false )
		);
		$this->register_public_type(
			'spp_project',
			__( 'Projects', 'superior-plus-content' ),
			__( 'Project', 'superior-plus-content' ),
			'format-gallery',
			array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'author' ),
			array( 'slug' => 'projects', 'with_front' => false )
		);
		$this->register_public_type(
			'spp_testimonial',
			__( 'Testimonials', 'superior-plus-content' ),
			__( 'Testimonial', 'superior-plus-content' ),
			'format-quote',
			array( 'title', 'editor', 'page-attributes', 'revisions', 'author' ),
			false
		);
		$this->register_public_type(
			'spp_faq',
			__( 'FAQs', 'superior-plus-content' ),
			__( 'FAQ', 'superior-plus-content' ),
			'editor-help',
			array( 'title', 'editor', 'page-attributes', 'revisions', 'author' ),
			false
		);

		register_post_type(
			'spp_site_config',
			array(
				'labels' => array(
					'name'          => __( 'Site Settings', 'superior-plus-content' ),
					'singular_name' => __( 'Site Settings', 'superior-plus-content' ),
					'edit_item'     => __( 'Edit Site Settings', 'superior-plus-content' ),
				),
				'public'              => false,
				'show_ui'             => true,
				'show_in_menu'        => 'spp-content',
				'show_in_rest'        => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'revisions' ),
				'capabilities'        => array(
					'edit_post'          => 'manage_spp_content',
					'read_post'          => 'manage_spp_content',
					'delete_post'        => 'manage_spp_system',
					'edit_posts'         => 'manage_spp_content',
					'edit_others_posts'  => 'manage_spp_content',
					'publish_posts'      => 'manage_spp_content',
					'read_private_posts' => 'manage_spp_content',
					'create_posts'       => 'manage_spp_system',
				),
				'map_meta_cap'        => false,
			)
		);

		register_taxonomy(
			'spp_project_category',
			'spp_project',
			array(
				'labels'       => array(
					'name'          => __( 'Project categories', 'superior-plus-content' ),
					'singular_name' => __( 'Project category', 'superior-plus-content' ),
				),
				'public'       => false,
				'show_ui'      => true,
				'show_in_rest' => true,
				'hierarchical' => true,
				'capabilities' => array(
					'manage_terms' => 'manage_spp_content',
					'edit_terms'   => 'manage_spp_content',
					'delete_terms' => 'manage_spp_content',
					'assign_terms' => 'edit_spp_projects',
				),
			)
		);
	}

	/**
	 * Register a public content type.
	 *
	 * @param string       $post_type Post type key.
	 * @param string       $plural Plural label.
	 * @param string       $singular Singular label.
	 * @param string       $icon Dashicon suffix.
	 * @param array        $supports Supported editor features.
	 * @param array|false  $rewrite Rewrite configuration.
	 */
	private function register_public_type( $post_type, $plural, $singular, $icon, $supports, $rewrite ) {
		$base = substr( $post_type, 4 );
		$cap  = ( 'faq' === $base ) ? array( 'spp_faq', 'spp_faqs' ) : array( "spp_{$base}", "spp_{$base}s" );
		register_post_type(
			$post_type,
			array(
				'labels' => array(
					'name'          => $plural,
					'singular_name' => $singular,
					'add_new_item'  => sprintf(
						/* translators: %s content type label. */
						__( 'Add %s', 'superior-plus-content' ),
						$singular
					),
					'edit_item'     => sprintf(
						/* translators: %s content type label. */
						__( 'Edit %s', 'superior-plus-content' ),
						$singular
					),
				),
				'public'          => true,
				'show_in_rest'    => true,
				'show_in_menu'    => 'spp-content',
				'has_archive'     => false,
				'rewrite'         => $rewrite,
				'menu_icon'       => 'dashicons-' . $icon,
				'supports'        => $supports,
				'capability_type' => $cap,
				'map_meta_cap'    => true,
			)
		);
	}

	/**
	 * Return the singleton settings record ID.
	 *
	 * @return int
	 */
	public function get_site_config_id() {
		$ids = get_posts(
			array(
				'post_type'      => 'spp_site_config',
				'post_status'    => array( 'private', 'publish', 'draft' ),
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'orderby'        => 'ID',
				'order'          => 'ASC',
			)
		);
		return $ids ? (int) $ids[0] : 0;
	}

	/**
	 * Create the singleton settings record when needed.
	 *
	 * @return int
	 */
	public function ensure_site_config() {
		$config_id = $this->get_site_config_id();
		if ( $config_id || ! current_user_can( 'manage_spp_content' ) ) {
			return $config_id;
		}
		return (int) wp_insert_post(
			array(
				'post_type'   => 'spp_site_config',
				'post_status' => 'private',
				'post_title'  => __( 'Superior Plus Site Settings', 'superior-plus-content' ),
			)
		);
	}

	/**
	 * Hide destructive/singleton controls.
	 */
	public function protect_site_config() {
		$screen = get_current_screen();
		if ( ! $screen || 'spp_site_config' !== $screen->post_type ) {
			return;
		}
		echo '<style>.post-type-spp_site_config .page-title-action,.post-type-spp_site_config #delete-action{display:none!important}</style>';
	}
}
