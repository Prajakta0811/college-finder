require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());
app.use(express.json());

/* =========================================================
   HOME ROUTE
========================================================= */

app.get("/", (req, res) => {

  res.send("College Finder API Running");

});

/* =========================================================
   SIGNUP
========================================================= */

app.post("/api/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    /* CHECK EXISTING USER */

    const existingUser =
      await pool.query(

        `
        SELECT *
        FROM users
        WHERE email = $1
        `,

        [email]

      );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({

        error: "User already exists"

      });

    }

    /* HASH PASSWORD */

    const hashedPassword =
      await bcrypt.hash(password, 10);

    /* INSERT USER */

    await pool.query(

      `
      INSERT INTO users
      (name, email, password)
      VALUES ($1, $2, $3)
      `,

      [
        name,
        email,
        hashedPassword
      ]

    );

    res.json({

      message: "Signup successful"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Signup failed"

    });

  }

});

/* =========================================================
   LOGIN
========================================================= */

app.post("/api/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    /* FIND USER */

    const user =
      await pool.query(

        `
        SELECT *
        FROM users
        WHERE email = $1
        `,

        [email]

      );

    if (user.rows.length === 0) {

      return res.status(400).json({

        error: "Invalid email"

      });

    }

    /* CHECK PASSWORD */

    const validPassword =
      await bcrypt.compare(

        password,
        user.rows[0].password

      );

    if (!validPassword) {

      return res.status(400).json({

        error: "Invalid password"

      });

    }

    res.json({

      message: "Login successful"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Login failed"

    });

  }

});

/* =========================================================
   FEATURED COLLEGES
   HOMEPAGE USES THIS
========================================================= */

app.get("/api/featured-colleges", async (req, res) => {

  try {

    const result =
      await pool.query(

        `
        SELECT *
        FROM colleges
        WHERE featured = true
        ORDER BY id ASC
        `

      );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Featured colleges error"

    });

  }

});

/* =========================================================
   GET ALL COLLEGES
   FOR SEARCH / FILTERS / EXPLORE PAGE
========================================================= */

app.get("/api/colleges", async (req, res) => {

  try {

    const result =
      await pool.query(

        `
        SELECT *
        FROM colleges
        ORDER BY rating DESC
        `

      );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Database error"

    });

  }

});

/* =========================================================
   SEARCH COLLEGES
========================================================= */

app.get("/api/colleges/search", async (req, res) => {

  try {

    const {
      course,
      state,
      college
    } = req.query;

    let query =
      "SELECT * FROM colleges WHERE 1=1";

    const values = [];

    /* COURSE */

    if (
      course &&
      course.trim() !== ""
    ) {

      values.push(
        `%${course.trim()}%`
      );

      query += `
        AND course ILIKE $${values.length}
      `;

    }

    /* STATE */

    if (
      state &&
      state.trim() !== ""
    ) {

      values.push(
        `%${state.trim()}%`
      );

      query += `
        AND state ILIKE $${values.length}
      `;

    }

    /* COLLEGE NAME */

    if (
      college &&
      college.trim() !== ""
    ) {

      values.push(
        `%${college.trim()}%`
      );

      query += `
        AND name ILIKE $${values.length}
      `;

    }

    /* EXECUTE QUERY */

    const result =
      await pool.query(
        query,
        values
      );

    res.json(result.rows);

  } catch (error) {

    console.error(
      "Search Error:",
      error
    );

    res.status(500).json({

      error: "Search error"

    });

  }

});

/* =========================================================
   GET COLLEGE BY ID
========================================================= */

app.get("/api/colleges/:id", async (req, res) => {

  try {

    const id =
      req.params.id;

    const result =
      await pool.query(

        `
        SELECT *
        FROM colleges
        WHERE id = $1
        `,

        [id]

      );

    if (result.rows.length === 0) {

      return res.status(404).json({

        error: "College not found"

      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Error fetching college"

    });

  }

});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});