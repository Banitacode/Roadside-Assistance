//console.log("My first backend programme");
const express = require ("express");
const pool = require("./db");
const app = express();
const cors = require("cors")
app.use(cors())
let mechanic ={
  name:"Ravi",
  location:"Hydrabad",
  service:"BikeRepair"
}
app.get("/", (req, res) => {
  res.send("Hello! My backend is working successfully!");//1ST API 
});
app.use(express.json());
app.get("/mechanics",(req,res) => {
   // res.send("Here the list of the mechanics");// 2ND API
   if (mechanic === null){
     return res.status(404).json({
      message:"Mechanic not found"
    })
   }
    res.status(200).json(mechanic)
});
app.get("/booking", (req, res) => {
  res.send("Booking route is reachable");
});
app.get("/bookings",async(req,res)=>{
  try{
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY id DESC"
    );
  
res.status(200).json(result.rows);//dought---row
} catch(error){
  console.log("Fetch booking error:", error.message);
  res.status(500).json({
    message:"Unable to Fetch the booking"
  });
}
})
app.post("/booking",async (req,res)=>{
  console.log("BOOKING REQUEST RECEIVED");
  const bookingDetails = req.body;//3rd API
  const customerName = bookingDetails.customerName?.trim()
  const phoneNo = bookingDetails.phoneNo?.trim()
  const vehicle =bookingDetails.vehicle?.trim()
  const currentLocation = bookingDetails.Location?.trim()
  const  service = bookingDetails.service?.trim()
  if(!customerName || !phoneNo || !vehicle || !currentLocation || !service){
    return res.status(400).json({
   message:"PLZ ENTER ALL THE FIELD"
    });
  }
  console.log(bookingDetails)
  try{
   const result = await pool.query(
    `INSERT INTO bookings
    (customer_name,phone_number,vehicle,current_location,service)
    VALUES($1,$2,$3,$4,$5)
    RETURNING *`,
    [customerName,phoneNo,vehicle,currentLocation,service]
   );
  res.status(201).json({
    message:"Booking create Sucessfully",
    booking:result.rows[0]//dought
  })
} catch(error){
  console.log("Booking data error :",error.message)

res.status(500).json({
  message:"Unable to save booking"

});
}
})
app.put("/mechanics",(req,res)=>{
  if(mechanic === null){
    return res.status(404).json({
      message:"Mechanic not found"
    })
  }
 mechanic.service = req.body.service;
 mechanic.location = req.body.location;
  res.status(200).json({
    message:"Message update  sucessfully",
    mechanic :mechanic
  })
})
app.delete("/mechanics",(req,res)=>{
  mechanic = null;
res.status(200).json({
  message:"Mechanic delete sucessfully"
});
});
console.log("BOOKING ROUTE IS LOADED");
pool.query("SELECT NOW()")
.then(result => {
  console.log("postgreSQL connected Sucessfully!")
  console.log(result.rows)//dought  rows
})
.catch(error => {
  console.log("Database Connection is error :",error.message);
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
