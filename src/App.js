import React, { useState,  useEffect } from 'react';
import axios from 'axios';
import './App.css';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [monitoredCities, setMonitoredCities] = useState([]);

  const API_KEY = 'acf8c07164e18c86ccdc6b8d468ce4b7';

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      setWeatherData(response.data);
      setCity(''); // Clear the city input field after successful fetch
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  const handleAddToDashboard = () => {
    if (weatherData) {
      const isCityAlreadyMonitored = monitoredCities.some(c => c.id === weatherData.id);
      if (!isCityAlreadyMonitored) {
        setMonitoredCities([...monitoredCities, { id: weatherData.id, name: weatherData.name }]);
      }
    }
  };

  useEffect(() => {
    const fetchMonitoredCitiesWeather = async () => {
      const promises = monitoredCities.map(async city => {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`);
          return { ...city, weatherData: response.data };
        } catch (error) {
          console.error('Error fetching weather data for', city.name, ':', error);
          return { ...city, weatherData: null };
        }
      });

      const updatedMonitoredCities = await Promise.all(promises);
      setMonitoredCities(updatedMonitoredCities);
    
    };

    fetchMonitoredCitiesWeather();
  }, [monitoredCities]); // Fetch weather data whenever monitoredCities list changes


  return (
  <div className="container">
    <h1 className="heading">Weather Dashboard</h1>
    <div className="inputContainer">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="input"
          />
        <button onClick={fetchWeatherData} className="button">Get Weather</button>
      </div>

      {weatherData && (
        <div className="weatherCard">
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <button onClick={handleAddToDashboard} className="addButton">Add to Dashboard</button>
        </div>
      )}

      <h2 className="subHeading">My Cities</h2>
      <ul className="cityList">
        {monitoredCities.map(city => (
          <li key={city.id} className="cityItem">
            <strong>{city.name}</strong>
            {city.weatherData ? (
              <div>
                <p>Temperature: {city.weatherData.main.temp}°C</p>
                <p>Weather: {city.weatherData.weather[0].description}</p>
                {/* Additional weather details can be displayed here */}
              </div>
            ) : (
              <p>Error fetching weather data</p>
            )}
            {/* Display detailed weather information here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeatherApp;