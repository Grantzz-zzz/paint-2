<?php
/**
 * Safe starter-content installer. Existing pages and services are preserved.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_install_theme_content() {
	spp_register_service_type();
	spp_register_project_type();
	foreach ( array( 'commercial', 'interior', 'exterior', 'fence', 'outdoor' ) as $project_category ) {
		if ( ! term_exists( $project_category, 'spp_project_category' ) ) {
			wp_insert_term( ucfirst( $project_category ), 'spp_project_category', array( 'slug' => $project_category ) );
		}
	}
	$pages = array(
		'home'        => array( 'Home', 'Superior Plus Painting provides residential and commercial painting across Melbourne with careful preparation, honest advice and a finish made to last.' ),
		'about'       => array( 'About', 'Superior Plus Painting is a Melbourne-based team dedicated to high-quality workmanship, reliable service and respect for every property.' ),
		'services'    => array( 'Services', 'Explore our complete painting, preparation, repair and property-improvement services.' ),
		'our-process' => array( 'Our Process', 'Our proven six-step painting process keeps each project organised from consultation to clean handover.' ),
		'faqs'        => array( 'FAQs', 'Clear answers about quotations, preparation, scheduling, paint systems and what to expect.' ),
		'contact'     => array( 'Contact', 'Tell us about your property and arrange a free, no-obligation quotation.' ),
	);
	$page_ids = array();
	foreach ( $pages as $slug => $page ) {
		$existing = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $existing ) {
			$page_ids[ $slug ] = $existing->ID;
			continue;
		}
		$page_ids[ $slug ] = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $page[0],
				'post_name'    => $slug,
				'post_content' => $page[1],
			)
		);
	}

	if ( ! empty( $page_ids['home'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $page_ids['home'] );
	}

	$service_ids = array();
	foreach ( spp_default_services() as $slug => $service ) {
		$existing = get_page_by_path( $slug, OBJECT, 'spp_service' );
		if ( $existing ) {
			$service_ids[ $slug ] = $existing->ID;
			continue;
		}
		$post_id = wp_insert_post(
			array(
				'post_type'    => 'spp_service',
				'post_status'  => 'publish',
				'post_title'   => $service['title'],
				'post_name'    => $slug,
				'post_excerpt' => $service['intro'],
				'post_content' => '<p>' . esc_html( $service['intro'] ) . '</p>',
				'menu_order'   => count( $service_ids ) + 1,
			)
		);
		if ( is_wp_error( $post_id ) ) {
			continue;
		}
		$service_ids[ $slug ] = $post_id;
		foreach ( array( 'eyebrow', 'accent', 'tone', 'gallery', 'scope_title', 'scope', 'process', 'why', 'benefits', 'image' ) as $key ) {
			if ( isset( $service[ $key ] ) ) {
				update_post_meta( $post_id, 'spp_' . $key, $service[ $key ] );
			}
		}
	}

	if ( ! wp_get_nav_menu_object( 'Superior Plus Primary' ) ) {
		$menu_id = wp_create_nav_menu( 'Superior Plus Primary' );
		$home_item = spp_add_page_menu_item( $menu_id, $page_ids['home'] ?? 0 );
		$services_item = spp_add_page_menu_item( $menu_id, $page_ids['services'] ?? 0 );
		foreach ( $service_ids as $service_id ) {
			wp_update_nav_menu_item(
				$menu_id,
				0,
				array(
					'menu-item-object-id' => $service_id,
					'menu-item-object'    => 'spp_service',
					'menu-item-parent-id' => $services_item,
					'menu-item-type'      => 'post_type',
					'menu-item-status'    => 'publish',
				)
			);
		}
		foreach ( array( 'about', 'our-process', 'faqs', 'contact' ) as $slug ) {
			spp_add_page_menu_item( $menu_id, $page_ids[ $slug ] ?? 0 );
		}
		$locations = get_theme_mod( 'nav_menu_locations', array() );
		$locations['primary'] = $menu_id;
		$locations['footer']  = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}

	flush_rewrite_rules();
}
function spp_add_page_menu_item( $menu_id, $page_id ) {
	if ( ! $page_id ) {
		return 0;
	}
	return wp_update_nav_menu_item(
		$menu_id,
		0,
		array(
			'menu-item-object-id' => $page_id,
			'menu-item-object'    => 'page',
			'menu-item-type'      => 'post_type',
			'menu-item-status'    => 'publish',
		)
	);
}

function spp_activation_flush_rewrites() {
	spp_register_service_type();
	spp_register_project_type();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'spp_activation_flush_rewrites' );

function spp_setup_page_menu() {
	add_theme_page(
		__( 'Superior Plus Setup', 'superior-plus' ),
		__( 'Superior Plus Setup', 'superior-plus' ),
		'manage_options',
		'spp-setup',
		'spp_render_setup_page'
	);
}
add_action( 'admin_menu', 'spp_setup_page_menu' );

function spp_render_setup_page() {
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Superior Plus theme setup', 'superior-plus' ); ?></h1>
		<?php if ( isset( $_GET['spp-imported'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-success"><p><?php esc_html_e( 'Starter pages, services and navigation are ready. Existing content was preserved.', 'superior-plus' ); ?></p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['spp-elementor-imported'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-success"><p><?php esc_html_e( 'The editable Elementor homepage was installed successfully.', 'superior-plus' ); ?></p></div>
		<?php endif; ?>
		<p><?php esc_html_e( 'Use this once on a staging site or after taking a backup. It creates only missing content, but it also sets the new Home page as the site homepage.', 'superior-plus' ); ?></p>
		<ul>
			<li><?php esc_html_e( 'Creates six core pages and nine editable service entries.', 'superior-plus' ); ?></li>
			<li><?php esc_html_e( 'Creates and assigns the primary navigation with its Services submenu.', 'superior-plus' ); ?></li>
			<li><?php esc_html_e( 'Never overwrites an existing page or service with the same slug.', 'superior-plus' ); ?></li>
		</ul>
		<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
			<input type="hidden" name="action" value="spp_install_content">
			<?php wp_nonce_field( 'spp_install_content' ); ?>
			<?php submit_button( __( 'Create starter content', 'superior-plus' ), 'primary large' ); ?>
		</form>
		<hr>
		<h2><?php esc_html_e( 'Editable Elementor homepage', 'superior-plus' ); ?></h2>
		<p><?php esc_html_e( 'This installs the React-matched homepage as native Elementor containers and widgets. It replaces only the Home page layout; your services, menu, header and footer remain intact.', 'superior-plus' ); ?></p>
		<?php if ( did_action( 'elementor/loaded' ) ) : ?>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="spp_install_elementor_home">
				<?php wp_nonce_field( 'spp_install_elementor_home' ); ?>
				<?php submit_button( __( 'Install or replace Elementor homepage', 'superior-plus' ), 'secondary large' ); ?>
			</form>
		<?php else : ?>
			<div class="notice notice-warning inline"><p><?php esc_html_e( 'Activate Elementor before installing the editable homepage.', 'superior-plus' ); ?></p></div>
		<?php endif; ?>
	</div>
	<?php
}

function spp_handle_content_install() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to run theme setup.', 'superior-plus' ) );
	}
	check_admin_referer( 'spp_install_content' );
	spp_install_theme_content();
	wp_safe_redirect( admin_url( 'themes.php?page=spp-setup&spp-imported=1' ) );
	exit;
}
add_action( 'admin_post_spp_install_content', 'spp_handle_content_install' );

function spp_handle_elementor_home_install() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to install the Elementor homepage.', 'superior-plus' ) );
	}
	check_admin_referer( 'spp_install_elementor_home' );
	if ( ! did_action( 'elementor/loaded' ) ) {
		wp_die( esc_html__( 'Elementor must be active before importing this homepage.', 'superior-plus' ) );
	}

	$template_path = SPP_PATH . '/elementor-templates/superior-plus-home-elementor-4.2.json';
	$template      = json_decode( file_get_contents( $template_path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( empty( $template['content'] ) || ! is_array( $template['content'] ) ) {
		wp_die( esc_html__( 'The bundled Elementor homepage template is invalid.', 'superior-plus' ) );
	}

	$home = get_page_by_path( 'home', OBJECT, 'page' );
	if ( ! $home ) {
		$home_id = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Home', 'post_name' => 'home' ) );
	} else {
		$home_id = $home->ID;
	}
	if ( is_wp_error( $home_id ) || ! $home_id ) {
		wp_die( esc_html__( 'WordPress could not create or find the Home page.', 'superior-plus' ) );
	}

	update_post_meta( $home_id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $home_id, '_elementor_template_type', 'wp-page' );
	update_post_meta( $home_id, '_elementor_version', ELEMENTOR_VERSION );
	update_post_meta( $home_id, '_elementor_data', wp_slash( wp_json_encode( $template['content'] ) ) );
	update_post_meta( $home_id, '_elementor_page_settings', $template['page_settings'] ?? array( 'hide_title' => 'yes' ) );
	wp_update_post( array( 'ID' => $home_id, 'post_content' => '' ) );
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $home_id );
	if ( isset( \Elementor\Plugin::$instance->files_manager ) ) {
		\Elementor\Plugin::$instance->files_manager->clear_cache();
	}

	wp_safe_redirect( admin_url( 'themes.php?page=spp-setup&spp-elementor-imported=1' ) );
	exit;
}
add_action( 'admin_post_spp_install_elementor_home', 'spp_handle_elementor_home_install' );
