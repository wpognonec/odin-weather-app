import "./reset.css"
import "./style.css"
import data from "./data.json"
import Today from "./components/Today"
import ForecastDay from "./components/forecastDay"

const apiKey = import.meta.env.VITE_API_KEY
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const input = document.querySelector("#locationInput")
const location = document.querySelector("#location")
const description = document.querySelector("#description")
const currentTemp = document.querySelector("#currentTemp")
const feelsLike = document.querySelector("#feelsLike")
const humidity = document.querySelector("#humidity")
const forecast = document.querySelector("#forecast")

async function getWeather(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}`
  try {
    // const response = await fetch(url)
    // if (!response.ok) {
    //   throw new Error(`Response status: ${response.status}`)
    // }

    // const weatherData = await response.json()
    const weatherData = data
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
  // feelsLike.textContent = weatherData.currentConditions.feelslike
  // humidity.textContent = weatherData.currentConditions.humidity
  // forecast.textContent =
  //   weatherData.days[0].tempmax + " " + weatherData.days[0].tempmin
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather(input.value).then(updateUI)
    // updateUI(data)
  }
})

// const date = new Date(1736402400 * 1000)
// console.log(days[date.getUTCDay()])
