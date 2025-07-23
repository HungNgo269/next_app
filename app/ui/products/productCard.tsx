import { ProductCard } from "@/app/interface/product";
import { sql } from "@/app/lib/db";
import Image from "next/image";

interface ProductCardID {
  productId: string;
}

export default async function ProductCard({ productId }: ProductCardID) {
  const products: ProductCard[] = await sql`
  SELECT id, name, price, image_urls, sold
  FROM products
  WHERE id = ${productId}
`;
  const product = products[0];

  const discounts =
    await sql`SELECT discount_value from product_discounts where product_id=${productId}`;
  const discount = discounts[0]?.discount_value ?? 0;

  return (
    <div className="flex flex-col h-[300px] w-[188px] p-1 mt-10">
      <div className="relative w-[180px] h-[188px]">
        <Image
          src={product?.image_urls[0]}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
        <div className="absolute px-0.5 top-0 right-0 bg-pink-100 text-red-500 text-sm  ">
          - {discount}%
        </div>
      </div>

      <div className="flex flex-col h-[112px] w-full p-2">
        <span className="line-clamp-2 whitespace-nowrap h-10">
          {product.name}
        </span>
        <span className="line-clamp-2 whitespace-nowrap h-5 pr-[auto] mb-2">
          coupon
        </span>

        <div className="flex flex-row justify-between w-full ">
          <div className="flex flex-row relative text-red-500">
            <div className=" font-semibold">{product.price}</div>
            <div className="absolute top-0 right-[-10] text-xs underline">
              đ
            </div>
          </div>
          <div>Đã bán {product.sold}</div>
        </div>
      </div>
    </div>
  );
}
