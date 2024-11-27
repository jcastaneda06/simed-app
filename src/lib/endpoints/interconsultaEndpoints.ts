import ConfigProvider from '@/config/ConfigProvider'
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

  return {
    getInterconsultasEnviadas,
    getInterconsultasRecibidas,
  }
}

export default interconsultaEndpoints
