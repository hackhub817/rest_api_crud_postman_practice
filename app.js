const express=require("express");
const mongoose= require("mongoose");



mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2",{
  dbName: 'TO-DO-LIST',
},{useNewUrlParser:true},).then(()=>console.log('connect database'))
.catch((err)=>{console.log(err);});


const userSchema = new mongoose.Schema({
   task:String,
});

const User = new mongoose.model("User",userSchema);

const app= express();

app.use(express.json())

app.get("/list",function(req , res)
{
// User.find(foundlist).then(()=>
// {
//     res.send(foundlist);
// }).catch(err=> {
//     return res.send("error");
// })

User.find()
    .then(found => {
        return res.send(found);
    })
    .catch(err => {
        return res.send("error");
    });

});
app.post("/add",function(req,res)
{

    const data = req.body;
    console.log(req.body.task);
    const user = new User({
        task: data.task
    });

    user.save()
    .then(()=>{
        return res.send("Added");
    })
    .catch(err => {
        return res.send("Error");
    })
});




app.post("/delete",function(req , res)
{
    User.findByIdAndRemove(req.body._id).then(()=>{
        res.send("done");
    }).catch(err => {
        return res.send("Error");
    })
});

app.post("/search",function(req,res)
{
    User.find({ task: req.body.task })
    .then(objects => {
      return res.send(objects);
    })
    .catch(err => {
      return res.send("error");
    });
});

app.route("/search/:SearchElement")
.get(function(req,res)
{
    User.find({task :req.params.SearchElement}).
    then(foundArticle=>{
       return res.send(foundArticle);
    }).catch(err=>
        {
           return  res.send("error");
        })
}).put(function(req,res){
    User.updateOne(
        {task :req.params.SearchElement},
       { $set:{task:req.body.task}},
        {overwrite:true}).then(()=>{
        return res.send("done");
}).catch(err=>{
    return res.send(err);
})

});






app.listen(8000,function(req,res)
{
    console.log("connected to port 8000");
});