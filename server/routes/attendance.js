const router = require("express").Router();
const pool = require("../db"); // pastikan ini mengacu pada koneksi database Anda
const unirest = require("unirest");

router.get("/attendance", (req, res) => {
    var apiCall = unirest("GET", "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/");
    apiCall.headers({
        "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
        "x-rapidapi-key": "srclZqaa9imshAk9Xzz55u27oltLp1SqdiFjsnmva9PTpf2j3f"
    });

    apiCall.end(function(result) {
        if (result.error) {
            console.error(result.error);
            res.status(500).json({ error: "Failed to fetch geolocation data" });
        } else {
            console.log(result.body);
            res.send(result.body);
        }
    });
});



// Route untuk Check In
router.post("/checkin", async (req, res) => {
    try {
        // Dapatkan data dari body request
        const { user_id } = req.body;

        // Panggil API geolocation untuk mendapatkan lokasi user
        var apiCall = unirest("GET", "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/");
        apiCall.headers({
            "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
            "x-rapidapi-key": "srclZqaa9imshAk9Xzz55u27oltLp1SqdiFjsnmva9PTpf2j3f"
        });

        apiCall.end(async function(result) {
            if (result.error) {
                console.error(result.error);
                return res.status(500).json({ error: "Failed to fetch geolocation data" });
            }

            // Extract latitude and longitude
            const { latitude, longitude } = result.body;

            // Catat waktu Check In
            const checkInTime = new Date();

            // Simpan data Check In ke database
            const newAttendance = await pool.query(
                `INSERT INTO Attendances (user_id, check_in, location_lat, location_long, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                 RETURNING *`,
                [user_id, checkInTime, latitude, longitude]
            );

            res.json(newAttendance.rows[0]);
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Route untuk Check Out
router.post("/checkout", async (req, res) => {
    try {
        // Dapatkan data dari body request
        const { user_id } = req.body;

        // Panggil API geolocation untuk mendapatkan lokasi user
        var apiCall = unirest("GET", "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/");
        apiCall.headers({
            "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
            "x-rapidapi-key": "srclZqaa9imshAk9Xzz55u27oltLp1SqdiFjsnmva9PTpf2j3f"
        });

        apiCall.end(async function(result) {
            if (result.error) {
                console.error(result.error);
                return res.status(500).json({ error: "Failed to fetch geolocation data" });
            }

            // Extract latitude and longitude
            const { latitude, longitude } = result.body;

            // Catat waktu Check Out
            const checkOutTime = new Date();

            // Hitung jumlah jam kerja
            const checkInQuery = await pool.query(
                `SELECT check_in FROM Attendances WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
                [user_id]
            );

            const checkInTime = checkInQuery.rows[0].check_in;
            const hoursWorked = calculateHoursWorked(checkInTime, checkOutTime); // Fungsi untuk menghitung jam kerja

            // Update data Check Out ke database
            const updatedAttendance = await pool.query(
                `UPDATE Attendances 
                 SET check_out = $1, work_hours = $2, location_lat = $3, location_long = $4, updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $5 AND check_in = $6
                 RETURNING *`,
                [checkOutTime, hoursWorked, latitude, longitude, user_id, checkInTime]
            );

            res.json(updatedAttendance.rows[0]);
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// Fungsi untuk menghitung jumlah jam kerja berdasarkan waktu Check In dan Check Out
function calculateHoursWorked(checkInTime, checkOutTime) {
    const diff = checkOutTime.getTime() - checkInTime.getTime();
    const hours = diff / (1000 * 60 * 60); // Convert ke jam
    return hours.toFixed(2); // Mengembalikan jumlah jam dengan 2 digit desimal
}

module.exports = router;
