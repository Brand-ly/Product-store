import {create} from 'zustand';
import axios from 'axios';

const BASE_URL = "http://localhost:3000";

export const useProductStore = create((set, get) => ({
    //product state
    products:[],
    loading:false,
    error:null,

    fetchProducts: async (params) => {
        set({loading:true})
        try {
            const response=await axios.get(`${BASE_URL}/api/products`)
            set({products:response.data, error:null})
        } catch (err) {
            if (err.status=429) set({err:"Rate limit exceeded"});
        }finally{
            set({loading:false});
        }
    }
    
}));