
const express = require("express");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// HOME API
app.get("/", (req, res) => {
  res.send("Hello! My backend is working successfully!");
});

// GET ALL MECHANICS
app.get("/mechanics", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM mechanics ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Fetch mechanic error:", error.message);
    res.status(500).json({
      message: "Unable to fetch mechanics"
    });
  }
});

// REGISTER MECHANIC
app.post("/mechanics", async (req, res) => {
  const {
    name,
    phone_no,
    location,
    service,
    experience_years,
    price
  } = req.body;

  if (!name?.trim() || !location?.trim() || !service?.trim()) {
    return res.status(400).json({
      message: "Plz enter the all require fields"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO mechanics
       (name, phone_no, location, service, experience_years, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name.trim(),
        phone_no?.trim() || null,
        location.trim(),
        service.trim(),
        experience_years === "" || experience_years == null
          ? null
          : Number(experience_years),
        price === "" || price == null
          ? null
          : Number(price)
      ]
    );

    res.status(201).json({
      message: "Mechanic registerde sucessfully",
      mechanic: result.rows[0]
    });
  } catch (error) {
    console.log("Mechanic registered Error:", error.message);
    res.status(500).json({
      message: "Unable to register mechanic"
    });
  }
});

// VERIFY MECHANIC
app.put("/mechanics/:id/verification", async (req, res) => {
  const mechanicId = req.params.id;
  const { verification_status } = req.body;

  if (verification_status !== "verified") {
    return res.status(400).json({
      message: "Invalid verification status"
    });
  }

  try {
    const result = await pool.query(
      `UPDATE mechanics
       SET verification_status = $1
       WHERE id = $2
       RETURNING *`,
      [verification_status, mechanicId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "mechanic not found"
      });
    }

    res.status(200).json({
      message: "mechanic verified sucessfully",
      mechanic: result.rows[0]
    });
  } catch (error) {
    console.log("Mechanic verification error:", error.message);
    res.status(500).json({
      message: "Unable to verified the mechanic"
    });
  }
});

// TEST BOOKING ROUTE
app.get("/booking", (req, res) => {
  res.send("Booking route is reachable");
});

// GET ALL BOOKINGS
app.get("/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Fetch booking error:", error.message);
    res.status(500).json({
      message: "Unable to Fetch the booking"
    });
  }
});

// CREATE BOOKING WITH CUSTOMER COORDINATES
app.post("/booking", async (req, res) => {
  console.log("BOOKING REQUEST RECEIVED");

  const bookingDetails = req.body;

  const customerName = bookingDetails.customerName?.trim();
  const phoneNo = bookingDetails.phoneNo?.trim();
  const vehicle = bookingDetails.vehicle?.trim();
  const currentLocation = bookingDetails.Location?.trim();
  const service = bookingDetails.service?.trim();

  const latitude =
    bookingDetails.latitude === "" || bookingDetails.latitude == null
      ? null
      : Number(bookingDetails.latitude);

  const longitude =
    bookingDetails.longitude === "" || bookingDetails.longitude == null
      ? null
      : Number(bookingDetails.longitude);

  if (
    !customerName ||
    !phoneNo ||
    !vehicle ||
    !currentLocation ||
    !service
  ) {
    return res.status(400).json({
      message: "PLZ ENTER ALL THE FIELD"
    });
  }

  if (
    (latitude === null) !== (longitude === null) ||
    (latitude !== null &&
      (!Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180))
  ) {
    return res.status(400).json({
      message: "Invalid latitude or longitude"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings
       (customer_name, phone_number, vehicle, current_location,
        service, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        customerName,
        phoneNo,
        vehicle,
        currentLocation,
        service,
        latitude,
        longitude
      ]
    );

    res.status(201).json({
      message: "Booking create Sucessfully",
      booking: result.rows[0]
    });
  } catch (error) {
    console.log("Booking data error:", error.message);
    res.status(500).json({
      message: "Unable to save booking"
    });
  }
});

// UPDATE MECHANIC
app.put("/mechanics/:id", async (req, res) => {
  const mechanicId = req.params.id;

  const {
    phone_no,
    location,
    service,
    experience_years,
    price,
    availability
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE mechanics
       SET phone_no = COALESCE($1, phone_no),
           location = COALESCE($2, location),
           service = COALESCE($3, service),
           experience_years = COALESCE($4, experience_years),
           price = COALESCE($5, price),
           availability = COALESCE($6, availability)
       WHERE id = $7
       RETURNING *`,
      [
        phone_no ?? null,
        location ?? null,
        service ?? null,
        experience_years ?? null,
        price ?? null,
        availability ?? null,
        mechanicId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "mechanic not found"
      });
    }

    res.status(200).json({
      message: "Mechanic update sucessfully",
      mechanic: result.rows[0]
    });
  } catch (error) {
    console.log("Update Mechanic error:", error.message);
    res.status(500).json({
      message: "Unable to update mechanic"
    });
  }
});

// DELETE MECHANIC
app.delete("/mechanics/:id", async (req, res) => {
  const mechanicId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM mechanics
       WHERE id = $1
       RETURNING *`,
      [mechanicId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Mechanic is not found"
      });
    }

    res.status(200).json({
      message: "Mechanic delete sucessfully",
      mechanic: result.rows[0]
    });
  } catch (error) {
    console.log("Deleted mechanic error:", error.message);
    res.status(500).json({
      message: "Unable to delete mechanic"
    });
  }
});

