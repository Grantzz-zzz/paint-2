<?php
/** FAQs page. @package SuperiorPlus */
get_header(); the_post();
?>
<main id="main-content" class="inner-main">
	<?php spp_breadcrumbs(); ?>
	<?php spp_page_hero( array( 'eyebrow' => 'Straight answers before we start', 'title' => 'Frequently asked questions', 'accent' => 'made easy.', 'intro' => get_the_excerpt() ?: 'Clear answers about quoting, preparation, scheduling, products and what to expect from our team.', 'tone' => 'cream', 'image' => 'projects/interior/interior-04.webp' ) ); ?>
	<section class="inner-section"><div class="container faq-layout"><?php spp_section_intro( 'What clients ask us', 'Everything you need', 'to move forward.' ); ?><div class="faq-list"><?php foreach ( spp_default_faqs() as $index => $faq ) : ?><div class="faq-item <?php echo 0 === $index ? 'open' : ''; ?>"><button data-faq-button aria-expanded="<?php echo 0 === $index ? 'true' : 'false'; ?>"><span><?php echo esc_html( str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT ) ); ?></span><b><?php echo esc_html( $faq[0] ); ?></b><span>⌄</span></button><div class="faq-answer" <?php echo 0 === $index ? '' : 'hidden'; ?>><p><?php echo esc_html( $faq[1] ); ?></p></div></div><?php endforeach; ?></div></div></section>
	<?php spp_closing_cta( 'Still have a question?', 'Call our team or send an enquiry and we’ll talk through your property, surfaces and timing.' ); ?>
</main>
<?php get_footer(); ?>
