import { Interconsulta } from '@/types/Interconsulta'

const interconsultaEndpoints = (apiUrl: string, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  async function getInterconsultas(query: string) {
    const result = await fetch(`${apiUrl}/interconsultas?${query}`, {
      headers: headers,
    })

    return result.json()
  }

  async function addInterconsulta(interconsulta: Interconsulta) {
    const result = await fetch(`${apiUrl}/interconsultas/crear`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(interconsulta),
    })

    return result.json()
  }

  async function updateInterconsultaState(id: string, estado: string) {
    const result = await fetch(`${apiUrl}/interconsultas/${id}/estado`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ estado }),
    })

    return result.json()
  }

  return { getInterconsultas, addInterconsulta, updateInterconsultaState }
}

export default interconsultaEndpoints
