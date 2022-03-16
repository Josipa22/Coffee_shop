const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const korisnikSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    passHash: String,
    admin: {
        type: Boolean,
        default: false
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

    coffees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coffee'
        }
    ]

})

korisnikSchema.plugin(uniqueValidator)
korisnikSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passHash
        return ret
    }
})

const Korisnik = mongoose.model('Korisnik', korisnikSchema, 'korisnici')

module.exports = Korisnik