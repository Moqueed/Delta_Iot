const express = require("express");
const { ActivePosition } = require("../models");

const router = express.Router();

//Create a active position
router.post("/add-position", async (req, res) => {
  try {
    const {job_id, position, skills, department, vacancy, manager, minimum_experience, maximum_experience, job_description, HRs } = req.body;

    // Ensure all fields are provided
    if (!job_id || !position || !skills || !department || !vacancy || !manager || !minimum_experience || !maximum_experience || !job_description || !HRs) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newPosition = await ActivePosition.create(req.body);
    res.status(201).json(newPosition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all active positions
router.get("/get-position", async (req, res) => {
  try {
    const positions = await ActivePosition.findAll();
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update Active position(Also updates HR vacancy)
router.put("/update/:id", async (req, res) => {
  try {
    const position = await ActivePosition.findByPk(req.params.id);
    if (!position)
      return res.status(404).json({ message: "Positions not found" });

    await position.update(req.body);
    res.json({ message: "Position updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Active Position (Also deletes HRVacancy)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await ActivePosition.destroy({
      where: { job_id: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ message: "Position not found" });

    res.json({ message: "Position deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
