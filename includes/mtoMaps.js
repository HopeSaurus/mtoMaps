jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');
  const filterButton = document.querySelector(".categories-list__title");
  
  console.log(filterMenu);

  function centerMap(){
    if(clusterBounds){
      reCenterMap();
    }
  }

  function activateFilterMenu(){
    const filterMenu = document.querySelector(".categories-wrapper");
    alert("fuckyou");
    filterMenu.classList.add('activate-menu');
  }

  mapCenterButton.addEventListener('click', centerMap);
  filterButton.addEventListener('click', activateFilterMenu);
});