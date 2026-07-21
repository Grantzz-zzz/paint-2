<?php
/** Single service template. @package SuperiorPlus */
get_header(); the_post();
$post_id = get_the_ID();
$defaults = spp_default_services();
$default  = $defaults[ get_post_field( 'post_name', $post_id ) ] ?? array();
$field = static function ( $key, $fallback = '' ) use ( $post_id, $default ) {
	$value = get_post_meta( $post_id, 'spp_' . $key, true );
	return '' !== $value && array() !== $value ? $value : ( $default[ $key ] ?? $fallback );
};
$scope = (array) $field( 'scope', array() );
$process = (array) $field( 'process', array() );
$benefits = (array) $field( 'benefits', array() );
$tone = $field( 'tone', 'maroon' );
$image_url = has_post_thumbnail() ? get_the_post_thumbnail_url( $post_id, 'full' ) : '';
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => $field( 'eyebrow' ), 'title' => get_the_title(), 'accent' => $field( 'accent' ), 'intro' => get_the_excerpt() ?: wp_strip_all_tags( get_the_content() ), 'tone' => $tone, 'image' => $field( 'image', 'stock/residential.webp' ), 'image_url' => $image_url, 'alt' => get_the_title() . ' project by Superior Plus Painting' ) ); spp_trust_strip(); ?>
	<section class="inner-section scope-section"><div class="container"><?php spp_section_intro( 'What we can help with', $field( 'scope_title', 'Complete service scope' ), 'covered with care.', 'Every quote is tailored to the property, surface condition and finish you want to achieve.' ); ?><div class="scope-grid"><?php foreach ( $scope as $index => $item ) : ?><div class="reveal"><div class="scope-item scope-<?php echo esc_attr( $tone ); ?>"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><?php echo spp_icon( 'check' ); ?><b><?php echo esc_html( $item ); ?></b></div></div><?php endforeach; ?></div></div></section>
	<section class="inner-section process-section"><div class="container"><?php spp_section_intro( 'How it comes together', 'A considered process.', 'A lasting finish.', $field( 'why' ) ); ?><div class="service-process"><?php foreach ( $process as $index => $item ) : ?><div class="reveal"><article><b><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></b><span><?php echo esc_html( $item ); ?></span></article></div><?php endforeach; ?></div></div></section>
	<?php spp_project_gallery( $field( 'gallery' ) ); ?>
	<section class="benefit-section benefit-<?php echo esc_attr( $tone ); ?>"><div class="container benefit-grid"><div class="reveal"><h2>Why this work<br><em>makes a difference.</em></h2></div><div class="benefit-list"><?php foreach ( $benefits as $index => $item ) : ?><div class="reveal"><div><span><?php echo esc_html( '0' . ( $index + 1 ) ); ?></span><h3><?php echo esc_html( $item ); ?></h3></div></div><?php endforeach; ?></div></div></section>
	<section class="inner-section related-section"><div class="container"><?php spp_section_intro( 'Keep exploring', 'Related services', 'for the whole property.' ); ?><div class="related-grid"><?php $related = get_posts( array( 'post_type' => 'spp_service', 'numberposts' => 4, 'post__not_in' => array( $post_id ), 'orderby' => 'menu_order', 'order' => 'ASC' ) ); foreach ( $related as $service ) : $related_tone = get_post_meta( $service->ID, 'spp_tone', true ) ?: 'maroon'; ?><a class="related-card tone-<?php echo esc_attr( $related_tone ); ?>" href="<?php echo esc_url( get_permalink( $service ) ); ?>"><span>Superior Plus</span><h3><?php echo esc_html( get_the_title( $service ) ); ?></h3><p><?php echo esc_html( get_the_excerpt( $service ) ); ?></p><?php echo spp_icon( 'arrow' ); ?></a><?php endforeach; ?></div></div></section>
	<?php spp_testimonial_band(); spp_areas_band(); spp_closing_cta( 'Planning ' . strtolower( get_the_title() ) . '?' ); ?>
</main>
<?php get_footer(); ?>
