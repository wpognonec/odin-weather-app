export default function Today(data) {
  return `
  <div class="today">
    <div class="temp">
      <img src="/icons_color/${data.icon}.svg"></img>
      <div>${data.temp}</div>
      <span class="unit">°F</span>
    </div>
    <div class="conditions">
      <div class="precip">Precipitation: ${data.precipprob}%</div>
      <div class="humid">Humidity: ${data.humidity}%</div>
      <div class="wind">Wind: ${data.windspeed} mph</div>
    </div>
  </div>
`
}