// DATABASE CONNECTION CHECK
console.log("BOOKING ROUTE IS LOADED");

pool.query("SELECT NOW()")
  .then(result => {
    console.log("postgreSQL connected Sucessfully!");
    console.log(result.rows);
  })
  .catch(error => {
    console.log("Database Connection is error:", error.message);
  });

// UPDATE BOOKING STATUS
app.put("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      message: "Plz provide a booking status"
    });
  }

  if (!["confirmed", "completed"].includes(status)) {
    return res.status(400).json({
      message: "Invalid Booking status"
    });
  }

  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.status(200).json({
      message: "Booking status update sucessfully",
      booking: result.rows[0]
    });
  } catch (error) {
    console.log("Update Booking error:", error.message);
    res.status(500).json({
      message: "Unable to update Booking status"
    });
  }
});

// MECHANIC ACCEPT BOOKING
app.put("/bookings/:id/accept", async (req, res) => {
  const bookingId = req.params.id;
  const { mechanic_id } = req.body;

  if (!mechanic_id) {
    return res.status(400).json({
      message: "Plz provide mechanic ID"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mechanicResult = await client.query(
      `SELECT id FROM mechanics
       WHERE id = $1
       AND verification_status = 'verified'
       AND availability = false
       FOR UPDATE`,
      [mechanic_id]
    );

    if (mechanicResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Verified and availability mechanic is not found"
      });
    }

    const result = await client.query(
      `UPDATE bookings
       SET status = 'confirmed'
       WHERE id = $1
       AND status = 'pending'
       AND mechanic_id = $2
       RETURNING *`,
      [bookingId, mechanic_id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Assigned pending booking not found"
      });
    }

    await client.query(
      `UPDATE mechanics
       SET availability = false
       WHERE id = $1`,
      [mechanic_id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "bookings accepted sucessfully",
      booking: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Accept booking error:", error.message);
    res.status(500).json({
      message: "unable to accept the booking"
    });
  } finally {
    client.release();
  }
});

// MECHANIC REJECT BOOKING
app.put("/bookings/:id/reject", async (req, res) => {
  const bookingId = req.params.id;
  const { mechanic_id } = req.body;

  if (!mechanic_id) {
    return res.status(400).json({
      message: "plz provide mechanic ID"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mechanicResult = await client.query(
      `SELECT id FROM mechanics
       WHERE id = $1
       AND verification_status = 'verified'
       AND availability = false
       FOR UPDATE`,
      [mechanic_id]
    );

    if (mechanicResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Assign Mechanic is not found"
      });
    }

    const result = await client.query(
      `UPDATE bookings
       SET mechanic_id = NULL
       WHERE id = $1
       AND mechanic_id = $2
       AND status = 'pending'
       RETURNING *`,
      [bookingId, mechanic_id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Assigned pending Booking is not found"
      });
    }

    await client.query(
      `UPDATE mechanics
       SET availability = true
       WHERE id = $1`,
      [mechanic_id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Booking rejected Sucessfully",
      booking: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Reject booking error:", error.message);
    res.status(500).json({
      message: "Unablt to Reject Booking"
    });
  } finally {
    client.release();
  }
});

// COMPLETE BOOKING
app.put("/bookings/:id/complete", async (req, res) => {
  const bookingId = req.params.id;
  const { mechanic_id } = req.body;

  if (!mechanic_id) {
    return res.status(400).json({
      message: "Plz provide mechanic ID"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mechanicResult = await client.query(
      `SELECT id FROM mechanics
       WHERE id = $1
       AND verification_status = 'verified'
       AND availability = false
       FOR UPDATE`,
      [mechanic_id]
    );

    if (mechanicResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Verified assigned mechanics not found"
      });
    }

    const result = await client.query(
      `UPDATE bookings
       SET status = 'completed'
       WHERE id = $1
       AND mechanic_id = $2
       AND status = 'confirmed'
       RETURNING *`,
      [bookingId, mechanic_id]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "confirmed assigned booking not found"
      });
    }

    const activeBookings = await client.query(
      `SELECT COUNT(*) FROM bookings
       WHERE mechanic_id = $1
       AND status IN ('pending', 'confirmed')`,
      [mechanic_id]
    );

    if (Number(activeBookings.rows[0].count) === 0) {
      await client.query(
        `UPDATE mechanics
         SET availability = true
         WHERE id = $1`,
        [mechanic_id]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Booking completed sucessfully",
      booking: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Complete booking error:", error.message);
    res.status(500).json({
      message: "Unable to complete booking"
    });
  } finally {
    client.release();
  }
});

// GET BOOKINGS FOR A MECHANIC
app.get("/mechanics/:id/bookings", async (req, res) => {
  const mechanicId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE mechanic_id = $1
       ORDER BY id DESC`,
      [mechanicId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Fetch mechanic bookings error:", error.message);
    res.status(500).json({
      message: "Unable to fetch the mechanic bookings"
    });
  }
});

// ASSIGN MECHANIC TO BOOKING
app.put("/bookings/:id/assign", async (req, res) => {
  const bookingId = req.params.id;
  const { mechanic_id } = req.body;

  if (!mechanic_id) {
    return res.status(400).json({
      message: "Plz provide Mechanic ID"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const mechanicResult = await client.query(
      `SELECT id FROM mechanics
       WHERE id = $1
       AND verification_status = 'verified'
       AND availability = true
       FOR UPDATE`,
      [mechanic_id]
    );

    if (mechanicResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Assign mechanic is not found"
      });
    }

    const result = await client.query(
      `UPDATE bookings
       SET mechanic_id = $1
       WHERE id = $2
       AND status = 'pending'
       AND mechanic_id IS NULL
       RETURNING *`,
      [mechanic_id, bookingId]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Assigned pending booking is not found"
      });
    }

    await client.query(
      `UPDATE mechanics
       SET availability = false
       WHERE id = $1`,
      [mechanic_id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Mechanic Assigned sucessfully",
      booking: result.rows[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Mechanic assignment error:", error.message);
    res.status(500).json({
      message: "Unable to Assign mechanic"
    });
  } finally {
    client.release();
  }
});

// CUSTOMER REGISTRATION
app.post("/register", async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (
    !fullName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !password?.trim()
  ) {
    return res.status(400).json({
      message: "Plz enter the all the required field"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
       (full_name, email, phone, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, phone, created_at`,
      [
        fullName.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        hashedPassword
      ]
    );

    res.status(201).json({
      message: "Customer registered sucessfully",
      user: result.rows[0]
    });
  } catch (error) {
    console.log("Customer registration error:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    res.status(500).json({
      message: "Unable to register the customer"
    });
  }
});

