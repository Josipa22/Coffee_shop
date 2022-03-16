const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 2,
    required: true
  },
  grade: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Korisnik"
  }
})

reviewSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id.toString()
    delete ret._id
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Review', reviewSchema, 'reviews')
