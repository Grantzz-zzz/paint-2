<?php
/**
 * Template Name: Superior Plus Campaign Landing
 * Template Post Type: page
 *
 * A reusable landing-page assignment for future campaigns. Text and media are
 * supplied by the content plugin; the visual system stays code controlled.
 *
 * @package SuperiorPlus
 */

$spp_react_shell = locate_template( 'react-app.php' );
if ( $spp_react_shell ) {
	require $spp_react_shell;
}
