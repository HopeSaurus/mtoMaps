<?php
// Function to display product category checkboxes
function display_product_category_checkboxes() {
    
    $filter_img_url = plugins_url('/',__FILE__) . '/assets/filtro.png';

    $args = array(
        'taxonomy' => 'product_cat',
        'hide_empty' => true,
    );

    $categories = get_terms($args);

    if (!empty($categories)) {
        echo '<div class="categories-container">';
        echo '<div class="categories-list__title"><img src=' . $filter_img_url . '></img>Filtrar</div>';
        echo '<ul class="categories-list">';
        foreach ($categories as $category) {
            echo '<li><label><input type="checkbox" name="product_category"  data-category-slug="' . $category->slug . '"> ' . $category->name . '</label></li>';
        }
        echo '<li><label><div class="clean-checkboxes" >Limpiar</div></label></li>';
        echo '</ul>';
        echo '</div>';
    } else {
        echo 'No categories found.';
    }
}

add_shortcode('product_categories_listing', 'display_product_category_checkboxes');

?>