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
  const userReviewCollection = client.db("cookingSchool").collection("userReviews");
  const adminNewCollection = client.db("cookingSchool").collection("newAdmin");
  const sendApplyCollection = client.db("cookingSchool").collection("sendApply");

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

  app.post('/userReview', (req, res) => {
    const userReviews = req.body;
    console.log('adding new event: ', userReviews)
    userReviewCollection.insertOne(userReviews)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/userReview', (req, res) => {
    userReviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.post('/newAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log('adding new event: ', newAdmin)
    adminNewCollection.insertOne(newAdmin)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/newAdmin', (req, res) => {
    adminNewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.post('/isAdmin', (req, res) => {
    const data = req.body;
    const email = req.body.email;
    adminNewCollection.find({adminEmail: email
      })
    .toArray((err, newAdmin) => {
      res.send(newAdmin.length > 0);
    })      

  })

  app.delete('/deleteClass/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    classCollection.findOneAndDelete({_id: id})
    .then(result => {
      res.send(result.deleteCount>0)
    })
    // console.log(documents)
  })

  
  app.post('/sendApply', (req, res) => {
    const sendApply = req.body;
    console.log('adding new event: ', sendApply)
    sendApplyCollection.insertOne(sendApply)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/receiveApply', (req, res) => {
    sendApplyCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  
//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})