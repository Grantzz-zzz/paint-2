<?php
/**
 * Template Name: Superior Plus Local Service Area
 * Template Post Type: page
 *
 * Provides a reusable local-SEO page assignment without allowing editors to
 * alter the approved frontend layout.
 *
 * @package SuperiorPlus
 */

$spp_react_shell = locate_template( 'react-app.php' );
if ( $spp_react_shell ) {
	require $spp_react_shell;
}
