import { IChapter } from "@/app/interface/chapter";
import { IProductCard, IProductImage } from "@/app/interface/product";
import { sql } from "@/app/lib/db";
import Image from "next/image";

type PageProps = {
  params: {
    bookId: string;
  };
};
export default async function BookDetailPage({ params }: PageProps) {
  const BookId = params.bookId;
  console.log("params", params);
  //   const Chapters: IChapter[] = await sql`
  //   SELECT id,product_id, title, chapter_number, is_free
  //   FROM chapters
  //   WHERE id = ${ChapterId}
  // `;
  //   const Chapter = Chapters[0];

  //   const Books: IProductImage[] = await sql`
  //   SELECT image_urls
  //   FROM products
  //   WHERE id = ${BookId}
  // `;
  //   const image = Books[0].image_urls[0];

  return (
    <>{BookId}</>
    // <div className="flex flex-col  w-[220px] h-[445px] p-1 mt-10">
    //   <div className="relative w-[200px] h-[300px]">
    //     <Image
    //       src={Chapter?.image_urls[0]}
    //       alt={Chapter.name}
    //       fill
    //       className="object-cover rounded"
    //     />
    //   </div>

    //   <div className="flex flex-col h-fit w-full mt-2.5">
    //     <span className="line-clamp-2  font-bold w-full">{Chapter.name}</span>
    //   </div>
    // </div>
  );
}
