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