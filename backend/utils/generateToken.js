import jwt from 'jsonwebtoken';

async function generateToken(id){
    return await jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })
}

export default generateToken;