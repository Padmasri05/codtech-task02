document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;

    // First, get the coordinates of the city using OpenStreetMap Nominatim API
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;

                // Now, get the weather data from Open-Meteo API using the coordinates
                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&current_weather=true`;

                return fetch(apiUrl);
            } else {
                throw new Error('City not found');
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.current_weather) {
                const weatherResult = `
                    <p><strong>City:</strong> ${city}</p>
                    <p><strong>Temperature:</strong> ${data.current_weather.temperature} °C</p>
                    <p><strong>Weather:</strong> ${data.current_weather.weathercode}</p>
                    <p><strong>Humidity:</strong> ${data.hourly.relative_humidity_2m[0]}%</p>
                    <p><strong>Wind Speed:</strong> ${data.current_weather.windspeed} m/s</p>
                `;
                document.getElementById('weatherResult').innerHTML = weatherResult;
            } else {
                document.getElementById('weatherResult').innerHTML = `<p>Weather data not available.</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p>Error: ${error.message}</p>`;
        });
});
