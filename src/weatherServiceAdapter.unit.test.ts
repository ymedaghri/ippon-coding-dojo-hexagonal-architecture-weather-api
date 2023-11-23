import { afterAll, afterEach, beforeAll, describe, test, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import weatherServiceAdapter from './weatherServiceAdapter'

const forecasts = (station: string) => [
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

export const restHandlers = [
  http.get('https://apis.is/weather/forecasts/en', ({ request }) => {
    const url = new URL(request.url)

    const stations = url.searchParams.get('stations')
    if (!stations) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(forecasts(stations))
  }),
]

const server = setupServer(...restHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('WeatherServiceAdapter', () => {
  test("Doit appeler l'api meteo Islandaise et retourner le résultat", async () => {
    // Given
    const stationNumber = 422

    // When
    const result = await weatherServiceAdapter(stationNumber)

    // Then
    expect(result).toEqual(forecasts(`${stationNumber}`))
  })
})
