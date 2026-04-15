import express from "express";

const app = express()

app.get('/posts', async (req, res, next) => {
  throw new Error('something broke') // no try/catch, no next(err)
})

const PORT=5000; 

app.listen(PORT,() =>{
    console.log(`Server running in ${PORT}`);
});