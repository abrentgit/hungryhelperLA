'use strict';

function getDataFromApi(searchTerm, callback) {
  const settings = {
    url: 'https://developers.zomato.com/api/v2.1/search',
    data: {
      q: `${searchTerm}`,
      start: 1,
      count: 5,
      lat: 34.0432464,
      lon: -118.2675059,
      entity_type: 'group',
    },
    dataType: 'json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('user-key', '94a6b2c4a8b7bb27928d04d5dd18b7b2');
    },
    type: 'GET',
    success: callback,
  };

  $.ajax(settings);
}

function renderResult(result) {
  return `
    <h2><b>${result.restaurant.name}</b></h2>
    <p>${result.restaurant.cuisines}</p>
    <p>${result.restaurant.location.address}</p>
    <p>Rating: ${result.restaurant.user_rating.rating_text}</p>
    <p>${result.restaurant.user_rating.aggregate_rating} out of 5</p>
    <a role="link" href="${result.restaurant.menu_url}" target="_blank">Menu</a>
  `;
  $('.js-search-results').prop('hidden', false);
}

function renderNoResults(result) {
  $('.js-search-results').html('<p>Sorry, there are no results for that search.</p>');
}

function displayData(data) {
  const $searchResults = $('.js-search-results');
  const results = data.restaurants.map((item, index) => renderResult(item));
  if (data.results_found === 0) {
    renderNoResults();
  } else {
    $searchResults.prop('hidden', false);
    $searchResults.html(results);
  }
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(this).find('.js-query'); //find the input in form
    const query = queryTarget.val(); //get that query value
    queryTarget.val(''); //clear your search
    getDataFromApi(query, displayData);
  });
}

$(watchSubmit);
