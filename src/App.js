import { useState, useEffect } from 'react'
import Weather from './app-component/weather.component'
import Axios from 'axios'
import ClipLoader from 'react-spinners/ClipLoader'
import './App.css'
import 'weather-icons/css/weather-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from './app-component/form.component'
const API_KEY = '00a925b4430bb1a7e951571ccdc1d076'

function App() {
  const [city, setCity] = useState(undefined)
  const [country, setCountry] = useState(undefined)
  const [icon, setIcon] = useState(undefined)
  const [main, setMain] = useState(undefined)
  const [celcius, setCelcuis] = useState(undefined)
  const [temp_max, setTempMax] = useState(undefined)
  const [temp_min, setTempMin] = useState(undefined)
  const [description, setDescription] = useState(undefined)
  const [weatherIcon, setWeatherIcon] = useState(undefined)
  const [loading, setloading] = useState(false)
  const [error, setError] = useState(false)

  const calculateCel = (temp) => (!isNaN(temp) ? Math.floor(temp - 273.15) : '')
  const wicon = {
    Thunderstorm: 'wi-thunderstorm',
    Drizzle: 'wi-sleet',
    Rain: 'wi-storm-showers',
    Snow: 'wi-snow',
    Amosphere: 'wi-fog',
    Clear: 'wi-day-sunny',
    Clouds: 'wi-day-fog',
  }
  const getWeatherIcon = (reangeID) => {
    switch (true) {
      case reangeID >= 200 && reangeID <= 232:
        setWeatherIcon(wicon.Thunderstorm)
        break
      case reangeID >= 300 && reangeID <= 321:
        setWeatherIcon(wicon.Drizzle)
        break
      case reangeID >= 500 && reangeID <= 531:
        setWeatherIcon(wicon.Rain)
        break
      case reangeID > 600 && reangeID <= 622:
        setWeatherIcon(wicon.Snow)
        break
      case reangeID > 700 && reangeID <= 781:
        setWeatherIcon(wicon.Atmosphere)
        break
      case reangeID > 800 && reangeID <= 804:
        setWeatherIcon(wicon.Clouds)
        break
      case reangeID === 800:
        setWeatherIcon(wicon.Clear)
        break
      default:
        setWeatherIcon(wicon.Clouds)
    }
  }
  const loadWeather = async (e) => {
    e.preventDefault()
    const city = e.target.elements.city.value
    const country = e.target.elements.country.value

    if (city && country) {
      setloading(true)
      Axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`,
      )
        .then((response) => {
          console.log(response.data)
          setCity(`${response.data.name},${response.data.sys.country}`)
          setTempMax(response.data.main.temp_max)
          setTempMin(response.data.main.temp_min)
          setCountry(response.data.sys.country)
          setCelcuis(response.data.main.temp)
          setDescription(response.data.weather[0].description)
          getWeatherIcon(response.data.weather[0].id)
          setloading(false)
        }, [])
        .catch((err) => console.log(err))
    } else {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    }
  }
  function err() {
    return (
      <div className="alert alert-danger mx-5" role="alert">
        please Enter City and Country
      </div>
    )
  }
  return (
    <div className="App">
      <Form loadWeather={loadWeather} error={error} getErr={err} />
      <ClipLoader loading={loading} size={150} />
      <Weather
        city={city}
        country={country}
        temp_max={calculateCel(temp_max)}
        temp_min={calculateCel(temp_min)}
        celcius={calculateCel(celcius)}
        description={description}
        weatherIcon={weatherIcon}
      />
    </div>
  )
}

export default App
