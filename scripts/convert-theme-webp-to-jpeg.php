<?php
/**
 * Convert public theme WebP assets to progressive JPEG compatibility copies.
 *
 * Usage:
 *   php scripts/convert-theme-webp-to-jpeg.php
 *   php scripts/convert-theme-webp-to-jpeg.php --replace
 *   php scripts/convert-theme-webp-to-jpeg.php --root=wordpress-theme/superior-plus/assets/images --replace
 *
 * The default mode keeps the WebP sources. --replace removes them only after
 * every JPEG has been written, decoded again, and dimension-checked.
 */

$requested_root = __DIR__ . '/../public/assets';
foreach ( $argv as $argument ) {
	if ( 0 === strpos( $argument, '--root=' ) ) {
		$requested_root = __DIR__ . '/../' . substr( $argument, 7 );
	}
}
$root    = realpath( $requested_root );
$replace = in_array( '--replace', $argv, true );
$quality = 68;

if ( ! $root || ! is_dir( $root ) ) {
	fwrite( STDERR, "The requested asset directory could not be resolved.\n" );
	exit( 1 );
}

if ( ! function_exists( 'imagecreatefromwebp' ) || ! function_exists( 'imagejpeg' ) ) {
	fwrite( STDERR, "PHP GD with WebP and JPEG support is required.\n" );
	exit( 1 );
}

$iterator = new RecursiveIteratorIterator(
	new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS )
);
$sources = array();
foreach ( $iterator as $file ) {
	if ( $file->isFile() && 'webp' === strtolower( $file->getExtension() ) ) {
		$sources[] = $file->getPathname();
	}
}
sort( $sources );

$created = array();
$bytes_before = 0;
$bytes_after  = 0;
foreach ( $sources as $source ) {
	$input = @imagecreatefromwebp( $source );
	if ( ! $input ) {
		fwrite( STDERR, "Could not decode {$source}. No WebP files were removed.\n" );
		exit( 1 );
	}

	$width  = imagesx( $input );
	$height = imagesy( $input );
	$output = imagecreatetruecolor( $width, $height );
	$white  = imagecolorallocate( $output, 255, 255, 255 );
	imagefill( $output, 0, 0, $white );
	imagealphablending( $output, true );
	imagecopy( $output, $input, 0, 0, 0, 0, $width, $height );
	imageinterlace( $output, true );

	$target = preg_replace( '/\.webp$/i', '.jpg', $source );
	if ( ! imagejpeg( $output, $target, $quality ) ) {
		imagedestroy( $input );
		imagedestroy( $output );
		fwrite( STDERR, "Could not write {$target}. No WebP files were removed.\n" );
		exit( 1 );
	}
	imagedestroy( $input );
	imagedestroy( $output );

	$check = @imagecreatefromjpeg( $target );
	if ( ! $check || imagesx( $check ) !== $width || imagesy( $check ) !== $height ) {
		if ( $check ) {
			imagedestroy( $check );
		}
		fwrite( STDERR, "JPEG verification failed for {$target}. No WebP files were removed.\n" );
		exit( 1 );
	}
	imagedestroy( $check );

	$created[]    = $target;
	$bytes_before += filesize( $source );
	$bytes_after  += filesize( $target );
}

if ( $replace ) {
	foreach ( $sources as $source ) {
		if ( ! unlink( $source ) ) {
			fwrite( STDERR, "Could not remove converted source {$source}.\n" );
			exit( 1 );
		}
	}
}

echo wp_json_encode_compat(
	array(
		'converted'    => count( $created ),
		'replaced'     => $replace,
		'webp_bytes'   => $bytes_before,
		'jpeg_bytes'   => $bytes_after,
		'quality'      => $quality,
	)
), PHP_EOL;

/**
 * Keep this script independent of WordPress.
 *
 * @param array<string,mixed> $value Summary data.
 * @return string
 */
function wp_json_encode_compat( $value ) {
	return (string) json_encode( $value, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
}
