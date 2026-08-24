<?php
$directory = __DIR__ . '/../docs/live-responsive-audit';
foreach ( glob( $directory . '/desktop-*.png' ) ?: array() as $source_path ) {
	if ( str_ends_with( $source_path, '-small.png' ) ) {
		continue;
	}
	$source = @imagecreatefrompng( $source_path );
	if ( ! $source ) {
		continue;
	}
	$width = imagesx( $source );
	$height = imagesy( $source );
	$target_width = 720;
	$target_height = (int) round( $height * $target_width / $width );
	$target = imagecreatetruecolor( $target_width, $target_height );
	imagecopyresampled( $target, $source, 0, 0, 0, 0, $target_width, $target_height, $width, $height );
	imagepng( $target, preg_replace( '/\.png$/', '-small.png', $source_path ), 6 );
	imagedestroy( $source );
	imagedestroy( $target );
}
