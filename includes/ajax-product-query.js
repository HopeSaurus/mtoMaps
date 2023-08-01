jQuery(document).ready(function($) {
    // Array to store the selected categories
    let selectedCategories = [];
    let products = [];
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
                        products = response.data;
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

    // First thing to do: Fetch everything and forget about ajax, Empty string will look for all products
    // This will initialize the response data and store it, response data is an array of objects, we will call them products.

    // Function to handle checkbox click events
    // Our logic will depend on the checkboxes state.
    function handleCheckboxClick() {
        // Clear the selected categories array
        selectedCategories = [];

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

        getProductsByCategories(selectedCategories);

        // We don't need to know which was added or removed now
        // We just need to loop through the products searching the ones that possess the categories selected.
        selectProducts();

    }

    handleCheckboxClick();

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
        noProductsMessage.classList.remove('hide-div');
    }
    
    function hideNoProducts(){
        const noProductsMessage = document.getElementById('map-message');
        if(!noProductsMessage.classList.contains('hide-div')){
            noProductsMessage.classList.add('hide-div');
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
        map.fitBounds(clusterBounds, {
            padding: [50,50]
        });
    }

    function closePopUps(){
        map.closePopup();
    }

    function selectProducts(){
        products.forEach(function(product){
            console.log('product info: ', product);
            product.categories.forEach(function(category){
                console.log('categories info: ',category);
            });
        });
    }

    function addMarkers(product){
        let latitude = product.latitude;
        let longitude = product.longitude;

        if(latitude && longitude ){

            marker = L.marker([latitude,longitude]);

            marker.bindPopup(`<div class="map__popup">
                                <a class="map__popup-linkarea" href="${product.link}"> 
                                    <img src="${product.thumbnail_url}" alt="${product.title}"></img>
                                    <div class="map__popup-title">${product.title}</div>
                                    <div class="map__popup-subtitle">${product.location}</div>
                                </a> 
                            </div>
                            `);

            marker.on('click', function(e) {
                let markerCoords = this.getLatLng();
                let currentZoom = map.getZoom();

                if(currentZoom>=17){
                    map.flyTo([markerCoords.lat ,markerCoords.lng], currentZoom, {duration: 0.5});
                }else{
                    map.flyTo([markerCoords.lat ,markerCoords.lng], 17,{animate: false});
                }
                this.openPopup();

            });
            categoryMarkers.addLayer(marker);

        }else{
            console.log(`Ignoring product with the id: ${product.ID}`);
        }
    }

});

