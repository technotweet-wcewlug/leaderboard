require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const {ObjectId} =  require ('bson');
const { default: mongoose } = require("mongoose");
app.use(express.json());
app.use(cors());

const userSchema = new mongoose.Schema(
  { username: String, ansKey: [String], score: Number },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const flags = [
  "WLUG{733G8ooFhqQnHhCu}",
  "WLUG{GYcf5MVrecOhnB6j}",
  "WLUG{8a0cuy2V4Ok1v6bf}",
  "WLUG{qEa3niwC25EXk17m}",
  "WLUG{3aeQniFe5EXdh57m}",
];
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log(e.message);
  });

app.get("/", (req, res) => {
  res.status(200).send("Leaderboard here");
});



app.post("/save", async (req, res) => {

    try {
        const body = req.body;
    const user = await User.findOne({ username: body["username"] });
        const flag = body['ansKey']
    switch (flag) {
        case flags[0]:
          score = 10;
          break;
        case flags[1]:
          score = 10;
          break;
        case flags[2]:
          score = 20;
          break;
        case flags[3]:
          score = 30;
          break;
        case flags[4]:
          score = 30;
          break;
  
        default:
          return res
            .status(201)
            .send({ message: "Your Flag is wrong, keep searching!!!" });
          break;
      }

    if(user)
    {
        //update 
        const sameValue = user['ansKey'].includes(body['ansKey'])
        if(sameValue)
        {
            //throw error
            return res
        .status(202)
        .send(
          "Don't enter the same ans again and again, we know you got an flag"
        );
        }
        else{
            //update finally
            //update score and add in ansKey array
          const updatedUser =  await User.findOneAndUpdate({ username: body["username"] }, 
            {
                $inc:{ score: score },
                $push:{ansKey:body['ansKey']},
                $currentDate: { updatedAt: true }
            },{ new: true }
            );
            if(updatedUser['score']==100)
            {
                return res
              .status(201)
              .send({ message: "Hooray!!!, You have completed the hunt!",score:100 });
            }
            console.log(updatedUser)
            return res
              .status(201)
              .send({ message: "Keep going, u got the flag...", score: updatedUser['score'] });
        }
    }
    else{
        //create new user
        const userData = {
            ...body,
            score,
          };
      
          await User.create(userData);
          res.status(200).send({ message:"Looks like you just got on leaderboard, now try to climb that leaderboard all the way to top",score: userData["score"] });

    }
    } catch (error) {
        res.status(403).send(error.message);
    }
})


app.put('/put',async(req,res)=>{
    const body = req.body
    const user = await User.findOneAndUpdate({ username: body["body"] }, {$set:{ score: score }});
    res.send(user);
}
)
app.get("/all", async (req, res) => {
  try {
    const data = await User.find().sort({ score: -1, updatedAt: 1 });
    res.status(200).send(data);
  } catch (error) {
    res.status(405).send(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
