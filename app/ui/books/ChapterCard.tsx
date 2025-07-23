import { Chapter } from "@/app/interface/chapter";
import { ProductCard, ProductImage } from "@/app/interface/product";
import { sql } from "@/app/lib/db";
import Image from "next/image";

type PageProps = {
  ChapterId: string;
};
export default async function ChapterCard({ ChapterId }: PageProps) {
  const id = ChapterId;
  const Chapters: Chapter[] = await sql`
    SELECT id,product_id, title, chapter_number, is_free
    FROM chapters
    WHERE id = ${id}
  `;
  const chapter = Chapters[0];
  const Books: ProductImage[] = await sql`
    SELECT image_urls,description,name
    FROM products
    WHERE id = ${chapter.product_id}
  `;
  const book = Books[0];

  return (
    <div className="flex flex-row h-[190px]">
      <div className="relative min-w-[130px] h-[190px]">
        <Image
          src={book.image_urls[0]}
          alt={"book image"}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="flex flex-col h-fit w-fit mt-1 pl-6">
        <span className="line-clamp-1  font-bold w-full">{book.name}</span>
        <div className="line-clamp-2">
          <span className=" font-medium ">
            Chương {chapter.chapter_number}:
          </span>
          &nbsp;
          <span className=" font-medium">{chapter.title}</span>
        </div>
        <span className="line-clamp-3 w-full mt-2">{book.description}</span>
      </div>
    </div>
  );
}
