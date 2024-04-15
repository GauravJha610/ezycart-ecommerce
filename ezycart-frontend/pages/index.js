import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";


export default function Home({featuredProduct,newProducts}) {
  // console.log(featuredProduct,newProducts)
  return(
    <div>
      <Header/>
      <Featured product={featuredProduct}/>
      <NewProducts products={newProducts}/>  
    </div>
  )
}

export async function getServerSideProps(){
  const featuredProductId = '661d4a1431f3930fb43fce67';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({},null,{sort:{'_id':-1},limit:10});    //{} to det all products(no filtering), "null" get all data/attributes
  return{
    props:{
      featuredProduct : JSON.parse(JSON.stringify(featuredProduct)),
      newProducts : JSON.parse(JSON.stringify(newProducts)),
    }
  }
}