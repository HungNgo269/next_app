//Trong trường hợp không đổi categories (mostly)
export const categories = [
  {
    id: 1,
    name: "Classic",
    slug: "classic",
    title: "Timeless Literary Masterpieces!",
  },
  {
    id: 2,
    name: "Si-Fi",
    slug: "si-fi",
    title: "Explore Infinite Sci-Fi Worlds!",
  },
  {
    id: 3,
    name: "Romance",
    slug: "romance",
    title: "Most Popular Romance Stories!",
  },
  {
    id: 4,
    name: "Fantasy",
    slug: "fantasy",
    title: "Epic Fantasy Adventures Await!",
  },
  {
    id: 5,
    name: "Bildungsroman",
    slug: "bildungsroman",
    title: "Life-Changing Coming of Age Tales!",
  },
  {
    id: 6,
    name: "Dark Novel",
    slug: "dark-novel",
    title: "Dark Dystopian Future Stories!",
  },
  {
    id: 7,
    name: "Philosophy",
    slug: "philosophy",
    title: "Mind-Expanding Philosophy Books!",
  },
  {
    id: 8,
    name: "Self-Help",
    slug: "self-help",
    title: "Transform Your Life Today!",
  },
  {
    id: 9,
    name: "History",
    slug: "history",
    title: "Fascinating Historical Chronicles!",
  },
  {
    id: 10,
    name: "Psychology",
    slug: "psychology",
    title: "Deep Psychology Insights!",
  },
  {
    id: 11,
    name: "Biography",
    slug: "biography",
    title: "Inspiring Life Stories!",
  },
  {
    id: 13,
    name: "Non-Fiction",
    slug: "non-fiction",
    title: "Real Stories, Real Knowledge!",
  },
  {
    id: 14,
    name: "Adventure",
    slug: "adventure",
    title: "Thrilling Adventure Quests!",
  },
] as const;
export const sortOptions = [
  {
    id: 1,
    slug: "popularity",
    name: "Sort By Popularity",
  },
  {
    id: 2,
    slug: "newest",
    name: "Sort By Newest",
  },
  {
    id: 3,
    slug: "views",
    name: "Sort By Views",
  },
  {
    id: 4,
    slug: "rating",
    name: "Sort By Rating",
  },
];
export const sortOptionsTime = [
  {
    id: 1,
    name: "Today",
  },
  {
    id: 2,
    name: "Week",
  },
  {
    id: 3,
    name: "Month",
  },
];
// Type safety
export type categorieslug = (typeof categories)[number]["slug"];
export type category = (typeof categories)[number];

export type sortSlug = (typeof sortOptions)[number]["slug"];
export type sort = (typeof sortOptions)[number];

export type sortTimeName = (typeof sortOptions)[number]["name"];

// Utility functions for category
export const getcategoryBySlug = (slug: string): category | undefined => {
  return categories.find((category) => category.slug === slug);
};

export const getcategoryById = (id: number): category | undefined => {
  return categories.find((category) => category.id === id);
};

export const getcategoryByName = (name: string): category | undefined => {
  return categories.find((category) => category.name === name);
};

export const getcategoryNameBySlug = (slug: string): string => {
  return getcategoryBySlug(slug)?.name || "";
};

export const getcategoryIdByName = (name: string): number => {
  return getcategoryByName(name)?.id || 0;
};

export const getcategoryIdBySlug = (slug: string): number => {
  return getcategoryBySlug(slug)?.id || 0;
};

export const getcategorySlugById = (id: number): string => {
  return getcategoryById(id)?.slug || "";
};

export const getcategoryTitleBySlug = (slug: string): string => {
  return getcategoryBySlug(slug)?.title || "";
};

export const isValidcategorieslug = (slug: string): slug is categorieslug => {
  return categories.some((category) => category.slug === slug);
};
// Utility functions for sort
export const getSortOptionBySlug = (slug: string): sort | undefined => {
  return sortOptions.find((sort) => sort.slug === slug);
};

export const getSortOptionById = (id: number): sort | undefined => {
  return sortOptions.find((sort) => sort.id === id);
};

export const getSortOptionByName = (name: string): sort | undefined => {
  return sortOptions.find((sort) => sort.name === name);
};
// For select/dropdown components
export const category_OPTIONS = [
  ...categories.map((category) => ({
    id: category.id,
    value: category.slug,
    label: category.name,
  })),
];
export const sort_OPTIONS = [
  ...sortOptions.map((options) => ({
    id: options.id,
    slug: options.slug,
    name: options.name,
  })),
];
export const sort_OPTIONS_time = [
  ...sortOptionsTime.map((options) => ({
    id: options.id,
    name: options.name,
  })),
];
