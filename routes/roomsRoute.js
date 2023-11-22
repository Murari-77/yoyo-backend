const express = require("express");
const router = express.Router();

const Room = require('../models/room')


router.get("/getallrooms", async(req, res) => {

   
    try{
        const rooms = await Room.find({})
        res.send(rooms)
    } catch (error) {
        return res.status(400).json({ message: error });
    }


});

router.get("/getroomsbyhotelid/:hotelId", async (req, res) => {
    const { hotelId } = req.params;
  
    try {
      const rooms = await Room.find({ hotel: hotelId });
      res.send(rooms);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

router.post("/getroombyid", async(req, res) => {

   const roomid = req.body.roomid

    try{
        const room = await Room.findOne({_id : roomid})
        res.send(room)
    } catch (error) {
        return res.status(400).json({ message: error });
    }


});

router.post("/addroom", async(req, res)=>{
    try{
        const newroom = new Room(req.body)
        await newroom.save()

        res.send('New Room Added Successfully')
    } catch(error){
        return res.status(400).json({error});
    }
});

router.delete('/deleteById/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the room by ID and delete it
      const deletedRoom = await Room.findByIdAndDelete(id);
  
      if (!deletedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;