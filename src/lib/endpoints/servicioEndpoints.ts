import { useConfig } from '@/config/ConfigProvider'

const servicioEndpoints = () => {
  const { apiUrl, tokenState } = useConfig()
  const token = tokenState.get()

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
