const Limit = require("../models/LimitModel");
const { logMessage } = require("../utils/logger");

// Function to update the limit leaves
const getLimitLeaves = async (req, res) => {
  const id = "81eb0cd9-74ec-4b55-bf70-414b2fa591dd";
  try {
   const response= await Limit.findOne({
    attributes: [
      "maximum"
    ],
    where: {
      id: id
    }
   })
   res.status(200).json(response);
  } catch (error) {
    logMessage("error", "Error showing limit leaves", {
      error: error.message,
    });
    return res
      .status(400)
      .json({ msg: "Failed to show limit leaves", error: error.message });
  }
};

module.exports = { getLimitLeaves };
