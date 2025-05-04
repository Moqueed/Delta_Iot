const Candidate  = require("../models/Candidate");
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const { sendAssignmentMail } = require("../utils/emailHelper");

const getAllAssignments = async(req, res) => {
    try{
        const assignments = await AssignToHR.findAll({
            include: [
                {
                    model: HR,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Candidate,
                    attributes: ['id','name', 'email']
                }
            ]
        });
        res.status(200).json(assignments);
    }catch(error){
        console.error("Error fetching assignments: ", error);
        res.status(500).json({error: "Internal server error"})
    };
};

const assignCandidateToHR = async (req, res) => {
    try {
      const { hr_id, candidate_id, position, contact_number, comments, attachments } = req.body;

        // Get HR and Candidate details
        const hr = await HR.findByPk(hr_id);
        const candidate = await Candidate.findByPk(candidate_id);
  
        if (!hr || !candidate) {
          return res.status(404).json({ error: "HR or Candidate not found" });
        }

        // // Check if candidate data is valid
        // if (!candidate.name || !candidate.email) {
        //     return res.status(400).json({ error: "Candidate name or email is missing" });
        // }
  
      // Create the assignment
      const assignment = await AssignToHR.create({
        hr_id,  
        candidate_id,
        HR_name: hr.name,
        candidate_name: candidate.candidate_name,
        candidate_email_id: candidate.candidate_email_id,
        position,
        contact_number,
        comments,
        attachments,
      });

      console.log("HR:", hr.name, hr.email);
      console.log("Candidate:", candidate.candidate_name, candidate.candidate_email_id);
  
      // Send email to HR
      await sendAssignmentMail({
        hrEmail: hr.email,
        hrName: hr.name,
        candidateName: candidate.candidate_name,
        candidateEmail: candidate.candidate_email_id,
        position,
        contactNumber: contact_number,
        comments,
      });
  
      res.status(201).json({ message: "Candidate assigned and email sent to HR", assignment });
    } catch (error) {
      console.error("Error assigning candidate:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  module.exports = {
    assignCandidateToHR,
    getAllAssignments, 
  };
