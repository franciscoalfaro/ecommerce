import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const Search = () => {
  const params = useParams();
  const { auth } = useAuth({});
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const { producto } = useParams();
  const [totalPages, setTotalPages] = useState(1);


  const nextPage = () => {
    let next = page + 1;
    setPage(next);

  };

  useEffect(() => {
    buscarProducto(page)
  }, [page])

  useEffect(() => {
    buscarProducto(1);
  }, [producto]);


  const buscarProducto = async (nextPage = 1) => {
    const request = await fetch(Global.url + 'product/search/' + params.product + '/' + nextPage, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await request.json();
    console.log(data)

    if (data.status === 'success') {
      setProducts(data.resultados);
      setTotalPages(data.totalPages);

    } else {
      console.log(data.message);
    }
  };






  return (
    <div>Search</div>
  )
}
