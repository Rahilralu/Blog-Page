import express from "express";
import { login_credential,cookievalidator,deleteuser  } from "../middleware/middleware.js";

const router = express.Router();
const posts = [
    {
        email: 'nazarrahil0000@gmail.com',
        password: 'haha1234'
    },
    {
        email: 'rahilnazar1234@gmail.com',
        password: 'lala1234'
    }
]

router.post('/refresh',cookievalidator)
router.get('/logout',deleteuser)
router.get('/',(req,res) => {
    res.send('HAHAHA')
})

// router.post('/signs',(req,res) => {
//     try{
//             const {username} = req.body;
//             const user = { username:username }
//             const access_token = generateAccessToken(user);
//             const referesh_token = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
//             res.json({access_token:access_token , referesh_token:referesh_token})
//         }
//         catch(error){
//             console.log(error);
//         }
//     }
// )

router.post('/login',login_credential)
// router.get('/posts',authenticate_token,(req,res) => {
//     res.json(posts.filter(post => post.username === req.user.username))
// })

// router.post('/sign',json_web_token);
export default router;