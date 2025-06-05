const Email = require("../models/email");

exports.subscribeUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const existing = await Email.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "You're already subscribed." });
    }

    await Email.create({ email });
    res.status(200).json({ message: "Subscription successful" });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
