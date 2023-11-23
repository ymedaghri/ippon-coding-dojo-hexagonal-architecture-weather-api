const API_URL = 'https://apis.is/weather/forecasts/en?stations='

export default async (stationNumber: number) => {
  try {
    const response = await fetch(`${API_URL}${stationNumber}`)

    if (!response.ok) {
      throw new Error(`La requête a échoué avec le statut ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Une erreur s'est produite :", error)
  }
}
