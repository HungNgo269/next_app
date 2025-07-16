import { CategoryCard } from "@/app/interface/category";
import { sql } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function DestinationCard() {
  const categories: CategoryCard[] = await sql`
    SELECT id, name, image_url, url FROM categories LIMIT 7
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((category: CategoryCard) => (
        <div key={category.id} className="border rounded-lg p-4 shadow-sm">
          <Link href={category?.url || ""}>
            <Image
              src={category.image_url}
              alt={category.name}
              className="object-cover rounded-md p-10"
            />
            <span className="block mt-2 font-semibold text-lg">
              {category.name}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
