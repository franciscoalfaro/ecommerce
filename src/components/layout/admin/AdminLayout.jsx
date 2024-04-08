import React, { useEffect } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Spiner } from '../../../hooks/Spiner'
import { Header } from './Header'

import { Footer } from './Footer'

export const AdminLayout = () => {
  const { auth, loading } = useAuth()
  console.log('el auth role', auth.role)

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


    if (auth && auth.role === 'admin') {
      return (
        <>
          <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
            <Header />
            {/* Contenido principal */}
            <div className='container mt-4'>
              <div className="row mt-4">
                <Outlet />
                <Footer />
              </div>

            </div>


          </main>
        
        </>
      );
    } else {
      // Si el usuario no es admin, redirigirlo a la página de inicio de sesión
      return <Navigate to="/auth" />;
    }
  }
};
