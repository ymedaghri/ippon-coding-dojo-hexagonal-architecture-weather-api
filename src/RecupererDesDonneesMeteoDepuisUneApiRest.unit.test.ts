import { describe, expect, test, vi } from 'vitest'
import { applicationBuilder } from './application'

describe('Recuperer des donnees meteo depuis une API', () => {
  test('Appel GET sur https://apis.is/weather/forecasts/en?stations=1', () => {
    // Given
    const wheaterServiceAdapter = {
      getForecastForStation: vi.fn(() => {
        return [
          {
            city: 'reykjavik',
            temp: '20',
          },
        ]
      }),
    }

    // When
    const application = applicationBuilder(wheaterServiceAdapter)
    const donneesMeteo = application.recupererDonneesMeteo()

    // Then
    expect(wheaterServiceAdapter.getForecastForStation).toHaveBeenCalledOnce
    expect(donneesMeteo).toEqual([
      {
        city: 'reykjavik',
        temp: '20',
      },
    ])
  })
})