// CUSTOMER LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      message: "Plz enter the Email and Password"
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Email or password"
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or password"
      });
    }

    res.status(200).json({
      message: "login sucessfully",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({
      message: "Unable to login"
    });
  }
});

// GET ALL CUSTOMERS
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, created_at
       FROM users
       ORDER BY id DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Fetch customers error:", error.message);
    res.status(500).json({
      message: "Unable to fetch customers"
    });
  }
});

// ADD CUSTOMER VEHICLE
app.post("/vehicles", async (req, res) => {
  const {
    user_id,
    vehicle_type,
    vehicle_model,
    registration_number
  } = req.body;

  if (!user_id || !vehicle_type || !vehicle_model) {
    return res.status(400).json({
      message: "Please enter all required vehicle details"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO vehicles
       (user_id, vehicle_type, vehicle_model, registration_number)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        user_id,
        vehicle_type,
        vehicle_model,
        registration_number || null
      ]
    );

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: result.rows[0]
    });
  } catch (error) {
    console.log("Add vehicle error:", error.message);
    res.status(500).json({
      message: "Unable to add vehicle"
    });
  }
});

// GET VEHICLES FOR ONE CUSTOMER
app.get("/users/:userId/vehicles", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM vehicles WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Fetch vehicles error:", error.message);
    res.status(500).json({
      message: "Unable to fetch vehicles"
    });
  }
});

