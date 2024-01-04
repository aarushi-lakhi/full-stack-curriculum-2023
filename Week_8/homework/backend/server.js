// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();
//const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");
db.settings({ ignoreUndefinedProperties: true });

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
/*app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
})*/
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
/*admin.initializeApp({
  credential: admin.credential.cert(creds),
  databaseURL: "https://tpeo-to-do-list-project.firebaseio.com",
}
);*/

//const db = admin.firestore();
// Firebase Admin Authentication Middleware
const auth = (req, res, next) => {
  //console.log("backendtoken" + req.get("Authorization").split("Bearer ")[1]);
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => res.status(401).send(error));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// Your API routes will go here...

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();
    
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
// ... 
app.get("/tasks/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    // Fetch all documents from tasks collection for a specific user
    const snapshot = await db.collection("tasks").where("userID", "==", userID).get();
    let tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).send(tasks);
  } catch (error) { 
    res.status(500).send(error.message);
  }
});

// POST: Endpoint to add a new task
// ...
app.post("/tasks", async (req, res) => {
  try {
    // Fetching the request body
    const userID = req.body.userID;
    const userTask = req.body.name;
    const finished = req.body.finished;
    const data = {
      'userID': userID,
      'task': userTask,
      'finished': finished
    } 
    // Adding a new document to the "tasks" collection
    const task = await db.collection("tasks").add(data);

    res.status(201).send({
      id: addedTask.id,  // Automatically generated Document ID from Firestore
      ...data,
    });
    
    // Sending a successful response
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE: Endpoint to remove a task
// ... 
app.delete("/tasks/:id", auth, async (req, res) => { 
  try {
    const id = req.params.id;
    // Deleting a document from the "tasks" collection
    await db.collection("tasks").doc(id).delete();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});