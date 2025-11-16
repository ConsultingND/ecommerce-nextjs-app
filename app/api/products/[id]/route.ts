// Load Product Endpoint
import { NextRequest } from "next/server";
import { connectToDB } from "../../db";

type Params = {
    id: string;
}

export async function GET(request: NextRequest, {params}: {params: Promise <Params> }) {
    // connect to db
    const { db } = await connectToDB();

    const {id: productId} = await params;

    // add query to retrieve a product whose ID i eqal to th productId from the params
    // Note: were are not searching for multile items, we expect to get back a signle item
    const product = await db.collection('products').findOne({ id: productId });


    // if product is not found.
    if (!product) {
        return new Response('Product not found!', {
            status: 404,
        });
    }

    return new Response(JSON.stringify(product), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
}



/**
 * 
 * Just like we were able to see one product on that a page, and then we were able to change the params to 
 * see a completely different product on that page. We can do the same with routes handlers, because that would 
 * allow us to load data for individual products instead of many products at once.
 * 
 * */ 