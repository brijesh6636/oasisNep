import { Prices } from "../models/prices.schema.js";
import { asyncErrorHandler } from "../utils/asynchandler.js";



export const addprice = async (req, res, next) => {
    const { Name, Id, ImageId, Category, Info, plans } = req.body;
    const item =await Prices.findOne({ Name })
    if (item) {
       return res.status(500).json({
            sucess: false,
            message: "Item already exists try updating"
        })
    }
    try {

        const priceList = await Prices.create({
            Name, Id, ImageId, Info, plans, Category
        })
        res.status(200).json({
            sucess: true,
            message: "Price Added Sucessfully",
            priceList
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            sucess: false,
            messae: "Failed to add price",
            error: error.message
        })

    }
}

export const getAllPrices = async (req, res, next) => {
    const allPrices = await Prices.find()
    res.status(200).json({
        sucess: true,
        allPrices
    })
}

export const updatePrice = async (req, res, next) => {
    const { Name, updates } = req.body

    
    try {
        const item = await Prices.findOneAndUpdate(
            { Name },
            { $set: updates },
            { new: true, upsert: false }
        )
        if (!item) {
           return res.status(200).json({
                sucess: false,
                message: "Item not found"
            })
        }
        res.status(200).json({
            sucess: true,
            data: item
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            messae: "Failed updating price"
        })
        next(error)
    }

}

export const deletePrice = asyncErrorHandler(async(req,res,next) =>{
    const { userIpDetails } =req.body
    try {
        const item =await Prices.findOneAndDelete({userIpDetails})
        if (!item) {
          return res.status(200).json({
                sucess: false,
                message: "Item not found"
            })
        }
        
        res.status(200).json({
            sucess:true,
            messae:"Item deleted Sucessfully",
            data:item
        })
    } catch (error) {
        next(error)
    }
})