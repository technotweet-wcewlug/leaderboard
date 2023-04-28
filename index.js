require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
// const {ObjectId} =  require ('bson');
const { default: mongoose } = require('mongoose');
app.use(express.json());
app.use(cors());

const userSchema = new mongoose.Schema({ id: String, flag: String });
const User = mongoose.model('User', userSchema);

const flags = ["WLUG{733G8ooFhqQnHhCu}","WLUG{GYcf5MVrecOhnB6j}","WLUG{8a0cuy2V4Ok1v6bf}","WLUG{qEa3niwC25EXk17m}","WLUG{qEa3niwC25EXk17m}"]
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("connected")
})
.catch((e)=>{
    console.log(e.message);
})

app.get('/',(req,res)=>{
    res.status(200).send("Leaderboard here");
})


app.post('/save-leaderboard',async(req,res)=>{
    
    try {
        const body = req.body
        await User.create(body);
        res.status(200).send("user saved")
    } catch (error) {
        console.log('error in saving')        
        res.status(404).send(error.message)
    }

}
)

app.get('/all',async(req,res)=>{
    try {
        const data = await User.find({});
        res.status(200).send(data);

    } catch (error) {
        res.status(405).send(error.message)
        
    }
})

app.listen(8080,()=>{
    console.log(`Listening on ${process.env.PORT}`)
})