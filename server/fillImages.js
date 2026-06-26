require("dotenv").config();
const pool = require("./db");

async function fillImages() {
  try {
    const result = await pool.query(
      "SELECT id, name FROM colleges WHERE image IS NULL"
    );

    for (let college of result.rows) {
      const imageUrl = `https://source.unsplash.com/400x300/?college,${encodeURIComponent(college.name)}`;

      await pool.query(
        "UPDATE colleges SET image = $1 WHERE id = $2",
        [imageUrl, college.id]
      );

      console.log(`Updated: ${college.name}`);
    }

    console.log("✅ All missing images updated!");
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

fillImages();