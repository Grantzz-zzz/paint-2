<?php
/**
 * Versioned public REST presenter.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SPP_Content_REST {
	/**
	 * Content types.
	 *
	 * @var SPP_Content_Types
	 */
	private $types;

	/**
	 * Field manager.
	 *
	 * @var SPP_Content_Fields
	 */
	private $fields;

	/**
	 * Create the presenter.
	 *
	 * @param SPP_Content_Types  $types Types service.
	 * @param SPP_Content_Fields $fields Field service.
	 */
	public function __construct( $types, $fields ) {
		$this->types  = $types;
		$this->fields = $fields;
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register versioned endpoints.
	 */
	public function register_routes() {
		register_rest_route(
			'spp/v1',
			'/bootstrap',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'bootstrap' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'spp/v1',
			'/routes',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'route' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'spp/v1',
			'/routes/(?P<path>.+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'route' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'path' => array(
						'sanitize_callback' => array( $this, 'sanitize_route_path' ),
					),
				),
			)
		);
		register_rest_route(
			'spp/v1',
			'/services',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'services' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'spp/v1',
			'/services/(?P<slug>[a-z0-9-]+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'service' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'slug' => array( 'sanitize_callback' => 'sanitize_title' ),
				),
			)
		);
		foreach ( array( 'projects', 'faqs', 'testimonials' ) as $collection ) {
			register_rest_route(
				'spp/v1',
				'/' . $collection,
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, $collection ),
					'permission_callback' => '__return_true',
				)
			);
		}
		register_rest_route(
			'spp/v1',
			'/export',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'export' ),
				'permission_callback' => function () {
					return current_user_can( 'manage_spp_system' );
				},
			)
		);
	}

	/**
	 * Normalize a route request.
	 *
	 * @param mixed $path Raw route.
	 * @return string
	 */
	public function sanitize_route_path( $path ) {
		$segments = array_filter( explode( '/', trim( rawurldecode( (string) $path ), '/' ) ) );
		return implode( '/', array_map( 'sanitize_title', $segments ) );
	}

	/**
	 * Global bootstrap response.
	 *
	 * @return WP_REST_Response
	 */
	public function bootstrap() {
		$config_id = $this->types->get_site_config_id();
		$get       = function ( $key, $fallback = '' ) use ( $config_id ) {
			$value = $config_id ? get_post_meta( $config_id, $key, true ) : '';
			return '' === $value || null === $value ? $fallback : $value;
		};
		$logo_id = absint( $get( 'spp_logo_id', 0 ) );

		$data = array(
			'business'      => array(
				'name'          => $get( 'spp_business_name', 'Superior Plus Painting & Remodeling' ),
				'phone_display' => $get( 'spp_phone_display', '0470 234 567' ),
				'phone_href'    => 'tel:' . $get( 'spp_phone_normalized', '0470234567' ),
				'email'         => $get( 'spp_email', 'sppainting.remodeling@gmail.com' ),
				'location'      => $get( 'spp_location', 'Melbourne, Victoria' ),
				'instagram_url' => $get( 'spp_instagram_url', '' ),
				'logo'          => $this->media( $logo_id ),
			),
			'navigation'    => $this->navigation(),
			'footer'        => array(
				'intro'        => $get( 'spp_footer_intro', 'Premium residential and commercial painting across Melbourne, with care in every coat.' ),
				'columns'      => $this->footer_columns( $config_id ),
				'copyright'    => $get( 'spp_footer_copyright', '© ' . gmdate( 'Y' ) . ' Superior Plus Painting & Remodeling' ),
				'closing_line' => $get( 'spp_footer_closing_line', 'Made with care in Melbourne.' ),
			),
			'trust_items'   => $this->text_values(
				$get(
					'spp_trust_items',
					array(
						array( 'text' => 'Fully insured' ),
						array( 'text' => 'Free written quotes' ),
						array( 'text' => 'Careful preparation' ),
						array( 'text' => 'Clean, tidy sites' ),
					)
				)
			),
			'service_areas' => $this->text_values( $get( 'spp_service_areas', array() ) ),
			'default_cta'   => array(
				'title' => $get( 'spp_default_cta_title', 'Ready for a fresh start?' ),
				'text'  => $get( 'spp_default_cta_text', 'Tell us about your property and we’ll arrange a free, no-obligation quotation.' ),
				'link'  => array(
					'label' => $get( 'spp_default_cta_label', 'Request my free quote' ),
					'url'   => $get( 'spp_default_cta_url', '/contact' ),
				),
			),
		);
		return $this->response( $data );
	}

	/**
	 * Resolve a published route.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function route( $request ) {
		$path = $this->sanitize_route_path( $request->get_param( 'path' ) );
		if ( 0 === strpos( $path, 'services/' ) ) {
			$slug = substr( $path, strlen( 'services/' ) );
			$post = get_page_by_path( $slug, OBJECT, 'spp_service' );
			if ( ! $post || 'publish' !== $post->post_status ) {
				return new WP_Error( 'spp_route_not_found', __( 'Route not found.', 'superior-plus-content' ), array( 'status' => 404 ) );
			}
			$service = $this->service_data( $post, true );
			return $this->response(
				array(
					'id'           => (int) $post->ID,
					'path'         => '/services/' . $post->post_name,
					'template_key' => 'service',
					'title'        => get_the_title( $post ),
					'seo'          => $this->seo( $post ),
					'hero'         => $service['hero'],
					'content'      => $service,
					'closing_cta'  => $this->cta( $post ),
				)
			);
		}

		$page = null;
		if ( '' === $path ) {
			$front_id = (int) get_option( 'page_on_front' );
			$page     = $front_id ? get_post( $front_id ) : get_page_by_path( 'home', OBJECT, 'page' );
		} else {
			$page = get_page_by_path( $path, OBJECT, 'page' );
		}
		if ( ! $page || 'publish' !== $page->post_status ) {
			return new WP_Error( 'spp_route_not_found', __( 'Route not found.', 'superior-plus-content' ), array( 'status' => 404 ) );
		}

		$meta         = $this->fields->get_public_meta( $page );
		$template_key = ! empty( $meta['template_key'] ) ? $meta['template_key'] : $this->fields->default_template_for_slug( $page->post_name );
		return $this->response(
			array(
				'id'           => (int) $page->ID,
				'path'         => '' === $path ? '/' : '/' . $path,
				'template_key' => $template_key,
				'title'        => get_the_title( $page ),
				'seo'          => $this->seo( $page ),
				'hero'         => $this->hero( $page ),
				'content'      => array(
					'body'   => apply_filters( 'the_content', $page->post_content ),
					'fields' => $this->resolve_media_meta( $meta ),
				),
				'closing_cta'  => $this->cta( $page ),
			)
		);
	}

	/**
	 * Services collection.
	 *
	 * @return WP_REST_Response
	 */
	public function services() {
		$items = array_map(
			function ( $post ) {
				return $this->service_data( $post, false );
			},
			$this->published_posts( 'spp_service' )
		);
		return $this->response( $items );
	}

	/**
	 * Single service.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public function service( $request ) {
		$post = get_page_by_path( $request['slug'], OBJECT, 'spp_service' );
		if ( ! $post || 'publish' !== $post->post_status ) {
			return new WP_Error( 'spp_service_not_found', __( 'Service not found.', 'superior-plus-content' ), array( 'status' => 404 ) );
		}
		return $this->response( $this->service_data( $post, true ) );
	}

	/**
	 * Projects collection.
	 *
	 * @return WP_REST_Response
	 */
	public function projects() {
		$items = array_map(
			function ( $post ) {
				$featured_id = absint( get_post_meta( $post->ID, 'spp_featured_media_id', true ) );
				if ( ! $featured_id ) {
					$featured_id = get_post_thumbnail_id( $post );
				}
				return array(
					'id'              => (int) $post->ID,
					'slug'            => $post->post_name,
					'title'           => get_the_title( $post ),
					'project_type'    => get_post_meta( $post->ID, 'spp_project_type', true ),
					'featured_media'  => $this->media( $featured_id ),
					'object_position' => get_post_meta( $post->ID, 'spp_object_position', true ) ?: '50% 50%',
					'gallery'         => $this->gallery( get_post_meta( $post->ID, 'spp_gallery_items', true ) ),
				);
			},
			$this->published_posts( 'spp_project' )
		);
		return $this->response( $items );
	}

	/**
	 * FAQ collection.
	 *
	 * @return WP_REST_Response
	 */
	public function faqs() {
		$items = array_map(
			function ( $post ) {
				return array(
					'id'       => (int) $post->ID,
					'question' => get_the_title( $post ),
					'answer'   => wp_kses_post( $post->post_content ),
				);
			},
			$this->published_posts( 'spp_faq' )
		);
		return $this->response( $items );
	}

	/**
	 * Testimonial collection.
	 *
	 * @return WP_REST_Response
	 */
	public function testimonials() {
		$items = array_map(
			function ( $post ) {
				return array(
					'id'             => (int) $post->ID,
					'quote'          => wp_strip_all_tags( $post->post_content ),
					'name'           => get_post_meta( $post->ID, 'spp_testimonial_name', true ),
					'label'          => get_post_meta( $post->ID, 'spp_testimonial_label', true ),
					'project'        => get_post_meta( $post->ID, 'spp_testimonial_project', true ),
					'rating'         => max( 1, min( 5, (int) get_post_meta( $post->ID, 'spp_testimonial_rating', true ) ?: 5 ) ),
					'is_placeholder' => (bool) get_post_meta( $post->ID, 'spp_is_placeholder', true ),
				);
			},
			$this->published_posts( 'spp_testimonial' )
		);
		return $this->response( $items );
	}

	/**
	 * Export content records without database-specific relationships.
	 *
	 * @return WP_REST_Response
	 */
	public function export() {
		$records = array();
		foreach ( array( 'spp_site_config', 'page', 'spp_service', 'spp_project', 'spp_testimonial', 'spp_faq' ) as $post_type ) {
			$posts = get_posts(
				array(
					'post_type'      => $post_type,
					'post_status'    => array( 'publish', 'private', 'draft' ),
					'posts_per_page' => -1,
					'orderby'        => array( 'menu_order' => 'ASC', 'ID' => 'ASC' ),
				)
			);
			foreach ( $posts as $post ) {
				if ( 'page' === $post_type && ! get_post_meta( $post->ID, 'spp_template_key', true ) && ! in_array( $post->post_name, array( 'home', 'about', 'services', 'our-process', 'faqs', 'contact' ), true ) ) {
					continue;
				}
				$records[] = array(
					'source_key' => get_post_meta( $post->ID, '_spp_source_key', true ) ?: $post_type . ':' . $post->post_name,
					'post_type'  => $post_type,
					'status'     => $post->post_status,
					'slug'       => $post->post_name,
					'title'      => $post->post_title,
					'content'    => $post->post_content,
					'excerpt'    => $post->post_excerpt,
					'menu_order' => (int) $post->menu_order,
					'fields'     => $this->fields->get_public_meta( $post ),
				);
			}
		}
		return $this->response(
			array(
				'format'      => 'spp-content-export',
				'exported_at' => gmdate( 'c' ),
				'records'     => $records,
			)
		);
	}

	/**
	 * Build a service payload.
	 *
	 * @param WP_Post $post Service.
	 * @param bool    $full Full page data.
	 * @return array
	 */
	private function service_data( $post, $full ) {
		$short = get_post_meta( $post->ID, 'spp_directory_excerpt', true );
		if ( ! $short ) {
			$short = $post->post_excerpt;
		}
		$data = array(
			'id'    => (int) $post->ID,
			'slug'  => $post->post_name,
			'title' => get_the_title( $post ),
			'short' => wp_strip_all_tags( $short ),
			'url'   => get_permalink( $post ),
		);
		if ( ! $full ) {
			return $data;
		}

		$related = array();
		foreach ( (array) get_post_meta( $post->ID, 'spp_related_service_ids', true ) as $related_id ) {
			$related_post = get_post( absint( $related_id ) );
			if ( $related_post && 'spp_service' === $related_post->post_type && 'publish' === $related_post->post_status ) {
				$related[] = $this->service_data( $related_post, false );
			}
		}

		$data += array(
			'hero'        => $this->hero( $post ),
			'scope_title' => get_post_meta( $post->ID, 'spp_scope_title', true ),
			'scope'       => $this->ordered_items( get_post_meta( $post->ID, 'spp_scope', true ) ),
			'process'     => $this->ordered_items( get_post_meta( $post->ID, 'spp_process', true ) ),
			'why'         => get_post_meta( $post->ID, 'spp_why', true ),
			'benefits'    => $this->ordered_items( get_post_meta( $post->ID, 'spp_benefits', true ) ),
			'related'     => $related,
			'gallery'     => $this->gallery( get_post_meta( $post->ID, 'spp_gallery_items', true ) ),
		);
		return $data;
	}

	/**
	 * Hero presenter.
	 *
	 * @param WP_Post $post Post.
	 * @return array
	 */
	private function hero( $post ) {
		$image_id = absint( get_post_meta( $post->ID, 'spp_hero_image_id', true ) );
		if ( ! $image_id ) {
			$image_id = get_post_thumbnail_id( $post );
		}
		return array(
			'eyebrow' => get_post_meta( $post->ID, 'spp_eyebrow', true ),
			'title'    => get_post_meta( $post->ID, 'spp_hero_title', true ) ?: get_the_title( $post ),
			'accent'   => get_post_meta( $post->ID, 'spp_accent', true ),
			'intro'    => get_post_meta( $post->ID, 'spp_hero_intro', true ) ?: wp_strip_all_tags( $post->post_excerpt ?: $post->post_content ),
			'image'    => $this->media( $image_id, get_post_meta( $post->ID, 'spp_hero_image_alt', true ) ),
		);
	}

	/**
	 * SEO presenter.
	 *
	 * @param WP_Post $post Post.
	 * @return array
	 */
	private function seo( $post ) {
		$social_id = absint( get_post_meta( $post->ID, 'spp_social_image_id', true ) );
		return array(
			'title'         => get_post_meta( $post->ID, 'spp_seo_title', true ) ?: get_the_title( $post ),
			'description'   => get_post_meta( $post->ID, 'spp_seo_description', true ) ?: wp_strip_all_tags( $post->post_excerpt ),
			'canonical_url' => get_post_meta( $post->ID, 'spp_canonical_url', true ) ?: get_permalink( $post ),
			'social_image'  => $this->media( $social_id ),
		);
	}

	/**
	 * Route CTA presenter.
	 *
	 * @param WP_Post $post Post.
	 * @return array
	 */
	private function cta( $post ) {
		return array(
			'title' => get_post_meta( $post->ID, 'spp_closing_cta_title', true ),
			'text'  => get_post_meta( $post->ID, 'spp_closing_cta_text', true ),
			'link'  => array(
				'label' => get_post_meta( $post->ID, 'spp_closing_cta_label', true ),
				'url'   => get_post_meta( $post->ID, 'spp_closing_cta_url', true ),
			),
		);
	}

	/**
	 * Media presenter.
	 *
	 * @param int    $attachment_id Attachment ID.
	 * @param string $alt_override Optional route-specific alt.
	 * @return array|null
	 */
	private function media( $attachment_id, $alt_override = '' ) {
		$attachment_id = absint( $attachment_id );
		if ( ! $attachment_id || 'attachment' !== get_post_type( $attachment_id ) ) {
			return null;
		}
		$source = wp_get_attachment_image_src( $attachment_id, 'full' );
		if ( ! $source ) {
			$url = wp_get_attachment_url( $attachment_id );
			if ( ! $url ) {
				return null;
			}
			$source = array( $url, 1, 1 );
		}
		return array(
			'attachment_id' => $attachment_id,
			'url'           => $source[0],
			'alt'           => $alt_override ? $alt_override : (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
			'caption'       => wp_get_attachment_caption( $attachment_id ) ?: '',
			'width'         => max( 1, (int) $source[1] ),
			'height'        => max( 1, (int) $source[2] ),
			'srcset'        => wp_get_attachment_image_srcset( $attachment_id, 'full' ) ?: '',
			'sizes'         => wp_get_attachment_image_sizes( $attachment_id, 'full' ) ?: '',
		);
	}

	/**
	 * Gallery presenter.
	 *
	 * @param mixed $items Stored gallery.
	 * @return array
	 */
	private function gallery( $items ) {
		if ( ! is_array( $items ) ) {
			return array();
		}
		$result = array();
		foreach ( $items as $index => $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}
			$media = $this->media( isset( $item['attachment_id'] ) ? $item['attachment_id'] : 0, isset( $item['alt'] ) ? $item['alt'] : '' );
			if ( ! $media ) {
				continue;
			}
			$result[] = array(
				'id'              => isset( $item['id'] ) ? $item['id'] : 'media-' . $index,
				'type'            => isset( $item['type'] ) ? $item['type'] : 'image',
				'media'           => $media,
				'poster'          => $this->media( isset( $item['poster_attachment_id'] ) ? $item['poster_attachment_id'] : 0 ),
				'alt'             => isset( $item['alt'] ) ? $item['alt'] : $media['alt'],
				'caption'         => isset( $item['caption'] ) ? $item['caption'] : '',
				'object_position' => isset( $item['object_position'] ) ? $item['object_position'] : '50% 50%',
				'is_placeholder'  => ! empty( $item['is_placeholder'] ),
				'order'           => isset( $item['order'] ) ? (int) $item['order'] : $index,
			);
		}
		return $result;
	}

	/**
	 * Resolve known media-ID keys in generic page fields.
	 *
	 * @param array $meta Public fields.
	 * @return array
	 */
	private function resolve_media_meta( $meta ) {
		foreach ( $meta as $key => $value ) {
			if ( preg_match( '/_image_id$|^logo_id$|^featured_media_id$/', $key ) ) {
				$meta[ preg_replace( '/_id$/', '', $key ) ] = $this->media( $value );
				unset( $meta[ $key ] );
			}
		}
		return $meta;
	}

	/**
	 * Ensure ordered item shape.
	 *
	 * @param mixed $items Stored list.
	 * @return array
	 */
	private function ordered_items( $items ) {
		if ( ! is_array( $items ) ) {
			return array();
		}
		$result = array();
		foreach ( array_values( $items ) as $index => $item ) {
			$result[] = is_array( $item )
				? array(
					'id'    => isset( $item['id'] ) ? $item['id'] : 'item-' . $index,
					'text'  => isset( $item['text'] ) ? $item['text'] : '',
					'order' => isset( $item['order'] ) ? (int) $item['order'] : $index,
				)
				: array( 'id' => 'item-' . $index, 'text' => (string) $item, 'order' => $index );
		}
		return $result;
	}

	/**
	 * Extract strings from ordered items.
	 *
	 * @param mixed $items Stored list.
	 * @return array
	 */
	private function text_values( $items ) {
		return array_values(
			array_filter(
				array_map(
					function ( $item ) {
						return is_array( $item ) && isset( $item['text'] ) ? $item['text'] : ( is_string( $item ) ? $item : '' );
					},
					is_array( $items ) ? $items : array()
				)
			)
		);
	}

	/**
	 * Published ordered records.
	 *
	 * @param string $post_type Post type.
	 * @return WP_Post[]
	 */
	private function published_posts( $post_type ) {
		return get_posts(
			array(
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
			)
		);
	}

	/**
	 * Normalize primary menu and automatically inject service children.
	 *
	 * @return array
	 */
	private function navigation() {
		$locations = get_nav_menu_locations();
		$menu_id   = isset( $locations['primary'] ) ? $locations['primary'] : 0;
		$items     = $menu_id ? wp_get_nav_menu_items( $menu_id ) : array();
		$result    = array();
		$children  = array();
		foreach ( (array) $items as $item ) {
			if ( (int) $item->menu_item_parent ) {
				$children[ (int) $item->menu_item_parent ][] = $item;
			}
		}
		foreach ( (array) $items as $item ) {
			if ( (int) $item->menu_item_parent ) {
				continue;
			}
			$entry = array(
				'id'       => (int) $item->ID,
				'label'    => $item->title,
				'url'      => $item->url,
				'children' => array(),
			);
			foreach ( isset( $children[ $item->ID ] ) ? $children[ $item->ID ] : array() as $child ) {
				$entry['children'][] = array( 'id' => (int) $child->ID, 'label' => $child->title, 'url' => $child->url );
			}
			if ( false !== stripos( $item->title, 'service' ) || untrailingslashit( $item->url ) === untrailingslashit( home_url( '/services' ) ) ) {
				$entry['children'] = array_map(
					function ( $service ) {
						return array( 'id' => (int) $service->ID, 'label' => get_the_title( $service ), 'url' => get_permalink( $service ) );
					},
					$this->published_posts( 'spp_service' )
				);
			}
			$result[] = $entry;
		}
		return $result;
	}

	/**
	 * Footer columns from registered footer menu.
	 *
	 * @param int $config_id Site settings record.
	 * @return array
	 */
	private function footer_columns( $config_id ) {
		$locations = get_nav_menu_locations();
		$menu_id   = isset( $locations['footer'] ) ? $locations['footer'] : 0;
		$items     = $menu_id ? wp_get_nav_menu_items( $menu_id ) : array();
		$links     = array();
		foreach ( (array) $items as $item ) {
			$links[] = array( 'label' => $item->title, 'url' => $item->url );
		}
		$services = array_map(
			function ( $service ) {
				return array( 'label' => get_the_title( $service ), 'url' => get_permalink( $service ) );
			},
			$this->published_posts( 'spp_service' )
		);
		$meta = function ( $key, $fallback = '' ) use ( $config_id ) {
			$value = $config_id ? get_post_meta( $config_id, $key, true ) : '';
			return $value ? $value : $fallback;
		};
		$contact_links = array(
			array( 'label' => $meta( 'spp_phone_display', '0470 234 567' ), 'url' => 'tel:' . $meta( 'spp_phone_normalized', '0470234567' ) ),
			array( 'label' => $meta( 'spp_email', 'sppainting.remodeling@gmail.com' ), 'url' => 'mailto:' . $meta( 'spp_email', 'sppainting.remodeling@gmail.com' ) ),
			array( 'label' => $meta( 'spp_location', 'Melbourne, Victoria' ), 'url' => 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( $meta( 'spp_location', 'Melbourne, Victoria' ) ) ),
		);
		if ( $meta( 'spp_instagram_url' ) ) {
			$contact_links[] = array( 'label' => 'Instagram', 'url' => $meta( 'spp_instagram_url' ) );
		}
		return array(
			array(
				'heading' => $meta( 'spp_footer_explore_heading', __( 'Explore', 'superior-plus-content' ) ),
				'links'   => $links,
			),
			array(
				'heading' => $meta( 'spp_footer_services_heading', __( 'Services', 'superior-plus-content' ) ),
				'links'   => $services,
			),
			array(
				'heading' => $meta( 'spp_footer_contact_heading', __( 'Get in touch', 'superior-plus-content' ) ),
				'links'   => $contact_links,
			),
		);
	}

	/**
	 * Version and cache a response.
	 *
	 * @param mixed $data Response data.
	 * @return WP_REST_Response
	 */
	private function response( $data ) {
		$payload = array(
			'schema_version' => SPP_CONTENT_SCHEMA_VERSION,
			'generated_at'   => gmdate( 'c' ),
			'data'           => $data,
		);
		$response = rest_ensure_response( $payload );
		$response->header( 'ETag', '"' . md5( wp_json_encode( $payload['data'] ) ) . '"' );
		$response->header( 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300' );
		return $response;
	}
}
