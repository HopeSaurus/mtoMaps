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

  document.addEventListener('click', function(event) {
    // Check if the click target is not a descendant of the menu element
    if (!filtermenu.contains(event.target) && filterMenu.classList.contains('activate-menu')) {
      // Click occurred outside of the menu, do something here (e.g., close the menu, hide a dropdown, etc.)
      filterMenu.classList.remove('activate-menu');
    }
  });
});