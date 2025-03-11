const express = require("express");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList"); // Import ActiveList model
const TotalData = require("../models/TotalData"); // Import TotalData model
const router = express.Router();

// Function to map progress_status to TotalData status
function mapStatus(progressStatus) {
  if (["Joined"].includes(progressStatus)) return "Joined";
  if (["Offer Released", "Final Discussion"].includes(progressStatus)) return "About to Join";
  if (["Buffer", "Hold"].includes(progressStatus)) return "Buffer";
  if (["Rejected", "Declined Offer"].includes(progressStatus)) return "Rejected";
  return "Master"; // Default category
}

// ✅ Add a new candidate and insert into ActiveList & TotalData
router.post("/add", async (req, res) => {
  try {
    // Insert into Candidate table
    const newCandidate = await Candidate.create(req.body);

    // Insert into ActiveList
    const activeCandidate = await ActiveList.create({
      candidate_email_id: newCandidate.candidate_email_id, // Ensure field matches
      candidate_name: newCandidate.candidate_name,
      position: newCandidate.position,
      department: newCandidate.department,
      skills: newCandidate.skills,
      progress_status: newCandidate.progress_status, // Sync status
      contact_number: newCandidate.contact_number,
      current_company: newCandidate.current_company,
      current_location: newCandidate.current_location,
      permanent_location: newCandidate.permanent_location,
      qualification: newCandidate.qualification,
      experience: newCandidate.experience,
      current_ctc: newCandidate.current_ctc,
      expected_ctc: newCandidate.expected_ctc,
      notice_period: newCandidate.notice_period,
      reference: newCandidate.reference,
      comments: newCandidate.comments,
      attachments: newCandidate.attachments
    });

    // Insert into TotalData
    await TotalData.create({
      candidate_id: newCandidate.id,
      status: mapStatus(newCandidate.progress_status),
    });

    res.status(201).json({ message: "Candidate added successfully and moved to ActiveList!", candidate: newCandidate });
  } catch (error) {
    console.error("❌ Error adding candidate:", error);
    res.status(500).json({ message: "Error adding candidate", error: error.message });
  }
});

// ✅ Get all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    res.status(500).json({ message: "Error fetching candidates", error: error.message });
  }
});

// ✅ Update a candidate and sync with ActiveList & TotalData
router.put("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.update(req.body);

    // Sync with ActiveList
    await ActiveList.update(req.body, { where: { candidate_email_id: candidate.candidate_email_id } });

    // Sync with TotalData
    await TotalData.update(
      { status: mapStatus(candidate.progress_status) },
      { where: { candidate_id: candidate.id } }
    );

    res.status(200).json({ message: "Candidate updated successfully!", candidate });
  } catch (error) {
    console.error("❌ Error updating candidate:", error);
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
});

// ✅ Delete a candidate from Candidate, ActiveList, and TotalData
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Delete from ActiveList
    await ActiveList.destroy({ where: { candidate_email_id: candidate.candidate_email_id } });

    // Delete from TotalData
    await TotalData.destroy({ where: { candidate_id: candidate.id } });

    // Delete from Candidate
    await candidate.destroy();

    res.status(200).json({ message: "Candidate deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting candidate:", error);
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
});

module.exports = router;
