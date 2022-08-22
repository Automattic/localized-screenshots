<?php

class Localized_Screenshots {
	static $base = 'localized-screenshots/v1';

	public static function init() {
		add_action( 'init', array( self::class, 'register_screenshot_route' ) );
		add_action( 'rest_api_init', array( self::class, 'register_upload_endpoint' ) );
	}

	public static function register_upload_endpoint() {
		register_rest_route(
			self::$base,
			'upload',
			array(
				'methods' => array( 'POST' ),
				'callback' => array( self::class, 'handle_upload' ),
				'permission_callback' => array( self::class, 'is_authorized' ),
			)
		);
	}

	public static function register_screenshot_route() {
		add_rewrite_rule( '^screenshot/(\d+)(?>/(\w+))?', 'index.php?screenshot_id=$matches[1]&locale=$matches[2]', 'top' );

		add_filter( 'query_vars', array( self::class, 'filter_screenshot_query_vars' ) );
		add_action( 'template_redirect', array( self::class, 'redirect_screenshot' ) );
	}

	public static function filter_screenshot_query_vars( $query_vars ) {
		$query_vars[] = 'screenshot_id';
		$query_vars[] = 'locale';
		return $query_vars;
	}

	public static function redirect_screenshot() {
		$screenshot_id = get_query_var( 'screenshot_id' );

		if ( ! $screenshot_id ) {
			return;
		}

		$locale = get_query_var( 'locale' );

		if ( ! empty( $locale ) && 'en' !== $locale ) {
			$localized_screenshot = get_posts(
				array(
					'post_type'      => 'attachment',
					'post_parent'    => $screenshot_id,
					'meta_key'       => 'screenshot_locale',
					'meta_value'     => $locale,
					'posts_per_page' => 1,
				)
			);

			$screenshot_id = empty( $localized_screenshot ) ? null : $localized_screenshot[0]->ID;
		}

		wp_safe_redirect( wp_get_attachment_image_url( $screenshot_id, 'full' ) );
	}

	public static function is_authorized() {
		// @todo
		return true;
	}

	public static function handle_upload( WP_REST_Request $request ) {
		if ( ! function_exists( 'media_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/media.php';
		}

		header( 'Access-Control-Allow-Origin: *' );

		$screenshot_parent = $request->get_param( 'screenshot_parent' );
		$screenshot_locale = $request->get_param( 'screenshot_locale' );
		$screenshot_meta = json_decode( $request->get_param( 'screenshot_meta' ), true );

		$attachment = media_handle_upload( 'screenshot', $screenshot_parent );
		add_post_meta( $attachment, 'screenshot_meta', $screenshot_meta );
		add_post_meta( $attachment, 'screenshot_locale', $screenshot_locale );

		return $attachment;
	}
}
