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
