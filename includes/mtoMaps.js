jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');
  const filterButton = document.getElementById('filter-button');
  const filterMenu = document.querySelector('.categories-wrapper');

  function centerMap(){
    if(clusterBounds){
      reCenterMap();
    }
  }

  function activateFilterMenu(){
    if(filterMenu.classList.contains('activate-menu')){
      filterMenu.classList.remove('activate-menu');
    }else filterMenu.classList.add('activate-menu');
  }

  mapCenterButton.addEventListener('click', centerMap);
  filterButton.addEventListener('click', activateFilterMenu);

 
});