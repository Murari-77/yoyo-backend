const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require('../models/room')

router.post("/bookroom", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ error: "Failed to create booking" });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
    try {
      const userid = req.body.userid;
      const bookings = await Booking.find({ userid: userid })
      .populate({
        path: "roomid",
        select: "name", // Select the hotel and name fields from the rooms collection
        model: "rooms", // Replace with your actual rooms model name
        populate: {
          path: "hotel",
          select: "hotelName", // Select the hotelName field from the users collection
          model: "users" // Replace with your actual users model name
        }
      })
      .exec();
      res.send(bookings);
    } catch (error) {
      console.error("Error fetching bookings by user ID:", error);
      res.status(400).json({ error: "Failed to fetch bookings by user ID" });
    }
  });

router.post("/getbookingsbyhotelid", async (req, res) => {
  try {
    const hotelid = req.body.hotelid;

    // Find all rooms belonging to the specified hotel
    const rooms = await Room.find({ hotelid: hotelid });

    // Extract room IDs from the retrieved rooms
    const roomIds = rooms.map(room => room._id);

    // Find bookings related to the retrieved room IDs
    const bookings = await Booking.find({ roomid: { $in: roomIds } })
      .populate({
        path: "roomid",
        select: "name",
        model: "rooms" // Select the roomName field from the rooms collection based on roomid
      })
      .populate({
        path: "userid",
        select: "fullName",
        model: "users" // Select the roomName field from the rooms collection based on roomid
      })
      .exec();

    res.send(bookings);
  } catch (error) {
    console.error("Error fetching bookings by hotel ID:", error);
    res.status(400).json({ error: "Failed to fetch bookings by hotel ID" });
  }
});

router.post("/cancelbooking", async (req, res) => {
  try {
    const { bookingid } = req.body;
    const bookingitem = await Booking.findOne({ _id: bookingid });
    if (!bookingitem) {
      return res.status(404).json({ error: "Booking not found" });
    }
    bookingitem.status = "Cancelled";
    await bookingitem.save();
    res.send("Your booking has been successfully cancelled");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(400).json({ error: "Failed to cancel booking" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(400).json({ error: "Failed to fetch all bookings" });
  }
});

module.exports = router;
