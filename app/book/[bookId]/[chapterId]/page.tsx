type PageProps = {
  params: {
    chapterId: string;
    bookId: string;
    slug: string;
  };
};
export default async function ChapterPage({ params }: PageProps) {
  const ChapterId = params.chapterId;
  const BookId = params.bookId;
  console.log("params", params);
  const increateView = await fetch(
    `http://localhost:3000/api/chapters/${ChapterId}/view`
  );
  const currentView = await fetch(
    `http://localhost:3000/api/chapters/${ChapterId}/stats`
  );
  const currentViewData = await currentView.json();
  console.log("c", currentViewData);
  //   const Chapters: Chapter[] = await sql`
  //   SELECT id,Book_id, title, chapter_number, is_free
  //   FROM chapters
  //   WHERE id = ${ChapterId}
  // `;
  //   const Chapter = Chapters[0];

  //   const Books: BookImage[] = await sql`
  //   SELECT image_urls
  //   FROM Books
  //   WHERE id = ${BookId}
  // `;
  //   const image = Books[0].image_urls[0];

  return (
    <>
      {BookId},{ChapterId}
    </>
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
