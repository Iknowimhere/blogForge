import { Schema,model } from "mongoose";


const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true
    },
    blog:{
        type:Schema.Types.ObjectId,
        required:true
    }

})

export default model("Comment",commentSchema);