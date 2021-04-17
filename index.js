const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId ;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctgcy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const classCollection = client.db("cookingSchool").collection("classes");

  app.get('/classes', (req, res) => {
    classCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })     
  })

  app.get('/classes/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('Show ID', id)
    classCollection.find({_id: id})
    .toArray((err, documents) => {
      res.send(documents)
    })
    // console.log(documents)
  })


  app.post('/addClasses', (req, res) => {
    const newClass = req.body;
    console.log('adding new class', newClass);
    classCollection.insertOne(newClass)
    .then(result => {
      console.log('Inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})