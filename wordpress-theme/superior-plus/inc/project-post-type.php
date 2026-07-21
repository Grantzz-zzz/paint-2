<?php
/**
 * Editable project portfolio backed by the WordPress Media Library.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_register_project_type() {
	register_post_type(
		'spp_project',
		array(
			'labels' => array(
				'name'          => __( 'Projects', 'superior-plus' ),
				'singular_name' => __( 'Project', 'superior-plus' ),
				'add_new_item'  => __( 'Add project', 'superior-plus' ),
				'edit_item'     => __( 'Edit project', 'superior-plus' ),
			),
			'public'       => true,
			'show_in_rest' => true,
			'has_archive'  => false,
			'rewrite'      => array( 'slug' => 'projects', 'with_front' => false ),
			'menu_icon'    => 'dashicons-format-gallery',
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions' ),
		)
	);
	register_taxonomy(
		'spp_project_category',
		'spp_project',
		array(
			'labels'       => array( 'name' => __( 'Project categories', 'superior-plus' ), 'singular_name' => __( 'Project category', 'superior-plus' ) ),
			'public'       => false,
			'show_ui'      => true,
			'show_in_rest' => true,
			'hierarchical' => true,
		)
	);
}
add_action( 'init', 'spp_register_project_type' );

