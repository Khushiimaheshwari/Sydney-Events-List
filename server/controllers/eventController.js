const Event = require("../models/Event");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};