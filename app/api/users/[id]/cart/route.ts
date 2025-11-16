// Load shopping cart for a user to use Mongodb
import { connectToDB } from "@/app/api/db";
import { products } from "@/app/product-data";
import { NextRequest } from "next/server";

// We want this type to represent an object that can have any string as its keys 
// and an array of strings as the values for those keys.
type ShoppingCart = Record<string, string[]>;

// Track carts for different users
// The values for each of those keys are arrays that contain the IDs of the products 
// that the user have added to their cart.
const carts: ShoppingCart = {
    '1': ['123', '234'],
    '2': ['345', '456'],
    '3': ['456', '234'],
}

type Params = {
    id: string;
}

export async function GET(request: NextRequest, {params}: {params: Promise <Params> }) {
    try {
        const { db } = await connectToDB();
        
        // Which user do we want to load the shopping cart for
        const {id: userId} = await params;

        // grab the users shoppingCart or productIds by searching for the corresponding record inside the db. 
        // aka document or users shopping cart
        const userCart = await db.collection('carts').findOne({ userId })

        if (!userCart) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const cartIds = userCart.cartIds ;

        // We need to populate those IDs with their corresponding products which is an array of product IDs in the user's cart.
        //provides all of the product whose IDs are in this array
        const cartProducts = await db.collection('products').find({id: {$in: cartIds} }).toArray();

        return new Response(JSON.stringify(cartProducts), {
            status: 200, 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to load cart'}), {
            status: 500, 
            headers: { 'Content-Type': 'application/json' }
        });
    }
}


type CartBody = {
    productId: string;
}

// Load add cart for a user using Mongodb
export async function POST(request: NextRequest, {params}: {params: Promise <Params> }) {
    try {
        const { db } = await connectToDB();

        // Which user do we want to load the shopping cart for
        const {id: userId} = await params;

        // we need a way for the user, the client side to indicate what item they want to add to their cart via a payload or req body
        const body: CartBody = await request.json();

        // get productId we want to add to the cart from the request
        const productId = body.productId;

        // Input validation: Check if productId exists and is a string
        if (!productId || typeof productId !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate product exists before adding to cart
        const product = await db.collection('products').findOne({ id: productId });
        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json'}
            })
        }

        // query the db to add the productId retrieved from the req body onto the cart endpoint or cartIds property of this document
        // and then we pass another object telling MongoDB what we want to do to the document that matches this criteria. 
        // The last object makes sure that if there is no matching cart in the database, MongoDB will create one for us. (adding missing data when we want to make some change to it)
        const updatedCart = await db.collection('carts').findOneAndUpdate(
            {userId},
            { $push: { cartIds: productId } },
            { upsert: true, returnDocument: 'after'},
        )

        // populate those Ids
        const cartProducts = await db.collection('products').find({ id: { $in: updatedCart.cartIds} }).toArray();

        // send back the response
        return new Response(JSON.stringify(cartProducts), {
            status: 201, //created
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch ( error ){
        return new Response(JSON.stringify({ error: 'Failed to add product to cart'}), {
            status: 500,
            headers: { 'Content-Type': 'application/json'}
        });
    }

}


export async function DELETE(request: NextRequest, {params}: {params: Promise <Params> }) {
    try {

        const { db } = await connectToDB();

        // grab the userId
        const {id: userId} = await params;

        // we need to get the ID of the item that they want to remove from their cart, which we can get from the request body.
        const body = await request.json();

        // get productId we want to remove from the cart from the request
        const productId = body.productId;

        // Input validation: Check if productId exists and is a string
        if (!productId || typeof productId !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // find and Update the ids that the user wants to delete
        const updatedCart = await db.collection('carts').findOneAndUpdate(
            { userId },
            { $pull: {cartIds: productId}}, //pull the productId for the cartId
            {returnDocument: 'after'} //if there is not matching cart for this user we want to send back an empty array
        );

        if (!updatedCart) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }

        // populate those Ids
        const cartProducts = await db.collection('products').find({ id: { $in: updatedCart.cartIds} }).toArray();

        // send back the response
        return new Response(JSON.stringify(cartProducts), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to remove product from the cart'}), {
            status: 500,
            headers: { 'Content-Type': 'application/json'}
        });
    }
}