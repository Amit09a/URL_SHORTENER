const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');

// POST /api/shorten - create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: 'Please provide a valid URL' });
  }

  try {
    // If exists, return existing
    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.json(url);
    }

    // Create new short code
    const shortCode = shortid.generate();
    url = new Url({ longUrl, shortCode });

    await url.save();
    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/urls - list all shortened URLs
router.get('/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ date: -1 }); // newest first
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /:shortCode - redirect to original
router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ message: 'No URL found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all URLs
router.delete("/urls", async (req, res) => {
  try {
    await Url.deleteMany({});
    res.json({ message: "All URLs deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete URLs" });
  }
});

module.exports = router;
