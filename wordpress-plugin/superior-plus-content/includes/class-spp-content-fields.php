<?php
/**
 * Locked content fields and Media Library controls.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_Fields {
	/**
	 * Content type service.
	 *
	 * @var SPP_Content_Types
	 */
	private $types;

	/**
	 * Create the manager.
	 *
	 * @param SPP_Content_Types $types Type registrar.
	 */
	public function __construct( $types ) {
		$this->types = $types;
		add_action( 'add_meta_boxes', array( $this, 'register_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_filter( 'manage_spp_service_posts_columns', array( $this, 'service_columns' ) );
		add_action( 'manage_spp_service_posts_custom_column', array( $this, 'service_column_value' ), 10, 2 );
	}

	/**
	 * Shared page fields.
	 *
	 * @return array
	 */
	private function shared_page_fields() {
		return array(
			'spp_template_key'          => array( 'label' => 'Locked page template', 'type' => 'template' ),
			'spp_eyebrow'              => array( 'label' => 'Hero eyebrow', 'type' => 'text', 'max' => 120 ),
			'spp_hero_title'            => array( 'label' => 'Hero title', 'type' => 'text', 'max' => 160 ),
			'spp_accent'                => array( 'label' => 'Hero accent line', 'type' => 'text', 'max' => 160 ),
			'spp_hero_intro'            => array( 'label' => 'Hero introduction', 'type' => 'textarea', 'max' => 1200 ),
			'spp_hero_image_id'         => array( 'label' => 'Hero image', 'type' => 'media', 'mime' => 'image' ),
			'spp_hero_image_alt'        => array( 'label' => 'Hero image alt text', 'type' => 'text', 'max' => 250 ),
			'spp_closing_cta_title'     => array( 'label' => 'Closing CTA title', 'type' => 'text', 'max' => 180 ),
			'spp_closing_cta_text'      => array( 'label' => 'Closing CTA text', 'type' => 'textarea', 'max' => 600 ),
			'spp_closing_cta_label'     => array( 'label' => 'Closing CTA button label', 'type' => 'text', 'max' => 100 ),
			'spp_closing_cta_url'       => array( 'label' => 'Closing CTA destination', 'type' => 'url_or_path', 'max' => 500 ),
			'spp_seo_title'             => array( 'label' => 'SEO title', 'type' => 'text', 'max' => 180 ),
			'spp_seo_description'       => array( 'label' => 'SEO description', 'type' => 'textarea', 'max' => 320 ),
			'spp_canonical_url'         => array( 'label' => 'Canonical URL', 'type' => 'url', 'max' => 500 ),
			'spp_social_image_id'       => array( 'label' => 'Social sharing image', 'type' => 'media', 'mime' => 'image' ),
		);
	}

	/**
	 * Definitions for a supported post.
	 *
	 * @param WP_Post $post Post being edited.
	 * @return array
	 */
	public function definitions_for_post( $post ) {
		if ( ! $post instanceof WP_Post ) {
			return array();
		}

		if ( 'spp_site_config' === $post->post_type ) {
			return array(
				'spp_business_name'       => array( 'label' => 'Business name', 'type' => 'text', 'max' => 180 ),
				'spp_phone_display'       => array( 'label' => 'Phone number as displayed', 'type' => 'text', 'max' => 40 ),
				'spp_phone_normalized'    => array( 'label' => 'Phone number for links', 'type' => 'phone', 'max' => 30 ),
				'spp_email'               => array( 'label' => 'Email address', 'type' => 'email', 'max' => 254 ),
				'spp_location'            => array( 'label' => 'Location', 'type' => 'text', 'max' => 180 ),
				'spp_instagram_url'       => array( 'label' => 'Instagram URL', 'type' => 'url', 'max' => 500 ),
				'spp_logo_id'             => array( 'label' => 'Site logo', 'type' => 'media', 'mime' => 'image' ),
				'spp_logo_alt'            => array( 'label' => 'Logo accessible name', 'type' => 'text', 'max' => 180 ),
				'spp_footer_intro'        => array( 'label' => 'Footer introduction', 'type' => 'textarea', 'max' => 500 ),
				'spp_footer_explore_heading' => array( 'label' => 'Footer Explore heading', 'type' => 'text', 'max' => 80 ),
				'spp_footer_services_heading' => array( 'label' => 'Footer Services heading', 'type' => 'text', 'max' => 80 ),
				'spp_footer_contact_heading' => array( 'label' => 'Footer contact heading', 'type' => 'text', 'max' => 80 ),
				'spp_footer_copyright'    => array( 'label' => 'Footer copyright', 'type' => 'text', 'max' => 200 ),
				'spp_footer_closing_line' => array( 'label' => 'Footer closing line', 'type' => 'text', 'max' => 200 ),
				'spp_trust_items'         => array( 'label' => 'Trust strip — exactly four lines', 'type' => 'list', 'max_items' => 4 ),
				'spp_service_areas'       => array( 'label' => 'Service areas — one suburb per line', 'type' => 'list', 'max_items' => 100 ),
				'spp_default_cta_title'   => array( 'label' => 'Default CTA title', 'type' => 'text', 'max' => 180 ),
				'spp_default_cta_text'    => array( 'label' => 'Default CTA text', 'type' => 'textarea', 'max' => 600 ),
				'spp_default_cta_label'   => array( 'label' => 'Default CTA button label', 'type' => 'text', 'max' => 100 ),
				'spp_default_cta_url'     => array( 'label' => 'Default CTA destination', 'type' => 'url_or_path', 'max' => 500 ),
				'spp_quote_recipient'     => array( 'label' => 'Quote recipient email (administrator only)', 'type' => 'system_email', 'max' => 254 ),
				'spp_privacy_text'        => array( 'label' => 'Form privacy/consent text', 'type' => 'textarea', 'max' => 1000 ),
			);
		}

		if ( 'spp_service' === $post->post_type ) {
			return array_merge(
				$this->shared_page_fields(),
				array(
					'spp_directory_excerpt'  => array( 'label' => 'Services-directory summary', 'type' => 'textarea', 'max' => 400 ),
					'spp_scope_title'        => array( 'label' => 'Scope heading', 'type' => 'text', 'max' => 180 ),
					'spp_scope'              => array( 'label' => 'Scope items — one per line', 'type' => 'list', 'max_items' => 30 ),
					'spp_why'                => array( 'label' => 'Process introduction', 'type' => 'textarea', 'max' => 1600 ),
					'spp_process'            => array( 'label' => 'Process steps — one per line', 'type' => 'list', 'max_items' => 20 ),
					'spp_benefits'           => array( 'label' => 'Benefits — one per line', 'type' => 'list', 'max_items' => 12 ),
					'spp_related_service_ids' => array( 'label' => 'Related services', 'type' => 'services' ),
					'spp_gallery_items'      => array( 'label' => 'Service gallery', 'type' => 'gallery', 'max_items' => 100 ),
				)
			);
		}

		if ( 'spp_project' === $post->post_type ) {
			return array(
				'spp_project_type'     => array( 'label' => 'Project type', 'type' => 'text', 'max' => 180 ),
				'spp_featured_media_id' => array( 'label' => 'Featured project image', 'type' => 'media', 'mime' => 'image' ),
				'spp_object_position'  => array( 'label' => 'Image crop position (example: 50% 50%)', 'type' => 'position' ),
				'spp_gallery_items'    => array( 'label' => 'Project gallery', 'type' => 'gallery', 'max_items' => 100 ),
			);
		}

		if ( 'spp_testimonial' === $post->post_type ) {
			return array(
				'spp_testimonial_name'    => array( 'label' => 'Client name', 'type' => 'text', 'max' => 180 ),
				'spp_testimonial_label'   => array( 'label' => 'Review label', 'type' => 'text', 'max' => 180 ),
				'spp_testimonial_project' => array( 'label' => 'Project label', 'type' => 'text', 'max' => 180 ),
				'spp_testimonial_rating'  => array( 'label' => 'Star rating', 'type' => 'rating' ),
				'spp_is_placeholder'      => array( 'label' => 'Placeholder review (not yet verified)', 'type' => 'checkbox' ),
			);
		}

		if ( 'spp_faq' === $post->post_type ) {
			return array();
		}

		if ( 'page' !== $post->post_type ) {
			return array();
		}

		$fields       = $this->shared_page_fields();
		$template_key = get_post_meta( $post->ID, 'spp_template_key', true );
		if ( ! $template_key ) {
			$template_key = $this->default_template_for_slug( $post->post_name );
		}

		switch ( $template_key ) {
			case 'home':
				$fields += array(
					'spp_home_trust_points'       => array( 'label' => 'Hero trust points — one per line', 'type' => 'list', 'max_items' => 8 ),
					'spp_home_services_eyebrow'   => array( 'label' => 'Services eyebrow', 'type' => 'text', 'max' => 120 ),
					'spp_home_services_title'     => array( 'label' => 'Services title', 'type' => 'text', 'max' => 180 ),
					'spp_home_services_accent'    => array( 'label' => 'Services accent', 'type' => 'text', 'max' => 180 ),
					'spp_home_services_intro'     => array( 'label' => 'Services introduction', 'type' => 'textarea', 'max' => 700 ),
					'spp_home_service_ids'        => array( 'label' => 'Homepage service cards', 'type' => 'relationships', 'post_type' => 'spp_service' ),
					'spp_home_commercial_title'   => array( 'label' => 'Commercial feature title', 'type' => 'text', 'max' => 180 ),
					'spp_home_commercial_accent'  => array( 'label' => 'Commercial feature accent', 'type' => 'text', 'max' => 180 ),
					'spp_home_commercial_text'    => array( 'label' => 'Commercial feature text', 'type' => 'textarea', 'max' => 900 ),
					'spp_home_commercial_image_id' => array( 'label' => 'Commercial feature image', 'type' => 'media', 'mime' => 'image' ),
					'spp_home_project_ids'        => array( 'label' => 'Selected homepage projects', 'type' => 'relationships', 'post_type' => 'spp_project' ),
					'spp_home_why_title'          => array( 'label' => 'Why-us title', 'type' => 'text', 'max' => 180 ),
					'spp_home_why_accent'         => array( 'label' => 'Why-us accent', 'type' => 'text', 'max' => 180 ),
					'spp_home_why_text'           => array( 'label' => 'Why-us introduction', 'type' => 'textarea', 'max' => 900 ),
					'spp_home_trust_cards'        => array( 'label' => 'Trust cards — Heading | Description', 'type' => 'pairs', 'max_items' => 12 ),
					'spp_home_areas_title'        => array( 'label' => 'Service-areas title', 'type' => 'text', 'max' => 180 ),
					'spp_home_areas_text'         => array( 'label' => 'Service-areas introduction', 'type' => 'textarea', 'max' => 700 ),
					'spp_home_testimonial_ids'    => array( 'label' => 'Selected homepage testimonials', 'type' => 'relationships', 'post_type' => 'spp_testimonial' ),
					'spp_home_quote_title'        => array( 'label' => 'Quote section title', 'type' => 'text', 'max' => 180 ),
					'spp_home_quote_text'         => array( 'label' => 'Quote section text', 'type' => 'textarea', 'max' => 700 ),
					'spp_home_response_label'     => array( 'label' => 'Response-time label', 'type' => 'text', 'max' => 120 ),
					'spp_home_form_fields'        => array( 'label' => 'Quote form fields — Label | Placeholder', 'type' => 'pairs', 'max_items' => 20 ),
				);
				break;
			case 'about':
				$fields += array(
					'spp_about_approach_title' => array( 'label' => 'Approach heading', 'type' => 'text', 'max' => 180 ),
					'spp_about_approach_copy'  => array( 'label' => 'Approach paragraphs', 'type' => 'textarea', 'max' => 3000 ),
					'spp_about_editorial_image_id' => array( 'label' => 'Editorial project image', 'type' => 'media', 'mime' => 'image' ),
					'spp_about_archive_image_id' => array( 'label' => 'Company archive image', 'type' => 'media', 'mime' => 'image' ),
					'spp_about_roots_copy'     => array( 'label' => 'Local-roots copy', 'type' => 'textarea', 'max' => 1600 ),
					'spp_about_standards'      => array( 'label' => 'Standards — one per line', 'type' => 'list', 'max_items' => 20 ),
				);
				break;
			case 'services_directory':
				$fields += array(
					'spp_services_intro'      => array( 'label' => 'Core services introduction', 'type' => 'textarea', 'max' => 900 ),
					'spp_additional_services' => array( 'label' => 'Additional services — Heading | Description', 'type' => 'pairs', 'max_items' => 30 ),
				);
				break;
			case 'process':
				$fields += array(
					'spp_master_process' => array( 'label' => 'Process steps — Heading | Description', 'type' => 'pairs', 'max_items' => 20 ),
					'spp_process_proof'  => array( 'label' => 'Why-it-works points — one per line', 'type' => 'list', 'max_items' => 20 ),
				);
				break;
			case 'faqs':
				$fields += array(
					'spp_faq_intro' => array( 'label' => 'FAQ introduction', 'type' => 'textarea', 'max' => 900 ),
					'spp_faq_ids'   => array( 'label' => 'Displayed FAQs', 'type' => 'relationships', 'post_type' => 'spp_faq' ),
				);
				break;
			case 'contact':
				$fields += array(
					'spp_contact_steps'     => array( 'label' => 'What-happens-next steps — Heading | Description', 'type' => 'pairs', 'max_items' => 10 ),
					'spp_service_options'   => array( 'label' => 'Form service options — one per line', 'type' => 'list', 'max_items' => 50 ),
					'spp_property_options'  => array( 'label' => 'Form property options — one per line', 'type' => 'list', 'max_items' => 30 ),
					'spp_contact_form_fields' => array( 'label' => 'Form fields — Label | Placeholder', 'type' => 'pairs', 'max_items' => 30 ),
					'spp_contact_form_note' => array( 'label' => 'Form note', 'type' => 'textarea', 'max' => 700 ),
				);
				break;
			case 'landing':
			case 'standard':
				$fields += array(
					'spp_content_sections'   => array( 'label' => 'Content sections — Heading | Body', 'type' => 'pairs', 'max_items' => 20 ),
					'spp_secondary_image_id' => array( 'label' => 'Secondary image', 'type' => 'media', 'mime' => 'image' ),
				);
				break;
		}

		return $fields;
	}

	/**
	 * Resolve a protected template for existing core slugs.
	 *
	 * @param string $slug Page slug.
	 * @return string
	 */
	public function default_template_for_slug( $slug ) {
		$map = array(
			'home'        => 'home',
			'about'       => 'about',
			'services'    => 'services_directory',
			'our-process' => 'process',
			'faqs'        => 'faqs',
			'contact'     => 'contact',
		);
		return isset( $map[ $slug ] ) ? $map[ $slug ] : 'standard';
	}

	/**
	 * Add meta boxes.
	 */
	public function register_meta_boxes() {
		foreach ( array( 'page', 'spp_service', 'spp_project', 'spp_testimonial', 'spp_site_config' ) as $post_type ) {
			add_meta_box(
				'spp-locked-content',
				__( 'Superior Plus editable content', 'superior-plus-content' ),
				array( $this, 'render_meta_box' ),
				$post_type,
				'normal',
				'high'
			);
		}
		add_meta_box(
			'spp-faq-guidance',
			__( 'Superior Plus FAQ', 'superior-plus-content' ),
			array( $this, 'render_faq_guidance' ),
			'spp_faq',
			'side',
			'high'
		);
	}

	/**
	 * Explain native FAQ fields.
	 *
	 * @param WP_Post $post Current post.
	 */
	public function render_faq_guidance( $post ) {
		unset( $post );
		echo '<p>' . esc_html__( 'Use the title for the question and the editor for the answer. Menu Order controls its position.', 'superior-plus-content' ) . '</p>';
	}

	/**
	 * Render supported field controls.
	 *
	 * @param WP_Post $post Current post.
	 */
	public function render_meta_box( $post ) {
		$definitions = $this->definitions_for_post( $post );
		wp_nonce_field( 'spp_content_save_' . $post->ID, 'spp_content_nonce' );
		echo '<p class="description">' . esc_html__( 'These controls change content only. The React theme keeps the approved layout and styling locked.', 'superior-plus-content' ) . '</p>';
		echo '<div class="spp-content-fields">';
		foreach ( $definitions as $key => $definition ) {
			$this->render_field( $post, $key, $definition );
		}
		echo '</div>';
	}

	/**
	 * Render one field.
	 *
	 * @param WP_Post $post Current post.
	 * @param string  $key Meta key.
	 * @param array   $definition Field definition.
	 */
	private function render_field( $post, $key, $definition ) {
		$value = get_post_meta( $post->ID, $key, true );
		$type  = $definition['type'];
		$label = $definition['label'];
		echo '<div class="spp-field spp-field-' . esc_attr( $type ) . '">';

		if ( 'checkbox' === $type ) {
			echo '<label><input type="checkbox" name="' . esc_attr( $key ) . '" value="1" ' . checked( (bool) $value, true, false ) . '> <strong>' . esc_html( $label ) . '</strong></label>';
			echo '</div>';
			return;
		}

		echo '<label for="' . esc_attr( $key ) . '"><strong>' . esc_html( $label ) . '</strong></label>';

		if ( 'textarea' === $type ) {
			echo '<textarea class="widefat" rows="5" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $value ) . '</textarea>';
		} elseif ( 'list' === $type || 'pairs' === $type ) {
			echo '<textarea class="widefat" rows="7" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $this->structured_to_lines( $value, $type ) ) . '</textarea>';
			echo '<p class="description">' . ( 'pairs' === $type ? esc_html__( 'Use one item per line and separate the heading from its description with |.', 'superior-plus-content' ) : esc_html__( 'Use one item per line. Drag-and-drop controls will preserve this order on the frontend.', 'superior-plus-content' ) ) . '</p>';
		} elseif ( 'media' === $type ) {
			$this->render_media_field( $key, $value, $definition );
		} elseif ( 'gallery' === $type ) {
			$this->render_gallery_field( $key, $value );
		} elseif ( 'services' === $type || 'relationships' === $type ) {
			$relationship_type = 'services' === $type ? 'spp_service' : $definition['post_type'];
			$this->render_relationships( $post, $key, $value, $relationship_type );
		} elseif ( 'template' === $type ) {
			$this->render_template_field( $post, $key, $value );
		} elseif ( 'rating' === $type ) {
			echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">';
			for ( $rating = 1; $rating <= 5; $rating++ ) {
				echo '<option value="' . esc_attr( $rating ) . '" ' . selected( (int) ( $value ? $value : 5 ), $rating, false ) . '>' . esc_html( $rating ) . '</option>';
			}
			echo '</select>';
		} else {
			$input_type = in_array( $type, array( 'email', 'url' ), true ) ? $type : 'text';
			$disabled   = ( 'system_email' === $type && ! current_user_can( 'manage_spp_system' ) ) ? ' disabled' : '';
			echo '<input class="widefat" type="' . esc_attr( $input_type ) . '" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $value ) . '"' . $disabled . '>';
		}
		echo '</div>';
	}

	/**
	 * Render a Media Library field.
	 *
	 * @param string $key Meta key.
	 * @param mixed  $value Current ID.
	 * @param array  $definition Field definition.
	 */
	private function render_media_field( $key, $value, $definition ) {
		$id      = absint( $value );
		$preview = $id ? wp_get_attachment_image( $id, 'medium' ) : '';
		echo '<div class="spp-media-control" data-mime="' . esc_attr( $definition['mime'] ) . '">';
		echo '<input type="hidden" class="spp-media-id" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $id ) . '">';
		echo '<div class="spp-media-preview">' . wp_kses_post( $preview ) . '</div>';
		echo '<button type="button" class="button spp-select-media">' . esc_html__( 'Choose or replace', 'superior-plus-content' ) . '</button> ';
		echo '<button type="button" class="button-link-delete spp-remove-media">' . esc_html__( 'Remove', 'superior-plus-content' ) . '</button>';
		echo '</div>';
	}

	/**
	 * Render gallery editor.
	 *
	 * @param string $key Meta key.
	 * @param mixed  $value Stored items.
	 */
	private function render_gallery_field( $key, $value ) {
		$items = is_array( $value ) ? $value : array();
		foreach ( $items as &$item ) {
			if ( ! is_array( $item ) || empty( $item['attachment_id'] ) ) {
				continue;
			}
			$attachment_id      = absint( $item['attachment_id'] );
			$item['preview_url'] = wp_get_attachment_image_url( $attachment_id, 'thumbnail' ) ?: wp_get_attachment_url( $attachment_id );
			$item['filename']    = basename( (string) get_attached_file( $attachment_id ) );
		}
		unset( $item );
		echo '<div class="spp-gallery-control">';
		echo '<input type="hidden" class="spp-gallery-json" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( wp_json_encode( $items ) ) . '">';
		echo '<div class="spp-gallery-items"></div>';
		echo '<button type="button" class="button button-secondary spp-add-gallery-media">' . esc_html__( 'Add images or videos', 'superior-plus-content' ) . '</button>';
		echo '<p class="description">' . esc_html__( 'Add, remove, replace and reorder items. Uploaded videos may use an image poster in a later migration step.', 'superior-plus-content' ) . '</p>';
		echo '</div>';
	}

	/**
	 * Render related-service checkboxes.
	 *
	 * @param WP_Post $post Current post.
	 * @param string  $key Meta key.
	 * @param mixed   $value Stored IDs.
	 */
	private function render_relationships( $post, $key, $value, $post_type ) {
		$selected = array_map( 'absint', is_array( $value ) ? $value : array() );
		$records  = get_posts(
			array(
				'post_type'      => $post_type,
				'post_status'    => array( 'publish', 'draft', 'private' ),
				'posts_per_page' => -1,
				'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
				'post__not_in'   => array( $post->ID ),
			)
		);
		echo '<div class="spp-check-list">';
		foreach ( $records as $record ) {
			echo '<label><input type="checkbox" name="' . esc_attr( $key ) . '[]" value="' . esc_attr( $record->ID ) . '" ' . checked( in_array( (int) $record->ID, $selected, true ), true, false ) . '> ' . esc_html( get_the_title( $record ) ) . '</label>';
		}
		echo '</div>';
	}

	/**
	 * Render protected template selection.
	 *
	 * @param WP_Post $post Current post.
	 * @param string  $key Meta key.
	 * @param mixed   $value Current value.
	 */
	private function render_template_field( $post, $key, $value ) {
		if ( 'spp_service' === $post->post_type ) {
			echo '<input type="hidden" name="' . esc_attr( $key ) . '" value="service"><code>service</code>';
			return;
		}
		$current = $value ? $value : $this->default_template_for_slug( $post->post_name );
		$options = array(
			'home'               => 'Homepage',
			'about'              => 'About',
			'services_directory' => 'Services directory',
			'process'            => 'Process',
			'faqs'               => 'FAQs',
			'contact'            => 'Contact',
			'standard'           => 'Standard content page',
			'landing'            => 'Landing page',
		);
		if ( ! current_user_can( 'manage_spp_system' ) ) {
			echo '<input type="hidden" name="' . esc_attr( $key ) . '" value="' . esc_attr( $current ) . '"><code>' . esc_html( $options[ $current ] ) . '</code>';
			return;
		}
		echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">';
		foreach ( $options as $option => $option_label ) {
			echo '<option value="' . esc_attr( $option ) . '" ' . selected( $current, $option, false ) . '>' . esc_html( $option_label ) . '</option>';
		}
		echo '</select><p class="description">' . esc_html__( 'Changing the template changes which locked React component renders the page.', 'superior-plus-content' ) . '</p>';
	}

	/**
	 * Convert stored structured items to editor lines.
	 *
	 * @param mixed  $value Stored value.
	 * @param string $type Field type.
	 * @return string
	 */
	private function structured_to_lines( $value, $type ) {
		if ( ! is_array( $value ) ) {
			return is_string( $value ) ? $value : '';
		}
		$lines = array();
		foreach ( $value as $item ) {
			if ( ! is_array( $item ) ) {
				$lines[] = (string) $item;
			} elseif ( 'pairs' === $type ) {
				$lines[] = ( isset( $item['title'] ) ? $item['title'] : '' ) . ' | ' . ( isset( $item['text'] ) ? $item['text'] : '' );
			} else {
				$lines[] = isset( $item['text'] ) ? $item['text'] : '';
			}
		}
		return implode( "\n", $lines );
	}

	/**
	 * Save content fields.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post Post object.
	 */
	public function save( $post_id, $post ) {
		if ( ! isset( $_POST['spp_content_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['spp_content_nonce'] ) ), 'spp_content_save_' . $post_id ) ) {
			return;
		}
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$definitions = $this->definitions_for_post( $post );
		foreach ( $definitions as $key => $definition ) {
			if ( 'system_email' === $definition['type'] && ! current_user_can( 'manage_spp_system' ) ) {
				continue;
			}
			if ( 'checkbox' === $definition['type'] ) {
				update_post_meta( $post_id, $key, isset( $_POST[ $key ] ) ? 1 : 0 );
				continue;
			}
			if ( 'services' === $definition['type'] || 'relationships' === $definition['type'] ) {
				$raw = isset( $_POST[ $key ] ) ? (array) wp_unslash( $_POST[ $key ] ) : array();
				$relationship_type = 'services' === $definition['type'] ? 'spp_service' : $definition['post_type'];
				update_post_meta( $post_id, $key, $this->sanitize_relationships( $raw, $relationship_type, $post_id ) );
				continue;
			}
			if ( ! isset( $_POST[ $key ] ) ) {
				continue;
			}
			$raw = wp_unslash( $_POST[ $key ] );
			$value = $this->sanitize_value( $raw, $definition, get_post_meta( $post_id, $key, true ) );
			update_post_meta( $post_id, $key, $value );
		}
		update_post_meta( $post_id, '_spp_client_modified_at', gmdate( 'c' ) );
	}

	/**
	 * Sanitize one field value.
	 *
	 * @param mixed $raw Submitted value.
	 * @param array $definition Field definition.
	 * @param mixed $existing Existing value.
	 * @return mixed
	 */
	private function sanitize_value( $raw, $definition, $existing ) {
		$type = $definition['type'];
		$max  = isset( $definition['max'] ) ? (int) $definition['max'] : 0;

		if ( 'list' === $type || 'pairs' === $type ) {
			return $this->sanitize_lines( $raw, $type, isset( $definition['max_items'] ) ? (int) $definition['max_items'] : 100, $existing );
		}
		if ( 'gallery' === $type ) {
			return $this->sanitize_gallery( $raw, isset( $definition['max_items'] ) ? (int) $definition['max_items'] : 100 );
		}
		if ( 'media' === $type ) {
			return $this->sanitize_attachment( $raw, $definition['mime'] );
		}
		if ( 'email' === $type || 'system_email' === $type ) {
			return sanitize_email( $raw );
		}
		if ( 'url' === $type ) {
			return esc_url_raw( $raw, array( 'http', 'https' ) );
		}
		if ( 'url_or_path' === $type ) {
			$raw = trim( sanitize_text_field( $raw ) );
			return 0 === strpos( $raw, '/' ) ? $raw : esc_url_raw( $raw, array( 'http', 'https', 'mailto', 'tel' ) );
		}
		if ( 'phone' === $type ) {
			return substr( preg_replace( '/[^0-9+]/', '', (string) $raw ), 0, 30 );
		}
		if ( 'textarea' === $type ) {
			$value = sanitize_textarea_field( $raw );
			return $max ? mb_substr( $value, 0, $max ) : $value;
		}
		if ( 'position' === $type ) {
			$value = sanitize_text_field( $raw );
			return preg_match( '/^(100|[0-9]{1,2})% (100|[0-9]{1,2})%$/', $value ) ? $value : '50% 50%';
		}
		if ( 'rating' === $type ) {
			return max( 1, min( 5, absint( $raw ) ) );
		}
		if ( 'template' === $type ) {
			$allowed = array( 'home', 'about', 'services_directory', 'process', 'faqs', 'contact', 'standard', 'landing', 'service', 'project' );
			$value   = sanitize_key( $raw );
			return in_array( $value, $allowed, true ) ? $value : 'standard';
		}
		$value = sanitize_text_field( $raw );
		return $max ? mb_substr( $value, 0, $max ) : $value;
	}

	/**
	 * Sanitize ordered line/pair fields with stable IDs.
	 *
	 * @param mixed  $raw Submitted text.
	 * @param string $type list or pairs.
	 * @param int    $limit Maximum items.
	 * @param mixed  $existing Existing items.
	 * @return array
	 */
	private function sanitize_lines( $raw, $type, $limit, $existing ) {
		$lines    = preg_split( '/\r\n|\r|\n/', sanitize_textarea_field( $raw ) );
		$lines    = array_slice( array_values( array_filter( array_map( 'trim', $lines ) ) ), 0, $limit );
		$existing = is_array( $existing ) ? array_values( $existing ) : array();
		$result   = array();
		foreach ( $lines as $index => $line ) {
			$id = isset( $existing[ $index ]['id'] ) ? sanitize_key( $existing[ $index ]['id'] ) : wp_generate_uuid4();
			if ( 'pairs' === $type ) {
				$parts    = array_map( 'trim', explode( '|', $line, 2 ) );
				$result[] = array(
					'id'    => $id,
					'title' => sanitize_text_field( $parts[0] ),
					'text'  => isset( $parts[1] ) ? sanitize_textarea_field( $parts[1] ) : '',
					'order' => $index,
				);
			} else {
				$result[] = array(
					'id'    => $id,
					'text'  => sanitize_text_field( $line ),
					'order' => $index,
				);
			}
		}
		return $result;
	}

	/**
	 * Sanitize a Media Library attachment.
	 *
	 * @param mixed  $raw Submitted ID.
	 * @param string $mime_family Expected MIME family.
	 * @return int
	 */
	private function sanitize_attachment( $raw, $mime_family ) {
		$id = absint( $raw );
		if ( ! $id || 'attachment' !== get_post_type( $id ) ) {
			return 0;
		}
		$mime = (string) get_post_mime_type( $id );
		return 0 === strpos( $mime, $mime_family . '/' ) ? $id : 0;
	}

	/**
	 * Sanitize gallery JSON.
	 *
	 * @param mixed $raw Submitted JSON.
	 * @param int   $limit Maximum items.
	 * @return array
	 */
	private function sanitize_gallery( $raw, $limit ) {
		$decoded = json_decode( (string) $raw, true );
		if ( ! is_array( $decoded ) ) {
			return array();
		}
		$result = array();
		foreach ( array_slice( $decoded, 0, $limit ) as $index => $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}
			$attachment_id = absint( isset( $item['attachment_id'] ) ? $item['attachment_id'] : 0 );
			if ( ! $attachment_id || 'attachment' !== get_post_type( $attachment_id ) ) {
				continue;
			}
			$mime = (string) get_post_mime_type( $attachment_id );
			$type = 0 === strpos( $mime, 'video/' ) ? 'video' : ( 0 === strpos( $mime, 'image/' ) ? 'image' : '' );
			if ( ! $type ) {
				continue;
			}
			$position = isset( $item['object_position'] ) ? sanitize_text_field( $item['object_position'] ) : '50% 50%';
			if ( ! preg_match( '/^(100|[0-9]{1,2})% (100|[0-9]{1,2})%$/', $position ) ) {
				$position = '50% 50%';
			}
			$result[] = array(
				'id'                   => ! empty( $item['id'] ) ? sanitize_key( $item['id'] ) : wp_generate_uuid4(),
				'type'                 => $type,
				'attachment_id'        => $attachment_id,
				'poster_attachment_id' => isset( $item['poster_attachment_id'] ) ? $this->sanitize_attachment( $item['poster_attachment_id'], 'image' ) : 0,
				'alt'                  => isset( $item['alt'] ) ? mb_substr( sanitize_text_field( $item['alt'] ), 0, 250 ) : '',
				'caption'              => isset( $item['caption'] ) ? mb_substr( sanitize_text_field( $item['caption'] ), 0, 500 ) : '',
				'object_position'      => $position,
				'is_placeholder'       => ! empty( $item['is_placeholder'] ),
				'order'                => $index,
			);
		}
		return $result;
	}

	/**
	 * Sanitize post relationships.
	 *
	 * @param array  $raw Raw IDs.
	 * @param string $post_type Required type.
	 * @param int    $exclude Excluded current ID.
	 * @return array
	 */
	private function sanitize_relationships( $raw, $post_type, $exclude = 0 ) {
		$result = array();
		foreach ( array_unique( array_map( 'absint', $raw ) ) as $id ) {
			if ( $id && $id !== (int) $exclude && $post_type === get_post_type( $id ) && current_user_can( 'read_post', $id ) ) {
				$result[] = $id;
			}
		}
		return array_slice( $result, 0, 20 );
	}

	/**
	 * Public meta payload for the REST presenter.
	 *
	 * @param WP_Post $post Post record.
	 * @return array
	 */
	public function get_public_meta( $post ) {
		$data = array();
		foreach ( $this->definitions_for_post( $post ) as $key => $definition ) {
			if ( 'system_email' === $definition['type'] ) {
				continue;
			}
			$data[ substr( $key, 4 ) ] = get_post_meta( $post->ID, $key, true );
		}
		return $data;
	}

	/**
	 * Load Media Library admin assets only where needed.
	 *
	 * @param string $hook Current admin page.
	 */
	public function enqueue_assets( $hook ) {
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}
		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->post_type, array( 'page', 'spp_service', 'spp_project', 'spp_testimonial', 'spp_site_config' ), true ) ) {
			return;
		}
		wp_enqueue_media();
		wp_enqueue_script( 'spp-content-admin', SPP_CONTENT_URL . 'assets/admin.js', array( 'jquery' ), SPP_CONTENT_VERSION, true );
		wp_enqueue_style( 'spp-content-admin', SPP_CONTENT_URL . 'assets/admin.css', array(), SPP_CONTENT_VERSION );
		wp_localize_script(
			'spp-content-admin',
			'sppContentAdmin',
			array(
				'chooseMedia' => __( 'Choose media', 'superior-plus-content' ),
				'useMedia'    => __( 'Use selected media', 'superior-plus-content' ),
				'image'       => __( 'Image', 'superior-plus-content' ),
				'video'       => __( 'Video', 'superior-plus-content' ),
				'remove'      => __( 'Remove', 'superior-plus-content' ),
				'moveUp'      => __( 'Move up', 'superior-plus-content' ),
				'moveDown'    => __( 'Move down', 'superior-plus-content' ),
				'altText'     => __( 'Alt text', 'superior-plus-content' ),
				'caption'     => __( 'Caption', 'superior-plus-content' ),
			)
		);
	}

	/**
	 * Add useful service columns.
	 *
	 * @param array $columns Existing columns.
	 * @return array
	 */
	public function service_columns( $columns ) {
		$columns['spp_template'] = __( 'Template', 'superior-plus-content' );
		$columns['spp_gallery']  = __( 'Gallery items', 'superior-plus-content' );
		return $columns;
	}

	/**
	 * Render service columns.
	 *
	 * @param string $column Column key.
	 * @param int    $post_id Service ID.
	 */
	public function service_column_value( $column, $post_id ) {
		if ( 'spp_template' === $column ) {
			echo '<code>service</code>';
		} elseif ( 'spp_gallery' === $column ) {
			$items = get_post_meta( $post_id, 'spp_gallery_items', true );
			echo esc_html( is_array( $items ) ? count( $items ) : 0 );
		}
	}
}
