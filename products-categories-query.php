<?php
// Function to display product category checkboxes
function display_product_category_checkboxes() {
    $args = array(
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
    );

    $categories = get_terms($args);

    if (!empty($categories)) {
        echo '<div class="categories-container">';
        echo '<h4 class="categories-list__title">Filtrar por:</h4>';
        echo '<ul class="categories-list">';
        foreach ($categories as $category) {
            echo '<li><label><input type="checkbox" name="product_category"  data-category-slug="' . $category->slug . '"> ' . $category->name . '</label></li>';
        }
        echo '</ul>';
        echo '</div>';
    } else {
        echo 'No categories found.';
    }
}

add_shortcode('product_categories_listing', 'display_product_category_checkboxes');

?>