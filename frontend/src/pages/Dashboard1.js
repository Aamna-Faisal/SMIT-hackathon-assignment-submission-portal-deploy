import React, { useState } from 'react';
import '../App.css';
import Navbar from '../components/Navbar';

const Dashboard1 = () => {
  const initialAssignments = [
    { id: 1, title: 'Assignment 1: HTML Basics', deadline: '2024-08-10', isSubmitted: false, fileName: null, file: null, link: null, grade: null },
    { id: 2, title: 'Assignment 2: CSS Styling', deadline: '2024-08-15', isSubmitted: false, fileName: null, file: null, link: null, grade: null },
    { id: 3, title: 'Assignment 3: JavaScript Functions', deadline: '2024-08-20', isSubmitted: false, fileName: null, file: null, link: null, grade: null },
    { id: 4, title: 'Assignment 4: React Components', deadline: '2024-08-25', isSubmitted: false, fileName: null, file: null, link: null, grade: null },
    { id: 5, title: 'Assignment 5: API Integration', deadline: '2024-08-30', isSubmitted: false, fileName: null, file: null, link: null, grade: null },
  ];

  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionType, setSubmissionType] = useState('file');
  const [submittedLink, setSubmittedLink] = useState('');
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage('');
  };

  const handleLinkChange = (event) => {
    setSubmittedLink(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (assignmentId) => {
    // Validation: Check if a file or link is provided
    if (submissionType === 'file' && !selectedFile) {
      setErrorMessage('A file is required for submission.');
      return;
    }
    if (submissionType === 'link' && !submittedLink) {
      setErrorMessage('A link is required for submission.');
      return;
    }

    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          isSubmitted: true,
          fileName: submissionType === 'file' ? selectedFile?.name : null,
          file: submissionType === 'file' ? selectedFile : null,
          link: submissionType === 'link' ? submittedLink : null,
          grade: assignment.grade !== null ? assignment.grade : 'Not Graded',
        };
      }
      return assignment;
    });

    setAssignments(updatedAssignments);
    setSelectedFile(null);
    setSubmittedLink('');
    setErrorMessage('');
  };

  const handleDownload = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !assignment.isSubmitted;
    if (filter === 'completed') return assignment.isSubmitted;
    return false;
  });

  return (
    <>
      <Navbar/>
      <div className="dashboard-container">
        <h2>Web and App Development</h2>

        <div className="filter-dropdown">
          <label>
            Filter Assignments:
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        {/* Display error message if present */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="assignments-section">
          <h3>{filter.charAt(0).toUpperCase() + filter.slice(1)} Assignments</h3>
          {filteredAssignments.length > 0 ? (
            <div className="assignment-cards">
              {filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card">
                  <h4>{assignment.title}</h4>
                  <p><strong>Deadline:</strong> {assignment.deadline}</p>
                  <p><strong>Status:</strong> {assignment.isSubmitted ? 'Submitted' : 'Pending'}</p>
                  {assignment.isSubmitted ? (
                    <p><strong>Grade:</strong> {assignment.grade ? assignment.grade : 'Not Graded'}</p>
                  ) : (
                    <div className="submit-section">
                      <label>
                        Submit as:
                        <select value={submissionType} onChange={(e) => setSubmissionType(e.target.value)}>
                          <option value="file">File</option>
                          <option value="link">Link</option>
                        </select>
                      </label>

                      {submissionType === 'file' && (
                        <input type="file" onChange={handleFileChange} />
                      )}
                      {submissionType === 'link' && (
                        <input
                          type="text"
                          value={submittedLink}
                          onChange={handleLinkChange}
                          placeholder="Enter assignment link"
                        />
                      )}
                      <button
                        onClick={() => handleSubmit(assignment.id)}
                        disabled={submissionType === 'file' ? !selectedFile : !submittedLink}
                        className="submit-button"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  <div className="download-section">
                    {assignment.isSubmitted && assignment.file ? (
                      <button onClick={() => handleDownload(assignment.file)} className="download-button">Download</button>
                    ) : assignment.isSubmitted && assignment.link ? (
                      <a href={assignment.link} target="_blank" rel="noopener noreferrer" className="download-button">View Link</a>
                    ) : (
                      <span>Not Available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No {filter} assignments.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard1;