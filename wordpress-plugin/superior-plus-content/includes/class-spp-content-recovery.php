<?php
/**
 * Administrator-only JSON backup and same-site content recovery.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Recovery {
	private $fields;
	private $rest;

	public function __construct( $fields, $rest ) {
		$this->fields = $fields;
		$this->rest   = $rest;
		add_action( 'admin_menu', array( $this, 'register_page' ), 35 );
		add_action( 'admin_post_spp_export_content_backup', array( $this, 'handle_export' ) );
		add_action( 'admin_post_spp_import_content_backup', array( $this, 'handle_import' ) );
	}

	public function register_page() {
		add_submenu_page(
			'spp-content',
			__( 'Backup and recovery', 'superior-plus-content' ),
			__( 'Backup & recovery', 'superior-plus-content' ),
			'manage_spp_system',
			'spp-content-recovery',
			array( $this, 'render_page' )
		);
	}

	public function render_page() {
		if ( ! current_user_can( 'manage_spp_system' ) ) {
			wp_die( esc_html__( 'You do not have permission to manage backups.', 'superior-plus-content' ) );
		}
		$report = get_option( 'spp_content_recovery_report', array() );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Superior Plus backup and recovery', 'superior-plus-content' ); ?></h1>
			<p><?php esc_html_e( 'Download a JSON safety copy before content changes or package updates. This file restores Superior Plus records on the same WordPress installation. Use a complete hosting files-and-database backup when moving or rebuilding the whole site.', 'superior-plus-content' ); ?></p>
			<?php if ( isset( $_GET['restored'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
				<div class="notice notice-success"><p><?php esc_html_e( 'The content backup was restored.', 'superior-plus-content' ); ?></p></div>
			<?php endif; ?>
			<?php if ( $report ) : ?>
				<h2><?php esc_html_e( 'Latest recovery report', 'superior-plus-content' ); ?></h2>
				<pre style="background:#fff;border:1px solid #ccd0d4;max-width:900px;padding:16px;white-space:pre-wrap"><?php echo esc_html( wp_json_encode( $report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) ); ?></pre>
			<?php endif; ?>
			<div class="card">
				<h2><?php esc_html_e( '1. Export content backup', 'superior-plus-content' ); ?></h2>
				<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
					<input type="hidden" name="action" value="spp_export_content_backup">
					<?php wp_nonce_field( 'spp_export_content_backup' ); ?>
					<?php submit_button( __( 'Download JSON backup', 'superior-plus-content' ), 'secondary', 'submit', false ); ?>
				</form>
			</div>
			<div class="card">
				<h2><?php esc_html_e( '2. Restore content backup', 'superior-plus-content' ); ?></h2>
				<p><strong><?php esc_html_e( 'This intentionally replaces matching Superior Plus content and fields with the selected backup.', 'superior-plus-content' ); ?></strong></p>
				<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" enctype="multipart/form-data">
					<input type="hidden" name="action" value="spp_import_content_backup">
					<?php wp_nonce_field( 'spp_import_content_backup' ); ?>
					<p><input type="file" name="spp_backup" accept="application/json,.json" required></p>
					<p><label><input type="checkbox" name="confirm_restore" value="yes" required> <?php esc_html_e( 'I understand that matching content will be replaced by this backup.', 'superior-plus-content' ); ?></label></p>
					<?php submit_button( __( 'Restore selected backup', 'superior-plus-content' ), 'primary', 'submit', false ); ?>
				</form>
			</div>
		</div>
		<?php
	}

	public function handle_export() {
		$this->authorize( 'spp_export_content_backup' );
		$package  = $this->rest->export_package();
		$filename = 'superior-plus-content-' . gmdate( 'Y-m-d-His' ) . '.json';
		nocache_headers();
		header( 'Content-Type: application/json; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
		echo wp_json_encode( $package, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
		exit;
	}

	public function handle_import() {
		$this->authorize( 'spp_import_content_backup' );
		if ( 'yes' !== ( isset( $_POST['confirm_restore'] ) ? sanitize_text_field( wp_unslash( $_POST['confirm_restore'] ) ) : '' ) ) {
			wp_die( esc_html__( 'Explicit restore confirmation is required.', 'superior-plus-content' ) );
		}
		if ( empty( $_FILES['spp_backup']['tmp_name'] ) || UPLOAD_ERR_OK !== (int) $_FILES['spp_backup']['error'] ) {
			wp_die( esc_html__( 'Select a valid JSON backup file.', 'superior-plus-content' ) );
		}
		$size = (int) $_FILES['spp_backup']['size'];
		if ( $size < 2 || $size > 5 * MB_IN_BYTES ) {
			wp_die( esc_html__( 'The backup file size is invalid.', 'superior-plus-content' ) );
		}
		$raw = file_get_contents( $_FILES['spp_backup']['tmp_name'] );
		$package = json_decode( $raw, true );
		if ( ! is_array( $package ) || 'spp-content-export' !== ( isset( $package['format'] ) ? $package['format'] : '' ) || ! isset( $package['records'] ) || ! is_array( $package['records'] ) ) {
			wp_die( esc_html__( 'The selected file is not a valid Superior Plus content backup.', 'superior-plus-content' ) );
		}
		$report = $this->restore_package( $package );
		update_option( 'spp_content_recovery_report', $report, false );
		wp_safe_redirect( admin_url( 'admin.php?page=spp-content-recovery&restored=1' ) );
		exit;
	}

	private function authorize( $nonce_action ) {
		if ( ! current_user_can( 'manage_spp_system' ) ) {
			wp_die( esc_html__( 'You do not have permission to manage backups.', 'superior-plus-content' ) );
		}
		check_admin_referer( $nonce_action );
	}

	private function restore_package( $package ) {
		$report = array(
			'started_at' => gmdate( 'c' ),
			'created'    => array(),
			'updated'    => array(),
			'errors'     => array(),
		);
		foreach ( $package['records'] as $record ) {
			$result = $this->restore_record( $record );
			if ( is_wp_error( $result ) ) {
				$report['errors'][] = $result->get_error_message();
			} else {
				$report[ $result['created'] ? 'created' : 'updated' ][] = $result['source_key'];
			}
		}
		$report['finished_at'] = gmdate( 'c' );
		$report['complete']    = empty( $report['errors'] );
		flush_rewrite_rules( false );
		return $report;
	}

	private function restore_record( $record ) {
		$allowed_types = array( 'spp_site_config', 'page', 'spp_service', 'spp_project', 'spp_testimonial', 'spp_faq' );
		$post_type = isset( $record['post_type'] ) ? sanitize_key( $record['post_type'] ) : '';
		$source_key = isset( $record['source_key'] ) ? sanitize_text_field( $record['source_key'] ) : '';
		if ( ! in_array( $post_type, $allowed_types, true ) || ! $source_key ) {
			return new WP_Error( 'spp_restore_record', __( 'A backup record has an invalid type or source key.', 'superior-plus-content' ) );
		}
		if ( ! empty( $record['checksum'] ) && ! hash_equals( $record['checksum'], $this->record_checksum( $record ) ) ) {
			return new WP_Error( 'spp_restore_checksum', sprintf( __( 'Checksum verification failed for %s.', 'superior-plus-content' ), $source_key ) );
		}

		$existing = get_posts(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'any',
				'posts_per_page' => 1,
				'meta_key'       => '_spp_source_key',
				'meta_value'     => $source_key,
			)
		);
		$post = $existing ? $existing[0] : get_page_by_path( sanitize_title( $record['slug'] ), OBJECT, $post_type );
		$created = ! $post;
		$post_data = array(
			'post_type'    => $post_type,
			'post_status'  => in_array( $record['status'], array( 'publish', 'private', 'draft', 'pending' ), true ) ? $record['status'] : 'draft',
			'post_name'    => sanitize_title( $record['slug'] ),
			'post_title'   => sanitize_text_field( $record['title'] ),
			'post_content' => wp_kses_post( $record['content'] ),
			'post_excerpt' => sanitize_textarea_field( $record['excerpt'] ),
			'menu_order'   => (int) $record['menu_order'],
		);
		if ( $post ) {
			$post_data['ID'] = $post->ID;
			$post_id = wp_update_post( wp_slash( $post_data ), true );
		} else {
			$post_id = wp_insert_post( wp_slash( $post_data ), true );
		}
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		update_post_meta( $post_id, '_spp_source_key', $source_key );
		$meta = isset( $record['meta'] ) && is_array( $record['meta'] ) ? $record['meta'] : array();
		if ( ! $meta && isset( $record['fields'] ) && is_array( $record['fields'] ) ) {
			foreach ( $record['fields'] as $key => $value ) {
				$meta[ 'spp_' . sanitize_key( $key ) ] = $value;
			}
		}
		if ( isset( $meta['spp_template_key'] ) ) {
			update_post_meta( $post_id, 'spp_template_key', sanitize_key( $meta['spp_template_key'] ) );
		}
		$allowed_meta = array_keys( $this->fields->definitions_for_post( get_post( $post_id ) ) );
		foreach ( $allowed_meta as $key ) {
			if ( array_key_exists( $key, $meta ) ) {
				update_post_meta( $post_id, $key, map_deep( $meta[ $key ], 'sanitize_text_field' ) );
			} else {
				delete_post_meta( $post_id, $key );
			}
		}
		foreach ( array( '_spp_client_modified_at', '_spp_managed_content', '_spp_source_hash', '_spp_design_variant' ) as $control_key ) {
			if ( isset( $record['control'][ $control_key ] ) && '' !== $record['control'][ $control_key ] ) {
				update_post_meta( $post_id, $control_key, sanitize_text_field( $record['control'][ $control_key ] ) );
			} else {
				delete_post_meta( $post_id, $control_key );
			}
		}
		$featured = absint( isset( $meta['spp_featured_media_id'] ) ? $meta['spp_featured_media_id'] : ( isset( $meta['spp_hero_image_id'] ) ? $meta['spp_hero_image_id'] : 0 ) );
		if ( $featured ) {
			set_post_thumbnail( $post_id, $featured );
		}
		return array( 'created' => $created, 'source_key' => $source_key );
	}

	private function record_checksum( $record ) {
		unset( $record['checksum'] );
		return hash( 'sha256', wp_json_encode( $record ) );
	}
}
