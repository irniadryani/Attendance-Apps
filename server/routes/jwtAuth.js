const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerate = require("../utils/jwtGenerate");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const { check, validationResult } = require("express-validator");

//register

router.post("/register", validInfo, async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length !== 0) {
      return res.status(401).send("User already exist");
    } else if (user.rows.length === 0) {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        "INSERT INTO users (full_name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, bcryptPassword, role_id]
      );

      const token = jwtGenerate(newUser.rows[0].user_id);

      res.json({ token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//login


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      "SELECT u.id, u.full_name, u.email, u.password, r.name as role FROM users u INNER JOIN roles r ON u.role_id = r.id WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).send("Email or Password is Incorrect");
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).send("Email or Password is Incorrect");
    }
    const token = jwtGenerate(user.rows[0].id);
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        fullName: user.rows[0].full_name,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

//
