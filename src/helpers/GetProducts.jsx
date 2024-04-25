import React from 'react'
import { Global } from './Global'

export const GetProducts = async (nextPage, setState,setTotalPages) => {

    
    try {
        const request = await fetch(Global.url + 'product/list/' + nextPage, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        const data = await request.json()

        if (data.status === 'success') {
            setState(data.products)
            setTotalPages(data.totalPages)

        }
        return data

    } catch (error) {
        console.log('code', error)

    }

}


