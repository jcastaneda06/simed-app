import { Interconsulta, RespuestaInterconsulta } from '@/types/Interconsulta'

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

  async function getInterconsultaById(id: string) {
    const result = await fetch(`${apiUrl}/interconsultas/${id}`, {
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

  async function getRespuestaByInterconsultaId(id: string) {
    const result = await fetch(`${apiUrl}/interconsultas/${id}/respuesta`, {
      headers: headers,
    })

    return result.json()
  }

  async function responderInterconsulta(respuesta: RespuestaInterconsulta) {
    const result = await fetch(
      `${apiUrl}/interconsultas/${respuesta.interconsulta}/respuesta`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(respuesta),
      }
    )

    return result.json()
  }

  async function deleteInterconsulta(id: string) {
    const result = await fetch(`${apiUrl}/interconsultas/${id}`, {
      method: 'DELETE',
      headers: headers,
    })

    return result.json()
  }

  return {
    getInterconsultas,
    addInterconsulta,
    updateInterconsultaState,
    getInterconsultaById,
    getRespuestaByInterconsultaId,
    responderInterconsulta,
    deleteInterconsulta,
  }
}

export default interconsultaEndpoints
