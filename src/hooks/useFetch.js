import { useState } from "react";

export const useFetch = () => {
  const [dataServer, setDataServer] = useState(null);

  const fetchData = async (url, method = 'GET', formData = null) => {
    try {
      let options = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: formData ? JSON.stringify(formData) : null
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      const result = {
        status: response.status,
        dataServerResult: responseData
      };

      setDataServer(result);
      return result;
    } catch (error) {
      if (error.name !== 'AbortError') {
        const data = {
          status: 500,
          message: 'No se pudo establecer conexión con el servidor',
          success: false,
          errorSystem: error.message
        };
        setDataServer(data);
      }    
    }
  };

  const createData = async (url, formData) => {
    const resp = await fetchData(url, 'POST', formData);
    return resp;
  };

  const getData = async (url) => {
    console.log('Llamando a getData');
    const resp = await fetchData(url, 'GET');
    return resp;
  };
  

  return {
    dataServer,
    createData,
    getData
  };
};
