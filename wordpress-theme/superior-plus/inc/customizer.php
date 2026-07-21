<?php
/**
 * Business settings in the WordPress Customizer.
 *
 * @package SuperiorPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function spp_customize_register( $customizer ) {
	$customizer->add_section(
		'spp_business',
		array(
			'title'    => __( 'Superior Plus business details', 'superior-plus' ),
			'priority' => 30,
		)
	);
	$settings = array(
		'spp_phone'    => array( 'Phone number', '0470 234 567', 'sanitize_text_field' ),
		'spp_email'    => array( 'Email address', 'sppainting.remodeling@gmail.com', 'sanitize_email' ),
		'spp_location' => array( 'Location', 'Melbourne, Victoria', 'sanitize_text_field' ),
		'spp_instagram' => array( 'Instagram URL', '', 'esc_url_raw' ),
		'spp_form_shortcode' => array( 'Contact form shortcode', '', 'sanitize_text_field' ),
	);
	foreach ( $settings as $key => $definition ) {
		$customizer->add_setting( $key, array( 'default' => $definition[1], 'sanitize_callback' => $definition[2] ) );
		$customizer->add_control( $key, array( 'section' => 'spp_business', 'label' => __( $definition[0], 'superior-plus' ), 'type' => 'text' ) );
	}
}
add_action( 'customize_register', 'spp_customize_register' );

function spp_phone() {
	return get_theme_mod( 'spp_phone', '0470 234 567' );
}

function spp_phone_href() {
	return preg_replace( '/[^0-9+]/', '', spp_phone() );
}

function spp_email() {
	return get_theme_mod( 'spp_email', 'sppainting.remodeling@gmail.com' );
}
