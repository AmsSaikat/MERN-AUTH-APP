import express from 'express'
import { connectDB } from './db/connectDB.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import cors from 'cors'

dotenv.config()

const PORT=process.env.PORT || 5000
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

app.use('/api/auth',authRoutes)


app.listen(PORT,()=>{
    connectDB()
    console.log(`Server hosted at port ${PORT}`)
})