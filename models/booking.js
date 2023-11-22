const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    roomid : {
        type: String, required : true
    },
    userid : {
        type : String , required : true
    },
    totalamount : {
        type : Number, required : true
    },
    totaldays : {
        type : Number, required : true
    },
    status : {
        type : String, required : true , default : 'Booked'
    }
},{
    timestamps : true,
})

const bookingmodel = mongoose.model('bookings' , bookingSchema)

module.exports = bookingmodel