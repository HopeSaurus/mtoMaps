jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');
  const filterButton = document.querySelector('categories-list__title');
  const filterMenu = document.querySelectorAll('categories-wrapper');

  function centerMap(){
    if(clusterBounds){
      reCenterMap();
    }
  }

  function activateFilterMenu(){
    filterMenu.classList.add('activate-menu');
  }

  mapCenterButton.addEventListener('click', centerMap);
  filterButton.addEventListener('click', activateFilterMenu);
});