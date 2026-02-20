import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';
import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants';
import { setLoading, setError } from '../utils/helpers';
import { setData } from '../utils/helpers';


export const useApi = async (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const callApi = async ({
    url,
    method = 'GET',
    body = {},
    headers = {
      'Content-Type': 'application/json',
    },
  }) => {
    let response = null;
    setLoading(true);
    try {
      const response = await axios.request({
        url:url,
        method:method,
        data: body,
        headers:headers,
      });
      response = response.data;
    } catch (error) {
      response = error.response.data;
      setError(response.error);
    } finally {
      setLoading(false);
    }
    return response;
  }
  return {callApi, error, loading};
};


  const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/auth",
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // const execute = useCallback(
  //   async (...args) => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const result = await apiFunction(...args);
  //       if (result.success) {
  //         setData(result.data);
  //         return result;
  //       } else {
  //         setError(result.error);
  //         return result;
  //       }
  //     } catch (err) {
  //       const errorMessage = getErrorMessage(err);
  //       setError(errorMessage);
  //       return { success: false, error: errorMessage };
  //     } finally {
  //       setLoading(false);
  //     }
  //     return { data, loading, error, execute };
  //   },
    
  //   [apiFunction]
  // );

  
