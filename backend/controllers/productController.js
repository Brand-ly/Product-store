import { SqlTemplate } from "@neondatabase/serverless";
import sql from "../config/db.js";

//Create product
export const getAllProducts= async(req,res)=>{
    try {
        const products=await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;
        console.log("fetched products", products);
        res.status(200).json({success:true, data:products})
    } catch (error) {
        console.log("Error getProducts", error);
        res.status(500).json({success:false, message:"Internal server error"})
    }
};

//create product new item
export const createProduct=async(req,res)=>{
    const {name,price,image}=req.body

    if (!name||!price||!image){
        return res.status(400).json({success:false, message:"All fields are required"});
    }
    try {
        const newProduct= await sql`
          INSERT INTO products (name,price, image)
          VALUES(${name},${price},${image})
          RETURNING*
        `;
        console.log("Product created");
        res.status(201).json({success:true, data: newProduct[0]})

    } catch (error) {
         console.log("Error createProducts", error.message, error.stack);
        res.status(500).json({success:false, message:"Internal server error"})
    }
};

//update current products
export const updateProduct=async(req,res)=>{
    const {id}=req.params;
    const {name,price,image}=req.body
    try {
        const updateProduct= await sql`
          UPDATE products
          SET  name=${name}, price=${price}, image=${image}
          WHERE id=${id}
          RETURNING*
        `;
         if(updateProduct.length==0){
             return res.status(404).json({success:false, message:"Product not found"});
         }
        console.log("Product updated");
        res.status(200).json({success:true, data: updateProduct[0]})

    } catch (error) {
         console.log("Error createProducts", error.message, error.stack );
        res.status(500).json({success:false, message:"Internal server error"})
    }
};

//delete products
export const deleteProduct=async(req,res)=>{
    const {id}=req.params;
    try {
        const deletedProduct=await sql`
           DELETE FROM products
           WHERE id= ${id}
           RETURNING *
        `;

        if(deletedProduct.length==0){
             return res.status(404).json({success:false, message:"Product not found"});
         }

         console.log("Product deleted");
        res.status(200).json({success:true, data: deletedProduct[0]})

    } catch (error) {
        console.log("Error deleteProducts", error);
        res.status(500).json({success:false, message:"Internal server error"})
    }
};

//display certain product
export const getProduct=async(req,res)=>{
    const {id}= req.params
    try {
        const product=await sql`
          SELECT * FROM products WHERE id=${id}
        `

        res.status(201).json({success:true, data: product[0]})
    } catch (error) {
        console.log("Error in getProduct", error);
        res.status(500).json({success:false, message:"Internal server error"})
    }
};