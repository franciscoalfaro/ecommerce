import React, { useEffect, useState } from 'react'
import { ComisionTransaccion } from './ComisionTransaccion'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';

export const Orders = () => {
  const { auth } = useAuth({});
  const [order, setOrder] = useState([])

  useEffect(() => {
    obtenerOrdenes()
  }, [])


  const obtenerOrdenes = async () => {
    try {
      const request = await fetch(Global.url + 'order/list', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }

      })
      const data = await request.json()

      if (data.status === "success") {
        setOrder(data.order)
      }else{
        console.log('code', data.message)
      }

    } catch (error) {
      console.log('code', error)

    }

  }




  return (
    <>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Numero de orden</th>
            <th>Estado</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {order.map((order, index) => (
            <tr key={index}>
              <td>{order.orderNumber}</td>
              <td>{order.status}</td>
              <td>
                <button>Descargar Boleta</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </>

  )
}
