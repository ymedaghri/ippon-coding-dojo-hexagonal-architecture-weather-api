export type InputPort = {
  getForecastForStation: () => unknown[]
}

export const applicationBuilder = (inputPort: InputPort) => {
  return {
    recupererDonneesMeteo: () => {
      return inputPort.getForecastForStation()
    },
  }
}
