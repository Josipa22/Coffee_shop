const mongoose = require("mongoose");

const coffeeSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  about: {
    type: String,
    minlength: 10,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Korisnik",
  },
});

coffeeSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Coffee", coffeeSchema, "coffees");
