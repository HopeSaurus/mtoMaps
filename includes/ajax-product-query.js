jQuery(document).ready(function($) {
    // Array to store the selected categories
    let selectedCategories = [];

    // Function to perform the Ajax request
    function getProductsByCategories(categoriesToDisplay) {

        showLoading();
        hideNoProducts();

        jQuery.ajax({
            url: myAjax.ajaxurl,
            method: 'POST',
            data: {
                action: 'fetch_products',
                categories: categoriesToDisplay,
                nonce: myAjax.nonce
            },
            success: function(response){

                hideLoading();
                
                if(response.success){

                    if( Object.keys(response.data)<=0){
                        showNoProducts();
                    }
                    else{

                        categoriesToDisplay.forEach(function(category){
    
                            let categoryMarkers = L.markerClusterGroup({
                                showCoverageOnHover: false,
                            });
    
                            const products = response.data[category];
    
                            products.forEach(function(product){
    
                                let latitude = parseFloat(product.latitude) + (Math.random() * 0.00001);
                                let longitude = parseFloat(product.longitude) + (Math.random() * 0.00001);
    
                                if(latitude && longitude /*&& (markersIDs[product.ID]==undefined)*/){
    
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
                                        /*
                                        if(currentZoom>6){
                                            map.flyTo([markerCoords.lat ,markerCoords.lng], currentZoom, { duration: 0.5 });
                                        }else{
                                            map.flyTo([markerCoords.lat ,markerCoords.lng], 6, { duration: 0.5 });
                                        }*/
                                        this.openPopup();
                                    });
                                    /*
                                    marker.on('popupclose', function() {
                                        
                                        map.flyToBounds(clusterBounds, {
                                            duration: 1,
                                        });
                                    
                                    });
                                    */
                                    //markersIDs[product.ID] = 1;
                                    categoryMarkers.addLayer(marker);
    
                                }else{
                                    console.log(`Ignoring product with the id: ${product.ID}`);
                                    //markersIDs[product.ID] += 1;
                                }
                            });
                            markerCategoryGroups[category] = categoryMarkers;
                            totalClusterGroup.addLayer(markerCategoryGroups[category]);
                            updateBounds();
                            closePopUps();
                            reCenterMap();
                        });
                    }  
                }
                else{
                    location.reload();
                }

            },
            error: function(xhr,status,error) {
                console.error(error);
                hideLoading();
            }
        });
    }

    // Function to handle checkbox click events
    function handleCheckboxClick() {
        // Clear the selected categories array
        selectedCategories = [];
        //Check which categories are displayed or not 
        let categoriesDisplayedOnMap = Object.keys(markerCategoryGroups);
        let categoriesToRemove = [];
        let categoriesToDisplay = [];

        // Iterate through the checked checkboxes
        $('input[type="checkbox"]:checked').each(function() {
            // Get the category name from the data-category-name attribute
            let categoryName = $(this).data('category-slug');
            // Push the category name to the selectedCategories array
            selectedCategories.push(categoryName);
        });

        if(selectedCategories.length==0){

            $('input[type="checkbox"]:not(:checked)').each(function() {

                let categoryName = $(this).data('category-slug');
                
                selectedCategories.push(categoryName);

            });
        }

            categoriesToRemove = categoriesDisplayedOnMap.filter(function(category){

                return !selectedCategories.includes(category);

            });

            categoriesToDisplay = selectedCategories.filter(function(category){

                return !categoriesDisplayedOnMap.includes(category);

            });

        //Do not need to call ajax if theres only categories to remove 
        categoriesToRemove.length!=0? removeCategories(categoriesToRemove) : "" ;

        //Only call ajax if theres categories to add
        categoriesToDisplay.length!=0? getProductsByCategories(categoriesToDisplay) : "" ;

    }

    function cleanCheckboxes(){
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
        });
        handleCheckboxClick();
    }

    // Attach the handleCheckboxClick function to the checkbox change event
    $('input[type="checkbox"]').on('change', handleCheckboxClick);
    $('.clean-checkboxes').on('click', cleanCheckboxes);

    // On page load, call the Ajax function to retrieve all products by default
    //getProductsByCategories();

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
    
    function removeCategories(categoriesToRemove){
        showLoading();
        categoriesToRemove.forEach(function(category){
    
            totalClusterGroup.removeLayer(markerCategoryGroups[category]);
            //markerCategoryGroups[category].clearLayers();
            delete markerCategoryGroups[category];
        });
        hideLoading();
        updateBounds();
        closePopUps();
        reCenterMap();
    }
    
    function updateBounds(){
        if(Object.keys(markerCategoryGroups)!=0){
    
            clusterBounds = totalClusterGroup.getBounds();
    
        }else if (Object.keys(markerCategoryGroups)==0){
            
            clusterBounds = bounds; 

        }else{
            console.log("What f happened?");
        }
    }

    function reCenterMap(){
        map.flyToBounds(clusterBounds, {
            duration: 1,
        });
    }

    function closePopUps(){
        map.closePopup();
    }

    handleCheckboxClick();

});

