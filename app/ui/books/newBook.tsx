"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  description: string;
  coverImage: string;
  category: string;
  categoryLabel: string;
  reviewedBy: string;
}

const categories = [
  { id: "featured", name: "Featured", color: "bg-amber-500" },
  { id: "fantasy", name: "Fantasy", color: "bg-purple-500" },
  { id: "romance", name: "Romance", color: "bg-pink-500" },
];

const booksData: Record<string, Book[]> = {
  featured: [
    {
      id: 1,
      title: "The Seven Moons of Maali Almeida",
      author: "Shehan Karunatilaka",
      rating: 4.5,
      description:
        "A darkly comic fantasy about a photographer who wakes up dead and has seven moons to solve his own murder.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "featured",
      categoryLabel: "LITERARY FICTION",
      reviewedBy: "Sarah Mitchell",
    },
    {
      id: 2,
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      rating: 4.8,
      description:
        "A novel about friendship, art, and identity, told through the lens of video game design and the creative process.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "featured",
      categoryLabel: "CONTEMPORARY FICTION",
      reviewedBy: "Michael Chen",
    },
    {
      id: 3,
      title: "The Atlas Six",
      author: "Olivie Blake",
      rating: 4.3,
      description:
        "Six young magicians compete for a place in an exclusive society, but only five will be chosen.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "featured",
      categoryLabel: "DARK ACADEMIA",
      reviewedBy: "Emma Rodriguez",
    },
    {
      id: 4,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      rating: 4.6,
      description:
        "A story told from the perspective of an artificial friend, exploring love, sacrifice, and what it means to be human.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "featured",
      categoryLabel: "SCIENCE FICTION",
      reviewedBy: "David Park",
    },
    {
      id: 5,
      title: "The Midnight Girls",
      author: "Alicia Jasinska",
      rating: 4.4,
      description:
        "A dark fairy tale retelling set in a world where three witches hold the fate of a kingdom in their hands.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "featured",
      categoryLabel: "FAIRY TALE RETELLING",
      reviewedBy: "Lisa Thompson",
    },
    {
      id: 6,
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      rating: 4.7,
      description:
        "A woman cursed to be forgotten by everyone she meets lives for centuries until she meets someone who remembers her.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "featured",
      categoryLabel: "HISTORICAL FANTASY",
      reviewedBy: "James Wilson",
    },
  ],
  fantasy: [
    {
      id: 7,
      title: "The Priory of the Orange Tree",
      author: "Samantha Shannon",
      rating: 4.9,
      description:
        "An epic fantasy featuring dragons, magic, and a world on the brink of war between ancient forces.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "fantasy",
      categoryLabel: "EPIC FANTASY",
      reviewedBy: "Rachel Green",
    },
    {
      id: 8,
      title: "The Poppy War",
      author: "R.F. Kuang",
      rating: 4.6,
      description:
        "A grimdark military fantasy inspired by 20th-century China, following a war orphan's journey to power.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "fantasy",
      categoryLabel: "MILITARY FANTASY",
      reviewedBy: "Alex Turner",
    },
    {
      id: 9,
      title: "The Ten Thousand Doors of January",
      author: "Alix E. Harrow",
      rating: 4.5,
      description:
        "A portal fantasy about a young woman who discovers doors to other worlds through the pages of a mysterious book.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "fantasy",
      categoryLabel: "PORTAL FANTASY",
      reviewedBy: "Sophie Davis",
    },
    {
      id: 10,
      title: "The Goblin Emperor",
      author: "Katherine Addison",
      rating: 4.7,
      description:
        "A court intrigue fantasy about a half-goblin prince who unexpectedly becomes emperor and must navigate palace politics.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "fantasy",
      categoryLabel: "COURT FANTASY",
      reviewedBy: "Mark Johnson",
    },
    {
      id: 11,
      title: "The Bear and the Nightingale",
      author: "Katherine Arden",
      rating: 4.8,
      description:
        "A lyrical fantasy rooted in Russian folklore, where old magic clashes with new religion in medieval Russia.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "fantasy",
      categoryLabel: "FOLKLORE FANTASY",
      reviewedBy: "Anna Petrov",
    },
    {
      id: 12,
      title: "The Blade Itself",
      author: "Joe Abercrombie",
      rating: 4.4,
      description:
        "A gritty fantasy that subverts traditional fantasy tropes with morally complex characters and dark humor.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "fantasy",
      categoryLabel: "GRIMDARK FANTASY",
      reviewedBy: "Tom Anderson",
    },
  ],
  romance: [
    {
      id: 13,
      title: "Beach Read",
      author: "Emily Henry",
      rating: 4.6,
      description:
        "Two rival writers challenge each other to write outside their comfort zones during a summer at the beach.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "romance",
      categoryLabel: "CONTEMPORARY ROMANCE",
      reviewedBy: "Jessica Brown",
    },
    {
      id: 14,
      title: "The Hating Game",
      author: "Sally Thorne",
      rating: 4.5,
      description:
        "Office enemies become lovers in this enemies-to-lovers romance filled with tension and witty banter.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "romance",
      categoryLabel: "ENEMIES TO LOVERS",
      reviewedBy: "Megan White",
    },
    {
      id: 15,
      title: "Red, White & Royal Blue",
      author: "Casey McQuiston",
      rating: 4.8,
      description:
        "The First Son of the United States falls in love with the Prince of Wales in this LGBTQ+ romance.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "romance",
      categoryLabel: "LGBTQ+ ROMANCE",
      reviewedBy: "Chris Martinez",
    },
    {
      id: 16,
      title: "The Spanish Love Deception",
      author: "Elena Armas",
      rating: 4.3,
      description:
        "A fake dating romance between academic rivals who must pretend to be in love for a wedding in Spain.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "romance",
      categoryLabel: "FAKE DATING",
      reviewedBy: "Isabella Garcia",
    },
    {
      id: 17,
      title: "People We Meet on Vacation",
      author: "Emily Henry",
      rating: 4.7,
      description:
        "Best friends take one last vacation together to save their friendship, but feelings complicate everything.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "romance",
      categoryLabel: "FRIENDS TO LOVERS",
      reviewedBy: "Amanda Taylor",
    },
    {
      id: 18,
      title: "The Kiss Quotient",
      author: "Helen Hoang",
      rating: 4.4,
      description:
        "An econometrician hires a male escort to help her learn about intimacy and relationships.",
      coverImage:
        "https://res.cloudinary.com/dm3j1fqob/image/upload/v1751940644/slides/itcybgip34j0yunz4kpv.jpg",
      category: "romance",
      categoryLabel: "CONTEMPORARY ROMANCE",
      reviewedBy: "Nicole Kim",
    },
  ],
};

export default async function RecentlyDiscoveredSection() {
  const [activeCategory, setActiveCategory] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 4;

  const currentBooks = booksData[activeCategory] || [];
  const totalPages = Math.ceil(currentBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const displayedBooks = currentBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xl font-semibold text-gray-900 mb-8">
            Recently discovered
          </span>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeCategory === category.id
                    ? "text-amber-600 border-amber-500 bg-amber-50"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {displayedBooks.map((book) => (
            <div
              key={book.id}
              className="flex gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <div className="w-24 h-32 relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-2">
                {/* Category Label */}
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {book.categoryLabel}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {book.title}
                </h3>

                {/* Author and Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {book.author}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(book.rating)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                {/* Reviewed By */}
                <div className="pt-2">
                  <span className="text-xs text-gray-500">
                    Reviewed by{" "}
                    <span className="text-amber-600 font-medium">
                      {book.reviewedBy}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-amber-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Showing {startIndex + 1}-
          {Math.min(startIndex + booksPerPage, currentBooks.length)} of{" "}
          {currentBooks.length} books
        </div>
      </div>
    </section>
  );
}
