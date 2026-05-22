import { useDispatch } from "react-redux"
import { useAppSelector } from "../hooks/useAppSelector"
import { deleteProduct, setProducts, setSelectedProduct } from "../store/productsSlice"
import axios from "axios"
import { API } from "../api/api"
import { useEffect } from "react"

export default function ProductsLiist() {

    const products = useAppSelector(state => state.products.list)
    const dispatch = useDispatch()


    async function handleDelete(id: number) {
        await axios.delete(API + '/products/' + id)

        dispatch(deleteProduct(id))
    }

    async function getProducts() {
        const {data} = await axios.get(API + '/products')
        dispatch(setProducts(data))
    }
    useEffect(()=>{
        getProducts()
    }, [])
    return (
        <>
            <ul>
                {products.map(p => {
                    return <li key={p.id}>
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <p>{p.price}</p>
                        <img width={'150px'} src={API + p.image_url} alt="" />
                        <button onClick={()=> handleDelete(p.id)}>Удалить</button>
                        <button onClick={() => dispatch(setSelectedProduct(p))}>Редакттровать</button>
                    </li>
                })}
            </ul>
        </>
    )
}