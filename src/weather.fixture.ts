import { WeatherObservation } from './csvAdapter'

export const forecasts = (station: string) => [
  {
    name: 'Reykjavík',
    atime: '2023-11-23 06:00:00',
    err: '',
    link: `http://en.vedur.is/weather/forecasts/areas/reykjavik/#group=100&station=${station}`,
    forecast: [{ ftime: '2023-11-23 07:00:00', F: '3' }],
    id: station,
    valid: '1',
  },
]

export const observation: WeatherObservation = {
  id: '422',
  name: 'Reykjavík',
  date: '2023-11-23',
  time: '06:00:00',
  temperature: '3',
  pressure: '1000',
  wind_direction: 'NE',
}
