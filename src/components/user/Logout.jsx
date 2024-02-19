import React from 'react'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const Logout = () => {
  const {setAuth} = useAuth()
  const navigate = useNavigate()

  useEffect( ()=>{
    //vaciar LocalStorage
    localStorage.clear()

    //setear estados a vacios
    setAuth({})

    navigate("/login")
  })

  return (
    <div>Cerrando Sesion</div>
  )
}
