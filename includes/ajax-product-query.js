jQuery(document).ready(function($) {
    // Array to store the selected categories
    let selectedCategories = [];

    // Function to perform the Ajax request
    function getProductsByCategories() {
        var mapElement = document.getElementById('map');
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(function (checkbox) {
            checkbox.setAttribute('disabled', 'disabled');
        });
    
        mapElement.setAttribute('disabled', 'disabled');

        jQuery.ajax({
            url: myAjax.ajaxurl,
            method: 'POST',
            data: {
                action: 'fetch_products',
                categories: selectedCategories,
                nonce: myAjax.nonce
            },
            success: function(response){

                mapElement.removeAttribute('disabled');
                checkboxes.forEach(function (checkbox) {
                    checkbox.removeAttribute('disabled');
                })
                
                if(response.success){
                    console.log("Query succesful", response);

                    for(const category in response.data){
                        console.log(category);
                        console.log('should be accesing the products here',response.data[category]);
                    }
                }
                else{
                    console.log("No selected categories", response);
                }

            },
            error: function(xhr,status,error) {
                console.log('Error occurred during Ajax request.');
                mapElement.removeAttribute('disabled');
                checkboxes.forEach(function (checkbox) {
                    checkbox.removeAttribute('disabled');
                })
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
            var categoryName = $(this).data('category-slug');
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

