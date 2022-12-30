const express=require("express")
const cors=require("cors")
const app=express()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())


const port=process.env.PORT || 5000


const uri = "mongodb+srv://webapp:Wme4Bc1EXS6Kq670@cluster0.w9jnv2l.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        
       const webCollection=client.db("webapplication").collection("webapplicationCollection")
       const commentCollection=client.db("webapplication").collection("comment")
       const completedCollection=client.db("webapplication").collection("completedData")

       app.get("/data",async(req,res)=>{
        const query={}
        const details= await webCollection.find(query).toArray()

        res.send(details)

       })
       app.post("/task",async(req,res)=>{
        const task=req.body
        
        const result= await webCollection.insertOne(task)
        res.send(result)
       })
       app.delete("/deletetask/:id",async (req,res)=>{
       
        const id=req.params.id 
        const query={_id :ObjectId(id)}
        const result= await webCollection.deleteOne(query)
        res.send(result)
       })

       app.post("/comment/:subject",async(req,res)=>{

        
        const commentData=req.body
      
        const result= await commentCollection.insertOne(commentData)
        res.send(result)
       })
       

    app.get("/completed",async(req,res)=>{

    const query={}
    const cursor=await completedCollection.find(query).toArray()
    res.send(cursor)
    })
    app.put("/updatedTask/:id",async(req,res)=>{
        const Id=req.params.id
        
        const info=req.body 
      

        const newsubject=info.subject;
        const newtask=info.task;

        const filter = {_id: ObjectId(Id)};
   
    const options = { upsert: true };

    const updateDoc = {
        $set: {
            subject: newsubject,
            task: newtask
        
        },
      };

      const result =await webCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })
    app.post("/completedTask/:id",async(req,res)=>{
        const id=req.params.id 
      
       
        const completed=req.body
        console.log(completed)
         const result=await completedCollection.insertOne(completed)
       
        
    })

           


    }
    finally{}

}
run().catch(console.dir)







app.listen(port,()=>{
    console.log("port 5000a choltace")
})