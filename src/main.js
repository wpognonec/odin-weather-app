import "./reset.css"
import "./style.css"
import axios from "axios"
import data from "./data.json"
import Today from "./components/Today"
import ForecastDay from "./components/ForecastDay"
import ForecastHour from "./components/ForecastHour"

const apiKey = import.meta.env.VITE_API_KEY
const omwKey = import.meta.env.VITE_OWM_KEY

const input = document.querySelector("#location-input")
const location = document.querySelector("#location")
const description = document.querySelector("#description")
const currentTemp = document.querySelector("#current-temp")
const forecast = document.querySelector("#forecast")
const forecastHour = document.querySelector("#forecast-hour")

async function getCityName(geolocation) {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${geolocation.latitude}&lon=${geolocation.longitude}&limit=1&appid=${omwKey}`

  try {
    const data = await axios.get(url).then((res) => res.data)
    const location = `${data[0].name}, ${data[0].state}`
    return location
  } catch (error) {
    console.error(error.message)
  }
}

async function getGeolocation() {
  try {
    const position = await getCurrentPosition()
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    return { latitude, longitude }
  } catch (error) {
    console.error("Error getting geolocation:", error)
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

async function getWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`
  try {
    const weatherData = await axios.get(url).then((res) => res.data)
    return {
      current: parseCurrentWeather(weatherData),
      daily: parseDailyWeather(weatherData),
      hourly: parseHourlyWeather(weatherData),
    }
  } catch (error) {
    console.error(error.message)
  }
}

function parseCurrentWeather({
  currentConditions,
  resolvedAddress,
  description,
}) {
  const { icon, temp, precipprob, humidity, windspeed, conditions } =
    currentConditions
  return {
    icon,
    temp: Math.round(temp),
    precipprob: Math.round(precipprob),
    humidity: Math.round(humidity),
    windspeed: Math.round(windspeed),
    resolvedAddress,
    description,
    conditions,
  }
}

function parseDailyWeather({ days }) {
  return days
    .map((day) => {
      const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
      })
      const { datetimeEpoch, tempmax, tempmin, icon } = day
      return {
        day: DAY_FORMATTER.format(datetimeEpoch * 1000),
        tempmax: Math.round(tempmax),
        tempmin: Math.round(tempmin),
        icon,
      }
    })
    .slice(0, 8)
}

function parseHourlyWeather({ currentConditions, days }) {
  const hours = days[0]?.hours
  const mapped = hours
    .map((hour) => {
      const { datetimeEpoch, icon, temp, feelslike, windspeed, precipprob } =
        hour
      return {
        datetimeEpoch,
        icon,
        temp: Math.round(temp),
        feelslike: Math.round(feelslike),
        windspeed: Math.round(windspeed),
        precipprob: Math.round(precipprob),
      }
    })
    .filter(
      ({ datetimeEpoch }) => datetimeEpoch >= currentConditions.datetimeEpoch
    )
  return mapped
}

function updateUI({ current, daily, hourly }) {
  console.log("current", current)
  console.log("daily", daily)
  console.log("hourly", hourly)

  location.textContent = current.resolvedAddress
  description.textContent = current.description
  currentTemp.innerHTML = Today(current)
  forecast.innerHTML = daily.map((day) => ForecastDay(day)).join("")
  forecastHour.innerHTML = hourly.map((hour) => ForecastHour(hour)).join("")
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(input.value).then(updateUI)
  }
})

try {
  const geolocation = await getGeolocation()
  const city = await getCityName(geolocation)
  getWeather(city).then(updateUI)
} catch (error) {
  console.log(error)
}
