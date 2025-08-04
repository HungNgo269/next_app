export default async function MostFollowBook() {
  return (
    <div>
      <div>
        <span className="font-bold text-lg text-start">Most views book</span>
      </div>
      <div className="space-y-3 mt-6">
        {rankings.map((item) => (
          <div key={item.rank} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                item.rank <= 3 ? "bg-red-500" : "bg-gray-500"
              }`}
            >
              {item.rank}
            </div>
            <div className="flex-shrink-0"></div>
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
