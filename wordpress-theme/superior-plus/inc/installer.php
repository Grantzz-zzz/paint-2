<?php
/**
 * Safe starter-content installer. Existing pages and services are preserved.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_ensure_content_types_registered() {
	if ( ! post_type_exists( 'spp_service' ) && function_exists( 'spp_register_service_type' ) ) {
		spp_register_service_type();
	}
	if ( ! post_type_exists( 'spp_project' ) && function_exists( 'spp_register_project_type' ) ) {
		spp_register_project_type();
	}
}

function spp_install_theme_content() {
	spp_ensure_content_types_registered();
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
	spp_ensure_content_types_registered();
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
		<?php if ( isset( $_GET['spp-elementor-system-imported'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-success"><p><?php esc_html_e( 'The Elementor homepage, UAE global header/footer and MetForm quote form were installed successfully.', 'superior-plus' ); ?></p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['spp-home-draft'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<?php $draft_id = absint( $_GET['spp-home-draft'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-success"><p>
				<?php esc_html_e( 'Homepage Redesign was created as a separate draft. The current homepage was not changed.', 'superior-plus' ); ?>
				<a href="<?php echo esc_url( admin_url( 'post.php?post=' . $draft_id . '&action=elementor' ) ); ?>"><?php esc_html_e( 'Edit it with Elementor', 'superior-plus' ); ?></a>
			</p></div>
		<?php endif; ?>
		<?php if ( isset( $_GET['spp-home-preserved'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<?php $draft_id = absint( $_GET['spp-home-preserved'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-warning"><p>
				<?php esc_html_e( 'Homepage Redesign already contains Elementor work, so the importer preserved it and changed nothing.', 'superior-plus' ); ?>
				<a href="<?php echo esc_url( admin_url( 'post.php?post=' . $draft_id . '&action=elementor' ) ); ?>"><?php esc_html_e( 'Continue editing the existing draft', 'superior-plus' ); ?></a>
			</p></div>
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
		<h2><?php esc_html_e( 'Step 1 — Homepage Redesign draft', 'superior-plus' ); ?></h2>
		<p><?php esc_html_e( 'This creates a separate draft page containing the React-matched homepage body. It does not replace the current homepage, header, footer, menu, or any existing Elementor page. If the draft already has Elementor content, the installer refuses to overwrite it.', 'superior-plus' ); ?></p>
		<?php if ( did_action( 'elementor/loaded' ) && post_type_exists( 'metform-form' ) ) : ?>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="spp_create_elementor_home_draft">
				<?php wp_nonce_field( 'spp_create_elementor_home_draft' ); ?>
				<?php submit_button( __( 'Create Homepage Redesign draft', 'superior-plus' ), 'primary large' ); ?>
			</form>
		<?php else : ?>
			<div class="notice notice-warning inline"><p><?php esc_html_e( 'Activate Elementor and MetForm before creating the homepage draft.', 'superior-plus' ); ?></p></div>
		<?php endif; ?>
		<hr>
		<p><strong><?php esc_html_e( 'Page-by-page mode is active.', 'superior-plus' ); ?></strong> <?php esc_html_e( 'The former complete-build and replace-home actions are disabled in the setup screen to protect work already completed on staging.', 'superior-plus' ); ?></p>
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
	$legacy_form = get_page_by_path( 'spp-quote-form', OBJECT, 'metform-form' );
	$portable_content = str_replace(
		array( '{{SPP_THEME_URI}}', '{{SPP_HOME_URL}}', '{{SPP_METFORM_ID}}' ),
		array( SPP_URI, untrailingslashit( home_url( '/' ) ), $legacy_form ? (string) $legacy_form->ID : '0' ),
		wp_json_encode( $template['content'] )
	);
	$template['content'] = json_decode( $portable_content, true );

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
// The legacy replace-home handler remains in the file for rollback compatibility,
// but is intentionally not registered. Page-by-page mode never overwrites Home.

/**
 * Load a bundled Elementor document and replace portable installer tokens.
 *
 * @param string $filename Template filename.
 * @param array  $tokens   Token replacements.
 * @return array
 */
function spp_read_elementor_document( $filename, $tokens = array() ) {
	$path = SPP_PATH . '/elementor-templates/' . $filename;
	$data = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( empty( $data['content'] ) || ! is_array( $data['content'] ) ) {
		wp_die( esc_html__( 'A bundled Elementor template is invalid.', 'superior-plus' ) );
	}
	$encoded = wp_json_encode( $data['content'] );
	$encoded = str_replace( array_keys( $tokens ), array_values( $tokens ), $encoded );
	return json_decode( $encoded, true );
}

