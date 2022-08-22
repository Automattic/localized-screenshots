<?php
/**
 * Plugin Name:     Localized Screenshots
 * Plugin URI:      https://example.com
 * Description:     Localized Screenshots Storage Prototype
 * Author:          Automattic
 * Author URI:      automattic.com
 * Text Domain:     localized-screenshots
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Localized_Screenshots
 */

require_once 'class-localized-screenshots.php';

add_action( 'plugins_loaded', array( Localized_Screenshots::class, 'init' ) );
