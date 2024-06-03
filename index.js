const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.SECRET_STRIPE);

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());



/* stripe */
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
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful
    /* COLLECTION */
    const userCollection = client.db("fitQuest").collection("user");
    const newsLetterCollection = client.db("fitQuest").collection("newsLetter");
    const trainerCollection = client.db("fitQuest").collection("trainer");
    const becomeTrainerCollection = client
      .db("fitQuest")
      .collection("become-trainer");
    /* USER CNF */
    const userCnCollection = client.db("fitQuest").collection("userCNF");
    /* ========================🚩🚩🚩=========================================
                  STRIPE COLLECTION   
========================================================================= */

app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  console.log(price)
  const amount= parseInt(price * 100)
  
console.log(amount)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
console.log(paymentIntent)
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});










    /* ========================🚩🚩🚩=========================================
                        USER COLLECTION   
========================================================================= */

/* get email user */
app.get('/userCn/:email',async(req,res)=>{
const email=req.params.email;
console.log(email)
const result= await userCnCollection.findOne({email})
res.send(result)


})


/* get all userCn */

app.get('/userCn',async (req,res)=>{
const result= await userCnCollection.find().toArray()
res.send(result)


})


    /* USER CNF */
    app.put("/userCn", async (req, res) => {
      const user = req.body;
      /* if user is Exist */
      const isExist = userCnCollection.findOne({ email: user?.email });
      if (isExist) {
        return res.send(isExist);
      }
/* savae user firest time */
      const option = { upsert: true };
      const query = { email: user?.email };
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      };

      const result = await userCnCollection.updateOne(query, updateDoc, option);
      res.send(result);
    });

    /* ========================🚩🚩🚩=========================================
                        NEWS LETTER COLLECTION   
========================================================================= */
    /* get methos */
    app.get("/news-letter", async (req, res) => {
      const result = await newsLetterCollection.find().toArray();
      res.send(result);
    });

    /* post method */
    app.post("/newsLetter", async (req, res) => {
      const query = req.body;
      console.log(query);
      const result = await newsLetterCollection.insertOne(query);
      res.send(result);
    });
    /* ========================🚩🚩🚩=========================================
                     TRAINNER BOOKING COLLECTION   
========================================================================= */
    app.post("/trainer-booking", async (req, res) => {
      const qury = req.body;
      console.log(qury);
      const result = await trainerCollection.insertOne(qury);
      res.send(result);
    });
    /* ========================🚩🚩🚩=========================================
                        BEOME TRAINER COLLECTION   
========================================================================= */

    /* get mehtod beacome a trainer */
    app.get("/become-trainer", async (req, res) => {
      const result = await becomeTrainerCollection.find().toArray();
      res.send(result);
    });

    /* post method become a trainer */
    app.post("/become-trainer", async (req, res) => {
      const becomeTrainer = req.body;
      console.log(becomeTrainer);
      const result = await becomeTrainerCollection.insertOne(becomeTrainer);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

/* ========================🚩🚩🚩=========================================
                           
========================================================================= */

app.get("/", async (req, res) => {
  res.send("ASSINGMENT 12");
});

app.listen(port, () => {
  console.log("ASSINGMENT 12 LINTENTING 12 ");
});
