import { CategoryCard } from "@/app/interface/category";
import { sql } from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function DestinationContainer() {
  const categories: CategoryCard[] = await sql`
    SELECT id, name, image_url, url FROM categories limit 7
  `;

  return (
    <div className="mt-10  mx-auto w-5/6">
      <span className="font-bold text-2xl">Browse by categories</span>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mt-20 mb-4">
        {categories.map((category: CategoryCard) => (
          <div key={category.id} className=" w-full h-[300px] hover:underline">
            <Link className=" w-full h-full" href={category?.url || ""}>
              <div className="flex justify-center items-center  rounded-[50%]  shadow-sm">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px] object-cover rounded-full"
                />
              </div>
              <span className="block mt-10 font-semibold text-lg text-center">
                {category.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
