<?php
/**
 * Plugin Name: Superior Plus Content
 * Plugin URI: https://sppaintingremodeling.com.au/
 * Description: Locked-design content management and REST API for the Superior Plus React website.
 * Version: 0.9.0
 * Author: Superior Plus Painting
 * Text Domain: superior-plus-content
 * Requires at least: 6.4
 * Requires PHP: 7.4
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SPP_CONTENT_VERSION', '0.9.0' );
define( 'SPP_CONTENT_SCHEMA_VERSION', '1.0.0' );
define( 'SPP_CONTENT_FILE', __FILE__ );
define( 'SPP_CONTENT_PATH', plugin_dir_path( __FILE__ ) );
define( 'SPP_CONTENT_URL', plugin_dir_url( __FILE__ ) );

require_once SPP_CONTENT_PATH . 'includes/class-spp-content-types.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-fields.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-rest.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-workflow.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-routing.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-migration.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-enquiries.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-recovery.php';
require_once SPP_CONTENT_PATH . 'includes/class-spp-content-plugin.php';

register_activation_hook( __FILE__, array( 'SPP_Content_Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'SPP_Content_Plugin', 'deactivate' ) );

SPP_Content_Plugin::instance();
