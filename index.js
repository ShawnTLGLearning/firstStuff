const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
ObjectId = require("mongodb").ObjectId;
const server = express();
const PORT = 8080;
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(__dirname + "/public"));

const localDb = "mongodb://127.0.0.1:27017/game-of-thrones";
const atlasURL =
  "mongodb+srv://Shawn_charles:a90db52b@cluster0.ctxg1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "game-of-thrones";
let db;

server.listen(PORT, () => console.log(`server listening on PORT: ${PORT}`));

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

MongoClient.connect(localDb, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);

    console.log(`Connected MongoDB: ${localDb}`);
    console.log(`Database: ${dbName}`);

    const quotesCollection = db.collection("quotes");

    server.post("/quotes", (req, res) => {
      console.log("form submitted");
      console.log(req.body);

      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.status(200).json({ status: "success" });
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    });

    server.post("/update", (req, res) => {
      console.log("form submitted");
      console.log(req.body);
      let id = ObjectId(req.body._id);
      quotesCollection
        .findOneAndReplace({ _id: id }, req.body.stuff)
        .then((result) => {
          res.status(200).json({ status: "success" });
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    });

    server.get("/students", (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then((result) => {
          res.send(result);
        })
        .catch((error) => console.error(error));
    });

    server.get("/student/:id", (req, res) => {
      console.log(req.params.id);
      let id = ObjectId(req.params.id);
      quotesCollection.findOne({ _id: id }).then((info) => {
        res.send(info);
      });
    });

    server.delete("/students", (req, res) => {
      let id = ObjectId(req.body._id);

      console.log(req.body);
      quotesCollection
        .deleteOne({ _id: id })
        .then((result) => {
          res.status(200).json({ status: "success" });
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    });
  })
  .catch((error) => console.error(error));
