import React, { useState, useEffect } from 'react';

const CorViewPublications = () => {
    const [publications, setPublications] = useState([]);
    const [visiblePublicationId, setVisiblePublicationId] = useState(null); // Track which publication's details are visible
    const [rejectionReason, setRejectionReason] = useState(''); // Store rejection reason
    const [publicationToReject, setPublicationToReject] = useState(null); // Track which publication is being rejected
    const coordinatorId = sessionStorage.getItem("coordinatorid");
    useEffect(() => {
        const fetchPublications = async () => {
            if (!coordinatorId) {
                console.error('Coordinator ID is undefined');
                return;
            }
            try {
                const response = await fetch(`http://localhost:4001/getAllPublications?coordinatorid=${coordinatorId}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch publications');
                }
                const data = await response.json();
                setPublications(data);
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };
        fetchPublications();
    }, [coordinatorId]);
    

    // Toggle visibility of publication details
    const togglePublicationDetails = (publicationId) => {
        if (visiblePublicationId === publicationId) {
            setVisiblePublicationId(null); // Hide details if the same card is clicked
        } else {
            setVisiblePublicationId(publicationId); // Show clicked publication's details
        }
    };

    // Approve the publication and update the database
    const approvePublication = async (publicationId) => {
        try {
            const response = await fetch(`http://localhost:4001/approvePublication/${publicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to approve publication');
            }

            // Remove the publication from the list after approval
            setPublications(publications.filter(pub => pub.publication_id !== publicationId));
        } catch (error) {
            console.error('Error approving publication:', error);
        }
    };

    // Reject the publication and update the database with the rejection reason
    const rejectPublication = async (publicationId) => {
        if (!rejectionReason.trim()) { // Check if rejection reason is empty or just spaces
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4001/rejectPublication/${publicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason }),  // Pass rejectionReason directly
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to reject publication');
            }

            // If the rejection is successful, remove the rejected publication from the list
            setPublications(publications.filter(pub => pub.publication_id !== publicationId));

            // Reset rejection reason and publication to reject state
            setRejectionReason('');
            setPublicationToReject(null);
        } catch (error) {
            console.error('Error rejecting publication:', error);
        }
    };

    return (
        <div className="container my-4">
            <h1 className="text-center text-dark mb-4">Publications Pending Approval</h1>
            {publications.length > 0 ? (
                <div className="row">
                    {publications.map(pub => (
                        <div className="col-md-6 mb-4" key={pub.publication_id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Cite As:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => togglePublicationDetails(pub.publication_id)}
                                                className="text-primary"
                                            >
                                                {pub.citeAs}
                                            </a>
                                        </h5>
                                        <span className="badge bg-info text-dark">{pub.status}</span>
                                    </div>

                                    {/* Only show details for the clicked publication */}
                                    {visiblePublicationId === pub.publication_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                               {pub.natureOfPublication && <p><strong>Nature of Publication:</strong> {pub.natureOfPublication}</p>}
                                                    {pub.typeOfPublication && <p><strong>Type of Publication:</strong> {pub.typeOfPublication}</p>}
                                                    {pub.titleOfPaper && <p><strong>Title of Paper:</strong> {pub.titleOfPaper}</p>}
                                                    {pub.nameOfJournalConference && <p><strong>Journal/Conference:</strong> {pub.nameOfJournalConference}</p>}
                                                    {pub.titleofChapter && <p><strong>Title of Chapter:</strong> {pub.titleofChapter}</p>}
                                                    {pub.nameofbook && <p><strong>Name of Book:</strong> {pub.nameofbook}</p>}
                                                    {pub.nameOfPublisher && <p><strong>Publisher:</strong> {pub.nameOfPublisher}</p>}
                                                    {pub.quartile && <p><strong>Quartile:</strong> {pub.quartile}</p>}
                                                    {pub.issnIsbn && <p><strong>ISSN/ISBN:</strong> {pub.issnIsbn}</p>}
                                                    {pub.authorStatus && <p><strong>Author Status:</strong> {pub.authorStatus}</p>}
                                                    {pub.firstAuthorName && <p><strong>First Author Name:</strong> {pub.firstAuthorName}</p>}
                                                    {pub.firstAuthorAffiliation && <p><strong>First Author Affiliation:</strong> {pub.firstAuthorAffiliation}</p>}
                                                    {pub.coAuthors && <p><strong>Co-Authors:</strong> {pub.coAuthors}</p>}
                                                    {pub.indexed && <p><strong>Indexed:</strong> {pub.indexed}</p>}
                                                    {pub.impactFactor && <p><strong>Impact Factor:</strong> {pub.impactFactor}</p>}
                                                    {pub.doi && <p><strong>DOI:</strong> {pub.doi}</p>}
                                                    {pub.linkOfPaper && (
                                                        <p>
                                                            <strong>Link to Paper:</strong>{" "}
                                                            <a href={pub.linkOfPaper} target="_blank" rel="noopener noreferrer">
                                                            {pub.linkOfPaper}
                                                            </a>
                                                        </p>
                                                        )}

                                                        {pub.scopusLink && (
                                                        <p>
                                                            <strong>Scopus Link:</strong>{" "}
                                                            <a href={pub.scopusLink} target="_blank" rel="noopener noreferrer">
                                                            {pub.scopusLink}
                                                            </a>
                                                        </p>
                                                        )}

                                                    {pub.volume && <p><strong>Volume:</strong> {pub.volume}</p>}
                                                    {pub.pageNo && <p><strong>Page Number:</strong> {pub.pageNo}</p>}
                                                    {pub.monthYear && <p><strong>Month & Year:</strong> {pub.monthYear}</p>}
                                                    {pub.citeAs && <p><strong>Cite As:</strong> {pub.citeAs}</p>}
                                                    {pub.proofOfPublication && (
                                                        <p><strong>Proof of Publication:</strong> 
                                                        <a href={`http://localhost:5002${pub.proofOfPublication}`} target="_blank" rel="noopener noreferrer">
                                                            View Proof
                                                        </a>
                                                    </p>
                                                    
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center mt-3">
                                    <button 
                                        className="btn btn-success w-49 mb-3" 
                                        onClick={() => approvePublication(pub.publication_id)}
                                    >
                                        Approve
                                    </button>

                                    {/* Reject button */}
                                    <button 
                                        className="btn btn-danger w-49 mb-3 ms-2" 
                                        onClick={() => setPublicationToReject(pub.publication_id)} // Set the publication ID to reject
                                    >
                                        Reject
                                    </button>
                                </div>

                                {/* If publication is being rejected, show a text field for rejection reason */}
                                {publicationToReject === pub.publication_id && (
                                    <div className="mt-3">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection"
                                        />
                                        <button 
                                            className="btn btn-danger w-100 mt-2" 
                                            onClick={() => rejectPublication(pub.publication_id)} // Handle rejection
                                        >
                                            Submit Rejection
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No publications available for approval.</p>
            )}
        </div>
    );
};

export default CorViewPublications;