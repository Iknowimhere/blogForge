import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({ 
    cloud_name: process.env.API_CLOUDNAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

  const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"Blogs",
        allowed_formats:["jpg","jpeg","png"],
    }
  })


  export default storage;