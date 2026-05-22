import { useDispatch } from "react-redux"
import { useAppSelector } from "../hooks/useAppSelector"
import { useEffect, useState } from "react"
import axios from "axios"
import { API } from "../api/api"
import { addProduct, setSelectedProduct, updateProduct } from "../store/productsSlice"
import ProductsLiist from "./ProductsList"

export default function ProductsForm() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState<File | null>(null)

    const selectedProduct = useAppSelector(state => state.products.selectedProduct)
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedProduct) {
            setName(selectedProduct.name)
            setDescription(selectedProduct.description)
            setPrice(selectedProduct.price)
        } else {
            setName('')
            setDescription('')
            setPrice(0)
        }
    }, [selectedProduct])


    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        const formdata = new FormData()

        formdata.append('name', name)
        formdata.append('description', description)
        formdata.append('price', String(price))
        formdata.append('image', String(file))

        if (selectedProduct) {
            const { data } = await axios.put(API + '/products/' + selectedProduct.id, formdata)

            dispatch(updateProduct(data))
        } else {
            const { data } = await axios.post(API + '/products', formdata)
            dispatch(addProduct(data))
        }

        dispatch(setSelectedProduct(undefined))

        setName('')
        setDescription('')
        setPrice(0)
        setFile(null)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null
        setFile(file)
    }

    return (
        <>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="название" value={name} onChange={e => setName(e.target.value)} />
                <input type="number" placeholder="цена" value={price} onChange={e => setPrice(Number(e.target.value))} />
                <input type="text" placeholder="описание" value={description} onChange={e => setDescription(e.target.value)} />
                <input type="file" accept="image/*" onChange={handleChange} />
                <button>{selectedProduct ? "Редактировать " : "Добавить"}</button>
            </form>

            {file ? <img src={URL.createObjectURL(file)} alt="" width={'150px'} /> : null}
            <h1>Наши продукты</h1>
            <ProductsLiist/>
        </>
    )
}