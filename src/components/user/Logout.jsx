import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const Logout = () => {
  const {setAuth} = useAuth()
  const navigate = useNavigate()

  useEffect( ()=>{
    //vaciar LocalStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    //setear estados a vacios
    setAuth({})

    navigate("/")
  })

  return (
    <div>Cerrando Sesion</div>
  )
}
