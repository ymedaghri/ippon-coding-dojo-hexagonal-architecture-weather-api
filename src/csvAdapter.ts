export type FileWriter = {
  write: (filename: string, content: string) => Promise<void>
}

export type WeatherObservation = {
  id: string
  name: string
  date: string
  time: string
  temperature: string
  pressure: string
  wind_direction?: string
}

export default (fileWriter: FileWriter) => {
  return {
    convert: (observations: WeatherObservation) => {
      fileWriter.write(
        'meteo.csv',
        'id,name,date,time,temperature,pressure,wind_direction'
      )
    },
  }
}
