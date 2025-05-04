const assignCandidateTemplate = ({ hrName, candidateName, candidateEmail, position, contactNumber, comments }) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Candidate Assigned</title>
        </head>
        <body>
          <h3>Hello ${hrName},</h3>
          <p>A new candidate has been assigned to you:</p>
          <ul>
            <li><strong>Name:</strong> ${candidateName}</li>
            <li><strong>Email:</strong> ${candidateEmail}</li>
            <li><strong>Position:</strong> ${position}</li>
            <li><strong>Contact:</strong> ${contactNumber}</li>
            <li><strong>Comments:</strong> ${comments || "N/A"}</li>
          </ul>
          <p>Kindly review the candidate details in your dashboard.</p>
        </body>
      </html>
    `;
  };
  
  module.exports = assignCandidateTemplate;
  