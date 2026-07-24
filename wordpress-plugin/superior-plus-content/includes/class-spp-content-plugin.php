<?php
/**
 * Main plugin coordinator.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class SPP_Content_Plugin {
	/**
	 * Singleton instance.
	 *
	 * @var SPP_Content_Plugin|null
	 */
	private static $instance = null;

	/**
	 * Content type registrar.
	 *
	 * @var SPP_Content_Types
	 */
	private $types;

	/**
	 * Field manager.
	 *
	 * @var SPP_Content_Fields
	 */
	private $fields;

	/**
	 * Return the singleton.
	 *
	 * @return SPP_Content_Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Wire the plugin.
	 */
	private function __construct() {
		$this->types  = new SPP_Content_Types();
		$this->fields = new SPP_Content_Fields( $this->types );
		$rest = new SPP_Content_REST( $this->types, $this->fields );
		new SPP_Content_Workflow( $this->types, $this->fields );
		new SPP_Content_Routing();
		new SPP_Content_Migration( $this->types );
		new SPP_Content_Enquiries( $this->types );
		new SPP_Content_Recovery( $this->fields, $rest );

		add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
		add_action( 'admin_menu', array( $this, 'register_admin_menu' ), 5 );
		add_filter( 'plugin_action_links_' . plugin_basename( SPP_CONTENT_FILE ), array( $this, 'action_links' ) );
	}

	/**
	 * Load translations.
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'superior-plus-content', false, dirname( plugin_basename( SPP_CONTENT_FILE ) ) . '/languages' );
	}

	/**
	 * Register the common admin parent menu.
	 */
	public function register_admin_menu() {
		add_menu_page(
			__( 'Superior Plus Content', 'superior-plus-content' ),
			__( 'Superior Plus', 'superior-plus-content' ),
			'manage_spp_content',
			'spp-content',
			array( $this, 'render_dashboard' ),
			'dashicons-art',
			25
		);
	}

	/**
	 * Render the lightweight content dashboard.
	 */
	public function render_dashboard() {
		if ( ! current_user_can( 'manage_spp_content' ) ) {
			wp_die( esc_html__( 'You do not have permission to manage this content.', 'superior-plus-content' ) );
		}
		$config_id = $this->types->get_site_config_id();
		$recipient = $config_id ? sanitize_email( get_post_meta( $config_id, 'spp_quote_recipient', true ) ) : '';
		$last_success = get_option( 'spp_quote_last_success', '' );
		$last_failure = get_option( 'spp_quote_last_failure', array() );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Superior Plus Content', 'superior-plus-content' ); ?></h1>
			<p><?php esc_html_e( 'Edit the words, images and ordered content used by the locked React design. Layout, fonts, colours, shapes and animations remain protected in the theme.', 'superior-plus-content' ); ?></p>
			<div class="card">
				<h2><?php esc_html_e( 'Editing areas', 'superior-plus-content' ); ?></h2>
				<p>
					<a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $config_id, 'url' ) ); ?>"><?php esc_html_e( 'Site settings', 'superior-plus-content' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=spp_service' ) ); ?>"><?php esc_html_e( 'Services', 'superior-plus-content' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=spp_project' ) ); ?>"><?php esc_html_e( 'Projects', 'superior-plus-content' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=spp_testimonial' ) ); ?>"><?php esc_html_e( 'Testimonials', 'superior-plus-content' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=spp_faq' ) ); ?>"><?php esc_html_e( 'FAQs', 'superior-plus-content' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>"><?php esc_html_e( 'Pages', 'superior-plus-content' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'nav-menus.php' ) ); ?>"><?php esc_html_e( 'Header and footer menus', 'superior-plus-content' ); ?></a>
				</p>
			</div>
			<div class="card">
				<h2><?php esc_html_e( 'Quote form delivery', 'superior-plus-content' ); ?></h2>
				<?php if ( is_email( $recipient ) ) : ?>
					<p><span class="dashicons dashicons-yes-alt" style="color:#1f7a42"></span> <?php esc_html_e( 'Recipient configured:', 'superior-plus-content' ); ?> <code><?php echo esc_html( $recipient ); ?></code></p>
				<?php else : ?>
					<p><span class="dashicons dashicons-warning" style="color:#b32d2e"></span> <?php esc_html_e( 'The public forms remain disabled until an administrator enters the confirmed recipient email in Site Settings.', 'superior-plus-content' ); ?></p>
				<?php endif; ?>
				<?php if ( $last_success ) : ?><p><?php esc_html_e( 'Last confirmed delivery:', 'superior-plus-content' ); ?> <code><?php echo esc_html( $last_success ); ?></code></p><?php endif; ?>
				<?php if ( ! empty( $last_failure['at'] ) ) : ?><p><?php esc_html_e( 'Last mail failure:', 'superior-plus-content' ); ?> <code><?php echo esc_html( $last_failure['at'] . ' (' . $last_failure['code'] . ')' ); ?></code></p><?php endif; ?>
				<p><a class="button" href="<?php echo esc_url( get_edit_post_link( $config_id, 'url' ) ); ?>"><?php esc_html_e( 'Configure recipient and privacy text', 'superior-plus-content' ); ?></a></p>
			</div>
			<div class="card">
				<h2><?php esc_html_e( 'Safety rules', 'superior-plus-content' ); ?></h2>
				<ul>
					<li><?php esc_html_e( 'Content is stored outside the theme and survives theme updates.', 'superior-plus-content' ); ?></li>
					<li><?php esc_html_e( 'Media is selected from the WordPress Media Library.', 'superior-plus-content' ); ?></li>
					<li><?php esc_html_e( 'The React fallback remains visible if the content API is unavailable.', 'superior-plus-content' ); ?></li>
					<li><?php esc_html_e( 'Nothing is sent to the production website automatically.', 'superior-plus-content' ); ?></li>
				</ul>
			</div>
		</div>
		<?php
	}

	/**
	 * Add a convenient plugin-list link.
	 *
	 * @param array $links Existing links.
	 * @return array
	 */
	public function action_links( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'admin.php?page=spp-content' ) ) . '">' . esc_html__( 'Manage content', 'superior-plus-content' ) . '</a>' );
		return $links;
	}

	/**
	 * Activation tasks.
	 */
	public static function activate() {
		$types = new SPP_Content_Types( false );
		$types->register();
		$routing = new SPP_Content_Routing( false );
		$routing->register_rewrites();
		self::add_capabilities();
		$types->ensure_site_config();
		update_option( 'spp_content_db_version', SPP_CONTENT_VERSION, false );
		if ( 'superior-plus' === get_stylesheet() ) {
			update_option( 'spp_content_routes_version', SPP_CONTENT_VERSION, false );
		} else {
			delete_option( 'spp_content_routes_version' );
		}
		flush_rewrite_rules();
	}

	/**
	 * Keep data and capabilities on deactivation.
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}

	/**
	 * Install capabilities without changing existing roles otherwise.
	 */
	private static function add_capabilities() {
		$common_caps = array( 'manage_spp_content' );
		$type_caps   = array();
		foreach ( array( 'service', 'project', 'testimonial', 'faq' ) as $singular ) {
			$plural = ( 'faq' === $singular ) ? 'faqs' : $singular . 's';
			$type_caps = array_merge(
				$type_caps,
				array(
					"edit_spp_{$singular}",
					"read_spp_{$singular}",
					"delete_spp_{$singular}",
					"edit_spp_{$plural}",
					"edit_others_spp_{$plural}",
					"publish_spp_{$plural}",
					"read_private_spp_{$plural}",
					"delete_spp_{$plural}",
					"delete_private_spp_{$plural}",
					"delete_published_spp_{$plural}",
					"delete_others_spp_{$plural}",
					"edit_private_spp_{$plural}",
					"edit_published_spp_{$plural}",
				)
			);
		}

		foreach ( array( 'administrator', 'editor' ) as $role_name ) {
			$role = get_role( $role_name );
			if ( ! $role ) {
				continue;
			}
			foreach ( array_merge( $common_caps, $type_caps ) as $capability ) {
				$role->add_cap( $capability );
			}
		}

		$administrator = get_role( 'administrator' );
		if ( $administrator ) {
			$administrator->add_cap( 'manage_spp_system' );
		}
	}
}
