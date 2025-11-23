import jwt from "jsonwebtoken"

export const verifyToken=(req,res,next)=>{
    try {
    const token=req.cookies.token
    if(!token){
        return res.status(404).json({success:false,message:"Unauthorized - no token provided"})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
        res.status(401).json({success:false,message:"Unauthorized-invalid token"})
    }

    req.userId=decoded.userId
    next()
    } catch (error) {
    console.log("Error in verifyToken",error)
    res.status(500).json({success:false,message:"Server error"})
    
    }
}