<?php
/**
 * Service content type and editing fields.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_register_service_type() {
	register_post_type(
		'spp_service',
		array(
			'labels' => array(
				'name'          => __( 'Services', 'superior-plus' ),
				'singular_name' => __( 'Service', 'superior-plus' ),
				'add_new_item'  => __( 'Add service', 'superior-plus' ),
				'edit_item'     => __( 'Edit service', 'superior-plus' ),
			),
			'public'       => true,
			'show_in_rest' => true,
			'has_archive'  => false,
			'rewrite'      => array( 'slug' => 'services', 'with_front' => false ),
			'menu_icon'    => 'dashicons-art',
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions' ),
		)
	);
}
add_action( 'init', 'spp_register_service_type' );

function spp_service_meta_boxes() {
	add_meta_box( 'spp-service-details', __( 'Service page design fields', 'superior-plus' ), 'spp_service_meta_box', 'spp_service', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'spp_service_meta_boxes' );

function spp_service_meta_box( $post ) {
	wp_nonce_field( 'spp_save_service', 'spp_service_nonce' );
	$fields = array(
		'spp_eyebrow'    => array( 'Hero eyebrow', 'text' ),
		'spp_accent'     => array( 'Hero accent line', 'text' ),
		'spp_scope_title' => array( 'Scope heading', 'text' ),
		'spp_why'        => array( 'Process introduction', 'textarea' ),
		'spp_scope'      => array( 'Scope items — one per line', 'list' ),
		'spp_process'    => array( 'Process steps — one per line', 'list' ),
		'spp_benefits'   => array( 'Benefits — one per line', 'list' ),
	);
	echo '<div class="spp-admin-fields">';
	foreach ( $fields as $key => $definition ) {
		$value = get_post_meta( $post->ID, $key, true );
		if ( 'list' === $definition[1] && is_array( $value ) ) {
			$value = implode( "\n", $value );
		}
		echo '<p><label for="' . esc_attr( $key ) . '"><strong>' . esc_html( $definition[0] ) . '</strong></label><br>';
		if ( 'text' === $definition[1] ) {
			echo '<input class="widefat" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '">';
		} else {
			echo '<textarea class="widefat" rows="' . ( 'list' === $definition[1] ? '6' : '4' ) . '" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $value ) . '</textarea>';
		}
		echo '</p>';
	}
	$tone    = get_post_meta( $post->ID, 'spp_tone', true ) ?: 'maroon';
	$gallery = get_post_meta( $post->ID, 'spp_gallery', true );
	echo '<p><label for="spp_tone"><strong>' . esc_html__( 'Page colour', 'superior-plus' ) . '</strong></label><br><select id="spp_tone" name="spp_tone">';
	foreach ( array( 'maroon', 'green', 'gold', 'teal', 'terracotta', 'cream' ) as $option ) {
		echo '<option value="' . esc_attr( $option ) . '" ' . selected( $tone, $option, false ) . '>' . esc_html( ucfirst( $option ) ) . '</option>';
	}
	echo '</select></p><p><label for="spp_gallery"><strong>' . esc_html__( 'Project gallery', 'superior-plus' ) . '</strong></label><br><select id="spp_gallery" name="spp_gallery"><option value="">None</option>';
	foreach ( array( 'commercial', 'interior', 'exterior', 'fence', 'outdoor' ) as $option ) {
		echo '<option value="' . esc_attr( $option ) . '" ' . selected( $gallery, $option, false ) . '>' . esc_html( ucfirst( $option ) ) . '</option>';
	}
	echo '</select></p></div>';
}

function spp_save_service_meta( $post_id ) {
	if ( ! isset( $_POST['spp_service_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['spp_service_nonce'] ) ), 'spp_save_service' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( array( 'spp_eyebrow', 'spp_accent', 'spp_scope_title', 'spp_tone', 'spp_gallery' ) as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
		}
	}
	if ( isset( $_POST['spp_why'] ) ) {
		update_post_meta( $post_id, 'spp_why', sanitize_textarea_field( wp_unslash( $_POST['spp_why'] ) ) );
	}
	foreach ( array( 'spp_scope', 'spp_process', 'spp_benefits' ) as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			$items = preg_split( '/\r\n|\r|\n/', sanitize_textarea_field( wp_unslash( $_POST[ $field ] ) ) );
			$items = array_values( array_filter( array_map( 'trim', $items ) ) );
			update_post_meta( $post_id, $field, $items );
		}
	}
}
add_action( 'save_post_spp_service', 'spp_save_service_meta' );

