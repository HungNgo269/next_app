import Image from "next/image";

export default function Banner() {
  return (
    <section className=" w-full rounded-[20px] mb-10">
      <div className="w-full h-[400px] relative">
        <Image
          src="/testwideimg.jpg"
          alt="Banner"
          fill
          style={{ borderRadius: "8px" }}
          className="rounded-[8px]"
        />
      </div>
    </section>
  );
}
