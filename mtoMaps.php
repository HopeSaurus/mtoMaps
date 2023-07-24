<?php

/**
 * 
 * Plugin Name: MTO Maps
 * Description: This plugin is made to retrieve woocommerce products and its geolocation to pin it inside a map.
 * Version: 2.0
 * Author: Ximena Bolaños Cacho
 * 
 */

if ( !defined('ABSPATH'))
{
    die('Access forbidden');
}

require_once plugin_dir_path(__FILE__) . 'products-categories-query.php';
require_once plugin_dir_path(__FILE__) . 'ajax-handle.php';

function render_leaflet_map($atts) {
    // Extract shortcode attributes
    $atts = shortcode_atts(array(
        'zoom' => '5',
    ), $atts);

    // Generate map HTML
    ob_start();
    ?>
    <div id="mtoMap">
        <?php display_product_category_checkboxes(); ?>
        <div id="map">
            <div id="map-message" class="hide-div">
                <p class="loading-text">No se han encontrado piezas pertenecientes a esa categoría</p>
            </div>  
        </div>
        <div id="loading-screen" class="hide-div">
            <div class="spinner"></div>
            <p class="loading-text">Cargando</p> 
        </div>
        <div class="map-disclaimer">*Los marcadores en el mapa muestran el lugar de origen de nuestras piezas textiles. (Esta es una versión preliminar de pruebas).</div>
    </div>
    <script>
        // Leaflet map initialization
        let map = L.map('map',{
            minZoom: 4
        }).setView([0, 0], <?php echo $atts['zoom']; ?>);
        
        var bounds = L.latLngBounds([4.532866, -138.453531],[42.718561, -66.647219] );
        //Setting those coordinates as our boundaries
        map.setMaxBounds(bounds);
        //Stop the user from dragging the map out of bounds
        map.on('drag', function() {
            map.panInsideBounds(bounds, { animate: false });
        });

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',{

        }
        ).addTo(map);

        var markerCategoryGroups = {};
        var markersIDs = {};
        let marker;

        var totalClusterGroup = 
        L.markerClusterGroup({
            showCoverageOnHover: false,
        });

        var clusterBounds = L.latLngBounds();

        map.addLayer(totalClusterGroup);

    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('leaflet_map', 'render_leaflet_map');

function enqueue_leaflet_map_assets() {
    if (is_page() && has_shortcode(get_post()->post_content, 'leaflet_map')) {
        wp_enqueue_script('leaflet_js', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js', Array(), '1.9.3', null);
        wp_enqueue_style('leaflet_css', 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css', Array(), '1.9.3', null);
        wp_enqueue_script('leaflet_markercluster_js','https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', Array(),'1.4.1',null);
        wp_enqueue_style('leaflet_markercluster_css','https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css', Array(), '1.4.1', null);
        wp_enqueue_style('leaflet_markerclusterdefault_css','https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css', Array(), '1.4.1', null);
    }
}

function enqueue_custom_mtoMaps_assets(){
    if (is_page() && has_shortcode(get_post()->post_content, 'leaflet_map')) {
        $styles_dir = plugin_dir_url(__FILE__) . "assets/mtoMaps_styles.css";
        wp_enqueue_style('mtoMaps_css', $styles_dir, Array(), null, null);
    }
}


function enqueue_ajax_query(){
    if (is_page() && has_shortcode(get_post()->post_content, 'leaflet_map')){
        $js_dir = plugin_dir_url(__FILE__) . "includes";
        $ajax_query_dir = $js_dir . "/ajax-product-query.js";
        wp_enqueue_script('ajax_query_js', $ajax_query_dir , Array(), null, null);

        $ajax_nonce = wp_create_nonce('my_ajax_nonce');

        wp_localize_script( 'ajax_query_js', 'myAjax', array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce' => $ajax_nonce
        ));
    }
}

add_action('wp_enqueue_scripts', 'enqueue_leaflet_map_assets');
add_action('wp_enqueue_scripts', 'enqueue_custom_mtoMaps_assets');
add_action('wp_enqueue_scripts', 'enqueue_ajax_query');
 
?> 