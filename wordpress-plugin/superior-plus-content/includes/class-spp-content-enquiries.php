<?php
/**
 * Public quote enquiry validation, spam controls, and email delivery.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Enquiries {
	private $types;

	public function __construct( $types ) {
		$this->types = $types;
		add_action( 'rest_api_init', array( $this, 'register_route' ) );
		add_action( 'wp_mail_failed', array( $this, 'record_mail_failure' ) );
	}

	public function register_route() {
		register_rest_route(
			'spp/v1',
			'/quote',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'submit' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	public function submit( $request ) {
		$nonce = sanitize_text_field( (string) $request->get_header( 'x-spp-form-nonce' ) );
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'spp_quote_form' ) ) {
			return $this->error( 'spp_quote_token', __( 'The form session expired. Refresh the page and try again.', 'superior-plus-content' ), 403 );
		}
		if ( ! $this->same_origin() ) {
			return $this->error( 'spp_quote_origin', __( 'This form request was not accepted.', 'superior-plus-content' ), 403 );
		}

		$params = (array) $request->get_json_params();
		if ( ! empty( $params['website'] ) ) {
			return $this->error( 'spp_quote_spam', __( 'This form request was not accepted.', 'superior-plus-content' ), 400 );
		}
		$started_at = isset( $params['started_at'] ) ? (int) $params['started_at'] : 0;
		$elapsed = (int) round( microtime( true ) * 1000 ) - $started_at;
		if ( $started_at <= 0 || $elapsed < 1500 || $elapsed > DAY_IN_SECONDS * 1000 ) {
			return $this->error( 'spp_quote_timing', __( 'Please review the form and try again.', 'superior-plus-content' ), 400 );
		}
		if ( $this->rate_limited() ) {
			return $this->error( 'spp_quote_rate_limit', __( 'Too many enquiries were submitted recently. Please wait a few minutes or call us.', 'superior-plus-content' ), 429 );
		}

		$config_id = $this->types->get_site_config_id();
		$recipient = $config_id ? sanitize_email( get_post_meta( $config_id, 'spp_quote_recipient', true ) ) : '';
		$recipient = sanitize_email( apply_filters( 'spp_quote_recipient', $recipient ) );
		if ( ! is_email( $recipient ) ) {
			return $this->error( 'spp_quote_not_configured', __( 'Email delivery is not configured yet. Please call or email us directly.', 'superior-plus-content' ), 503 );
		}

		$data = $this->sanitize_submission( $params );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$privacy_text = $config_id ? trim( (string) get_post_meta( $config_id, 'spp_privacy_text', true ) ) : '';
		if ( $privacy_text && empty( $params['consent'] ) ) {
			return $this->error( 'spp_quote_consent', __( 'Please confirm the privacy statement before submitting.', 'superior-plus-content' ), 400 );
		}

		$subject = sprintf(
			/* translators: 1: requested service, 2: customer name */
			__( 'New website quote request: %1$s — %2$s', 'superior-plus-content' ),
			$data['service'] ?: __( 'Painting enquiry', 'superior-plus-content' ),
			$data['name']
		);
		$lines = array(
			'Name: ' . $data['name'],
			'Phone: ' . $data['phone'],
			'Email: ' . $data['email'],
			'Suburb: ' . $data['suburb'],
			'Property address: ' . ( $data['address'] ?: 'Not supplied' ),
			'Service: ' . ( $data['service'] ?: 'Not supplied' ),
			'Property type: ' . ( $data['property_type'] ?: 'Not supplied' ),
			'Page: ' . $data['page_path'],
			'',
			'Project details:',
			$data['details'],
			'',
			'Privacy confirmation: ' . ( $privacy_text ? 'Confirmed' : 'Not required by current configuration' ),
			'Submitted: ' . gmdate( 'c' ),
		);
		$headers = array( 'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>' );
		$this->increment_rate_limit();
		$sent = wp_mail( $recipient, wp_strip_all_tags( $subject ), implode( "\n", $lines ), $headers );
		if ( ! $sent ) {
			return $this->error( 'spp_quote_delivery_failed', __( 'We could not send your enquiry right now. Please try again or contact us directly.', 'superior-plus-content' ), 502 );
		}

		update_option( 'spp_quote_last_success', gmdate( 'c' ), false );
		return rest_ensure_response(
			array(
				'schema_version' => SPP_CONTENT_SCHEMA_VERSION,
				'generated_at'   => gmdate( 'c' ),
				'data'           => array(
					'delivered' => true,
					'message'   => __( 'Thanks — we’ll be in touch.', 'superior-plus-content' ),
				),
			)
		);
	}

	private function sanitize_submission( $params ) {
		$data = array(
			'name'          => $this->limited_text( $params, 'name', 120 ),
			'phone'         => $this->limited_text( $params, 'phone', 40 ),
			'email'         => isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '',
			'suburb'        => $this->limited_text( $params, 'suburb', 120 ),
			'address'       => $this->limited_text( $params, 'address', 240 ),
			'service'       => $this->limited_text( $params, 'service', 120 ),
			'property_type' => $this->limited_text( $params, 'property_type', 120 ),
			'details'       => isset( $params['details'] ) ? $this->truncate( sanitize_textarea_field( $params['details'] ), 3000 ) : '',
			'page_path'     => $this->limited_text( $params, 'page_path', 240 ),
		);
		$phone_digits = preg_replace( '/\D+/', '', $data['phone'] );
		if ( $this->text_length( $data['name'] ) < 2 || strlen( $phone_digits ) < 8 || ! is_email( $data['email'] ) || $this->text_length( $data['suburb'] ) < 2 || $this->text_length( $data['details'] ) < 10 ) {
			return $this->error( 'spp_quote_invalid', __( 'Check your name, phone, email, suburb and project details, then try again.', 'superior-plus-content' ), 400 );
		}
		return $data;
	}

	private function limited_text( $params, $key, $limit ) {
		return isset( $params[ $key ] ) ? $this->truncate( sanitize_text_field( $params[ $key ] ), $limit ) : '';
	}

	private function truncate( $text, $limit ) {
		return function_exists( 'mb_substr' ) ? mb_substr( $text, 0, $limit ) : substr( $text, 0, $limit );
	}

	private function text_length( $text ) {
		return function_exists( 'mb_strlen' ) ? mb_strlen( $text ) : strlen( $text );
	}

	private function same_origin() {
		if ( empty( $_SERVER['HTTP_ORIGIN'] ) ) {
			return true;
		}
		$origin_host = wp_parse_url( esc_url_raw( wp_unslash( $_SERVER['HTTP_ORIGIN'] ) ), PHP_URL_HOST );
		$site_host = wp_parse_url( home_url( '/' ), PHP_URL_HOST );
		return $origin_host && $site_host && strtolower( $origin_host ) === strtolower( $site_host );
	}

	private function rate_key() {
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
		return 'spp_quote_' . substr( hash_hmac( 'sha256', $ip, wp_salt( 'nonce' ) ), 0, 32 );
	}

	private function rate_limited() {
		return (int) get_transient( $this->rate_key() ) >= 5;
	}

	private function increment_rate_limit() {
		$key = $this->rate_key();
		set_transient( $key, (int) get_transient( $key ) + 1, 15 * MINUTE_IN_SECONDS );
	}

	public function record_mail_failure( $error ) {
		update_option(
			'spp_quote_last_failure',
			array(
				'at'   => gmdate( 'c' ),
				'code' => $error instanceof WP_Error ? sanitize_key( $error->get_error_code() ) : 'mail_failed',
			),
			false
		);
	}

	private function error( $code, $message, $status ) {
		return new WP_Error( $code, $message, array( 'status' => $status ) );
	}
}
