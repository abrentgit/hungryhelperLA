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
      entity_type: 'landmark',
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
}

function displayData(data) {
  const results = data.restaurants.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val('');
    getDataFromApi(query, displayData);
  });
}

$(watchSubmit);