// CUSTOMER SUBMITS FEEDBACK AND RATING
app.post("/bookings/:id/feedback", async (req, res) => {
  const bookingId = req.params.id;
  const { rating, feedback, phone_number } = req.body;

  const customerRating = Number(rating);

  if (
    !Number.isInteger(customerRating) ||
    customerRating < 1 ||
    customerRating > 5 ||
    !phone_number ||
    !feedback?.trim()
  ) {
    return res.status(400).json({
      message: "Please provide a valid rating, phone number and feedback"
    });
  }

  try {
    const bookingResult = await pool.query(
      `SELECT id, phone_number, status
       FROM bookings
       WHERE id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const booking = bookingResult.rows[0];

    if (String(booking.phone_number) !== String(phone_number)) {
      return res.status(403).json({
        message: "You cannot review this booking"
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Feedback can be submitted only after service completion"
      });
    }

    const result = await pool.query(
      `UPDATE bookings
       SET rating = $1, feedback = $2
       WHERE id = $3
       RETURNING *`,
      [customerRating, feedback.trim(), bookingId]
    );

    res.status(200).json({
      message: "Feedback submitted successfully",
      booking: result.rows[0]
    });

  } catch (error) {
    console.log("Customer feedback error:", error.message);
    res.status(500).json({
      message: "Unable to submit feedback"
    });
  }
});

// CUSTOMER SUBMITS A COMPLAINT
app.post("/complaints", async (req, res) => {
  const { booking_id, customer_name, phone_number, complaint } = req.body;

  if (!booking_id || !customer_name || !phone_number || !complaint?.trim()) {
    return res.status(400).json({
      message: "Please provide all complaint details"
    });
  }

  try {
    const bookingResult = await pool.query(
      `SELECT id, phone_number
       FROM bookings
       WHERE id = $1`,
      [booking_id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (
      String(bookingResult.rows[0].phone_number) !==
      String(phone_number)
    ) {
      return res.status(403).json({
        message: "This booking does not belong to this customer"
      });
    }

    const result = await pool.query(
      `INSERT INTO complaints
       (booking_id, customer_name, phone_number, complaint)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [booking_id, customer_name, phone_number, complaint.trim()]
    );

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: result.rows[0]
    });

  } catch (error) {
    console.error("Complaint submission error:", error.message);
    res.status(500).json({
      message: "Unable to submit complaint"
    });
  }
});


// ADMIN FETCHES ALL COMPLAINTS
app.get("/complaints", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM complaints ORDER BY id DESC`
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Fetch complaints error:", error.message);
    res.status(500).json({
      message: "Unable to fetch complaints"
    });
  }
});


// ADMIN UPDATES COMPLAINT STATUS
app.put("/complaints/:id", async (req, res) => {
  const complaintId = req.params.id;
  const { status, admin_response } = req.body;

  const allowedStatuses = ["open", "in_progress", "resolved"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid complaint status"
    });
  }

  try {
    const result = await pool.query(
      `UPDATE complaints
       SET status = $1,
           admin_response = $2
       WHERE id = $3
       RETURNING *`,
      [status, admin_response || null, complaintId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint: result.rows[0]
    });

  } catch (error) {
    console.error("Update complaint error:", error.message);
    res.status(500).json({
      message: "Unable to update complaint"
    });
  }
});


// ADMIN REPORTS AND REVENUE SUMMARY
app.get("/admin/reports", async (req, res) => {
  try {
    const bookingResult = await pool.query(
      `SELECT
         COUNT(*) AS total_bookings,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending_bookings,
         COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_bookings,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed_bookings
       FROM bookings`
    );

    const revenueResult = await pool.query(
      `SELECT
         COALESCE(SUM(m.price), 0) AS estimated_revenue
       FROM bookings b
       LEFT JOIN mechanics m ON b.mechanic_id = m.id
       WHERE b.status = 'completed'`
    );

    const customerResult = await pool.query(
      `SELECT COUNT(*) AS total_customers FROM users`
    );

    const mechanicResult = await pool.query(
      `SELECT COUNT(*) AS total_mechanics FROM mechanics`
    );

    const complaintResult = await pool.query(
      `SELECT
         COUNT(*) AS total_complaints,
         COUNT(*) FILTER (WHERE status = 'open') AS open_complaints,
         COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_complaints,
         COUNT(*) FILTER (WHERE status = 'resolved') AS resolved_complaints
       FROM complaints`
    );

    res.status(200).json({
      bookings: bookingResult.rows[0],
      estimated_revenue: revenueResult.rows[0].estimated_revenue,
      customers: customerResult.rows[0],
      mechanics: mechanicResult.rows[0],
      complaints: complaintResult.rows[0]
    });

  } catch (error) {
    console.log("Admin reports error:", error.message);

    res.status(500).json({
      message: "Unable to fetch admin reports"
    });
  }
});


// START SERVER
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
