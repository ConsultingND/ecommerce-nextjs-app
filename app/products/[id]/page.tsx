// Add basic fetching functionality to the product detail page.
 
 import NotFoundPage from "@/app/not-found";

export default async function ProductDetailPage({ params }: {params: Promise<{ id: string}>}){
  const response = await fetch (`http://localhost:3000/api/products/` + (await params).id);
  const product = await response.json();
    
  if (!product) {
    return <NotFoundPage />
  } 

  return (
    <div className="container mx-auto p-8 flex flex-col md:flex-row">
      <div className="md:w-1/2 mb-4 md:mb-0 md:mr-8">
        <img src={'/assets/' + product.imageUrl} 
          alt="Product Image" 
          className="w-full h-auto rounded-lg shadow-md"/>
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-4">{ product.name } </h1>
        <p className="text-2xl text-gray-600 mb-6">${ product.price.toFixed(2) }</p> 
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
      <h2 className="text-gray-600 ">{ product!.description }</h2>         
      </div>
    </div>

  )
}



/**
 * Automatically pass data about the URL as a prop aka params
 * Since this is Next.js 15+ the params props is now asynchronous ( a  promise)
 * Given that the params is a Promise we need to make the component async and await the params.id
 *  Here we have Promise that is an obj with the key ID whose value is going to be string
 * */ 

/**
 * className description: create a container, w/ horizon margin to be auto, padding all round 8, flex to set the items in this container side-by-side in columns, all medium size screens to be set in rows
 * 
 * m-w-1/2 on medium screens take up half of the screens
 * */ 