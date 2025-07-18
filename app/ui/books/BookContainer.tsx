import { sql } from "@/app/lib/db";
import BookCard from "./BookCard";
import { Product } from "@/app/interface/product";

export default async function BookContainer() {
  const NumberOfBook =
    await sql`SELECT COUNT(*) as Total_Products from products`;
  console.log("NumberOfBook", NumberOfBook[0].total_products);
  const Books: Product[] =
    await sql`SELECT * FROM products order by  created_at DESC LIMIT 5`;
  console.log("Books", Books);
  return (
    <div className="flex flex-col justify-center items-center  mt-10  mx-auto w-5/6">
      <span className="font-bold text-2xl w-full text-start">BestSeller</span>

      <div className="grid grid-cols-5 gap-12">
        {Books.map((Book: Product) => (
          <BookCard key={Book.id} BookId={Book.id} />
        ))}
      </div>
    </div>
  );
}
