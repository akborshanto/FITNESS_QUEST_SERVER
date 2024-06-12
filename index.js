require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// This is your test secret API key.
const stripe = require("stripe")(process.env.SECRET_STRIPE);

const port = process.env.PORT || 5000;
const app = express();
// app.use(
//   cors({
//   // origin: ["*", "http://localhost:5173", " https://trainer-quet.web.app"],
//     credentials: true,
//   })
// );

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
    // await client.connect();
    // Send a ping to confirm a successful
    /* COLLECTION */
    // const userCollection = client.db("fitQuest").collection("user");
    const newsLetterCollection = client.db("fitQuest").collection("newsLetter");
    const trainerCollection = client
      .db("fitQuest")
      .collection("trainer-booking");
    const becomeTrainerCollection = client
      .db("fitQuest")
      .collection("become-trainer");
    /* USER CNF */
    // const userCnCollection = client.db("fitQuest").collection("userCNF");
    //const fordumCollection = client.db("fitQuest").collection("add-new-forum");
    const forumCollection = client.db("fitQuest").collection("forum");
    const ratingCollection = client.db("fitQuest").collection("rating");
    const roleCollection = client.db("fitQuest").collection("role");
    const paymentCollection = client.db("fitQuest").collection("payment");
    const adminFeedbackCollection = client
      .db("fitQuest")
      .collection("admin-feedback");

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

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      console.log(price);
      const amount = price * 100;
      console.log(amount);

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        // automatic_payment_methods: {
        //   enabled: true,
        // },
        payment_method_types: ["card"],
      });
      console.log({ paymentIntent });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.get("/payment-card", async (req, res) => {
      const payment = req.body;

      const paymentResult = await paymentCollection.find().toArray();
      res.send(paymentResult);
    });

    app.post("/payment-card", async (req, res) => {
      const payment = req.body;
      console.log(payment);
      const paymentResult = await paymentCollection.insertOne(payment);
      res.send(paymentResult);
    });
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
                        ZONKAR COLLECTION
========================================================================= */
    app.get("/moduleUser/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const result = await roleCollection.findOne({ email });
      res.send(result);
    });
    app.post("/moduleUser", async (req, res) => {
      const user = req.body;

      const query = { email: user.email };

      const existingUser = await roleCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "USER ALLLRETDT AXIST" });
      }
      const result = await roleCollection.insertOne(user);
      // console.log(result);
      res.send(result);
    });

    /* ========================🚩🚩🚩=========================================
                        CONCEPTET COLLECTION
========================================================================= */
    /* get email user */
    app.get("/userCn/:email", async (req, res) => {
      const email = req.params.email;

      const result = await userCnCollection.findOne({ email });
      res.send(result);
    });

    /* get all userCn */

    /* ========================🚩🚩🚩=========================================
                    FORUM _COLLECTION
========================================================================= */

    /* pagination */

    app.get("/all-forum-count", async (req, res) => {
      const count = await forumCollection.estimatedDocumentCount();
      res.send({ count });
    });

    /*  */
    app.get("/forum", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log(req.query)
      const result = await forumCollection
        .find()

        .skip(page * size)
        .limit(size)
        .toArray();
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

    // app.patch('/feedback/:dd',async(req,res)=>{
    //   const id=req.params.dd;
    //   const feedback=req.body;
    //   console.log(feedback)
    //   const query={_id: id}
    //   const option={upsert:true}
    //   const updateDoc={
    //     ...feedback
    //   }

    //   const result=await becomeTrainerCollection.updateOne(query,updateDoc,option)
    //   console.log(result)
    //   res.send(result)

    //   })

    app.get("/trainer-single-detail/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await becomeTrainerCollection.findOne(query);
      res.send(result);
    });

    /* get mehtod beacome a trainer */
    app.get("/become-trainer", async (req, res) => {
      const result = await becomeTrainerCollection.find().toArray();
      res.send(result);
    });

    /* post method become a trainer */
    app.post("/become-trainer", async (req, res) => {
      const becomeTrainer = req.body;

      const result = await becomeTrainerCollection.insertOne(becomeTrainer);
      res.send(result);
    });

    /* ========================🚩🚩🚩=========================================
                 ADMIN DASHBOARD
========================================================================= */

    /* role collection */
    app.patch("/role/admin/:email", async (req, res) => {
      const email = req.params.email;

      const updateDoc = {
        $set: {
          role: "trainer",
        },
      };

      const result = await roleCollection.updateOne({ email }, updateDoc);
      res.send(result);
    });

    /* UPDATE ROLE */
    // app.patch("/user/:email", async (req, res) => {
    //   const email = req.params.email;
    //   console.log(email);
    //   const user = req.body;
    //   console.log(user);
    //   const query = { email };

    //   const updateDoc = {
    //     $set: {
    //       ...user,
    //     },
    //   };

    //   const result = await userCnCollection.updateOne(query, updateDoc);

    //   res.send(result);
    // });

    /* single trainer Data */
    app.get("/singleTrainerData/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await becomeTrainerCollection.findOne(query);
      res.send(result);
    });

    /* pagination */
    app.get("/addNewClassAdmins", async (req, res) => {
      const count = await addNewClassAdminCollection.estimatedDocumentCount();
      res.send({ count });
    });

    /* add new collectiion */
    app.get("/addnewClassAdmin", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const result = await addNewClassAdminCollection
        .find()

        .skip(page * size)
        .limit(size)
        .toArray();

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

      const query = { email: email };

      // const query = { 'email': email };
      const result = await becomeTrainerCollection.find(query).toArray();
      res.send(result);
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

    // /await client.db("admin").command({ ping: 1 });
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
