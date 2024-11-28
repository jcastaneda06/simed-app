import ConfigProvider from '@/config/ConfigProvider'
import { Interconsulta } from '@/types/Interconsulta'
import { Usuario } from '@/types/Usuario'

const interconsultaEndpoints = () => {
  const { apiUrl, tokenState } = ConfigProvider()
  const token = tokenState.get()

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  async function getInterconsultasEnviadas(query: string, usuario: Usuario) {
    const result = await fetch(
      `${apiUrl}/interconsultas/enviadas?${query}&idServicio=${usuario?.servicio}`,
      {
        headers: headers,
      }
    )

    return result.json()
  }

  async function getInterconsultasRecibidas(query: string, usuario: Usuario) {
    const result = await fetch(
      `${apiUrl}/interconsultas/recibidas?${query}&idServicio=${usuario?.servicio}`,
      {
        headers: headers,
      }
    )

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

  return {
    getInterconsultasEnviadas,
    getInterconsultasRecibidas,
    addInterconsulta,
  }
}

export default interconsultaEndpoints
