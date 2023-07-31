<?php
// Function to display product category checkboxes
function display_product_category_checkboxes() {

    $filter_img_url = plugins_url('/',__FILE__) . '/assets/filtro.png';

    $parent_categories = get_parent_categories();


    if(!empty($parent_categories)){
        echo '<div class="categories-container">';
        echo '<div class="categories-list__title"><img src=' . $filter_img_url . '></img>Filtrar</div>';
        foreach($parent_categories as $parent_category){
            echo'<div class="categories-container--parent-category">'. $parent_category->name .':'; 
            $args = array(
                'taxonomy' => 'product_cat',
                'parent' => $parent_category->term_id,
                'hide_empty' => 1, 
            );
 
            $subcategories = get_terms($args);

            if(!empty($subcategories)){
                echo '<ul class="subcategories-list">';
                foreach($subcategories as $subcategory){
                    echo '<li><label><input type="checkbox" name="product_category"  data-category-slug="' . $subcategory->slug . '"> ' . $subcategory->name . '</label></li>';
                }
                if($parent_category === array_key_last($parent_categories)){
                    echo '<li class="subcategories-list__search-controls">';
                    echo '<label><div class="clean-checkboxes" >Limpiar</div></label>';
                    echo '<label><div class="search-categories" >Buscar</div></label>';
                    echo '</li>';
                }
                echo '</ul>';
                echo '</div>';
            }
        }
        echo '</div>';
    }

}

add_shortcode('product_categories_listing', 'display_product_category_checkboxes');

function get_parent_categories(){
    $args = array(
        'taxonomy' => 'product_cat',
        'parent' => 0, // Set to 0 to get only top-level parent categories
        'hide_empty' => 1, // Set to 1 to exclude parent categories with no products assigned
    );

    $parent_categories = get_terms($args);

    return $parent_categories;
    
}

?>