// debug-env.js
console.log("=== Environment Debug ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL value:", `"${process.env.DATABASE_URL}"`);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length || 0);

// Check all DATABASE related vars
console.log("\n=== All DATABASE variables ===");
Object.keys(process.env)
  .filter((key) => key.includes("DATABASE"))
  .forEach((key) => {
    console.log(`${key}: "${process.env[key]}"`);
  });
