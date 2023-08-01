jQuery(document).ready(function($) {
  const mapCenterButton = document.getElementById('map-center-button');
  const filterButton = document.getElementById('filter-button');
  const filterMenu = document.querySelector('.categories-wrapper');

  function centerMap(){
    if(clusterBounds){
      map.fitBounds(clusterBounds, {
        padding: [50,50]
    });
    }
  }

  function activateFilterMenu(){
    if(filterMenu.classList.contains('activate-menu')){
      filterMenu.classList.remove('activate-menu');
      document.removeEventListener('click', clickOutsideFilterMenu);
    }else {
      filterMenu.classList.add('activate-menu');
      document.addEventListener('click', clickOutsideFilterMenu);
    }
  }

  function clickOutsideFilterMenu(event) {
    if (!filterMenu.contains(event.target) && event.target !== filterButton && filterMenu.classList.contains('activate-menu')) {
      filterMenu.classList.remove('activate-menu');
      document.removeEventListener('click', clickOutsideFilterMenu);
    }
  }

  mapCenterButton.addEventListener('click', centerMap);
  filterButton.addEventListener('click', activateFilterMenu);

 
});