//TODO:
//BY DEFAULT SHOULD BE SHOWING EVERY CATEGORY
//REMOVE CONSOLE LOGS

jQuery(document).ready(function($) {
    // Array to store the selected categories
    let selectedCategories = [];

    // Function to perform the Ajax request
    function getProductsByCategories() {

        showLoading();
        hideNoProducts();

        jQuery.ajax({
            url: myAjax.ajaxurl,
            method: 'POST',
            data: {
                action: 'fetch_products',
                categories: selectedCategories,
                nonce: myAjax.nonce
            },
            success: function(response){

                hideLoading();
                
                if(response.success){
                    console.log("Query succesful", response);
                    let categoriesToDisplay;
                    let categoriesToRemove;
                    let categoriesDisplayedOnMap = Object.keys(markerCategoryGroups);
                    let decision = categoriesDisplayedOnMap.length - selectedCategories.length;
                    clusterBounds = L.latLngBounds();

                    //If theres no category selected or there are no items belonging to that category return
                    if(decision == 0 ) return;
                    //If theres more categories selected than displaying search for the ones that are missing 
                    else if( decision < 0 ){

                        //If theres a category to display but theres no products belonging to that category display a message window
                        if( Object.keys(response.data)<=0){
                            showNoProducts();
                        }
                        else{
                            categoriesToDisplay = selectedCategories.filter(function(category){

                                return !categoriesDisplayedOnMap.includes(category);

                            });
                        
                            console.log("These are the categories to display", categoriesToDisplay);

                            categoriesToDisplay.forEach(function(category){

                                console.log(category);
                                console.log('should be accesing the products here',response.data[category]);
        
                                let categoryMarkers = L.markerClusterGroup({
                                    showCoverageOnHover: false,
                                });
        
                                const products = response.data[category];

                                console.log("These are the products array", products);
        
                                products.forEach(function(product){
        
                                    let latitude = product.latitude;
                                    let longitude = product.longitude;
        
                                    if(latitude && longitude){
        
                                        marker = L.marker([latitude,longitude]);
        
                                        marker.bindPopup(`<div class="map__popup">
                                                            <a class="map__popup-linkarea" href="${product.link}"> 
                                                                <h4 class="map__popup-title">${product.title}</h4> 
                                                                <img src="${product.thumbnail_url}" alt="${product.title}"></img> 
                                                            </a> 
                                                        </div>
                                                        `);
        
                                        marker.on('click', function(e) {
                                            let markerCoords = this.getLatLng();
                                            let currentZoom = map.getZoom();
                                            if(currentZoom>6){
                                                map.flyTo([markerCoords.lat ,markerCoords.lng], currentZoom, { duration: 0.5 });
                                            }else{
                                                map.flyTo([markerCoords.lat ,markerCoords.lng], 6, { duration: 0.5 });
                                            }
                                            this.openPopup();
                                        });

                                        marker.on('popupclose', function() {
                                            
                                            map.flyToBounds(clusterBounds, {
                                                duration: 1,
                                            });
                                            
                                        });
        
                                        categoryMarkers.addLayer(marker);
                                    
        
                                    }else{
                                        console.log(`Ignoring product with the id: ${product.ID}`);
                                    }
                                });
                                console.log(categoryMarkers);
                                markerCategoryGroups[category] = categoryMarkers;
                                totalClusterGroup.addLayer(markerCategoryGroups[category]);
                                //map.addLayer(markerCategoryGroups[category]);
                            });
                        }
                    //If theres more categories displaying that selected, search for the ones to remove
                    }else if( decision > 0){

                        categoriesToRemove = categoriesDisplayedOnMap.filter(function(category){

                            return !selectedCategories.includes(category);

                        });

                        categoriesToRemove.forEach(function(category){

                            totalClusterGroup.removeLayer(markerCategoryGroups[category]);
                            //markerCategoryGroups[category].clearLayers();
                            delete markerCategoryGroups[category];
                            console.log("This should delete the unchecked categories",markerCategoryGroups);
                        });

                    }
                    //This shouldnt ever happen
                    else
                    {
                        console.log("No categories selected nor displaying");
                    }


                    console.log("This is the cluster object", markerCategoryGroups);
                    
                    if(Object.keys(markerCategoryGroups)!=0){

                        clusterBounds = totalClusterGroup.getBounds();

                        map.flyToBounds(clusterBounds, {
                            duration: 1,
                        });

                    }else if (Object.keys(markerCategoryGroups)==0){

                        map.flyToBounds(bounds, {
                            duration: 1,
                        });

                    }else{
                        console.log("What f happened?");
                    }
                }
                else{
                    console.log("Don't try dirty things");
                    location.reload();
                }

            },
            error: function(xhr,status,error) {
                console.log('Error occurred during Ajax request.');
                hideLoading();

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
        });

        console.log(selectedCategories);
        // Call the Ajax function to retrieve the products based on selected categories
        getProductsByCategories();
    }

    // Attach the handleCheckboxClick function to the checkbox change event
    $('input[type="checkbox"]').on('change', handleCheckboxClick);
    $('.clean-checkboxes').on('click', cleanCheckboxes);

    // On page load, call the Ajax function to retrieve all products by default
    getProductsByCategories();
});

function showLoading(){
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hide-div');
}

function hideLoading(){
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hide-div');
}

function showNoProducts(){
    const noProductsMessage = document.getElementById('map-message');
    noProductsMessage.classList.remove('hide-div')
}

function hideNoProducts(){
    const noProductsMessage = document.getElementById('map-message');
    if(!noProductsMessage.classList.contains('hide-div')){
        noProductsMessage.classList.add('hide-div')
    }
}

function cleanCheckboxes(){
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
    });
    handleCheckboxClick();
}