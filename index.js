const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
// This is your test secret API key.

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const stripe = require("stripe")(process.env.SECRET_STRIPE);

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
    const trainerCollection = client
      .db("fitQuest")
      .collection("trainer-booking");
    const becomeTrainerCollection = client
      .db("fitQuest")
      .collection("become-trainer");
    /* USER CNF */
    const userCnCollection = client.db("fitQuest").collection("userCNF");
    const forumCollection = client.db("fitQuest").collection("forum");
    const ratingCollection = client.db("fitQuest").collection("rating");
    /* dashboard */

    const addNewClassAdminCollection = client
      .db("fitQuest")
      .collection("addNewClassAdimin");
    const addNewSlotTrainer = client
      .db("fitQuest")
      .collection("addNewSlotTrainer");
    /* ========================🚩🚩🚩=========================================
                  STRIPE COLLECTION   
========================================================================= */

    // app.post("/create-payment-intent", async (req, res) => {
    //   const { price } = req.body;
    //   console.log(price);
    //   const amount = price * 100;
    //   console.log(amount);

    //   // Create a PaymentIntent with the order amount and currency
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: "usd",
    //     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    //     automatic_payment_methods: {
    //       enabled: true,
    //     },
    //     payment_method_types: ["card"],
    //   });

    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //   });
    // });

    /* ========================🚩🚩🚩=========================================
                    RATINGNG_COLLECTION   
========================================================================= */
    /* get all ratin */
    app.get("/rating", async (req, res) => {
      const result = await ratingCollection.find().toArray();
      res.send(result);
    });

    /* post method */

    app.post("/rating", async (req, res) => {
      const query = req.body;

      const result = await ratingCollection.insertOne(query);
      res.send(result);
    });

    /* ========================🚩🚩🚩=========================================
                        USER COLLECTION   
========================================================================= */

    app.post("/user-add", async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email };
      const findUser = await userCnCollection.findOne(query);

      if (findUser && findUser.email !== user.email) {
        const result = await userCnCollection.insertOne(user);
        res.send(result);
      } else {
        res.send("user already exist");
      }
    });

    /* get email user */
    app.get("/userCn/:email", async (req, res) => {
      const email = req.params.email;

      const result = await userCnCollection.findOne({ email });
      res.send(result);
    });

    /* get all userCn */

    app.get("/userCn", async (req, res) => {
      const result = await userCnCollection.find().toArray();
      res.send(result);
    });

    /* USER CNF */
    app.post("/userCn", async (req, res) => {
      const user = req.body;

      /* if user is Exist */
      const isExist = userCnCollection.findOne({ email: user?.email });
      if (isExist) return res.send(isExist);
      // if (isExist) {
      //   return res.send(isExist);
      // }
      /* savae user firest time */

      const updateDoc = {
        ...user,
        timestamp: Date.now(),
      };

      const result = await userCnCollection.insertOne(updateDoc);

      res.send(result);
    });

    /* ========================🚩🚩🚩=========================================
                    FORUM _COLLECTION   
========================================================================= */

    app.get("/forum", async (req, res) => {
      const result = await forumCollection.find().toArray();

      res.send(result);
    });

    /* get the singe data from FORUMCOLELCTION */
    app.get("/forums/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await forumCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    /* post method */
    app.post("/forum", async (req, res) => {
      const query = req.body;

      const result = await forumCollection.insertOne(query);
      // console.log(result);
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

    /* PROJECTION */
    app.get("/projection", async (req, res) => {
      const bookingDetails = await trainerCollection
        .find(
          {},
          {
            projection: {
              slot: 1,
              role: 1,
            },
          }
        )
        .toArray();
      const bookingCount = await trainerCollection.countDocuments();

      console.log(bookingDetails);
      res.send({ bookingDetails, bookingCount });
    });

    /* get method */
    app.get("/trainer-booking", async (req, res) => {
      const result = await trainerCollection.find().toArray();
      res.send(result);
    });

    /* post method */
    app.post("/trainer-booking", async (req, res) => {
      const qury = req.body;

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
    /* ========================🚩🚩🚩=========================================
                    All TRAINER _COLLECTION   
========================================================================= */

    /* ========================🚩🚩🚩=========================================
                 ADMIN DASHBOARD
========================================================================= */

    /* UPDATE ROLE */
    app.patch("/user/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const user = req.body;
      console.log(user);
      const query = { email };

      const updateDoc = {
        $set: {
          ...user,
        },
      };

      const result = await userCnCollection.updateOne(query, updateDoc);

      res.send(result);
    });

    /* single trainer Data */
    app.get("/singleTrainerData/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await becomeTrainerCollection.findOne(query);
      res.send(result);
    });

    /* add new collectiion */
    app.get("/addnewClassAdmin", async (req, res) => {
      const result = await addNewClassAdminCollection.find().toArray();
      res.send(result);
    });

    /* add new classs */
    app.post("/addnewClassAdmin", async (req, res) => {
      const query = req.body;
      console.log(query);
      const result = await addNewClassAdminCollection.insertOne(query);
      console.log(result);
      res.send(result);
    });

    /* add */
    /* ========================🚩🚩🚩=========================================
               TRAINERDASHBOARD
========================================================================= */


app.post("/add-NewSlot-Trainer", async (req, res) => {
  const query = req.body;
  console.log(query);
  const result = await addNewSlotTrainer.insertOne(query);
  console.log(result);
  res.send(result);
});








    app.get("/addNewSlotTrainer/:email", async (req, res) => {
      const email = req.params.email;
 
const query={'email':email}

      // const query = { 'email': email };
      const result = await becomeTrainerCollection.find(query).toArray();
      res.send(result)
    });

    /* delete trainer */
    app.delete("/manageSlot/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await trainerCollection.deleteOne(query);
      res.send(result);
    });

    /* ========================🚩🚩🚩=========================================
                 
========================================================================= */

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deploymensdft. You successfully connected to MongoDB!"
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
