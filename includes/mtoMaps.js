jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');
  const filterButton = document.getElementById('filter-button');

  function centerMap(){
    if(clusterBounds){
      reCenterMap();
    }
  }

  function activateFilterMenu(){
    alert('henlo');
  }

  mapCenterButton.addEventListener('click', centerMap);
  filterButton.addEventListener('click', activateFilterMenu);
});