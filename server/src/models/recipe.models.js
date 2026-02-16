import mongoose from 'mongoose'
const recipeSchema=new mongoose.Schema({
    recipeName:{
        type:String,
        required:[true,"recipe title is required"],
        trim:true,
        minlength:5

    },
    ingredients:{

        type:[String],
        required:true,

    },
    steps:{
        type:[String],
        required:true
    },
    nutrition:{
        calories:{type:Number,default:0},
        protein:{type:Number,default:0},
        carbs:{type:Number,default:0}
    },
    foodType:{
        type:[String],
        enum:["veg","vegan","keto"],

    },
   
    ratings:[
        {
         user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         required:true,
         },
         value:{
            type:Number,
            min:1,
            max:5,
            required:true

         },

        },
         
        ],

    cookingTime:{
        type:Number,
        min:1,

    },
    difficulty:{
        type:String,
        required:true,
        default:"easy",
        enum:["easy","hard","medium"]

    }
    
})
export const Recipe=mongoose.model("Recipe",recipeSchema);