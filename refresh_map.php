<?php
function refresh_map(){
    if (isset($_POST['categories']) && is_array($_POST['categories'])) {
        $categories = $_POST['categories'];
        $query_args = array(
            'post_type' => 'product',
            'tax_query' => array(
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'slug',
                    'terms' => $categories,
                    'operator' => 'IN',
                ),
            ),
        );
        $products = new WP_Query($query_args);
        if ($products->have_posts()) :
            while ($products->have_posts()) : $products->the_post();
                $product_id = get_the_ID();
                $product_latitude = get_post_meta($product_id, 'latitud', true);
                $product_longitude = get_post_meta($product_id, 'longitud', true);
                $product_permalink = get_permalink();
                $product_title = get_the_title();
                $thumbnail_id = get_post_thumbnail_id($product_id);
                $product_image = addslashes(wp_get_attachment_image_url($thumbnail_id, 'thumbnail'));
                if (!empty($product_latitude) && !empty($product_longitude)) {
                    echo "marker = L.marker([" . $product_latitude . ", " . $product_longitude . "]);\n";
                    echo "marker.bindPopup('<div class=\"map__popup\"> \
                                                <a class=\"map__popup-linkarea\" href=\"" . $product_permalink . "\"> \
                                                    <h4 class=\"map__popup-title\">". $product_title . "</h4> \
                                                    <img src=\"" . $product_image . "\" alt=\"Foto de la pieza textil\"></img> \
                                                </a> \
                                            </div>');\n";
                    echo "marker.on('click', function(e) {
                        let markerCoords = this.getLatLng();
                        let currentZoom = map.getZoom();
                        if(currentZoom>6){
                            map.flyTo([markerCoords.lat + offset,markerCoords.lng], currentZoom, { duration: 0.5 });
                        }else{
                            map.flyTo([markerCoords.lat + offset,markerCoords.lng], 6, { duration: 0.5 });
                        }
                        this.openPopup();
                    });\n";
                    
                    echo "markers.addLayer(marker);\n";
                }
            endwhile;
            wp_reset_postdata();
        endif;

        echo "
        map.addLayer(markers);
        
        let clusterBounds = markers.getBounds();
        if(clusterBounds)
            map.fitBounds(clusterBounds);";
    }
}
?>