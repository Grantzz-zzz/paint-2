<?php
/**
 * Content is deliberately preserved on uninstall.
 *
 * Destructive removal must be implemented as a separate administrator-only
 * maintenance action with explicit confirmation and a verified backup.
 *
 * @package SuperiorPlusContent
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}
