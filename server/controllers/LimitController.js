const Limit = require("../models/LimitModel");

const updateLimitLeaves = async (req, res) => {
    try {
        const id_leaves = "81eb0cd9-74ec-4b55-bf70-414b2fa591dd";
        const limitLeaves = await Limit.findOne({ where: { id: "81eb0cd9-74ec-4b55-bf70-414b2fa591dd" } });

        if (!limitLeaves) {
            return res.status(404).json({ msg: "ID Not Found" });
        }

        const { limit_leaves } = req.body;

        console.log("Updating limit_leaves to:", limit_leaves); // Debug log

        await Limit.update(
            { limit_leaves: limit_leaves },
            { where: { id: "81eb0cd9-74ec-4b55-bf70-414b2fa591dd" } }
        );

        // Fetch the updated record to verify the update
        const updatedLimit = await Limit.findOne({ where: { id: "81eb0cd9-74ec-4b55-bf70-414b2fa591dd" } });
        console.log("Updated limit_leaves:", updatedLimit.limit_leaves); // Debug log

        res.status(200).json({ msg: "Limit Leaves Updated" });
    } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(400).json({ msg: "Failed to update leave status", error: error.message });
    }
};

const limitLeaves = async (req, res) => {
    try {
      const { limit_leaves } = req.body;
  
      // Check if there is already a default password setting
      let currentSetting = await Limit.findOne({ where: { id:"81eb0cd9-74ec-4b55-bf70-414b2fa591dd" } });
  
      if (currentSetting) {
        // If exists, update the default password
        await currentSetting.update({ limit_leaves });
      } else {
        // If not, create a new setting
        currentSetting = await Limit.create({
          limit_leaves,
        });
      }

      return res.status(201).json({
        msg: "Default Limit Leaves Set Successfully",
        data: {
          limit_leaves: limit_leaves,
        },
      });
    } catch (error) {
      console.error("Error setting limit leaves:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = { updateLimitLeaves, limitLeaves };
