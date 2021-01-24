const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 4000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vktpy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const classCollection = client.db("Beyond8").collection("classInfo");

  app.get('/allClasses', (req,res)=>{
      const search = req.query.search;
      classCollection.find({subject: {$regex: search}})
      .toArray((err, documents)=>{
          if(err){
              res.status(500).json({error: err, message: 'something went wrong'})
          }
          res.send(documents)
      })
  })

  app.get('/details/:id', (req,res)=>{
    classCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })


  
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port )