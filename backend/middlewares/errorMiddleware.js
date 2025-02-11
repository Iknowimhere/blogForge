export const errorMiddleware=(err, req, res, next) => { 

    if(err.code===11000){
        err.statusCode=400
        err.message="User already exists!!"
    }

    if(err.name==="ValidationError"){
        let msgs=Object.values(err.errors).map(obj=>{
            return obj.message;
        });
        err.statusCode=400;
        err.message=msgs.join(", "); 
    }

    if(err.name==="CastError"){
        err.statusCode=400;
        err.message="Not a valid id"
    }
    
    return res.status(err.statusCode ||500).json({
      status: "Failure",
      message:err.message || "Something went wrong, Please try again later!",
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }