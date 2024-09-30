require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// This is your test secret API key.
const stripe = require("stripe")(process.env.SECRET_STRIPE);

const port = process.env.PORT || 5000;
const app = express();

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
const uri =
  "mongodb+srv://fitness-quest:9WgGe2e9Bl3wJIuE@cluster1.phei2xm.mongodb.net/?appName=Cluster1";
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.phei2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

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

    /*  */
    const ALL_TRAINERCollection = client
      .db("fitQuest")
      .collection("ALL_TRAINER");

    /* ======UPDATE==== */
    const Trainer = client.db("fitQuest").collection("trainer");
    const userCollect = client.db("fitQuest").collection("userFitness");
    const newsLetter = client.db("fitQuest").collection("newsLetterFitness");
    const forumFitness = client.db("fitQuest").collection("forumFitness");
    const classFitness = client.db("fitQuest").collection("classFitness");
    const pendingTrainer = client.db("fitQuest").collection("pendingTrainer");
    const Subscriber = client.db("fitQuest").collection("subscriberFitness");
    const newClass = client.db("fitQuest").collection("newClassFroum");
    const manageSlot = client.db("fitQuest").collection("manage-slot");
    /* ============================================================================================================ */

    {
      /* all trainer */
    }
    app.post("/fitness/trainer", async (req, res) => {
      const trainer = req.body;

      const result = await Trainer.insertOne(trainer);
      res.send(result);
    });

    app.get("/fitness/allTrainer", async (req, res) => {
      const result = await userCollect.find().toArray();
      res.send(result);
    });
    app.get("/fitness/allTrainerNew", async (req, res) => {
      const result = await Trainer.find().toArray();
      res.send(result);
    });

    {
      /* delete */
    }
    app.delete("/fitness/allTrainer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollect.deleteOne(query);

      res.send(result);
    });
    /* user Trainer */
    app.post("/fitness/userFitness", async (req, res) => {
      try {
        const data = req.body;
        ////console.log(data);
        const result = await userCollect.insertOne(data);
        res.send(result);
      } catch (error) {
        //console.error(error);
        res.status(500).send("An error occurred");
      }
    });
    {
      /* DASHBOAD FORUM */
    }
    app.post("/fitness/forumFitness", async (req, res) => {
      try {
        const data = req.body;

        const result = await forumFitness.insertOne(data);

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
      }
    });
    app.get("/fitness/forumFitness", async (req, res) => {
      const result = await forumFitness.find().toArray();
      res.send(result);
    });
    app.get("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      //console.log(email, "DSFDSds");
      const query = { email: email };
      const user = await userCollect.findOne(query);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      if (user.role === "admin") {
        return res.send({ role: "admin" });
      }
      if (user.role === "trainer") {
        return res.send({ role: "trainer" });
      }
      return res.send({ role: "user" });
    });

    app.get("/fitness/classFitness", async (req, res) => {
      const data = req.body;
      const result = await classFitness.find().toArray();

      res.send(result);
    });
    {
      /* pending trainer */
    }
    app.post("/fitness/pending-trainer", async (req, res) => {
      const trainer = req.body;

      const result = await pendingTrainer.insertOne(trainer);
      res.send(result);
    });
    app.get("/fitness/pending-trainer", async (req, res) => {
      const result = await pendingTrainer.find().toArray();
      res.send(result);
    });
    app.get("/fitness/pending-trainers/:id", async (req, res) => {
      const id = req.params.id;

      try {
        // Construct the query to find the document by its ID
        const query = { _id: new ObjectId(id) };

        // Retrieve the specific pending trainer document
        const result = await pendingTrainer.findOne(query);

        // Send the result back to the client
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Trainer not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
      }
    });
    app.get("/fitness/pending-single-trainers/:email", async (req, res) => {
      const email = req.params.email;

      try {
        // Construct the query to find the document by its ID
        const query = { email: email };

        // Retrieve the specific pending trainer document
        const result = await userCollect.findOne(query);

        // Send the result back to the client
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Trainer not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
      }
    });
    app.delete(
      "/fitness/pending-single-trainersDeletee/:email",
      async (req, res) => {
        const email = req.params.email;

        try {
          // Construct the query to find the document by its ID
          const query = { email: email };

          // Retrieve the specific pending trainer document
          const result = await userCollect.deleteOne(query);

          // Send the result back to the client
          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: "Trainer not found" });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "An error occurred" });
        }
      }
    );

    {
      /*dashboard  admin */
    }

    app.post("/applictionBecameTrainerUpdata/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const trainerInfo = await pendingTrainer.findOne(query);
      const email = trainerInfo.email;

      const findUser = await userCollect.findOne({ email: email });

      const update = {
        $set: {
          role: "trainer",
        },
      };
      const updateRole = await userCollect.updateOne(findUser, update);
      const makeTrainer = await Trainer.insertOne(trainerInfo);
      const result = await pendingTrainer.deleteOne(query);

      //console.log(result);
      res.send(result);
    });

    {
      /* forum */
    }

    [
      /* newClassFroumCOllection */
    ];
    app.post("/fitness/newClass-forum", async (req, res) => {
      const trainer = req.body;

      const result = await newClassFroum.insertOne(trainer);

      res.send(result);
    });

    {
      /*    app.get("/fitness/new-class", async (req, res) => {
      const result = await newClass.find().toArray();
      res.send(result);
    }); */
    }

    {
      /* subscriber */
    }
    app.get("/fitness/subscibers", async (req, res) => {
      const result = await Subscriber.find().toArray();
      res.send(result);
    });

    app.post("/fitness/subsciber", async (req, res) => {
      const trainer = req.body;
      // //console.log(trainer)
      const result = await Subscriber.insertOne(trainer);
      res.send(result);
    });

    {
      /* dashboard trainer */
    }
    app.get("/fitness/booked-trainser/:email", async (req, res) => {
      const email = req.params.email;
      const querys = { email: email };

      const result = await Trainer.findOne(querys);

      // const result = await Trainer.find().toArray();
      res.send(result);
    });
    app.get("/fitness/allTrainerNew", async (req, res) => {
      const result = await Trainer.find().toArray();
      res.send(result);
    });
    app.delete(`/fitness/allTrainerNewDelete/:email`, async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await Trainer.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    app.get(`/fitness/single-trainer/:id`, async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await Trainer.findOne(query);

      res.send(result);
    });

    /* manage slot  */

    app.post("/fitness/manage-slot", async (req, res) => {
      const mangeSlot = req.body;
    //  console.log(mangeSlot);
      const email=mangeSlot.email;
      const query={email:email}

      const updatetedData = {
              
        $push: {
            slots: req.body.slot,
        }
    }

      const findTrainer=await Trainer.updateOne(query,updatetedData)
// console.log(findTrainer)
      res.send(findTrainer);
    });
/*     app.get("/fitness/manage-slots/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const result = await manageSlot.find(query).toArray();

      // const result = await Trainer.find().toArray();
      res.send(result);
    });
 */
    /* ======================================================================== */
    /* ========================🚩🚩🚩=========================================
                  STRIPE COLLECTION
========================================================================= */

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      //console.log(price);
      const amount = price * 100;
      //console.log(amount);

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
      //console.log({ paymentIntent });
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
      //console.log(payment);
      const paymentResult = await paymentCollection.insertOne(payment);
      res.send(paymentResult);
    });

    /* ========================🚩🚩🚩=========================================

========================================================================= */

    // /await client.db("admin").command({ ping: 1 });
    //console.log(
    ("Pinged your deploymensdft. You successfully connected to MongoDB!");
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
  //console.log("ASSINGMENT 12 LINTENTING 12 ");
});
