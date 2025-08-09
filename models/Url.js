const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  shortUrl: String,
  clicks: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

// generate shortUrl before saving
urlSchema.pre('save', function (next) {
  if (!this.shortUrl) {
    this.shortUrl = `${process.env.BASE_URL}/${this.shortCode}`;
  }
  next();
});

module.exports = mongoose.model('Url', urlSchema);
