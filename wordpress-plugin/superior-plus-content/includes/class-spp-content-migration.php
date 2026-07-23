<?php
/**
 * Idempotent migration of the approved React dataset into editable WordPress records.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Migration {
	const VERSION = '1.0.0';

	private $types;
	private $report = array();

	public function __construct( $types ) {
		$this->types = $types;
		add_action( 'admin_menu', array( $this, 'register_page' ), 30 );
		add_action( 'admin_post_spp_migrate_approved_site', array( $this, 'handle' ) );
	}

	public function register_page() {
		add_submenu_page(
			'spp-content',
			__( 'Import approved website', 'superior-plus-content' ),
			__( 'Import approved site', 'superior-plus-content' ),
			'manage_spp_system',
			'spp-content-migration',
			array( $this, 'render_page' )
		);
	}

	public function render_page() {
		if ( ! current_user_can( 'manage_spp_system' ) ) {
			wp_die( esc_html__( 'You do not have permission to run the migration.', 'superior-plus-content' ) );
		}
		$report = get_option( 'spp_content_migration_report', array() );
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Import the approved React website', 'superior-plus-content' ); ?></h1>
			<p><?php esc_html_e( 'Run this on staging. It creates or completes the approved pages, services, FAQs, testimonials, projects and Media Library assignments. Stable source keys prevent duplicates. Records marked as client-edited are never overwritten.', 'superior-plus-content' ); ?></p>
			<?php if ( isset( $_GET['migrated'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
				<div class="notice notice-success"><p><?php esc_html_e( 'Migration completed. The report below records exactly what was created, updated, reused or protected.', 'superior-plus-content' ); ?></p></div>
			<?php endif; ?>
			<?php if ( $report ) : ?>
				<h2><?php esc_html_e( 'Latest migration report', 'superior-plus-content' ); ?></h2>
				<pre style="background:#fff;border:1px solid #ccd0d4;max-width:900px;padding:16px;white-space:pre-wrap"><?php echo esc_html( wp_json_encode( $report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) ); ?></pre>
			<?php endif; ?>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="spp_migrate_approved_site">
				<?php wp_nonce_field( 'spp_migrate_approved_site' ); ?>
				<?php submit_button( __( 'Import or safely refresh approved content', 'superior-plus-content' ), 'primary large' ); ?>
			</form>
		</div>
		<?php
	}

	public function handle() {
		if ( ! current_user_can( 'manage_spp_system' ) ) {
			wp_die( esc_html__( 'You do not have permission to run the migration.', 'superior-plus-content' ) );
		}
		check_admin_referer( 'spp_migrate_approved_site' );
		$this->run();
		wp_safe_redirect( admin_url( 'admin.php?page=spp-content-migration&migrated=1' ) );
		exit;
	}

	/**
	 * Run the complete migration.
	 *
	 * @return array
	 */
	public function run() {
		if ( 'superior-plus' !== get_stylesheet() || ! function_exists( 'spp_default_services' ) ) {
			wp_die( esc_html__( 'Activate the Superior Plus theme before running this migration.', 'superior-plus-content' ) );
		}
		$this->report = array(
			'version'       => self::VERSION,
			'baseline'      => 'baseline/site-baseline.json',
			'started_at'    => gmdate( 'c' ),
			'created'       => array(),
			'updated'       => array(),
			'reused'        => array(),
			'protected'     => array(),
			'errors'        => array(),
			'expected'      => array( 'pages' => 6, 'services' => 9, 'faqs' => 10, 'testimonials' => 4, 'projects' => 9 ),
		);

		$config_id = $this->types->ensure_site_config();
		$this->migrate_config( $config_id );
		$page_ids = $this->migrate_pages();
		$faq_ids = $this->migrate_faqs();
		$testimonial_ids = $this->migrate_testimonials();
		$project_ids = $this->migrate_projects();
		$service_ids = $this->migrate_services( $project_ids );
		$this->connect_relationships( $page_ids, $service_ids, $faq_ids, $testimonial_ids, $project_ids );
		$this->ensure_navigation( $page_ids, $service_ids );

		$this->report['actual'] = array(
			'pages'       => count( $page_ids ),
			'services'    => count( $service_ids ),
			'faqs'        => count( $faq_ids ),
			'testimonials'=> count( $testimonial_ids ),
			'projects'    => count( $project_ids ),
		);
		$this->report['complete'] = $this->report['expected'] === $this->report['actual'] && empty( $this->report['errors'] );
		$this->report['finished_at'] = gmdate( 'c' );
		update_option( 'spp_content_migration_version', self::VERSION, false );
		update_option( 'spp_content_migration_report', $this->report, false );
		flush_rewrite_rules( false );
		return $this->report;
	}

	private function migrate_config( $config_id ) {
		if ( ! $config_id ) {
			$this->report['errors'][] = 'site_config';
			return;
		}
		$logo_id = $this->import_asset( 'logo.jpeg', 'Superior Plus Painting & Remodeling logo' );
		$meta = array(
			'spp_business_name' => 'Superior Plus Painting & Remodeling',
			'spp_phone_display' => '0470 234 567',
			'spp_phone_normalized' => '0470234567',
			'spp_email' => 'sppainting.remodeling@gmail.com',
			'spp_location' => 'Melbourne, Victoria',
			'spp_logo_id' => $logo_id,
			'spp_logo_alt' => 'Superior Plus Painting & Remodeling',
			'spp_footer_intro' => 'Premium residential and commercial painting across Melbourne, with care in every coat.',
			'spp_footer_explore_heading' => 'Explore',
			'spp_footer_services_heading' => 'Services',
			'spp_footer_contact_heading' => 'Get in touch',
			'spp_footer_copyright' => '© ' . gmdate( 'Y' ) . ' Superior Plus Painting & Remodeling',
			'spp_footer_closing_line' => 'Made with care in Melbourne.',
			'spp_trust_items' => array( 'Fully insured', 'Free written quotes', 'Careful preparation', 'Clean, tidy sites' ),
			'spp_service_areas' => spp_suburbs(),
			'spp_default_cta_title' => 'Ready for a fresh start?',
			'spp_default_cta_text' => 'Tell us about your property and we’ll arrange a free, no-obligation quotation.',
			'spp_default_cta_label' => 'Request my free quote',
			'spp_default_cta_url' => '/contact',
			'spp_privacy_text' => 'No obligation. Your details stay private.',
		);
		$this->write_meta( $config_id, 'site-config', $meta, true );
	}

	private function migrate_pages() {
		$pages = $this->page_dataset();
		$ids = array();
		foreach ( $pages as $slug => $data ) {
			$post = get_page_by_path( $slug, OBJECT, 'page' );
			$is_new = ! $post;
			if ( $is_new ) {
				$id = wp_insert_post(
					array(
						'post_type' => 'page', 'post_status' => 'publish', 'post_name' => $slug,
						'post_title' => $data['title'], 'post_excerpt' => $data['excerpt'], 'post_content' => $data['excerpt'],
					),
					true
				);
				if ( is_wp_error( $id ) ) {
					$this->report['errors'][] = 'page:' . $slug;
					continue;
				}
				$post = get_post( $id );
				$this->report['created'][] = 'page:' . $slug;
			}
			$ids[ $slug ] = (int) $post->ID;
			$meta = $data['meta'];
			$meta['spp_template_key'] = $data['template'];
			if ( ! empty( $data['hero_asset'] ) ) {
				$meta['spp_hero_image_id'] = $this->import_asset( $data['hero_asset'], $data['title'] . ' hero' );
			}
			if ( ! empty( $data['editorial_asset'] ) ) {
				$meta['spp_about_editorial_image_id'] = $this->import_asset( $data['editorial_asset'], 'Superior Plus painting project' );
			}
			if ( ! empty( $data['archive_asset'] ) ) {
				$meta['spp_about_archive_image_id'] = $this->import_asset( $data['archive_asset'], 'Superior Plus company archive' );
			}
			$this->write_meta( $post->ID, 'page:' . $slug, $meta, $is_new );
		}
		if ( isset( $ids['home'] ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $ids['home'] );
		}
		return $ids;
	}

	private function migrate_faqs() {
		$ids = array();
		foreach ( spp_default_faqs() as $index => $item ) {
			$key = 'faq:' . ( $index + 1 );
			$post = $this->find_source( $key, 'spp_faq' );
			if ( ! $post ) {
				$post = get_page_by_title( $item[0], OBJECT, 'spp_faq' );
			}
			if ( ! $post ) {
				$id = wp_insert_post( array( 'post_type' => 'spp_faq', 'post_status' => 'publish', 'post_title' => $item[0], 'post_content' => $item[1], 'menu_order' => $index + 1 ), true );
				if ( is_wp_error( $id ) ) {
					$this->report['errors'][] = $key;
					continue;
				}
				$post = get_post( $id );
				$this->report['created'][] = $key;
			}
			$ids[] = (int) $post->ID;
			$this->claim_record( $post->ID, $key, array( 'question' => $item[0], 'answer' => $item[1] ) );
		}
		return $ids;
	}

	private function migrate_testimonials() {
		$items = array(
			array( 'Professional & reliable', 'Superior Plus Painting completed the work on time with excellent attention to detail. The finish was outstanding, and the team kept everything clean throughout the project.' ),
			array( 'Excellent quality', 'We were impressed with the preparation and workmanship. The painters were friendly, punctual and delivered exactly what they promised. Our home looks fantastic.' ),
			array( 'Great communication', 'From the first quote to the final inspection, the communication was excellent. The project was completed on schedule and the quality exceeded our expectations.' ),
			array( 'Value for money', 'We received honest advice, competitive pricing and a high-quality finish. We would definitely use Superior Plus Painting again.' ),
		);
		$ids = array();
		foreach ( $items as $index => $item ) {
			$key = 'testimonial:' . ( $index + 1 );
			$post = $this->find_source( $key, 'spp_testimonial' );
			if ( ! $post ) {
				$id = wp_insert_post( array( 'post_type' => 'spp_testimonial', 'post_status' => 'publish', 'post_title' => $item[0], 'post_content' => $item[1], 'menu_order' => $index + 1 ), true );
				if ( is_wp_error( $id ) ) {
					$this->report['errors'][] = $key;
					continue;
				}
				$post = get_post( $id );
				$this->report['created'][] = $key;
			}
			$ids[] = (int) $post->ID;
			$this->write_meta( $post->ID, $key, array(
				'spp_testimonial_name' => $item[0], 'spp_testimonial_label' => $item[0],
				'spp_testimonial_project' => $item[0], 'spp_testimonial_rating' => 5, 'spp_is_placeholder' => 1,
			), ! get_post_meta( $post->ID, '_spp_source_key', true ) );
		}
		return $ids;
	}

	private function migrate_projects() {
		$labels = array(
			'residential' => 'Residential Painting Showcase', 'commercial' => 'Commercial Painting Portfolio',
			'interior' => 'Interior Painting Portfolio', 'exterior' => 'Exterior Painting Portfolio',
			'fence' => 'Fence Painting Portfolio', 'outdoor' => 'Outdoor Timber Portfolio',
			'roof' => 'Roof Painting Showcase', 'wallpaper' => 'Wallpaper Removal Showcase',
			'plaster' => 'Plaster Repairs Showcase',
		);
		$ids = array();
		foreach ( $labels as $category => $title ) {
			$key = 'project:' . $category;
			$post = $this->find_source( $key, 'spp_project' );
			$is_new = ! $post;
			if ( $is_new ) {
				$id = wp_insert_post( array( 'post_type' => 'spp_project', 'post_status' => 'publish', 'post_name' => $category . '-painting-showcase', 'post_title' => $title ), true );
				if ( is_wp_error( $id ) ) {
					$this->report['errors'][] = $key;
					continue;
				}
				$post = get_post( $id );
				$this->report['created'][] = $key;
			}
			$gallery = $this->category_gallery( $category );
			$featured = ! empty( $gallery[0]['attachment_id'] ) ? $gallery[0]['attachment_id'] : 0;
			$this->write_meta( $post->ID, $key, array(
				'spp_template_key' => 'project', 'spp_project_type' => $title . ' · Melbourne',
				'spp_featured_media_id' => $featured, 'spp_object_position' => '50% 50%', 'spp_gallery_items' => $gallery,
			), $is_new );
			if ( $featured ) {
				set_post_thumbnail( $post->ID, $featured );
			}
			$ids[ $category ] = (int) $post->ID;
		}
		return $ids;
	}

	private function migrate_services( $project_ids ) {
		$category_map = array(
			'residential-painting-melbourne' => 'residential', 'commercial-painting-melbourne' => 'commercial',
			'interior-painting-melbourne' => 'interior', 'exterior-painting-melbourne' => 'exterior',
			'fence-painting-melbourne' => 'fence', 'deck-painting-staining-melbourne' => 'outdoor',
			'roof-painting-melbourne' => 'roof', 'wallpaper-removal-melbourne' => 'wallpaper',
			'plaster-repairs-melbourne' => 'plaster',
		);
		$ids = array();
		foreach ( spp_default_services() as $slug => $service ) {
			$post = get_page_by_path( $slug, OBJECT, 'spp_service' );
			$is_new = ! $post;
			if ( $is_new ) {
				$id = wp_insert_post( array(
					'post_type' => 'spp_service', 'post_status' => 'publish', 'post_name' => $slug,
					'post_title' => $service['title'], 'post_excerpt' => $service['intro'], 'post_content' => $service['intro'],
				), true );
				if ( is_wp_error( $id ) ) {
					$this->report['errors'][] = 'service:' . $slug;
					continue;
				}
				$post = get_post( $id );
				$this->report['created'][] = 'service:' . $slug;
			}
			$category = $category_map[ $slug ];
			$gallery = $this->category_gallery( $category );
			$hero = ! empty( $gallery[0]['attachment_id'] ) ? $gallery[0]['attachment_id'] : 0;
			$meta = array(
				'spp_template_key' => 'service', 'spp_directory_excerpt' => $this->service_short( $slug ),
				'spp_eyebrow' => $service['eyebrow'], 'spp_hero_title' => $service['title'], 'spp_accent' => $service['accent'],
				'spp_hero_intro' => $service['intro'], '_spp_design_variant' => $service['tone'], 'spp_hero_image_id' => $hero,
				'spp_scope_title' => $service['scope_title'], 'spp_scope' => $service['scope'], 'spp_process' => $service['process'],
				'spp_why' => $service['why'], 'spp_benefits' => $service['benefits'], 'spp_gallery_items' => $gallery,
				'spp_seo_title' => $service['title'] . ' Melbourne', 'spp_seo_description' => $service['intro'],
				'spp_closing_cta_title' => 'Ready to discuss your ' . strtolower( $service['title'] ) . ' project?',
				'spp_closing_cta_text' => 'Arrange a free inspection and written quote with Superior Plus Painting.',
				'spp_closing_cta_label' => 'Request my free quote', 'spp_closing_cta_url' => '/contact',
			);
			$this->write_meta( $post->ID, 'service:' . $slug, $meta, $is_new );
			if ( $hero ) {
				set_post_thumbnail( $post->ID, $hero );
			}
			$ids[ $slug ] = (int) $post->ID;
		}
		return $ids;
	}

	private function connect_relationships( $pages, $services, $faqs, $testimonials, $projects ) {
		if ( isset( $pages['home'] ) ) {
			$this->write_relationship( $pages['home'], 'spp_home_service_ids', array_values( $services ) );
			$this->write_relationship( $pages['home'], 'spp_home_project_ids', array_values( array_intersect_key( $projects, array_flip( array( 'interior', 'exterior', 'commercial' ) ) ) ) );
			$this->write_relationship( $pages['home'], 'spp_home_testimonial_ids', $testimonials );
		}
		if ( isset( $pages['faqs'] ) ) {
			$this->write_relationship( $pages['faqs'], 'spp_faq_ids', $faqs );
		}
		$service_values = array_values( $services );
		foreach ( $services as $id ) {
			$this->write_relationship( $id, 'spp_related_service_ids', array_values( array_filter( array_slice( $service_values, 0, 4 ), function ( $related ) use ( $id ) { return $related !== $id; } ) ) );
		}
	}

	private function write_relationship( $post_id, $key, $ids ) {
		if ( get_post_meta( $post_id, '_spp_client_modified_at', true ) || metadata_exists( 'post', $post_id, $key ) ) {
			return;
		}
		update_post_meta( $post_id, $key, array_map( 'absint', $ids ) );
	}

	private function ensure_navigation( $pages, $services ) {
		if ( function_exists( 'spp_install_theme_content' ) && ! wp_get_nav_menu_object( 'Superior Plus Primary' ) ) {
			spp_install_theme_content();
		}
		unset( $pages, $services );
	}

	private function write_meta( $post_id, $source, $meta, $is_new ) {
		if ( get_post_meta( $post_id, '_spp_client_modified_at', true ) ) {
			$this->report['protected'][] = $source;
			return;
		}
		$owned = get_post_meta( $post_id, '_spp_source_key', true ) === $source;
		foreach ( $meta as $key => $value ) {
			if ( $owned || $is_new || ! metadata_exists( 'post', $post_id, $key ) ) {
				update_post_meta( $post_id, $key, $value );
			}
		}
		$this->claim_record( $post_id, $source, $meta );
		$this->report[ $is_new ? 'created' : ( $owned ? 'updated' : 'reused' ) ][] = $source;
	}

	private function claim_record( $post_id, $source, $data ) {
		if ( get_post_meta( $post_id, '_spp_client_modified_at', true ) ) {
			return;
		}
		update_post_meta( $post_id, '_spp_managed_content', 1 );
		update_post_meta( $post_id, '_spp_source_key', $source );
		update_post_meta( $post_id, '_spp_migration_version', self::VERSION );
		update_post_meta( $post_id, '_spp_source_hash', hash( 'sha256', wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ) );
	}

	private function find_source( $source, $post_type ) {
		$posts = get_posts( array(
			'post_type' => $post_type, 'post_status' => array( 'publish', 'private', 'draft' ), 'posts_per_page' => 1,
			'meta_key' => '_spp_source_key', 'meta_value' => $source,
		) );
		return $posts ? $posts[0] : null;
	}

	private function import_asset( $relative, $alt ) {
		$relative = ltrim( str_replace( '\\', '/', $relative ), '/' );
		$existing = get_posts( array(
			'post_type' => 'attachment', 'post_status' => 'inherit', 'posts_per_page' => 1,
			'meta_key' => '_spp_source_asset', 'meta_value' => $relative, 'fields' => 'ids',
		) );
		if ( $existing ) {
			return (int) $existing[0];
		}
		$source = trailingslashit( get_stylesheet_directory() ) . 'react-dist/assets/' . $relative;
		if ( ! is_file( $source ) ) {
			$this->report['errors'][] = 'asset:' . $relative;
			return 0;
		}
		$uploads = wp_upload_dir();
		$target = trailingslashit( $uploads['basedir'] ) . 'superior-plus/' . $relative;
		wp_mkdir_p( dirname( $target ) );
		if ( ! file_exists( $target ) && ! copy( $source, $target ) ) {
			$this->report['errors'][] = 'copy:' . $relative;
			return 0;
		}
		$filetype = wp_check_filetype( basename( $target ), null );
		$id = wp_insert_attachment( array(
			'post_mime_type' => $filetype['type'], 'post_title' => sanitize_text_field( $alt ),
			'post_status' => 'inherit', 'post_content' => '',
		), $target );
		if ( is_wp_error( $id ) ) {
			$this->report['errors'][] = 'attachment:' . $relative;
			return 0;
		}
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$metadata = wp_generate_attachment_metadata( $id, $target );
		if ( $metadata ) {
			wp_update_attachment_metadata( $id, $metadata );
		}
		update_post_meta( $id, '_wp_attachment_image_alt', $alt );
		update_post_meta( $id, '_spp_source_asset', $relative );
		$this->report['created'][] = 'media:' . $relative;
		return (int) $id;
	}

	private function import_remote_video( $relative, $alt ) {
		$relative = ltrim( str_replace( '\\', '/', $relative ), '/' );
		$source_key = 'remote:' . $relative;
		$existing = get_posts( array(
			'post_type' => 'attachment', 'post_status' => 'inherit', 'posts_per_page' => 1,
			'meta_key' => '_spp_source_asset', 'meta_value' => $source_key, 'fields' => 'ids',
		) );
		if ( $existing ) {
			return (int) $existing[0];
		}
		$url = 'https://grantzz-zzz.github.io/paint-2/assets/' . $relative;
		$id = wp_insert_attachment( array(
			'post_mime_type' => 'video/mp4', 'post_title' => sanitize_text_field( $alt ),
			'post_status' => 'inherit', 'post_content' => '', 'guid' => esc_url_raw( $url ),
		) );
		if ( is_wp_error( $id ) ) {
			$this->report['errors'][] = 'remote-video:' . $relative;
			return 0;
		}
		update_post_meta( $id, '_spp_source_asset', $source_key );
		update_post_meta( $id, '_spp_remote_media_url', esc_url_raw( $url ) );
		$this->report['created'][] = 'media:' . $source_key;
		return (int) $id;
	}

	private function category_gallery( $category ) {
		$roots = in_array( $category, array( 'residential', 'roof', 'wallpaper', 'plaster' ), true )
			? array( 'generated/' . $category )
			: array( 'client/projects/' . $category );
		$items = array();
		foreach ( $roots as $relative_dir ) {
			$directory = trailingslashit( get_stylesheet_directory() ) . 'react-dist/assets/' . $relative_dir;
			foreach ( glob( $directory . '/*.webp' ) ?: array() as $file ) {
				if ( false !== strpos( basename( $file ), '-poster.' ) ) {
					continue;
				}
				$relative = $relative_dir . '/' . basename( $file );
				$id = $this->import_asset( $relative, ucfirst( $category ) . ' painting project by Superior Plus Painting' );
				if ( $id ) {
					$items[] = array( 'attachment_id' => $id, 'type' => 'image', 'alt' => ucfirst( $category ) . ' painting project by Superior Plus Painting', 'object_position' => '50% 50%' );
				}
			}
			foreach ( glob( $directory . '/*-video-*-poster.webp' ) ?: array() as $poster_file ) {
				$poster_relative = $relative_dir . '/' . basename( $poster_file );
				$video_relative = preg_replace( '/-poster\.webp$/', '.mp4', $poster_relative );
				$alt = ucfirst( $category ) . ' painting project video by Superior Plus Painting';
				$video_id = $this->import_remote_video( $video_relative, $alt );
				$poster_id = $this->import_asset( $poster_relative, $alt . ' poster' );
				if ( $video_id ) {
					$items[] = array(
						'attachment_id' => $video_id, 'poster_attachment_id' => $poster_id,
						'type' => 'video', 'alt' => $alt, 'object_position' => '50% 50%',
					);
				}
			}
		}
		return $items;
	}

	private function service_short( $slug ) {
		$short = array(
			'residential-painting-melbourne' => 'Complete home repaints, interior refreshes and exterior transformations.',
			'commercial-painting-melbourne' => 'Reliable, carefully scheduled painting for workplaces and managed properties.',
			'interior-painting-melbourne' => 'Clean, modern finishes for walls, ceilings, trims and living spaces.',
			'exterior-painting-melbourne' => 'Durable protection and renewed street appeal for Melbourne properties.',
			'roof-painting-melbourne' => 'Careful cleaning, preparation and protective roof coating systems.',
			'fence-painting-melbourne' => 'Brush, spray and stain finishes for new and weathered fences.',
			'deck-painting-staining-melbourne' => 'Restore, protect and showcase the natural character of outdoor timber.',
			'wallpaper-removal-melbourne' => 'Careful removal, adhesive cleaning and paint-ready wall preparation.',
			'plaster-repairs-melbourne' => 'Smooth, strong repairs for damaged walls and ceilings before painting.',
		);
		return $short[ $slug ];
	}

	private function page_dataset() {
		$process = array_map( function ( $item ) { return array( 'title' => $item[0], 'text' => $item[1] ); }, spp_default_process() );
		return array(
			'home' => array(
				'title' => 'Home', 'template' => 'home', 'excerpt' => 'Premium residential and commercial painting across Melbourne.',
				'hero_asset' => 'hero-painter.png',
				'meta' => array(
					'spp_eyebrow' => 'Melbourne painters who care', 'spp_hero_title' => 'Made to feel', 'spp_accent' => 'beautiful.',
					'spp_hero_intro' => 'Premium residential and commercial painting, delivered with careful preparation, honest advice and a finish we’re proud to put our name on.',
					'spp_home_trust_points' => array( 'Fully insured', 'Free colour advice', 'Melbourne-wide' ),
					'spp_home_services_eyebrow' => 'What we paint', 'spp_home_services_title' => 'Every surface deserves', 'spp_home_services_accent' => 'the right finish.',
					'spp_home_services_intro' => 'From one carefully refreshed room to a complete commercial transformation, our experienced team brings the same care to every job.',
					'spp_home_commercial_title' => 'We keep your business', 'spp_home_commercial_accent' => 'looking its best.',
					'spp_home_commercial_text' => 'Professional finishes, clear communication and scheduling built around your operation—from a single office to multi-site projects.',
					'spp_home_why_title' => 'Good painting starts', 'spp_home_why_accent' => 'before the first coat.',
					'spp_home_why_text' => 'We listen, prepare properly and communicate clearly. It’s how we deliver polished, durable work—without turning your home or workplace upside down.',
					'spp_home_trust_cards' => array(
						array( 'title' => 'Fully insured', 'text' => 'Your property and peace of mind are protected.' ),
						array( 'title' => 'Premium materials', 'text' => 'Proven Australian paint systems for lasting results.' ),
						array( 'title' => 'On time, every time', 'text' => 'Clear schedules, prompt arrivals and no loose ends.' ),
						array( 'title' => 'Respectfully clean', 'text' => 'Careful protection, tidy sites and a spotless handover.' ),
					),
					'spp_home_areas_title' => 'Your local painting team,', 'spp_home_areas_text' => 'Based in Melbourne and proudly servicing homes and businesses across the south-east and surrounding suburbs.',
					'spp_home_quote_title' => 'Ready for a', 'spp_home_quote_text' => 'Tell us what you’re planning. We’ll arrange a free, no-obligation quote and help you choose the right way forward.',
					'spp_home_response_label' => 'Usually replies within 2 hours',
					'spp_home_form_fields' => array(
						array( 'title' => 'Name', 'text' => 'Your name' ), array( 'title' => 'Phone', 'text' => '04xx xxx xxx' ),
						array( 'title' => 'Email', 'text' => 'you@email.com' ), array( 'title' => 'Suburb', 'text' => 'Your suburb' ),
						array( 'title' => 'Tell us about your project', 'text' => 'What would you like painted?' ),
					),
					'spp_seo_title' => 'Superior Plus Painting | Melbourne Painters',
					'spp_seo_description' => 'Premium residential and commercial painting across Melbourne, delivered with careful preparation, honest advice and quality workmanship.',
				),
			),
			'about' => array(
				'title' => 'About', 'template' => 'about', 'excerpt' => 'Melbourne painters committed to careful preparation and quality workmanship.',
				'hero_asset' => 'client/projects/fence/fence-03.webp', 'editorial_asset' => 'client/projects/fence/fence-03.webp', 'archive_asset' => 'client/projects/brand/brand-01.webp',
				'meta' => array(
					'spp_eyebrow' => 'Your trusted Melbourne painters', 'spp_hero_title' => 'Care in every coat.', 'spp_accent' => 'Pride in every detail.',
					'spp_hero_intro' => 'Superior Plus Painting is a Melbourne-based team dedicated to high-quality residential and commercial painting with reliable service, honest communication and respect for every property.',
					'spp_about_approach_title' => 'Quality begins',
					'spp_about_approach_copy' => "From small residential touch-ups to complete home repaints and large commercial projects, we approach every job with professionalism, honesty and pride. We inspect and prepare each surface, protect surrounding areas and use professional application techniques for a smooth, durable finish.\n\nWe understand that your property is one of your most valuable investments. That is why clear communication, reliable scheduling and a clean handover matter just as much as the paint itself.",
					'spp_about_roots_copy' => 'Superior Plus has grown through practical local promotion, direct client relationships and work that can be seen across Melbourne homes and businesses.',
					'spp_about_standards' => array( 'Experienced, professional painters', 'High-quality workmanship', 'Attention to every detail', 'Reliable communication', 'Clean and tidy sites', 'Competitive, transparent pricing', 'Fully insured', 'Free, no-obligation quotes' ),
					'spp_seo_title' => 'About Us', 'spp_seo_description' => 'Meet Superior Plus Painting, Melbourne painting professionals committed to careful preparation, reliable service and quality workmanship.',
				),
			),
			'services' => array(
				'title' => 'Services', 'template' => 'services_directory', 'excerpt' => 'Painting, preparation, repair and property improvement services.',
				'hero_asset' => 'client/projects/commercial/commercial-02.webp',
				'meta' => array(
					'spp_eyebrow' => 'Everything under one careful eye', 'spp_hero_title' => 'Painting & property services', 'spp_accent' => 'made beautifully simple.',
					'spp_hero_intro' => 'From complete residential and commercial painting to the preparation and repairs behind a lasting finish, our team can coordinate more of your project from one place.',
					'spp_services_intro' => 'Explore our dedicated service pages for detailed scope, process and preparation information.',
					'spp_additional_services' => array(
						array( 'title' => 'Wallpaper removal', 'text' => 'Adhesive removal and wall preparation for a smooth paint-ready finish.' ),
						array( 'title' => 'Carpentry services', 'text' => 'Suitable repairs or replacement for damaged trims, frames, weatherboards and timber details.' ),
						array( 'title' => 'Caulking & gap sealing', 'text' => 'Neat sealing around windows, doors, skirtings and suitable interior or exterior joints.' ),
						array( 'title' => 'Tiling services', 'text' => 'Tiling support for suitable residential and commercial improvement projects.' ),
						array( 'title' => 'Timber restoration', 'text' => 'Preparation and restoration for decks, fences, pergolas and weatherboards.' ),
						array( 'title' => 'Surface preparation', 'text' => 'Pressure washing, sanding, scraping, filling and priming.' ),
						array( 'title' => 'Property maintenance', 'text' => 'Ongoing support to keep residential and commercial properties in excellent condition.' ),
					),
					'spp_seo_title' => 'Painting & Property Services', 'spp_seo_description' => 'Explore Superior Plus Painting’s complete painting, preparation, repair and property improvement services across Melbourne.',
				),
			),
			'our-process' => array(
				'title' => 'Our Process', 'template' => 'process', 'excerpt' => 'A six-step process from consultation to clean handover.',
				'hero_asset' => 'client/projects/commercial/commercial-06.webp',
				'meta' => array(
					'spp_eyebrow' => 'A proven path to a better finish', 'spp_hero_title' => 'Our painting process', 'spp_accent' => 'planned down to the detail.',
					'spp_hero_intro' => 'Outstanding painting starts with careful planning, detailed preparation and clear communication. Our six-step process keeps every residential and commercial project organised from quote to handover.',
					'spp_master_process' => $process, 'spp_process_proof' => array( 'Clear communication', 'Thorough preparation', 'High-quality workmanship', 'Respect for your property', 'Reliable scheduling', 'Attention to detail' ),
					'spp_seo_title' => 'Our Painting Process', 'spp_seo_description' => 'Discover Superior Plus Painting’s six-step process for careful preparation, premium application and a clean final handover.',
				),
			),
			'faqs' => array(
				'title' => 'FAQs', 'template' => 'faqs', 'excerpt' => 'Answers about quotes, preparation, timing and booking.',
				'hero_asset' => 'client/projects/interior/interior-04.webp',
				'meta' => array(
					'spp_eyebrow' => 'Straight answers before we start', 'spp_hero_title' => 'Frequently asked questions', 'spp_accent' => 'made easy.',
					'spp_hero_intro' => 'Painting comes with practical questions. Here are clear answers about quoting, preparation, scheduling, products and what to expect from our team.',
					'spp_faq_intro' => 'Painting comes with practical questions. Here are clear answers about quoting, preparation, scheduling, products and what to expect from our team.',
					'spp_seo_title' => 'Frequently Asked Questions', 'spp_seo_description' => 'Answers about quotes, service areas, preparation, timing, paint systems and booking with Superior Plus Painting.',
				),
			),
			'contact' => array(
				'title' => 'Contact', 'template' => 'contact', 'excerpt' => 'Arrange a free painting consultation and written quote.',
				'hero_asset' => 'client/projects/exterior/exterior-07.webp',
				'meta' => array(
					'spp_eyebrow' => 'Tell us what you’re planning', 'spp_hero_title' => 'Get in touch', 'spp_accent' => 'and get a fresh start.',
					'spp_hero_intro' => 'Share a few details about your property and the work you have in mind. We’ll follow up to arrange a free, no-obligation consultation and written quote.',
					'spp_contact_steps' => array(
						array( 'title' => 'We review your enquiry.', 'text' => 'We’ll confirm the service, property and best way to reach you.' ),
						array( 'title' => 'We arrange an inspection.', 'text' => 'Our team assesses the surfaces and discusses colours, finishes and timing.' ),
						array( 'title' => 'You receive a written quote.', 'text' => 'Clear scope, preparation and pricing—with no obligation to proceed.' ),
					),
					'spp_service_options' => array( 'Residential Painting', 'Commercial Painting', 'Interior Painting', 'Exterior Painting', 'Roof Painting', 'Fence Painting', 'Deck Painting & Staining', 'Garage Floor Coatings', 'Driveway Painting & Coatings', 'Plaster Repairs', 'Wallpaper Removal', 'Other' ),
					'spp_property_options' => array( 'House', 'Unit', 'Apartment', 'Townhouse', 'Office', 'Retail', 'Warehouse', 'Other' ),
					'spp_contact_form_fields' => array(
						array( 'title' => 'Name', 'text' => 'Your name' ), array( 'title' => 'Phone number', 'text' => '04xx xxx xxx' ),
						array( 'title' => 'Email address', 'text' => 'you@email.com' ), array( 'title' => 'Suburb', 'text' => 'Your suburb' ),
						array( 'title' => 'Property address', 'text' => 'Street address' ), array( 'title' => 'Project details', 'text' => 'What would you like painted or repaired?' ),
					),
					'spp_contact_form_note' => 'No obligation. Form delivery and privacy consent must be connected before launch.',
					'spp_seo_title' => 'Get a Free Quote', 'spp_seo_description' => 'Contact Superior Plus Painting for a free residential, commercial or property-painting quote across Melbourne.',
				),
			),
		);
	}
}
