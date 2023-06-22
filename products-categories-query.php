<?php
// Function to display product category checkboxes
function display_product_category_checkboxes() {
    $args = array(
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
    );

    $categories = get_terms($args);

    if (!empty($categories)) {
        echo '<h4 class="categories-list__title">Filtrar por:</h4>';
        echo '<ul class="categories-list">';
        foreach ($categories as $category) {
            echo '<li><label><input type="checkbox" name="product_category" value="' . $category->slug . '" data-category-name="' . esc_attr($category->name) . '"> ' . $category->name . '</label></li>';
        }
        echo '</ul>';
    } else {
        echo 'No categories found.';
    }
}

add_shortcode('product_categories_listing', 'display_product_category_checkboxes');

?>