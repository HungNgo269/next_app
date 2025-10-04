import Image from "next/image";

interface ImageCardProps {
  bookImage: string;
  bookName: string;
}

export default function ImageCard({ bookImage, bookName }: ImageCardProps) {
  return (
    <Image
      src={bookImage || "/default-cover.png"}
      alt={bookName}
      fill
      className="object-cover duration-500 group-hover:scale-[102%] transition-transform"
    />
  );
}
