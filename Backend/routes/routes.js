import express from "express";

const router = express.Router();

router.get('/',(req,res) => {
    res.send('HAHAHA')
})

router.post('/login',(req,res) => {
    const { email,password } = req.body
    console.log(email,password);
    res.json({success: false});
})

export default router;