jQuery(document).ready(function($) {
    // Array to store the selected categories
    var selectedCategories = [];

    // Function to perform the Ajax request
    function getProductsByCategories() {
        jQuery.ajax({
            url: myAjax.ajaxurl,
            method: 'POST',
            data: {
                action: 'fetch_products',
                categories: selectedCategories
            },
            success: function(response) {
                // Handle the response and update the products display
                // Example: Update a specific element with the retrieved products
            },
            error: function(xhr,status,error) {
                console.log('Error occurred during Ajax request.');
            }
        });
    }

    // Function to handle checkbox click events
    function handleCheckboxClick() {
        // Clear the selected categories array
        selectedCategories = [];

        // Iterate through the checked checkboxes
        $('input[type="checkbox"]:checked').each(function() {
            // Get the category name from the data-category-name attribute
            var categoryName = $(this).data('category-name');
            // Push the category name to the selectedCategories array
            selectedCategories.push(categoryName);
            console.log(selectedCategories);
        });

        // Call the Ajax function to retrieve the products based on selected categories
        getProductsByCategories();
    }

    // Attach the handleCheckboxClick function to the checkbox change event
    $('input[type="checkbox"]').on('change', handleCheckboxClick);

    // On page load, call the Ajax function to retrieve all products by default
    getProductsByCategories();
});