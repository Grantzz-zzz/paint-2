<?php
/**
 * Site footer.
 *
 * @package SuperiorPlus
 */
?>
</div>
<footer class="site-footer">
	<div class="container footer-grid">
		<div><?php spp_logo(); ?><p><?php esc_html_e( 'Premium residential and commercial painting across Melbourne, with care in every coat.', 'superior-plus' ); ?></p></div>
		<div><h4><?php esc_html_e( 'Explore', 'superior-plus' ); ?></h4><ul class="footer-links"><li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About', 'superior-plus' ); ?></a></li><li><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'Services', 'superior-plus' ); ?></a></li><li><a href="<?php echo esc_url( home_url( '/our-process/' ) ); ?>"><?php esc_html_e( 'Our Process', 'superior-plus' ); ?></a></li><li><a href="<?php echo esc_url( home_url( '/faqs/' ) ); ?>"><?php esc_html_e( 'FAQs', 'superior-plus' ); ?></a></li></ul></div>
		<div><h4><?php esc_html_e( 'Services', 'superior-plus' ); ?></h4><ul class="footer-links"><?php foreach ( array_slice( get_posts( array( 'post_type' => 'spp_service', 'numberposts' => 4, 'orderby' => 'menu_order', 'order' => 'ASC' ) ), 0, 4 ) as $service ) : ?><li><a href="<?php echo esc_url( get_permalink( $service ) ); ?>"><?php echo esc_html( get_the_title( $service ) ); ?></a></li><?php endforeach; ?></ul></div>
		<div><h4><?php esc_html_e( 'Get in touch', 'superior-plus' ); ?></h4><a href="tel:<?php echo esc_attr( spp_phone_href() ); ?>"><?php echo esc_html( spp_phone() ); ?></a><a href="mailto:<?php echo esc_attr( antispambot( spp_email() ) ); ?>"><?php echo esc_html( antispambot( spp_email() ) ); ?></a><span><?php echo esc_html( get_theme_mod( 'spp_location', 'Melbourne, Victoria' ) ); ?></span></div>
	</div>
	<div class="container footer-bottom"><span>© <?php echo esc_html( wp_date( 'Y' ) ); ?> <?php esc_html_e( 'Superior Plus Painting & Remodeling', 'superior-plus' ); ?></span><span><?php esc_html_e( 'Made with care in Melbourne.', 'superior-plus' ); ?></span></div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
