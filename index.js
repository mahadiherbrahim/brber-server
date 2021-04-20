const express = require('express')
const app = express()
const port = process.env.PORT || 4000 
const cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.goub9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("completeWebsite").collection("services");
  const bookingCollection = client.db("completeWebsite").collection("booking");
  const testimonialCollection = client.db("completeWebsite").collection("testimonial");

  //Show All Services
  app.get('/services',(req,res) => {
    serviceCollection.find()
      .toArray((err,items) => {
          res.send(items)
      })
  })

  // Booking Service
  app.get('/booking/:id',(req,res) =>{
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,document)=>{
        res.send(document)
      })
  })


  // Add Booking
  app.post('/addBooking',(req,res)=>{
      const newProduct = req.body
      bookingCollection.insertOne(req.body)
      .then(result=>{
        res.send(result.insertedCount > 0)
      })
  })

  //Booking List
  app.get('/bookingList/:email',(req,res) =>{
    bookingCollection.find({email: req.params.email})
    .toArray((err,document)=>{
        res.send(document)
        console.log('booking list')
      })
  })

  //Add Testimonial
  app.post('/addTestimonial',(req,res)=>{
    const newProduct = req.body
    testimonialCollection.insertOne(req.body)
    .then(result=>{
      console.log('Testimonial Inserted',result.insertedCount);
      res.send(result.insertedCount > 0)
      })
  })

  //Show All Testimonial
  app.get('/testimonial',(req,res) => {
    testimonialCollection.find()
      .toArray((err,items) => {
          res.send(items)
      })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Complete Website listening at http://localhost:${port}`)
})