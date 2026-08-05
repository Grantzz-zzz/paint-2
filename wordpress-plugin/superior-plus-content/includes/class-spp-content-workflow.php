<?php
/**
 * Controlled content creation, preview, and publishing.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Workflow {
	/**
	 * Content type service.
	 *
	 * @var SPP_Content_Types
	 */
	private $types;

	/**
	 * Fields service.
	 *
	 * @var SPP_Content_Fields
	 */
	private $fields;

	/**
	 * Prevent recursive status correction.
	 *
	 * @var bool
	 */
	private $correcting_status = false;

	/**
	 * Create the workflow.
	 *
	 * @param SPP_Content_Types  $types Type service.
	 * @param SPP_Content_Fields $fields Field service.
	 */
	public function __construct( $types, $fields ) {
		$this->types  = $types;
		$this->fields = $fields;

		add_action( 'admin_menu', array( $this, 'register_pages' ), 20 );
		add_action( 'admin_post_spp_create_locked_content', array( $this, 'create' ) );
		add_action( 'load-post-new.php', array( $this, 'redirect_uncontrolled_creation' ) );
		add_action( 'add_meta_boxes', array( $this, 'register_workflow_box' ), 20 );
		add_action( 'save_post', array( $this, 'validate_publish' ), 40, 2 );
		add_action( 'admin_notices', array( $this, 'admin_notices' ) );
		add_filter( 'preview_post_link', array( $this, 'preview_link' ), 20, 2 );
		add_filter( 'post_row_actions', array( $this, 'row_preview_action' ), 20, 2 );
	}

	/**
	 * Supported controlled templates.
	 *
	 * @return array
	 */
	public function templates() {
		return array(
			'standard' => array(
				'label'       => __( 'Standard Content Page', 'superior-plus-content' ),
				'description' => __( 'A locked informational page with hero, approved content sections, imagery and closing CTA.', 'superior-plus-content' ),
				'post_type'   => 'page',
				'icon'        => 'dashicons-media-document',
			),
			'landing'  => array(
				'label'       => __( 'Landing Page', 'superior-plus-content' ),
				'description' => __( 'A locked campaign page using the approved design tokens and conversion sections.', 'superior-plus-content' ),
				'post_type'   => 'page',
				'icon'        => 'dashicons-welcome-widgets-menus',
			),
			'service_areas' => array(
				'label'       => __( 'Service Area Page', 'superior-plus-content' ),
				'description' => __( 'A local SEO page using the approved service-area hero, content sections, related pages and quote path.', 'superior-plus-content' ),
				'post_type'   => 'page',
				'icon'        => 'dashicons-location-alt',
			),
			'blog_hub' => array(
				'label'       => __( 'Blog Directory', 'superior-plus-content' ),
				'description' => __( 'A reusable article directory; published Blog Articles are inserted automatically.', 'superior-plus-content' ),
				'post_type'   => 'page',
				'icon'        => 'dashicons-book-alt',
			),
			'gallery' => array(
				'label'       => __( 'Gallery Directory', 'superior-plus-content' ),
				'description' => __( 'A reusable gallery hub populated from editable Project records and their Media Library galleries.', 'superior-plus-content' ),
				'post_type'   => 'page',
				'icon'        => 'dashicons-images-alt2',
			),
			'additional_services' => array(
				'label'       => __( 'Additional Services Directory', 'superior-plus-content' ),
				'description' => __( 'The approved preparation, repair and property-care service directory.', 'superior-plus-content' ),
				'post_type'   => 'page',
				'icon'        => 'dashicons-admin-tools',
			),
			'service'  => array(
				'label'       => __( 'Service Page', 'superior-plus-content' ),
				'description' => __( 'Scope, process, gallery, benefits, related services and SEO in the approved service design.', 'superior-plus-content' ),
				'post_type'   => 'spp_service',
				'icon'        => 'dashicons-art',
			),
			'project'  => array(
				'label'       => __( 'Project / Gallery Page', 'superior-plus-content' ),
				'description' => __( 'A project record with featured media, crop position and an unlimited ordered gallery.', 'superior-plus-content' ),
				'post_type'   => 'spp_project',
				'icon'        => 'dashicons-format-gallery',
			),
			'article'  => array(
				'label'       => __( 'Blog Article', 'superior-plus-content' ),
				'description' => __( 'A reusable article with the approved hero, reading navigation, references, takeaways, related services and CTA.', 'superior-plus-content' ),
				'post_type'   => 'spp_article',
				'icon'        => 'dashicons-edit-page',
			),
		);
	}

	/**
	 * Register wizard and hidden preview pages.
	 */
	public function register_pages() {
		add_submenu_page(
			'spp-content',
			__( 'Manage service areas', 'superior-plus-content' ),
			__( 'Areas', 'superior-plus-content' ),
			'manage_spp_content',
			'spp-content-areas',
			array( $this, 'render_areas_page' )
		);
		add_submenu_page(
			'spp-content',
			__( 'Create locked content', 'superior-plus-content' ),
			__( 'Create new', 'superior-plus-content' ),
			'manage_spp_content',
			'spp-content-create',
			array( $this, 'render_create_page' )
		);
		add_submenu_page(
			null,
			__( 'Preview Superior Plus content', 'superior-plus-content' ),
			__( 'Preview Superior Plus content', 'superior-plus-content' ),
			'manage_spp_content',
			'spp-content-preview',
			array( $this, 'render_preview_page' )
		);
	}

	/**
	 * Render a focused manager for every editable suburb page.
	 */
	public function render_areas_page() {
		if ( ! current_user_can( 'manage_spp_content' ) ) {
			wp_die( esc_html__( 'You do not have permission to manage service areas.', 'superior-plus-content' ) );
		}
		$directory = get_page_by_path( 'service-areas', OBJECT, 'page' );
		$areas = get_posts(
			array(
				'post_type'      => 'page',
				'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
				'posts_per_page' => -1,
				'meta_key'       => 'spp_template_key',
				'meta_value'     => 'service_areas',
				'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
			)
		);
		$areas = array_values(
			array_filter(
				$areas,
				function ( $area ) {
					return 'service-areas' !== $area->post_name;
				}
			)
		);
		?>
		<div class="wrap">
			<h1 class="wp-heading-inline"><?php esc_html_e( 'Service Areas', 'superior-plus-content' ); ?></h1>
			<a class="page-title-action" href="<?php echo esc_url( admin_url( 'admin.php?page=spp-content-create&template=service_areas' ) ); ?>"><?php esc_html_e( 'Add service area', 'superior-plus-content' ); ?></a>
			<?php if ( $directory ) : ?>
				<a class="page-title-action" href="<?php echo esc_url( get_edit_post_link( $directory->ID ) ); ?>"><?php esc_html_e( 'Edit directory page', 'superior-plus-content' ); ?></a>
			<?php endif; ?>
			<p><?php esc_html_e( 'Edit suburb names, regional groups, local copy, services, nearby areas, hero images and directory-card images without changing the approved layout.', 'superior-plus-content' ); ?></p>
			<table class="wp-list-table widefat fixed striped">
				<thead><tr><th><?php esc_html_e( 'Area', 'superior-plus-content' ); ?></th><th><?php esc_html_e( 'Region', 'superior-plus-content' ); ?></th><th><?php esc_html_e( 'Status', 'superior-plus-content' ); ?></th><th><?php esc_html_e( 'Actions', 'superior-plus-content' ); ?></th></tr></thead>
				<tbody>
				<?php foreach ( $areas as $area ) : ?>
					<?php
					$name = get_post_meta( $area->ID, 'spp_area_name', true );
					$name = $name ? $name : preg_replace( '/^Painters in\s+/i', '', $area->post_title );
					?>
					<tr>
						<td><strong><?php echo esc_html( $name ); ?></strong><br><code>/service-areas/<?php echo esc_html( $area->post_name ); ?></code></td>
						<td><?php echo esc_html( get_post_meta( $area->ID, 'spp_area_region', true ) ); ?></td>
						<td><?php echo esc_html( ucfirst( $area->post_status ) ); ?></td>
						<td><a href="<?php echo esc_url( get_edit_post_link( $area->ID ) ); ?>"><?php esc_html_e( 'Edit all content & images', 'superior-plus-content' ); ?></a><?php if ( 'publish' === $area->post_status ) : ?> | <a target="_blank" rel="noopener" href="<?php echo esc_url( get_permalink( $area ) ); ?>"><?php esc_html_e( 'View', 'superior-plus-content' ); ?></a><?php endif; ?></td>
					</tr>
				<?php endforeach; ?>
				<?php if ( ! $areas ) : ?><tr><td colspan="4"><?php esc_html_e( 'No managed service areas found. Run the Superior Plus content importer once.', 'superior-plus-content' ); ?></td></tr><?php endif; ?>
				</tbody>
			</table>
		</div>
		<?php
	}

	/**
	 * Redirect direct Add New entry points into the safe wizard.
	 */
	public function redirect_uncontrolled_creation() {
		if ( ! current_user_can( 'manage_spp_content' ) || isset( $_GET['spp_allow_direct'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}
		$post_type = isset( $_GET['post_type'] ) ? sanitize_key( wp_unslash( $_GET['post_type'] ) ) : 'post'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$map       = array(
			'page'        => 'standard',
			'spp_service' => 'service',
			'spp_project' => 'project',
			'spp_article' => 'article',
		);
		if ( isset( $map[ $post_type ] ) ) {
			wp_safe_redirect( admin_url( 'admin.php?page=spp-content-create&template=' . $map[ $post_type ] ) );
			exit;
		}
	}

	/**
	 * Render template chooser.
	 */
	public function render_create_page() {
		if ( ! current_user_can( 'manage_spp_content' ) ) {
			wp_die( esc_html__( 'You do not have permission to create this content.', 'superior-plus-content' ) );
		}
		$current = isset( $_GET['template'] ) ? sanitize_key( wp_unslash( $_GET['template'] ) ) : 'standard'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! isset( $this->templates()[ $current ] ) ) {
			$current = 'standard';
		}
		?>
		<div class="wrap spp-create-wrap">
			<h1><?php esc_html_e( 'Create locked Superior Plus content', 'superior-plus-content' ); ?></h1>
			<p><?php esc_html_e( 'Choose the content type. The approved React layout, styles, animation and responsive behaviour stay locked.', 'superior-plus-content' ); ?></p>
			<div class="spp-template-grid">
				<?php foreach ( $this->templates() as $key => $template ) : ?>
					<a class="spp-template-card <?php echo $current === $key ? 'is-selected' : ''; ?>" href="<?php echo esc_url( admin_url( 'admin.php?page=spp-content-create&template=' . $key ) ); ?>">
						<span class="dashicons <?php echo esc_attr( $template['icon'] ); ?>"></span>
						<strong><?php echo esc_html( $template['label'] ); ?></strong>
						<small><?php echo esc_html( $template['description'] ); ?></small>
					</a>
				<?php endforeach; ?>
			</div>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="spp-create-form">
				<input type="hidden" name="action" value="spp_create_locked_content">
				<input type="hidden" name="template_key" value="<?php echo esc_attr( $current ); ?>">
				<?php wp_nonce_field( 'spp_create_locked_content', 'spp_create_nonce' ); ?>
				<label for="spp-new-title"><strong><?php esc_html_e( 'Working title', 'superior-plus-content' ); ?></strong></label>
				<input class="regular-text" id="spp-new-title" name="post_title" required maxlength="180" placeholder="<?php esc_attr_e( 'Example: Garage Floor Coatings', 'superior-plus-content' ); ?>">
				<p class="description"><?php esc_html_e( 'WordPress will generate the slug and public route from this title. You can revise the title and slug before publishing.', 'superior-plus-content' ); ?></p>
				<button class="button button-primary button-hero" type="submit"><?php esc_html_e( 'Create draft and start editing', 'superior-plus-content' ); ?></button>
			</form>
		</div>
		<style>
			.spp-template-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;max-width:960px;margin:24px 0}
			.spp-template-card{background:#fff;border:2px solid #dcdcde;border-radius:4px;color:#1d2327;display:grid;gap:8px;padding:20px;text-decoration:none}
			.spp-template-card:hover,.spp-template-card:focus,.spp-template-card.is-selected{border-color:#8f211c;box-shadow:0 0 0 1px #8f211c;color:#1d2327}
			.spp-template-card .dashicons{color:#8f211c;font-size:28px;height:28px;width:28px}
			.spp-template-card strong{font-size:17px}.spp-template-card small{font-size:13px;line-height:1.5}
			.spp-create-form{background:#fff;border:1px solid #dcdcde;display:grid;gap:10px;max-width:920px;padding:20px}
			.spp-create-form .button{justify-self:start}@media(max-width:782px){.spp-template-grid{grid-template-columns:1fr}}
		</style>
		<?php
	}

	/**
	 * Create one managed draft and redirect to its supported fields.
	 */
	public function create() {
		if ( ! current_user_can( 'manage_spp_content' ) ) {
			wp_die( esc_html__( 'You do not have permission to create this content.', 'superior-plus-content' ) );
		}
		check_admin_referer( 'spp_create_locked_content', 'spp_create_nonce' );
		$template_key = isset( $_POST['template_key'] ) ? sanitize_key( wp_unslash( $_POST['template_key'] ) ) : '';
		$templates    = $this->templates();
		if ( ! isset( $templates[ $template_key ] ) ) {
			wp_die( esc_html__( 'Unsupported content template.', 'superior-plus-content' ) );
		}
		$post_type = $templates[ $template_key ]['post_type'];
		if ( ! current_user_can( get_post_type_object( $post_type )->cap->create_posts ) ) {
			wp_die( esc_html__( 'You cannot create this content type.', 'superior-plus-content' ) );
		}
		$title = isset( $_POST['post_title'] ) ? mb_substr( sanitize_text_field( wp_unslash( $_POST['post_title'] ) ), 0, 180 ) : '';
		if ( ! $title ) {
			wp_die( esc_html__( 'Enter a working title.', 'superior-plus-content' ) );
		}

		$post_args = array(
				'post_type'   => $post_type,
				'post_status' => 'draft',
				'post_title'  => $title,
				'post_name'   => sanitize_title( $title ),
			);
		$area_name = '';
		if ( 'service_areas' === $template_key ) {
			$area_name = trim( preg_replace( '/^Painters in\s+/i', '', $title ) );
			$parent = get_page_by_path( 'service-areas', OBJECT, 'page' );
			$post_args['post_title']  = 'Painters in ' . $area_name;
			$post_args['post_name']   = sanitize_title( $area_name );
			$post_args['post_parent'] = $parent ? (int) $parent->ID : 0;
		}
		$post_id = wp_insert_post(
			$post_args,
			true
		);
		if ( is_wp_error( $post_id ) ) {
			wp_die( esc_html( $post_id->get_error_message() ) );
		}

		$source_key = wp_generate_uuid4();
		update_post_meta( $post_id, 'spp_template_key', $template_key );
		update_post_meta( $post_id, '_spp_managed_content', 1 );
		update_post_meta( $post_id, '_spp_source_key', $post_type . ':' . $source_key );
		update_post_meta( $post_id, '_spp_design_variant', $this->design_variant( $source_key ) );
		update_post_meta( $post_id, '_spp_created_at', gmdate( 'c' ) );
		if ( 'service_areas' === $template_key ) {
			update_post_meta( $post_id, 'spp_area_name', $area_name );
			update_post_meta( $post_id, 'spp_area_region', 'Melbourne service area' );
			update_post_meta( $post_id, 'spp_area_region_description', 'Professional painting services across Melbourne, carefully planned for local homes and properties.' );
			update_post_meta( $post_id, 'spp_area_property_types', array( 'Homes', 'Townhouses', 'Apartments', 'Commercial properties' ) );
			update_post_meta( $post_id, 'spp_area_service_slugs', array( 'residential-painting-melbourne', 'interior-painting-melbourne', 'exterior-painting-melbourne', 'commercial-painting-melbourne' ) );
			update_post_meta( $post_id, 'spp_area_local_context', 'Superior Plus Painting and Remodeling provides professional painting services in ' . $area_name . ', with careful preparation, clear communication and a clean handover.' );
			update_post_meta( $post_id, 'spp_area_neighbour_slugs', array() );
			update_post_meta( $post_id, 'spp_eyebrow', $area_name . ' service area' );
			update_post_meta( $post_id, 'spp_hero_title', 'Painters in ' . $area_name );
			update_post_meta( $post_id, 'spp_accent', 'careful work, clearly planned.' );
			update_post_meta( $post_id, 'spp_hero_intro', 'Professional residential and commercial painting services in ' . $area_name . ', Melbourne.' );
			update_post_meta( $post_id, 'spp_seo_title', 'Painters ' . $area_name . ' | Superior Plus Painting' );
			update_post_meta( $post_id, 'spp_seo_description', 'Professional residential, commercial, interior and exterior painters in ' . $area_name . ', Melbourne. Request a free written quote.' );
		}

		wp_safe_redirect( add_query_arg( 'spp_created', '1', get_edit_post_link( $post_id, 'url' ) ) );
		exit;
	}

	/**
	 * Assign a supported protected variant without exposing style controls.
	 *
	 * @param string $seed Stable source key.
	 * @return string
	 */
	private function design_variant( $seed ) {
		$variants = array( 'maroon', 'green', 'gold', 'teal', 'terracotta', 'cream' );
		$index    = abs( crc32( $seed ) ) % count( $variants );
		return $variants[ $index ];
	}

	/**
	 * Add workflow status to supported edit screens.
	 */
	public function register_workflow_box() {
		foreach ( array( 'page', 'spp_service', 'spp_project', 'spp_article' ) as $post_type ) {
			add_meta_box(
				'spp-publishing-workflow',
				__( 'Superior Plus publishing', 'superior-plus-content' ),
				array( $this, 'render_workflow_box' ),
				$post_type,
				'side',
				'high'
			);
		}
	}

	/**
	 * Render template, route, validation, and preview state.
	 *
	 * @param WP_Post $post Current post.
	 */
	public function render_workflow_box( $post ) {
		$template = get_post_meta( $post->ID, 'spp_template_key', true );
		if ( ! $template ) {
			$template = 'spp_service' === $post->post_type ? 'service' : ( 'spp_project' === $post->post_type ? 'project' : ( 'spp_article' === $post->post_type ? 'article' : $this->fields->default_template_for_slug( $post->post_name ) ) );
		}
		$missing = $this->missing_required_fields( $post );
		$preview = $this->react_preview_link( $post );
		$structured_preview = wp_nonce_url( admin_url( 'admin.php?page=spp-content-preview&post=' . $post->ID ), 'spp_preview_content_' . $post->ID );
		echo '<p><strong>' . esc_html__( 'Locked template:', 'superior-plus-content' ) . '</strong><br><code>' . esc_html( $template ) . '</code></p>';
		echo '<p><strong>' . esc_html__( 'Public route:', 'superior-plus-content' ) . '</strong><br><code>' . esc_html( $this->public_path( $post ) ) . '</code></p>';
		if ( get_post_meta( $post->ID, '_spp_managed_content', true ) ) {
			echo '<p><strong>' . esc_html__( 'Protected design variant:', 'superior-plus-content' ) . '</strong><br>' . esc_html( get_post_meta( $post->ID, '_spp_design_variant', true ) ) . '</p>';
		}
		if ( $missing ) {
			echo '<div class="notice notice-warning inline"><p><strong>' . esc_html__( 'Required before publishing:', 'superior-plus-content' ) . '</strong><br>' . esc_html( implode( ', ', $missing ) ) . '</p></div>';
		} else {
			echo '<div class="notice notice-success inline"><p>' . esc_html__( 'Required content is ready.', 'superior-plus-content' ) . '</p></div>';
		}
		echo '<p><a class="button button-primary" target="_blank" rel="noopener" href="' . esc_url( $preview ) . '">' . esc_html__( 'Preview exact React design', 'superior-plus-content' ) . '</a></p>';
		echo '<p><a target="_blank" rel="noopener" href="' . esc_url( $structured_preview ) . '">' . esc_html__( 'Inspect saved field structure', 'superior-plus-content' ) . '</a></p>';
	}

	/**
	 * Generate backend public path.
	 *
	 * @param WP_Post $post Record.
	 * @return string
	 */
	private function public_path( $post ) {
		if ( 'spp_service' === $post->post_type ) {
			return '/services/' . ( $post->post_name ?: sanitize_title( $post->post_title ) );
		}
		if ( 'spp_project' === $post->post_type ) {
			return '/projects/' . ( $post->post_name ?: sanitize_title( $post->post_title ) );
		}
		if ( 'spp_article' === $post->post_type ) {
			return '/blog/' . ( $post->post_name ?: sanitize_title( $post->post_title ) );
		}
		if ( 'page' === $post->post_type ) {
			return '/' . trim( get_page_uri( $post ), '/' );
		}
		return '/';
	}

	/**
	 * Replace WordPress's generic preview with the secure structured preview.
	 *
	 * @param string  $link Existing preview link.
	 * @param WP_Post $post Post.
	 * @return string
	 */
	public function preview_link( $link, $post ) {
		if ( ! in_array( $post->post_type, array( 'page', 'spp_service', 'spp_project', 'spp_article' ), true ) ) {
			return $link;
		}
		return $this->react_preview_link( $post );
	}

	/**
	 * Build an authenticated React preview URL. The REST nonce is injected by
	 * the theme for the currently logged-in user and is never placed in the URL.
	 *
	 * @param WP_Post $post Record.
	 * @return string
	 */
	private function react_preview_link( $post ) {
		return add_query_arg( 'spp_preview', (int) $post->ID, home_url( $this->public_path( $post ) ) );
	}

	/**
	 * Add preview link to list tables.
	 *
	 * @param array   $actions Row actions.
	 * @param WP_Post $post Record.
	 * @return array
	 */
	public function row_preview_action( $actions, $post ) {
		if ( in_array( $post->post_type, array( 'page', 'spp_service', 'spp_project', 'spp_article' ), true ) && current_user_can( 'edit_post', $post->ID ) ) {
			$actions['spp_preview'] = '<a href="' . esc_url( $this->preview_link( '', $post ) ) . '" target="_blank" rel="noopener">' . esc_html__( 'Content preview', 'superior-plus-content' ) . '</a>';
		}
		return $actions;
	}

	/**
	 * Render a secure structured draft preview.
	 */
	public function render_preview_page() {
		$post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$post    = get_post( $post_id );
		if ( ! $post || ! current_user_can( 'edit_post', $post_id ) ) {
			wp_die( esc_html__( 'Preview not available.', 'superior-plus-content' ), '', array( 'response' => 404 ) );
		}
		check_admin_referer( 'spp_preview_content_' . $post_id );
		$fields = $this->fields->get_public_meta( $post );
		?>
		<div class="wrap spp-content-preview">
			<p><a href="<?php echo esc_url( get_edit_post_link( $post_id, 'url' ) ); ?>">&larr; <?php esc_html_e( 'Return to editor', 'superior-plus-content' ); ?></a></p>
			<h1><?php echo esc_html( get_the_title( $post ) ); ?></h1>
			<p><strong><?php esc_html_e( 'Status:', 'superior-plus-content' ); ?></strong> <?php echo esc_html( $post->post_status ); ?> · <strong><?php esc_html_e( 'Route:', 'superior-plus-content' ); ?></strong> <code><?php echo esc_html( $this->public_path( $post ) ); ?></code></p>
			<?php if ( $post->post_content ) : ?>
				<section class="card"><h2><?php esc_html_e( 'Main content', 'superior-plus-content' ); ?></h2><?php echo wp_kses_post( apply_filters( 'the_content', $post->post_content ) ); ?></section>
			<?php endif; ?>
			<table class="widefat striped">
				<thead><tr><th><?php esc_html_e( 'Field', 'superior-plus-content' ); ?></th><th><?php esc_html_e( 'Saved value', 'superior-plus-content' ); ?></th></tr></thead>
				<tbody>
					<?php foreach ( $fields as $key => $value ) : ?>
						<tr><th><?php echo esc_html( ucwords( str_replace( '_', ' ', $key ) ) ); ?></th><td><?php $this->render_preview_value( $key, $value ); ?></td></tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		<style>.spp-content-preview{max-width:1100px}.spp-content-preview .card{max-width:none}.spp-content-preview th{width:240px}.spp-preview-media{display:flex;flex-wrap:wrap;gap:10px}.spp-preview-media img{height:110px;object-fit:cover;width:150px}</style>
		<?php
	}

	/**
	 * Safely render a preview value.
	 *
	 * @param string $key Field key.
	 * @param mixed  $value Saved value.
	 */
	private function render_preview_value( $key, $value ) {
		if ( preg_match( '/_image_id$|^logo_id$|^featured_media_id$/', $key ) && absint( $value ) ) {
			echo wp_kses_post( wp_get_attachment_image( absint( $value ), 'medium' ) );
			return;
		}
		if ( 'gallery_items' === $key && is_array( $value ) ) {
			echo '<div class="spp-preview-media">';
			foreach ( $value as $item ) {
				if ( ! empty( $item['attachment_id'] ) ) {
					echo wp_kses_post( wp_get_attachment_image( absint( $item['attachment_id'] ), 'thumbnail' ) );
				}
			}
			echo '</div>';
			return;
		}
		if ( is_array( $value ) ) {
			echo '<pre>' . esc_html( wp_json_encode( $value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) ) . '</pre>';
			return;
		}
		echo nl2br( esc_html( (string) $value ) );
	}

	/**
	 * Required fields for managed records only.
	 *
	 * @param WP_Post $post Record.
	 * @return array Human-readable missing fields.
	 */
	private function missing_required_fields( $post ) {
		if ( ! get_post_meta( $post->ID, '_spp_managed_content', true ) ) {
			return array();
		}
		$template = get_post_meta( $post->ID, 'spp_template_key', true );
		$required = array(
			'standard' => array(
				'post_title'        => 'Title',
				'spp_eyebrow'       => 'Hero eyebrow',
				'spp_accent'        => 'Hero accent',
				'spp_hero_intro'    => 'Hero introduction',
				'spp_hero_image_id' => 'Hero image',
			),
			'landing'  => array(
				'post_title'        => 'Title',
				'spp_eyebrow'       => 'Hero eyebrow',
				'spp_accent'        => 'Hero accent',
				'spp_hero_intro'    => 'Hero introduction',
				'spp_hero_image_id' => 'Hero image',
			),
			'service'  => array(
				// Every decorative/content field is optional. The locked React
				// source supplies a safe presentation fallback when an editor
				// intentionally clears a hero subheader or section field.
				'post_title' => 'Title',
			),
			'project'  => array(
				'post_title'              => 'Title',
				'spp_project_type'        => 'Project type',
				'spp_featured_media_id'   => 'Featured project image',
			),
			'article'  => array(
				'post_title'              => 'Title',
				'post_content'            => 'Article body',
				'post_excerpt'            => 'Article excerpt',
				'spp_article_category'    => 'Article category',
				'spp_article_read_time'   => 'Read time',
				'spp_hero_image_id'       => 'Article image',
			),
		);
		$missing = array();
		foreach ( isset( $required[ $template ] ) ? $required[ $template ] : array() as $key => $label ) {
			if ( 'post_title' === $key ) {
				$value = $post->post_title;
			} elseif ( 'post_content' === $key ) {
				$value = $post->post_content;
			} elseif ( 'post_excerpt' === $key ) {
				$value = $post->post_excerpt;
			} else {
				$value = get_post_meta( $post->ID, $key, true );
			}
			if ( '' === $value || null === $value || 0 === $value || array() === $value ) {
				$missing[] = $label;
			}
		}
		return $missing;
	}

	/**
	 * Prevent incomplete managed records from becoming public.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post Record.
	 */
	public function validate_publish( $post_id, $post ) {
		if ( $this->correcting_status || 'publish' !== $post->post_status || ! in_array( $post->post_type, array( 'page', 'spp_service', 'spp_project', 'spp_article' ), true ) ) {
			return;
		}
		$missing = $this->missing_required_fields( $post );
		if ( ! $missing ) {
			return;
		}
		$this->correcting_status = true;
		wp_update_post( array( 'ID' => $post_id, 'post_status' => 'draft' ) );
		$this->correcting_status = false;
		set_transient(
			'spp_publish_errors_' . get_current_user_id(),
			array(
				'post_id' => $post_id,
				'missing' => $missing,
			),
			MINUTE_IN_SECONDS
		);
	}

	/**
	 * Show workflow feedback.
	 */
	public function admin_notices() {
		if ( isset( $_GET['spp_created'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Locked draft created. Complete the supported fields, preview the saved content, then publish.', 'superior-plus-content' ) . '</p></div>';
		}
		$key    = 'spp_publish_errors_' . get_current_user_id();
		$notice = get_transient( $key );
		if ( ! $notice ) {
			return;
		}
		delete_transient( $key );
		echo '<div class="notice notice-error"><p><strong>' . esc_html__( 'This item stayed in Draft because required content is missing:', 'superior-plus-content' ) . '</strong> ' . esc_html( implode( ', ', $notice['missing'] ) ) . '</p></div>';
	}
}
