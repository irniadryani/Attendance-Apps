const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {
    // Query untuk mendapatkan role_id dari user berdasarkan user_id
    const roleQuery = await pool.query("SELECT role_id FROM users WHERE id = $1", [req.user]);

    console.log(roleQuery);

    if (roleQuery.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const role_id = roleQuery.rows[0].role_id;

    // Implementasikan logika dashboard berdasarkan peran (role)
    if (role_id === 'd9a94ed1-41ee-4d91-86f8-a4fe1f658747') {
      res.send('Dashboard untuk User');
    } else if (role_id === 'd64564e6-bf90-4956-b526-288125ab1bb2') {
      res.send('Dashboard untuk Admin');
    } else if (role_id === 'e3c9b131-1b6f-42bb-b24f-301dc59fc27a') {
      res.send('Dashboard untuk Superadmin');
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;


// router.get("/", authorization, async(req,res) =>{
//     try {
//         //req user has the payload
//         // res.json(req.user);

//         const user = await pool.query("SELECT full_name FROM users WHERE id = $1", [req.user]);

//         res.json(user.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json("Server Error");
//     }
// })
