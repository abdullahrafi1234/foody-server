const express = require('express');
const cors = require('cors');
//for .env file
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev0lfe7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const foodsCollection = client.db('foodDB').collection('food')
        const requestCollection = client.db('foodDB').collection('request')


        // foods
        app.get('/addFood', async(req,res) => {
            const cursor = foodsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get('/addFood/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await foodsCollection.findOne(query)
            res.send(result)
        })


        //get my foods in table
        app.get('/addFoods/:email', async(req, res) => {
            const email = req.params.email
            const query = {email: email}
            const result = await foodsCollection.find(query).toArray()
            res.send(result)
        })


        //get my foods request 
        app.get('/request/:email', async(req, res) => {
            const email = req.params.email
            const query = {email: email}
            const result = await requestCollection.find(query).toArray()
            res.send(result)
        })



        //request 
        app.post('/request', async(req, res) => {
            const request = req.body
            const result = await requestCollection.insertOne(request)
            res.send(result)
        })

        
        // add food
        app.post('/addFood', async(req, res) => {
            const food = req.body
            console.log(food);
            const result = await foodsCollection.insertOne(food)
            res.send(result)
        })

        //update food
        app.put('/addFood/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedFood = req.body
            const updated = {
                $set: {
                    foodName: updatedFood.foodName,
                    quantity: updatedFood.quantity,
                    location: updatedFood.location,
                    date: updatedFood.date,
                    notes: updatedFood.notes,
                    status: updatedFood.status,
                    photo: updatedFood.photo,

                }
            }
            const result = await foodsCollection.updateOne(filter, updated,options)
            res.send(result)

        })


        //update food status
        app.patch('/addFood/:id', async(req, res) => {
            const id = req.params.id
            const status = req.body
            const query = {_id: new ObjectId(id)}
            const updateStatus = {
                $set: status,
            }
            const result = await foodsCollection.updateOne(query,updateStatus)
            res.send(result)
        })



        //delete food
        app.delete('/addFood/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




// see in the website
app.get('/', (req, res) => {
    res.send('Assignment eleven is running')
})




//for running on server side cmd
app.listen(port, () => {
    console.log(`Assignment eleven is running on port: ${port}`)
})