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
                    let categoriesToDisplay;
                    let categoriesToRemove;
                    let mapBounds;
                    let categoriesDisplayedOnMap = Object.keys(markerCategoryGroups);
                    let decision = categoriesDisplayedOnMap - selectedCategories.length;
                    //If theres more categories selected than displaying search for the ones that are missing 
                    if( decision < 0 ){

                        categoriesToDisplay = selectedCategories.filter(function(category){

                            return !categoriesDisplayedOnMap.includes(category);

                        });
                    
                        categoriesToDisplay.forEach(function(category){

                            console.log(category);
                            console.log('should be accesing the products here',response.data[category]);
    
                            let categoryMarkers = L.markerClusterGroup({
                                showCoverageOnHover: false,
                            });
    
                            const products = response.data[category];
    
                            products.forEach(function(product){
    
                                let latitud = product.latitud;
                                let longitud = product.longitud;
    
                                if(latitud && longitud){
    
                                    marker = L.marker([latitud,longitud]);
    
                                    marker.bindPopup(`<div class="map__popup">
                                                        <a class="map__popup-linkarea" href="${product.link}"> 
                                                            <h4 class="map__popup-title">${product.title}</h4> 
                                                            <img src="${product.thumbnail.url}" alt="${product.title}"></img> 
                                                        </a> 
                                                    </div>
                                                    `);
    
                                    marker.on('click', function(e) {
                                        let markerCoords = this.getLatLng();
                                        let currentZoom = map.getZoom();
                                        if(currentZoom>6){
                                            map.flyTo([markerCoords.lat + offset,markerCoords.lng], currentZoom, { duration: 0.5 });
                                        }else{
                                            map.flyTo([markerCoords.lat + offset,markerCoords.lng], 6, { duration: 0.5 });
                                        }
                                        this.openPopup();
                                    });
    
                                    categoryMarkers.addLayer(marker);
    
                                }
                            });
    
                            markerCategoryGroups[category] = categoryMarkers;
                            map.addLayer(markerCategoryGroups.category);
                        });


                    //If theres more categories displaying that selected, search for the ones to remove
                    }else if( decision > 0){

                        categoriesToRemove = categoriesDisplayedOnMap.filter(function(category){

                            return !selectedCategories.includes(category);

                        });

                        categoriesToRemove.forEach(function(category){

                            markerCategoryGroups.category.clearLayers();

                        });

                    }else{
                        console.log("You shouldnt be here");
                    }

                    mapBounds = L.latLngBounds();

                    for(cluster in markerCategoryGroups){
                        mapBounds.extend(markerCategoryGroups.getBounds());
                    }

                    map.flyToBounds(mapBounds, {
                        duration: 1,
                      });
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

