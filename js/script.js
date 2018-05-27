'use strict';

// A constant is defined for the base URL for the API.
const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
// Here is the key for the API.
const apiKey = '297cffc414404f6bab72c3f16cc32346';
// Each number means a day of the week.
const weekdays = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb'
}

getForecast('Recife');

/* When the "search" button is clicked a function is called
 * with the "event" input to prevent Default.
 * A constant is defined with the city name in the input.
 * The function getForecast is called with the constant as input. 
 */
$('#search').click(function (event) {
    event.preventDefault();
    const newCity = $('#city').val();
    $('#city').val('');
    getForecast(newCity);

})

/* The function hides the content to display a loading icon.
 * Clears the "next-days" cards.
 * Uses the "city" input to complete the URL in ajax and access the API site.
 */
function getForecast(city) {
    loadCity();

    clearFields();

    /* Access the API site to get the forecast.
     * If succeed, display the content in the page by the "displayCity" function.
     * Defines constants for the today weather and the next days.
     */
    $.ajax({
        url: baseURL,
        data: {
            key: apiKey,
            city: city,
            lang: 'pt'
        },
        success: function (result) {
            displayCity();

            const forecast = result.data;
            const today = forecast[0];
            const nextDays = forecast.slice(1);

            $('#city-name').text(result.city_name);

            displayToday(today);
            displayNextDays(nextDays);
        },
        error: function (error) {
            const forecast = result.data;
        }
    });
}

/* Receive "today" as input as an array to set constants.
 * The setted constants are used to display the forecast in the page.
 */
function displayToday(today) {
    const temp = Math.round(today.temp);
    const wind = (today.wind_spd).toFixed(2);
    const humidity = today.rh;
    const weather = today.weather.description;
    const icon = today.weather.icon;
    const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

    $('#current-temperature').text(temp);
    $('#current-weather').text(weather);
    $('#current-wind').text(wind);
    $('#current-humidity').text(humidity);
    $('#weather-icon').attr('src', iconURL);
}

/* Receive "nextDays" as input as an array to set constants.
 * The setted constants are used to display the forecast for the next days
 * as cards below the "today" forecast.
 * A for-loop is used to display as many cards as days in the array with their
 * respective information.
 */
function displayNextDays(nextDays) {
    for (let i = 0; i < nextDays.length; i = i + 1) {
        const day = nextDays[i];

        const minTemp = Math.round(day.min_temp);
        const maxTemp = Math.round(day.max_temp);
        const date = new Date(day.valid_date);
        const weekday = weekdays[date.getUTCDay()]

        const card = $(`<div class="day-card">
                            <div class="date">${date.getUTCDate()}/${date.getUTCMonth() + 1}</div>
                            <div class="weekday">${weekday}</div>
                            <span class="max">${maxTemp}°</span>
                            <span class="min">${minTemp}°</span>
                        </div>`);
        card.appendTo('#next-days');

    }
}

// Clear the "next-days" field.
function clearFields() {
    $('#next-days').empty();
}

// Change the "display" property for the page content and the loading icon.
function loadCity() {
    $('#loader').css('display', '');
    $('#forecast').css('display', 'none');
}

// Change the "display" property for the page content and the loading icon.
function displayCity() {
    $('#loader').css('display', 'none');
    $('#forecast').css('display', '');

}