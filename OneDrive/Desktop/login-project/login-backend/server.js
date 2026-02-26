const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Oracle DB connection config
const dbConfig = {
  user: "system",
  password: "System123",
  connectString: "localhost:1521/XEPDB1"
};

// 🔹 Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// 🔹 Save publication
app.post("/add-publication", async (req, res) => {
  const { author, title, pages, date, issuedBy } = req.body;

console.log("Incoming Data:", req.body);

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      
      `INSERT INTO PAPER_DB.PAPER 
       (author_name, title, pages, publication_date, issued_by)
       VALUES (:author, :title, :pages, TO_DATE(:date,'YYYY-MM-DD'), :issuedBy)`,
      { author, title, pages, date, issuedBy },
      { autoCommit: true }
    );

    await connection.close();

    res.json({ message: "Publication saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});



app.get("/publications", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT paper_id,
              author_name,
              title,
              pages,
              TO_CHAR(publication_date,'YYYY-MM-DD'),
              issued_by
       FROM PAPER_DB.PAPER
       ORDER BY paper_id`
    );

    await connection.close();

    res.json(result.rows.map(row => ({
      id: row[0],
      author: row[1],
      title: row[2],
      pages: row[3],
      date: row[4],
      issuedBy: row[5]
    })));

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.put("/update-publication/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, pages, date, issuedBy } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `UPDATE PAPER_DB.PAPER
       SET author_name = :author,
           title = :title,
           pages = :pages,
           publication_date = TO_DATE(:date,'YYYY-MM-DD'),
           issued_by = :issuedBy
       WHERE paper_id = :id`,
      { author, title, pages, date, issuedBy, id },
      { autoCommit: true }
    );

    await connection.close();
    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.delete("/delete-publication/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `DELETE FROM PAPER_DB.PAPER WHERE paper_id = :id`,
      { id },
      { autoCommit: true }
    );

    await connection.close();
    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);