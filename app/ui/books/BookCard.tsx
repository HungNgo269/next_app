import { ProductCard } from "@/app/interface/product";
import { sql } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

interface BookCardID {
  BookId: string;
}

export default async function BookCard({ BookId }: BookCardID) {
  const Books: ProductCard[] = await sql`
  SELECT id, name, price, image_urls, sold
  FROM products
  WHERE id = ${BookId}
`;
  const Book = Books[0];

  return (
    <Link
      href={`book/${BookId}`}
      className="flex flex-col  w-[220px] h-[445px] p-1 mt-10 cursor-po"
    >
      <div className="relative w-[200px] h-[300px]">
        <Image
          src={Book?.image_urls[0]}
          alt={Book.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex flex-col h-fit w-full mt-2.5">
        <span className="line-clamp-2  font-bold ">{Book.name}</span>
      </div>
    </Link>
  );
}
