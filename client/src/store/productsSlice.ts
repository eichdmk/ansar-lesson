import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface initialState {
    list: Product[],
    selectedProduct: Product | undefined
}

const initialState: initialState = {
    list: [],
    selectedProduct: undefined
}


const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>)=>{
            state.list = action.payload
        },
        addProduct: (state, action: PayloadAction<Product>)=>{
            state.list.push(action.payload)
        },
        updateProduct: (state, action: PayloadAction<Product>)=>{
            state.list = state.list.map(p => p.id === action.payload.id ? action.payload : p)
        },
        deleteProduct: (state, action: PayloadAction<number>)=>{
            state.list = state.list.filter(p => p.id !== action.payload)
        },
        setSelectedProduct: (state, action: PayloadAction<Product | undefined>)=>{
            state.selectedProduct = action.payload
        }
    }
})

export const {setProducts, addProduct, updateProduct, deleteProduct, setSelectedProduct} = productsSlice.actions
export default productsSlice.reducer