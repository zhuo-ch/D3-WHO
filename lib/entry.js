document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  job().then(data => {
    debugger
    data.listings.listing.forEach(el => root.append(el.title));
  });
});

function find_locations() {
  const api_key = 'e31133fc79147d1ff4c9e5495187cd2c';
  const met = 'aj.jobs.getLocations';
  const url = 'https://authenticjobs.com/api/?';

  return $.ajax({
    method:'GET',
    url: `${url}api_key=${api_key}&method=${met}&format=json`,
    dataType: 'jsonp',
  });
}
