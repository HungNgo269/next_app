export default async function MostFollowBook() {
  const rankings = [
    {
      rank: 1,
      title: "Ryoushin no Shakkin w...",
      views: "12,782 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 2,
      title: "In no jitsury okusha ni n...",
      views: "12,124 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 3,
      title: "Kết hôn với đứa con gái ...",
      views: "11,492 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 4,
      title: "Shimotsuki wa Mob ga Suki",
      views: "11,279 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 5,
      title: "Mushoku Tensei - Isekai Ittara...",
      views: "10,271 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 6,
      title: "Con gái mẹ kế là bạn gái của...",
      views: "9,651 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 7,
      title: "Tôi bị tên senpai NTR mất bạn...",
      views: "9,173 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 8,
      title: "My Plain-looking Fiancee is Sec...",
      views: "8,987 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 9,
      title: "Làm bạn với cô nàng để thương...",
      views: "8,562 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 10,
      title: "Netoge no Yome ga Ninki Idol ...",
      views: "8,896 theo dõi",
      cover: "/placeholder.svg?height=40&width=40",
    },
  ];
  return (
    <div>
      <h2 className="font-bold text-lg mb-4 text-center">Top Rankings</h2>
      <div className="space-y-3">
        {rankings.map((item) => (
          <div key={item.rank} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                item.rank <= 3 ? "bg-red-500" : "bg-gray-500"
              }`}
            >
              {item.rank}
            </div>
            <div className="flex-shrink-0">
              {/* <img
                src="jawed.png"
                alt={item.title}
                width={40}
                height={40}
                className="rounded object-cover"
              /> */}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer truncate">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">{item.views}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
