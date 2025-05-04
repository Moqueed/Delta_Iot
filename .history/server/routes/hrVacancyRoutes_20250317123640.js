const express = require("express");
const router = express.Router();
const HRVacancy = require("../models/HRVacancy");

// 📌 GET all HRVacancies
router.get("/get-vacancies", async (req, res) => {
  try {
    const vacancies = await HRVacancy.findAll();
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 GET a specific HRVacancy by job_id
router.get("/get-vacancy/:job_id", async (req, res) => {
  try {
    const vacancy = await HRVacancy.findOne({ where: { job_id: req.params.job_id } });
    if (!vacancy) return res.status(404).json({ message: "Vacancy not found" });
    res.status(200).json(vacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 DELETE an HRVacancy
router.delete("/delete-vacancy/:job_id", async (req, res) => {
  try {
    const deleted = await HRVacancy.destroy({ where: { job_id: req.params.job_id } });
    if (!deleted) return res.status(404).json({ message: "Vacancy not found" });
    res.status(200).json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
