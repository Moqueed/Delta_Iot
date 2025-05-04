const Candidate  = require("../models/Candidate");
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");

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
  
      // Create the assignment
      const assignment = await AssignToHR.create({
        hr_id,
        candidate_id,
        position,
        contact_number,
        comments,
        attachments,
      });
  
      // Get HR and Candidate details
      const hr = await HR.findByPk(hr_id);
      const candidate = await Candidate.findByPk(candidate_id);
  
      // Send email to HR
      await sendAssignmentMail({
        hrEmail: hr.email,
        hrName: hr.name,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
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
