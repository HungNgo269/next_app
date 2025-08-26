export const categories = [
  { id: 1, name: "Classic", slug: "classic" },
  { id: 2, name: "Si-Fi", slug: "si-fi" },
  { id: 3, name: "Romance", slug: "romance" },
  { id: 4, name: "Fantasy", slug: "fantasy" },
  { id: 5, name: "Bildungsroman", slug: "bildungsroman" },
  { id: 6, name: "Dark Novel", slug: "dark-novel" },
  { id: 7, name: "Philosophy", slug: "philosophy" },
  { id: 8, name: "Self-Help", slug: "self-help" },
  { id: 9, name: "History", slug: "history" },
  { id: 10, name: "Psychology", slug: "psychology" },
  { id: 11, name: "Biography", slug: "biography" },
  { id: 13, name: "Non-Fiction", slug: "non-fiction" },
  { id: 14, name: "Adventure", slug: "adventure" },
] as const;

// Type safety
export type categorieslug = (typeof categories)[number]["slug"];
export type category = (typeof categories)[number];

// Utility functions
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

export const isValidcategorieslug = (slug: string): slug is categorieslug => {
  return categories.some((category) => category.slug === slug);
};

// For select/dropdown components
export const category_OPTIONS = [
  ...categories.map((category) => ({
    id: category.id,
    value: category.slug,
    label: category.name,
  })),
];

// For validation
export const VALID_category_SLUGS = categories.map((c) => c.slug);

// Export individual categories if needed
export const ACTION_CLASSIC = categories.find((c) => c.slug === "classic")!;
export const ACTION_SI_FI = categories.find((c) => c.slug === "si-fi")!;
export const ACTION_ROMANCE = categories.find((c) => c.slug === "romance")!;
export const ACTION_FANTASY = categories.find((c) => c.slug === "fantasy")!;
export const ACTION_BILDUNGSROMAN = categories.find(
  (c) => c.slug === "bildungsroman"
)!;
export const ACTION_DARK_NOVEL = categories.find(
  (c) => c.slug === "dark-novel"
)!;
export const ACTION_PHILOSOPHY = categories.find(
  (c) => c.slug === "philosophy"
)!;
export const ACTION_SELF_HELP = categories.find((c) => c.slug === "self-help")!;
export const ACTION_HISTORY = categories.find((c) => c.slug === "history")!;
export const ACTION_PSYCHOLOGY = categories.find(
  (c) => c.slug === "psychology"
)!;
export const ACTION_BIOGRAPHY = categories.find((c) => c.slug === "biography")!;
export const ACTION_NON_FICTION = categories.find(
  (c) => c.slug === "non-fiction"
)!;
export const ACTION_ADVENTURE = categories.find((c) => c.slug === "adventure")!;
