import {Schema,model} from 'mongoose'

const blogSchema=new Schema({
    title:{
        type:String,
        required:true,
        minLength:[10,"title should be above 10 characters"]
    },
    slug:{
        type:String,
        unique:true,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    categories:{
        type:[{type:String,ref:"Category"}],
        required:true
    },
    featuredImage:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Schema.Types.ObjectId,
        ref:"Like",
        default:0
    },
    comments:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    }
},{
    timestamps:true
})

const Blog=model("Blog",blogSchema);


export default Blog;








function convertToSlug() {
    this.slug= this.title
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, ""); // Remove non-alphanumeric characters except hyphens
  }