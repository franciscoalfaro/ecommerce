import React, { useEffect } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Spiner } from '../../../hooks/Spiner'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'




export const PrivateLayout = () => {
  const { auth, loading } = useAuth()

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      setTimeout(() => { window.location.href = "/login" }, 1200);
    }
  }, [auth, navigate]);

  if (loading) {
    return <Spiner></Spiner>
  } else {
    return (
      <>
        {/*Layout*/}
        <Sidebar></Sidebar>
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
          <Header></Header>
          
          {/*cabecera y navegacion*/}
          
          {/*contenido principal*/}
          {auth && auth._id ? <Outlet></Outlet> : <Navigate to="/login"></Navigate>}
          
          {/*barra lateral*/}
          <Footer></Footer>
        </main>
      </>
    )
  }
}