/**
 * Create or update one theme-owned Elementor document.
 *
 * @return int
 */
function spp_upsert_elementor_document( $post_type, $slug, $title, $content, $template_type = 'wp-post' ) {
	$post = get_page_by_path( $slug, OBJECT, $post_type );
	$id   = $post ? $post->ID : wp_insert_post(
		array( 'post_type' => $post_type, 'post_status' => 'publish', 'post_title' => $title, 'post_name' => $slug )
	);
	if ( is_wp_error( $id ) || ! $id ) {
		wp_die( esc_html__( 'WordPress could not create an Elementor document.', 'superior-plus' ) );
	}
	wp_update_post( array( 'ID' => $id, 'post_status' => 'publish', 'post_title' => $title ) );
	update_post_meta( $id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $id, '_elementor_template_type', $template_type );
	update_post_meta( $id, '_elementor_version', ELEMENTOR_VERSION );
	update_post_meta( $id, '_elementor_data', wp_slash( wp_json_encode( $content ) ) );
	return (int) $id;
}

/** Determine whether an Elementor document already contains editable elements. */
function spp_elementor_document_has_content( $post_id ) {
	$data = get_post_meta( $post_id, '_elementor_data', true );
	if ( ! is_string( $data ) || '' === trim( $data ) || '[]' === trim( $data ) ) {
		return false;
	}
	$decoded = json_decode( $data, true );
	return is_array( $decoded ) && ! empty( $decoded );
}

/**
 * Create the homepage as an isolated draft without changing the active front page.
 * Existing Elementor data is never replaced by this action.
 */
function spp_handle_elementor_home_draft_create() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to create the homepage draft.', 'superior-plus' ) );
	}
	check_admin_referer( 'spp_create_elementor_home_draft' );
	if ( ! did_action( 'elementor/loaded' ) || ! post_type_exists( 'metform-form' ) ) {
		wp_die( esc_html__( 'Elementor and MetForm must be active before creating the homepage draft.', 'superior-plus' ) );
	}

	$tokens = array(
		'{{SPP_THEME_URI}}' => SPP_URI,
		'{{SPP_HOME_URL}}'  => untrailingslashit( home_url( '/' ) ),
		'{{CURRENT_YEAR}}'  => wp_date( 'Y' ),
	);

	// Reuse a completed theme-owned form. Populate it only when it has no fields.
	$form = get_page_by_path( 'spp-quote-form', OBJECT, 'metform-form' );
	if ( $form && spp_elementor_document_has_content( $form->ID ) ) {
		$form_id = (int) $form->ID;
	} else {
		$form_content = spp_read_elementor_document( 'superior-plus-quote-metform-4.1.7.json', $tokens );
		$form_id      = spp_upsert_elementor_document( 'metform-form', 'spp-quote-form', 'Superior Plus Quote Form', $form_content, 'wp-post' );
		update_post_meta( $form_id, '_wp_page_template', 'elementor_canvas' );
		update_post_meta(
			$form_id,
			'metform_form__form_setting',
			array(
				'form_title'      => 'Superior Plus Quote Form',
				'form_type'       => 'contact-form',
				'success_message' => 'Thanks — we’ll be in touch shortly.',
				'store_entries'   => '1',
			)
		);
	}

	$draft = get_page_by_path( 'homepage-redesign', OBJECT, 'page' );
	if ( $draft && spp_elementor_document_has_content( $draft->ID ) ) {
		wp_safe_redirect( admin_url( 'themes.php?page=spp-setup&spp-home-preserved=' . $draft->ID ) );
		exit;
	}
	if ( $draft ) {
		$draft_id = (int) $draft->ID;
	} else {
		$draft_id = wp_insert_post(
			array(
				'post_type'   => 'page',
				'post_status' => 'draft',
				'post_title'  => 'Homepage Redesign',
				'post_name'   => 'homepage-redesign',
			)
		);
	}
	if ( is_wp_error( $draft_id ) || ! $draft_id ) {
		wp_die( esc_html__( 'WordPress could not create the Homepage Redesign draft.', 'superior-plus' ) );
	}

	$tokens['{{SPP_METFORM_ID}}'] = (string) $form_id;
	$content = spp_read_elementor_document( 'superior-plus-home-elementor-4.2.json', $tokens );
	update_post_meta( $draft_id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $draft_id, '_elementor_template_type', 'wp-page' );
	update_post_meta( $draft_id, '_elementor_version', ELEMENTOR_VERSION );
	update_post_meta( $draft_id, '_elementor_data', wp_slash( wp_json_encode( $content ) ) );
	update_post_meta( $draft_id, '_elementor_page_settings', array( 'hide_title' => 'yes', 'page_layout' => 'default' ) );
	wp_update_post( array( 'ID' => $draft_id, 'post_content' => '', 'post_status' => 'draft' ) );

	if ( isset( \Elementor\Plugin::$instance->files_manager ) ) {
		\Elementor\Plugin::$instance->files_manager->clear_cache();
	}
	wp_safe_redirect( admin_url( 'themes.php?page=spp-setup&spp-home-draft=' . $draft_id ) );
	exit;
}
add_action( 'admin_post_spp_create_elementor_home_draft', 'spp_handle_elementor_home_draft_create' );

