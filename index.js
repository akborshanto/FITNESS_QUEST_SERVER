const express=require('express')
const cors= require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port =process.env.PORT || 5000;
const app=express()
app.use(cors())
app.use(express.json())

/* ========================🚩🚩🚩=========================================
                          MONGODB
========================================================================= */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful 
/* COLLECTION */
const userCollection=  client.db('fitQuest').collection('user')

const newsLetterCollection=  client.db('fitQuest').collection('newsLetter')



/* ========================🚩🚩🚩=========================================
                        USER COLLECTION   
========================================================================= */

app.post('/user',async(req,res)=>{
const query=req.body;
console.log(query)
const result= await userCollection.insertOne(query)
console.table(result)
res.send(result)




})

/* ========================🚩🚩🚩=========================================
                        NEWS LETTER COLLECTION   
========================================================================= */

app.post('/newsLetter',async (req,res)=>{

const query= req.body;
console.log(query)
const result= await newsLetterCollection.insertOne(query)
res.send(result)



})




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  // await client.close();
  }
}
run().catch(console.dir);

/* ========================🚩🚩🚩=========================================
                           
========================================================================= */

app.get('/',async (req,res)=>{

res.send("ASSINGMENT 12")

})

app.listen(port,()=>{

    console.log("ASSINGMENT 12 LINTENTING 12 ")
})