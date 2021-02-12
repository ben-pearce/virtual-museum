import React from 'react';

import Card from 'react-bootstrap/Card';

function GridObject() {
  return (
    <a href="/object/100">
      <Card className="mb-2 mt-2">
        <Card.Img variant="top" src="/rocket.jpg"></Card.Img>
        <Card.Body>
          <Card.Title>Stephenson&apos;s Rocket</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Locomotives and Rolling Stock</Card.Subtitle>
        </Card.Body>
      </Card>
    </a>
  );
}

export default GridObject;