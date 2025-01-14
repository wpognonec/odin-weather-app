export default function ForecastDay(data) {
  return `
  <div class="forecast-day">
      <div>${data.day}</div>
      <img src="/icons_color/${data.icon}.svg"></img>
      <div class="temps">
        <div>${data.tempmin}°</div>
        <div>${data.tempmax}°</div>
      </div>
    </div>
  </div>
`
}
