import Image from "next/image";
interface BannerProps {
  width: number;
}
export default function Banner({ width }: BannerProps) {
  return (
    <section className="mb-10">
      <Image
        src="/testwideimg.jpg"
        alt="Banner"
        width={width}
        height={0}
        className="h-auto rounded-[8px]"
      />
    </section>
  );
}
