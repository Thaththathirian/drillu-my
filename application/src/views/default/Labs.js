import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useHistory } from 'react-router-dom';

const Labs = () => {
  const history = useHistory();
  
  // Sample lab data - replace with your actual data source
  const labs = [
    {
      id: 1,
      code: 'CS101L',
      name: 'Computer Science Lab 1',
      expiry: '2024-12-31'
    },
    {
      id: 2,
      code: 'CS102L',
      name: 'Computer Science Lab 2',
      expiry: '2024-12-31'
    },
    {
      id: 3,
      code: 'CS103L',
      name: 'Computer Science Lab 3',
      expiry: '2024-12-31'
    }
  ];

  const handleGoToLab = (labId) => {
    // Navigate to lab page for the specific lab
    history.push(`/lab/${labId}`);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Labs</h1>
      </div>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th scope="col">Lab Code</th>
                <th scope="col">Lab Name</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => (
                <tr key={lab.id}>
                  <td>{lab.code}</td>
                  <td>{lab.name}</td>
                  <td>{lab.expiry}</td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleGoToLab(lab.id)}
                    >
                      <CsLineIcons icon="monitor" className="me-2" size="15" />
                      Go to Lab
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

export default Labs; 