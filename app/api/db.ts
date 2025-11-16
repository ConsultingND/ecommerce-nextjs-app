import { Db, MongoClient, ServerApiVersion } from 'mongodb';

// Because the operation connecting to a database is slow, the Purpose this serves is that if we already have a 
// connection established, we don't need to reestablish it every time by saying client.connect. 
// This improves the performance of our application considerably.
// setting the type per typescript requirements
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;


export async function connectToDB() {

// check if both already exist
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb}
    }

    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.ofjkhpt.mongodb.net/?appName=Cluster0`;

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });

    // Ensures that the client is connected
    await client.connect();

    // set cachedClient and cachedDb after the connection
    cachedClient = client;
    cachedDb = client.db('ecommerce-nexjs')

    // make the connet avaiable -> and easier to access the preicise thing we are trying to get
    return { client, db: client.db('ecommerce-nexjs') }
}