// return 'express' function & store it in a const express
const express = require('express');

// allow others to fetch data or connect front-end & back-end data
const cors = require('cors');

// ------ JWT ------
// require('crypto').randomBytes(64).toString('hex')
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


require('dotenv').config();


const app = express();

// middleware
app.use(cors());
// front-end thk pathano data receive krte problem hy, to solve it, we use express.json as middleware (req.body er mddhe data pawa jabe na eita use na krle)
app.use(express.json());

// V.V.I. https://github.com/auth0/node-jsonwebtoken
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  // authoriazation er pore, user i.e. header NAA thakle,
  if(!authHeader) {
    return res.status(401).send({message: 'unauthorized access'});
  }
  // console.log('inside verify JWT', authHeader); // see output
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if(err) {
      return res.status(403).send({message: 'Forbidded access'});
    }
    // console.log('decoded', decoded);
    req.decoded = decoded;
    // authorized hoile & err NAA thake, next a jabo
    next();
  })
}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtxh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('geniusCar').collection('service');
    const orderCollection = client.db('geniusCar').collection('order');

    // V.V.I. https://github.com/auth0/node-jsonwebtoken
    // AUTH with JWT
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
      });
      res.send({accessToken});
    })

    /* ----------------------------
    **** Order Collection API ****
    ---------------------------- */
    // load all services
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // create single API
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // POST
    app.post('/service', async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // DELETE
    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const service = await serviceCollection.deleteOne(query);
      res.send(service);
    });

    /* ----------------------------
    **** Order Collection API ****
    ---------------------------- */

    // GET (Multiple)
    // verifyJWT bujhe shune boshate hbe, order a boshailm
    app.get('/order', verifyJWT, async (req, res) => {
      console.log('decoded', req.decoded);
      const decodedEmail = req.decoded.email;
      /* const email = req.query;
      console.log(email); */
      const email = req.query.email;

      // ekjn er order info er response onno keu jno dekhte naa paay, so
      // ***** protteker alada email, jar email sudhu tar response ta k dba
      /* const query = {email: email};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders); */

      if(email === decodedEmail) {
        const query = {email: email};
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      } else {
        res.status(403).send({message: 'forbidden access'})
      }
    });

    // POST
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

  }
  
  finally {

  }
}

run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Running genius server');
})


const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log('listeningaaaaaa');
});