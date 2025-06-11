import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useHistory } from 'react-router-dom';

const Placements = () => {
  const history = useHistory();

  // Sample placement data - replace with your actual data source
  const placements = [
    {
      id: 1,
      code: 'PL101',
      name: 'Placement Training 1',
      expiry: '2024-12-31',
    },
    {
      id: 2,
      code: 'PL102',
      name: 'Placement Training 2',
      expiry: '2024-12-31',
    },
    {
      id: 3,
      code: 'PL103',
      name: 'Placement Training 3',
      expiry: '2024-12-31',
    },
  ];

  const handleGoToPlacement = (placementId) => {
    // Navigate to placement page for the specific placement
    history.push(`/placement/${placementId}`);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Placements</h1>
      </div>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Placement Code</th>
                <th scope="col">Placement Name</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((placement) => (
                <tr key={placement.id}>
                  <td>{placement.code}</td>
                  <td>{placement.name}</td>
                  <td>{placement.expiry}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleGoToPlacement(placement.id)}>
                      <CsLineIcons icon="briefcase" className="me-2" size="15" />
                      Go to Placement
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Placements;
