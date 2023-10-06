jQuery(document).ready(function($) {
    // Array to store the selected categories
    let selectedCategories = {};
    var products = [];
    // Function to perform the Ajax request
    function getProductsByCategories() {

        showLoading();
        hideNoProducts();

        jQuery.ajax({
            url: myAjax.ajaxurl,
            method: 'POST',
            data: {
                action: 'fetch_products',
                categories: [],
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
                        handleCheckboxClick();
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
    getProductsByCategories();
    // Function to handle checkbox click events
    // Our logic will depend on the checkboxes state.

    function handleCheckboxClick() {
        //init selected categories
        parentCategories.forEach(function(category){
            selectedCategories[category] = [];
        });
        let checkboxes;
        // Clear the selected categories array
        parentCategories.forEach(function(category){
            checkboxes = document.querySelectorAll(`.${category}`);
            checkboxes.forEach(checkbox=>{
                if(checkbox.checked){
                    selectedCategories[category].push(checkbox.dataset.categorySlug);
                }
            });
            if(selectedCategories[category].length === 0){
                checkboxes.forEach(checkbox=>{
                    selectedCategories[category].push(checkbox.dataset.categorySlug);
                });
            }
        });

        filterProducts();
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
     
    function updateBounds(){
        if(Object.keys(selectedCategories)!=0){
    
            clusterBounds = totalClusterGroup.getBounds();
    
        }else if (Object.keys(selectedCategories)==0){
            
            clusterBounds = bounds; 

        }else{
            console.log("What f happened?");
        }
    }

    function reCenterMap(){
        map.fitBounds(clusterBounds, {
            padding: [50,50],
            maxZoom: 10
        });
    }

    function closePopUps(){
        map.closePopup();
    }

    function filterProducts(){
        let markersToAdd = [];
        let matches=[];
        let acc;

        if(clusterGroupPointer){
            totalClusterGroup.removeLayer(clusterGroupPointer);
        }
        hideNoProducts();

        products.forEach(function(product){
            matches = [];
            product.categories.forEach(function(category){
                acc = 0;
                for (const parentCategory in selectedCategories){
                    if(selectedCategories[parentCategory].includes(category)){
                        acc++;
                    }
                }
                matches.push(acc);
            });
            if(!matches.includes(0)){
                markersToAdd.push(product);
            }else{
                //console.log("marker not added",product.ID,product.categories);
            }
        });

        if(markersToAdd.length === 0){
            showNoProducts();
        }else{
            addMarkers(markersToAdd);
        }
        updateBounds();
        reCenterMap();
    }

    function addMarkers(products){

        let markerCluster = 
        L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyDistanceMultiplier: 0.5,
        });

        products.forEach(function(product){

            let latitude = product.latitude.replace('\'','');
            let longitude = product.longitude.replace('\'','');

            if(latitude && longitude ){

                marker = L.marker([latitude,longitude], { icon: customIcon });

                if(product.stock === 'instock'){
                    marker.bindPopup(`<div class="map__popup">
                                        <a class="map__popup-linkarea" href="${product.link}"> 
                                            <img src="${product.thumbnail_url}" alt="${product.title}"></img>
                                            <div class="map__popup-title">${product.title}</div>
                                            <div class="map__popup-subtitle">${product.location}</div>
                                        </a> 
                                    </div>
                                    `);
                }else{
                    marker.bindPopup(`<div class="map__popup">
                                    <a class="map__popup-linkarea" href="${product.link}"> 
                                        <img src="${product.thumbnail_url}" alt="${product.title}">
                                        <span class="out-of-stock-label">Vendido</span>
                                        <div class="map__popup-title">${product.title}</div>
                                        <div class="map__popup-subtitle">${product.location}</div>
                                    </a> 
                                </div>
                                `);
                }
                marker.on('click', function(e) {
                    let markerCoords = this.getLatLng();
                    let currentZoom = map.getZoom();

                    if(currentZoom>=17){
                        map.flyTo([markerCoords.lat ,markerCoords.lng], currentZoom, {duration: 0.5});
                    }else{
                        //map.flyTo([markerCoords.lat ,markerCoords.lng], 17,{animate: false});
                    }
                    this.openPopup();

                });
                markerCluster.addLayer(marker);

            }else{
                console.log(`Ignoring product with the id: ${product.ID}`);
            }
        });
        clusterGroupPointer = markerCluster;
        totalClusterGroup.addLayer(clusterGroupPointer);
    }

});

