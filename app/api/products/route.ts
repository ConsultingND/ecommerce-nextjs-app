// Load list product endpoint 
import { connectToDB } from "../db";

// creating list endpoint
export async function GET(request: Request) {

    // add a query to the database to load our data which is our products
    const { db } = await connectToDB();
    const products = await db.collection('products').find({}).toArray();


    // We need convert the array of products into a string and parse it by the front end by using JSON.stringify. 
    return new Response(JSON.stringify(products), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

/**
 * Use headers to specify what type of data this is supposed to be. Because we're converting this into a string, 
 * before we send it, we need to let the client know what that string is actually supposed to be turned into 
 * when it's received. 
 * */ 


// The list products endpoint is the easiest--All that this endpoint does is take the products from a file
//  and it sends them back to the client. Instead of getting those products from a file, we will load them from 
// the database. Makes it much easier in a prod; to change the products in the db w/o redeploy our application.