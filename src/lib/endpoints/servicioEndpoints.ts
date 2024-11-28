import { useConfig } from '@/config/ConfigProvider'

const servicioEndpoints = (apiUrl: string, token: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const getServicios = async () => {
    const response = await fetch(`${apiUrl}/servicios`, {
      headers: headers,
    })

    return response.json()
  }

  return {
    getServicios,
  }
}

export default servicioEndpoints
