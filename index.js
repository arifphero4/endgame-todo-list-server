const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wryro.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const totalTodo = client.db("to-do-app").collection("totaltodo");

    app.post("/api/addingTodo", async (req, res) => {
      const data = req.body;
      const result = await totalTodo.insertOne(data);
      res.send(result);
    });

    app.get("/api/gettingTodo", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const result = await totalTodo.find(query).toArray();
      res.send(result);
    });

    app.put("/api/editTask/:id", async (req, res) => {
      const id = req.params.id;
      const taskInput = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateText = {
        $set: {
          taskInput: taskInput.taskInput,
        },
      };
      const result = await totalTodo.updateOne(filter, updateText, options);
      res.send(result);
    });

    app.put("/api/completeTask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          complete: true,
        },
      };
      const result = await totalTodo.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.get("/api/completedTask", async (req, res) => {
      const email = req.query.email;
      // const queryId = req.query.id;
      // const id = { _id: ObjectId(queryId) }
      const query = { email: email, complete: true };
      const result = await totalTodo.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task management app is running");
});

app.listen(port, () => {
  console.log("task management app Is Running at", port);
});

/* 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wryro.mongodb.net/?retryWrites=true&w=majority`;
const totalTodo = client.db("to-do-app").collection("totaltodo");

*/
