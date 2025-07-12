import { sql } from "@/app/lib/db";
import ProductCard from "./productCard";
import { Product } from "@/app/lib/definitions";

export default async function ProductContainer() {
  //   const NumberOfproduct =
  //     await sql`SELECT COUNT(*) as Total_product from products`;
  const Products: Product[] = await sql`SELECT * FROM products `;
  console.log("pr", Products);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-5 gap-8">
        {Products.map((product: Product) => (
          <ProductCard key={product.id} productId={product.id} />
        ))}
      </div>
    </div>
  );
}
