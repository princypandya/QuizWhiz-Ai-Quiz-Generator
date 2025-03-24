const mongoose=require('mongoose')

const Resultschema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    timetaken: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
})

const Resultsmodel = new mongoose.model("UserDetails", Resultschema)
module.exports=Resultsmodel