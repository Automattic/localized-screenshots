<?php

class Localized_Screenshots {
	static $base = 'localized-screenshots/v1';

	public static function init() {
		add_action( 'admin_menu', array( self::class, 'init_settings_page' ) );

		add_action( 'init', array( self::class, 'register_screenshot_route' ) );
		add_action( 'rest_api_init', array( self::class, 'register_get_screenshot_endpoint' ) );
		add_action( 'rest_api_init', array( self::class, 'register_upload_screenshot_endpoint' ) );
		add_action( 'rest_api_init', array( self::class, 'register_update_screenshot_endpoint' ) );
		add_action( 'rest_api_init', array( self::class, 'register_get__all_screenshots_endpoint' ) );
	}

	public static function init_settings_page() {
		add_options_page( 'Localized Screenshots', 'Localized Screenshots', 'manage_options', 'localized-screenshots', array( self::class, 'settings_page' ) );

		register_setting( 'localized_screenshots_settings', 'localized_screenshots_settings' );
		add_settings_section( 'api_settings', 'API Settings', null, 'localized_screenshots_settings' );
		add_settings_field( 'localized_screenshots_api_secret', 'API Secret', array( self::class, 'settings_page_api_secret_field' ), 'localized_screenshots_settings', 'api_settings' );
	}

	public static function settings_page() {
		?>
			<h2><?php _e( 'Localized Screenshots Settings', 'localized-screenshots' ); ?></h2>
			<form action="options.php" method="post">
				<?php
					settings_fields( 'localized_screenshots_settings' );
					do_settings_sections( 'localized_screenshots_settings' );
				?>
				<input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e( 'Save', 'localized-screenshots' ); ?>" />
			</form>
		<?php
	}

	public static function settings_page_api_secret_field() {
		$settings = get_option( 'localized_screenshots_settings' ) ?? array();
		echo '<input id="localized_screenshots_api_secret" name="localized_screenshots_settings[api_secret]" type="text" value="' . esc_attr( $settings['api_secret'] ?? '' ) . '" />';
	}

	public static function register_get_screenshot_endpoint() {
		register_rest_route(
			self::$base,
			'get',
			array(
				'methods' => array( 'GET' ),
				'callback' => array( self::class, 'handle_get_screenshot' ),
				'permission_callback' => array( self::class, 'is_authorized' ),
			)
		);
	}

	public static function register_get__all_screenshots_endpoint() {
		register_rest_route(
			self::$base,
			'all',
			array(
				'methods' => array( 'GET' ),
				'callback' => array( self::class, 'handle_get_all_screenshots' ),
				'permission_callback' => array( self::class, 'is_authorized' ),
			)
		);
	}

	public static function register_upload_screenshot_endpoint() {
		register_rest_route(
			self::$base,
			'upload',
			array(
				'methods' => array( 'POST' ),
				'callback' => array( self::class, 'handle_upload_screenshot' ),
				'permission_callback' => array( self::class, 'is_authorized' ),
			)
		);
	}

	public static function register_update_screenshot_endpoint() {
		register_rest_route(
			self::$base,
			'update',
			array(
				'methods' => array( 'POST' ),
				'callback' => array( self::class, 'handle_update_screenshots' ),
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

		header( 'Access-Control-Allow-Origin: *' );

		wp_redirect( wp_get_attachment_image_url( $screenshot_id, 'full' ) );
	}

	public static function is_authorized( WP_REST_Request $request ) {
		$settings    = get_option( 'localized_screenshots_settings' ) ?? array();
		$api_secret  = $settings['api_secret'] ?? '';
		$auth_header = $request->get_header( 'X-Localized-Screenshots-Token' );

		return $auth_header === $api_secret;
	}

	public static function handle_get_screenshot( WP_REST_Request $request ) {
		$requested_screenshot = get_post( $request->get_param( 'id' ) );
		$screenshot_parent = $requested_screenshot->post_parent ? get_post( $requested_screenshot->post_parent ) : $requested_screenshot;
		$localized_screenshots = get_posts(
			array(
				'post_type'      => 'attachment',
				'post_parent'    => $screenshot_parent->ID,
				'posts_per_page' => -1,
			)
		);
		$all_screenshots = array_merge( array( $screenshot_parent ), $localized_screenshots );
		$response = array_map(
			function( $screenshot ) {
				return array(
					'id'     => $screenshot->ID,
					'url'    => get_home_url() . "/screenshot/$screenshot->ID/",
					'locale' => get_post_meta( $screenshot->ID, 'screenshot_locale', true ),
					'meta'   => get_post_meta( $screenshot->ID, 'screenshot_meta', true ),
				);
			},
			$all_screenshots
		);

		return $response;
	}

	public static function handle_get_all_screenshots() {
		$screenshots = get_posts(
			array(
				'post_type'       => 'attachment',
				'post_parent'     => 0,
				'posts_per_page'  => -1,
				'orderby'         => 'ID',
				'order'           => 'DESC',
				'meta_query'      => array(
					array(
						'key'     => 'screenshot_meta',
						'compare' => 'EXISTS',
					),
				),
			)
		);

		$response = array_map(
			function( $screenshot ) {
				return array(
					'id'     => $screenshot->ID,
					'url'    => get_home_url() . "/screenshot/$screenshot->ID/",
				);
			},
			$screenshots
		);

		return $response;
	}

	public static function handle_upload_screenshot( WP_REST_Request $request ) {
		if ( ! function_exists( 'media_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/image.php';
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/media.php';
		}

		$screenshot_parent = $request->get_param( 'screenshot_parent' );
		$screenshot_locale = $request->get_param( 'screenshot_locale' );
		$screenshot_meta = json_decode( $request->get_param( 'screenshot_meta' ), true );

		$attachment = media_handle_upload( 'screenshot', $screenshot_parent );
		add_post_meta( $attachment, 'screenshot_meta', $screenshot_meta );
		add_post_meta( $attachment, 'screenshot_locale', $screenshot_locale );

		return $attachment;
	}

	public static function handle_update_screenshots( WP_REST_Request $request ) {
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		$screenshot_id = $request->get_param( 'screenshot_id' );
		$screenshot_meta = json_decode( $request->get_param( 'screenshot_meta' ), true );

		$file = wp_handle_upload( $_FILES['screenshot'], array( 'test_form' => false ) );
		$updated = update_attached_file( $screenshot_id, $file['file'] );

		if ( $updated ) {
			update_post_meta( $screenshot_id, 'screenshot_meta', $screenshot_meta );
		}

		return $updated;
	}
}
