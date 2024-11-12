const Mining = require("../models/mining_model");

const miningDuration = 2 * 60 * 1000;
const ratePerSecond = 0.1;

const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    const existingUser = await Mining.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const newUser = new Mining({
      username,
      miningSession: {
        startTime: null,
        endTime: null,
      },
      minedCoins: 0,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
};

const startMining = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Mining.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const currentTime = new Date();
    const endTime = new Date(user.miningSession.endTime);

    if (currentTime <= endTime)
      return res.status(400).json({ message: "Mining already starting." });

    user.miningSession.startTime = currentTime;
    user.miningSession.endTime = new Date(Date.now() + miningDuration);
    await user.save();

    res.status(200).json({
      message: "Mining session started successfully.",
      miningSession: user.miningSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error starting mining session." });
  }
};

const getMiningStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Mining.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let remainingTime = null;
    let minedCoins = user.minedCoins;

    if (user.miningSession.endTime) {
      const currentTime = new Date();
      const startTime = new Date(user.miningSession.startTime);
      const endTime = new Date(user.miningSession.endTime);

      const elapsedTime = Math.min(
        (currentTime - startTime) / 1000,
        (endTime - startTime) / 1000
      );
      minedCoins = user.minedCoins + elapsedTime * ratePerSecond;
      remainingTime = Math.max(endTime - currentTime, 0);
    }

    res.status(200).json({
      // miningStatus: user.miningSession.isActive ? "Active" : "Inactive",
      remainingTime: remainingTime ? `${remainingTime / 1000} seconds` : "N/A",
      totalMinedCoins: minedCoins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching mining status." });
  }
};

module.exports = { registerUser, startMining, getMiningStatus };
