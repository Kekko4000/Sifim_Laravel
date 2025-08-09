// resources/js/Hooks/useAutoLoader.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

export function useAutoLoader(targetId) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(config => {
      setLoading(true)
      return config
    }, err => {
      setLoading(false)
      return Promise.reject(err)
    })

    const resInterceptor = axios.interceptors.response.use(resp => {
      setLoading(false)
      return resp
    }, err => {
      setLoading(false)
      return Promise.reject(err)
    })

    return () => {
      axios.interceptors.request.eject(reqInterceptor)
      axios.interceptors.response.eject(resInterceptor)
    }
  }, [])

  return loading
}
