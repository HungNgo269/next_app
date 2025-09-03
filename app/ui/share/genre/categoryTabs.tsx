import { categories } from "@/app/constant/categories";
import Link from "next/link";

export default function CategoryTabs({
  activeGenre,
}: {
  activeGenre?: string;
}) {
  return (
    <div className="flex gap-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/book?genre=${category.slug}`}
          className={activeGenre === category.slug ? "active" : ""}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
