<?php

function fetch_products(){
    if (isset($_POST['categories']) && is_array($_POST['categories'])) {
        
        $categories = $_POST['categories'];
    
        $query_args = array(
            'post_type' => 'product',
        );

        if (!empty($categories)) {
            $query_args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'slug',
                    'terms' => $categories,
                    'operator' => 'IN',
                ),
            );
        }

        $query = new WP_Query($query_args);

        // Prepare the product data to send back in the Ajax response
        $products = array();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product_id = get_the_ID();
                $thumbnail_id = get_post_thumbnail_id($product_id);
                // Retrieve and store relevant product data
                $product_data = array(
                    'title' => get_the_title(),
                    'link' => get_the_permalink(),
                    'thumbnail_url' => addslashes(wp_get_attachment_image_url($thumbnail_id, 'thumbnail')),
                    'latitude' => get_post_meta($product_id, 'latitud', true),
                    'longitude' => $product_longitude = get_post_meta($product_id, 'longitud', true)
                );
                $products[] = $product_data;
            }
            wp_reset_postdata();
        }

        // Return the product data as a JSON response
        wp_send_json_success($products);
    } else {
        wp_send_json_error('Invalid request');
    }
    die();
}

add_action('wp_ajax_fetch_products', 'fetch_products');
add_action('wp_ajax_nopriv_fetch_products', 'fetch_products');

?>