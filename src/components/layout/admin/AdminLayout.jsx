import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Spiner } from '../../../hooks/Spiner';
import { Header } from './Header';
import { Footer } from './Footer';

export const AdminLayout = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [auth, navigate]);

  if (loading) {
    // Si los datos de autenticación aún se están cargando, muestra un spinner
    return <Spiner></Spiner>;
  } else {
    // Si los datos de autenticación se han cargado

    // Si auth es nulo, redirigir al usuario a la página de inicio de sesión
    if (!auth) {
      return <Navigate to="/"></Navigate>;
    }

    // Si el usuario es admin, mostrar el contenido del layout de administrador
    if (auth.role === 'admin') {
      return (
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
          <Header></Header>
          <div className='container mt-4'>
            <div className="row mt-4">
              <Outlet></Outlet>
              <Footer></Footer>
            </div>
          </div>
        </main>
      );
    } else {
      // Si el usuario no es admin, redirigirlo a la página de inicio
      return <Navigate to="/"></Navigate>;
    }
  }
};