/** Install the complete Elementor/UAE/MetForm editing system on staging. */
function spp_handle_elementor_system_install() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to install the Elementor build.', 'superior-plus' ) );
	}
	check_admin_referer( 'spp_install_elementor_system' );
	if ( ! did_action( 'elementor/loaded' ) || ! post_type_exists( 'elementor-hf' ) || ! post_type_exists( 'metform-form' ) ) {
		wp_die( esc_html__( 'Elementor, Ultimate Addons for Elementor and MetForm must all be active.', 'superior-plus' ) );
	}

	$tokens = array(
		'{{SPP_THEME_URI}}' => SPP_URI,
		'{{SPP_HOME_URL}}'  => untrailingslashit( home_url( '/' ) ),
		'{{CURRENT_YEAR}}'  => wp_date( 'Y' ),
	);

	$form_content = spp_read_elementor_document( 'superior-plus-quote-metform-4.1.7.json', $tokens );
	$form_id      = spp_upsert_elementor_document( 'metform-form', 'spp-quote-form', 'Superior Plus Quote Form', $form_content, 'wp-post' );
	update_post_meta( $form_id, '_wp_page_template', 'elementor_canvas' );
	update_post_meta(
		$form_id,
		'metform_form__form_setting',
		array(
			'form_title'      => 'Superior Plus Quote Form',
			'form_type'       => 'contact-form',
			'success_message' => 'Thanks — we’ll be in touch shortly.',
			'store_entries'   => '1',
		)
	);

	$header_id = spp_upsert_elementor_document( 'elementor-hf', 'spp-global-header', 'Superior Plus Global Header', spp_read_elementor_document( 'superior-plus-header-uae-2.9.2.json', $tokens ) );
	$footer_id = spp_upsert_elementor_document( 'elementor-hf', 'spp-global-footer', 'Superior Plus Global Footer', spp_read_elementor_document( 'superior-plus-footer-uae-2.9.2.json', $tokens ) );
	$location  = array( 'rule' => array( 'basic-global' ), 'specific' => array() );
	foreach ( array( $header_id => 'type_header', $footer_id => 'type_footer' ) as $id => $type ) {
		update_post_meta( $id, 'ehf_template_type', $type );
		update_post_meta( $id, 'ehf_target_include_locations', $location );
		update_post_meta( $id, 'ehf_target_exclude_locations', array() );
	}
	update_option( 'spp_hfe_header_id', $header_id );
	update_option( 'spp_hfe_footer_id', $footer_id );

	$home = get_page_by_path( 'home', OBJECT, 'page' );
	$home_id = $home ? $home->ID : wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => 'Home', 'post_name' => 'home' ) );
	$home_tokens = $tokens + array( '{{SPP_METFORM_ID}}' => (string) $form_id );
	$home_content = spp_read_elementor_document( 'superior-plus-home-elementor-4.2.json', $home_tokens );
	spp_upsert_elementor_document( 'page', 'home', 'Home', $home_content, 'wp-page' );
	update_post_meta( $home_id, '_elementor_page_settings', array( 'hide_title' => 'yes', 'page_layout' => 'default' ) );
	wp_update_post( array( 'ID' => $home_id, 'post_content' => '' ) );
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $home_id );

	if ( isset( \Elementor\Plugin::$instance->files_manager ) ) {
		\Elementor\Plugin::$instance->files_manager->clear_cache();
	}
	wp_safe_redirect( admin_url( 'themes.php?page=spp-setup&spp-elementor-system-imported=1' ) );
	exit;
}
// Intentionally not registered: the old all-at-once importer could replace
// completed Elementor documents. New pages are installed individually.
