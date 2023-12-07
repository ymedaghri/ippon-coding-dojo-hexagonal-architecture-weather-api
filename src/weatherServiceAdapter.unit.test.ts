import { afterAll, afterEach, beforeAll, describe, test, expect } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import weatherServiceAdapter from './weatherServiceAdapter'
import { forecasts } from './weather.fixture'

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
