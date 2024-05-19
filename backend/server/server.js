require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const app=express();

const mongoDBUri=process.env.MONGODB_URI;
app.use(express.json()); 
// console.log(process.env.MONGODB_URI);
// console.log(process.env.JWT_SECRET);
mongoose.connect(mongoDBUri)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.error("Error Connecting to MongoDB",error);
});
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/auth',require('./Routes/auth'));
app.use('/blog',require('./Routes/blogs'));

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`);
})