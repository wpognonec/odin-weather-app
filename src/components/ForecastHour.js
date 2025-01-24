export default function ForecastHour(data) {
  return `
    <tr>
      <td>${formatHours(data.datetimeEpoch)}</td>
      <td><img class="medium-icon" src="/icons_color/${
        data.icon
      }.svg"></img></td>
      <td>
        <div class="temp-small">
          <div>${data.temp}</div>
          <span class="unit-small">°F</span>
        </div>
      </td>
      <td>
          <div class="flex">
            <img class="small-icon" src="drop.svg"></img>${data.precipprob}%
          </div>
      </td>
      <td>
          <div class="flex">
            <img class="small-icon" src="wind.svg"></img>${data.windspeed} mph
          </div>
      </td>
    </tr>
`
}

function formatHours(timestamp) {
  let date = new Date(timestamp * 1000)
  let hour = date.getHours()
  let period = hour >= 12 ? "PM" : "AM"
  hour = hour % 12
  hour = hour ? hour : 12
  return hour + " " + period
}
