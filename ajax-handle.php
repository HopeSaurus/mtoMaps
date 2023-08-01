<?php

add_action('wp_ajax_fetch_products', 'fetch_products');
add_action('wp_ajax_nopriv_fetch_products', 'fetch_products');

function fetch_products(){

    $nonce = $_POST['nonce'];
    
    if (!wp_verify_nonce($nonce, 'my_ajax_nonce')) {
        wp_send_json_error('Invalid nonce.');
    }
    
    /*
    $categories = $_POST['categories'];

    $sanitized_categories = array();

    if(!empty($categories)){
        foreach ($categories as $category) {
            $sanitized_category = sanitize_text_field($category);
            if(term_exists($sanitized_category)){
                $sanitized_categories[] = $sanitized_category;
            }else{
                wp_send_json_error('FUCK YOU');
            }
        }
    }
    */
    $query_args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
    );

    /*
    if (!empty($sanitized_categories)) {
        $query_args['tax_query'] = array(
            array(
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => $sanitized_categories,
                'operator' => 'IN',
            ),
        );
    }
    */
    $query = new WP_Query($query_args);


    // Prepare the product data to send back in the Ajax response
    $products = array();
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product_id = get_the_ID();
            $thumbnail_id = get_post_thumbnail_id($product_id);
            //$categories = getCategoriesSlug($product_id);
            // Retrieve and store relevant product data
            $product_data = array(
                'ID' => $product_id,
                'title' => get_the_title(),
                //'categories' => $categories,
                'location' => get_post_meta($product_id, 'comunidad_nombre', true),
                'link' => get_the_permalink(),
                'thumbnail_url' => addslashes(wp_get_attachment_image_url($thumbnail_id, 'thumbnail')),
                'latitude' => get_post_meta($product_id, 'latitud', true),
                'longitude' => get_post_meta($product_id, 'longitud', true)
            );
            $products[] = $product_data;
        }
        wp_reset_postdata();
    }

    // Return the product data as a JSON response
    wp_send_json_success($products);
    die();
}


function getCategoriesSlug($product_id){
    $categories = get_the_terms($product_id, 'product_cat');
    $categories_slug = array();
    foreach($categories as $category){
        $categories_slug[] = $category->slug;
    }
    return $categories_slug;
}
?>