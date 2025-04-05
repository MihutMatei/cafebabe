import React from 'react';
import { ListGroup, Image, Card } from 'react-bootstrap';

function ViewSubmissions({ reports }) {
  return (
    <div>
      <ListGroup>
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{report.name}</Card.Title>
                <Card.Text>
                  <strong>Category:</strong> {report.category}
                </Card.Text>
                <Card.Text>
                  <strong>Description:</strong> {report.description}
                </Card.Text>
                <Card.Text>
                  <strong>Location:</strong> {report.latitude}, {report.longitude}
                </Card.Text>
                <Image
                  src={`http://localhost:8000/uploads/${report.image_saved_to.split('/').pop()}`}
                  alt="Uploaded"
                  fluid
                  rounded
                />
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No reports available.</p>
        )}
      </ListGroup>
    </div>
  );
}

export default ViewSubmissions;
