const departamentoEndpoints = (apiUrl: string, token: string) => {
  async function getDepartamentos() {
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    return await fetch(`${apiUrl}/departamentos`, {
      headers: headers,
    }).then((res) => res.json())
  }

  return { getDepartamentos }
}

export default departamentoEndpoints
