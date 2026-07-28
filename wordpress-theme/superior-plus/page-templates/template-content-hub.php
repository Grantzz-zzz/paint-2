<?php
/**
 * Template Name: Superior Plus Content Hub
 * Template Post Type: page
 *
 * Reuses the locked React collection layout for future blog, gallery or
 * resource hubs while content remains managed by Superior Plus Content.
 *
 * @package SuperiorPlus
 */

$spp_react_shell = locate_template( 'react-app.php' );
if ( $spp_react_shell ) {
	require $spp_react_shell;
}
