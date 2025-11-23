import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import crypto from "crypto";
import { GenerateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import { resetPasswordEmail, sendResetPassSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/sendVerificationEmail.js"


export const signup = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    const { email, password, name } = req.body

    // Check if user already exists
    const existUser = await User.findOne({ email })
    if (existUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate 6-digit verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt
    })

    await newUser.save()

    GenerateTokenAndSetCookie(res,newUser._id)

    await sendVerificationEmail(newUser.email,verificationToken)

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        verificationToken,
        verificationTokenExpiresAt
      }
    })
  } catch (error) {
    console.log("Error: ", error)
    res.status(500).json({ message: "Server error", error })
  }
}



export const verifyEmail=async (req,res)=>{


  try {
    const {code} =req.body;
    const userWithCode=await User.findOne({verificationToken:code})
    if(!userWithCode){
      return res.status(404).json({message:"Invalid code"})
    }

    if (userWithCode.verificationTokenExpiresAt < Date.now()) {
  return res.status(400).json({ message: "Verification code has expired" });
}
    
    userWithCode.isVerified= true
    userWithCode.verificationToken=undefined
    userWithCode.verificationTokenExpiresAt=undefined
    await userWithCode.save()

    await sendWelcomeEmail(userWithCode.email,userWithCode.name)

      res.status(200).json({
      message: "Email verified successfully",
      user: {
        id: userWithCode._id,
        email: userWithCode.email,
        name: userWithCode.name,
        verified: userWithCode.isVerified,
      },
    });

  } catch (error) {
    console.error("❌ Error verifying email:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


export const signin = async (req,res)=>{
    try {
      const {email,password} = req.body

      const existUser =await User.findOne({email})

      if(!existUser){
        return res.status(404).json({message:"No account is registered with this email"})
      }
      if(!existUser.isVerified){
        return res.status(404).json({message:"Email is yet to be verified"})
      }

      const passValidity=await bcrypt.compare(password,existUser.password)
      if(!passValidity){
        return res.status(404).json({message:"Wrong password"})
      }

      GenerateTokenAndSetCookie(res,existUser._id)
      existUser.lastLogin=new Date();

      await existUser.save()

      res.status(200).json({
        success:true,
        message:"logged in successfully",
        user:{
          ...existUser._doc,
          password:undefined
        }
      })
    } catch (error) {
      res.status(400).json({
        success:false,
        message:error.message
      })
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Error during logout:", error);
    res.status(500).json({
      success: false,
      message: "Server error while logging out",
      error: error.message,
    });
  }
};


export const forgotPassword= async (req,res)=>{
  try {
    const {email}=req.body;
    const user=await User.findOne({email})

    if(!user){
      return res.status(404).json({success:false , message:"No account registered with this email"})
    }

    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenExpiresAt=Date.now()+1*60*60*1000

    user.resetPasswordToken=resetToken
    user.resetPasswordExpiresAt= resetTokenExpiresAt

    await user.save()

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await resetPasswordEmail(user.email , resetURL)


      res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
        console.error("❌ Error in forgotPassword:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
      error: error.message,
    });
  }
}



export const resetPassword=async (req,res)=>{
  try {
    const {token}=req.params
    const {password}=req.body

    const user=await User.findOne({
      resetPasswordToken:token,
      resetPasswordExpiresAt:{$gt:Date.now()}
    })

    if(!user){
      return res.status(400).json({success:false,message:"invalid or expired token"})
    }

    const updatedPassword=await bcrypt.hash(password,10)

    user.password=updatedPassword


    user.resetPasswordToken=undefined,
    user.resetPasswordExpiresAt=undefined

    await user.save()

    await sendResetPassSuccessEmail(user.email)

    res.status(200).json({success:true,message:"Password reset successfully"})

  } catch (error) {
    console.log("Error in reseting password",error)
    res.status(400).json({success:false,message:error.message})
  }
}


export const checkAuth=async(req,res)=>{
  try {
    const user=await User.findById(req.userId).select("-password")

    if(!user){
      return res.status(400).json({success:false,message:"User not found"})
    }

    res.status(200).json({success:true, user
    })
  } catch (error) {
    console.log("Error in checkAuth",error)
    res.status(400).json({success:false,message:error.message})
  }
} 