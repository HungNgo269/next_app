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
      loading="lazy"
      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
    />
  );
}
