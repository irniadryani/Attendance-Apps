const Limit = require("../models/LimitModel");
const { logMessage } = require("../utils/logger");

// Function to update the limit leaves
const updateLimitLeaves = async (req, res) => {
  try {
    const limitId = "81eb0cd9-74ec-4b55-bf70-414b2fa591dd";

    const limitLeaves = await Limit.findOne({ where: { id: limitId } });

    if (!limitLeaves) {
      logMessage("warning", "Limit ID not found", { limitId });
      return res.status(404).json({ msg: "ID Not Found" });
    }

    const { limit_leaves } = req.body;

    const [updated] = await Limit.update(
      { maximum: limit_leaves },
      { where: { id: limitId } }
    );

    if (updated) {
      return res.status(200).json({ msg: "Limit Leaves Updated" });
    }

    throw new Error("Limit Leaves Update Failed");
  } catch (error) {
    logMessage("error", "Error updating limit leaves", {
      error: error.message,
    });
    return res
      .status(400)
      .json({ msg: "Failed to update limit leaves", error: error.message });
  }
};

module.exports = { updateLimitLeaves };
