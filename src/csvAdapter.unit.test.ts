import { describe, expect, test, vi } from 'vitest'
import csvAdapterBuilder, { FileWriter } from './csvAdapter'
import { observation } from './weather.fixture'

describe('CsvAdapter', () => {
  test('Doit lire le fichier csv et retourner le résultat', async () => {
    // Given
    const fileWriter: FileWriter = {
      write: vi.fn(),
    }
    const csvAdapter = csvAdapterBuilder(fileWriter)

    // When
    csvAdapter.convert(observation)

    // Then
    expect(fileWriter.write).toHaveBeenCalledWith(
      'meteo.csv',
      'id,name,date,time,temperature,pressure,wind_direction'
    )
  })
})
