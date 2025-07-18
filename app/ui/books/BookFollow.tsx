import Image from "next/image";

export default async function BookFollow() {
  console.log("ÁDADasd");
  return (
    <>cc</>
    // <div>
    //   <h2 className="font-bold text-lg mb-4 text-center">Top Rankings</h2>
    //   <div className="space-y-3">
    //     {rankings.map((item) => (
    //       <div key={item.rank} className="flex items-center gap-3">
    //         <div
    //           className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
    //             item.rank <= 3 ? "bg-red-500" : "bg-gray-500"
    //           }`}
    //         >
    //           {item.rank}
    //         </div>
    //         <div className="flex-shrink-0">
    //           <Image
    //             src="jawed.png"
    //             alt={item.title}
    //             width={40}
    //             height={40}
    //             className="rounded object-cover"
    //           />
    //         </div>
    //         <div className="flex-1 min-w-0">
    //           <h4 className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer truncate">
    //             {item.title}
    //           </h4>
    //           <p className="text-xs text-gray-500">{item.views}</p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}
