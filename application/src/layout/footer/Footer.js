import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-footer', 'true');
    return () => {
      document.documentElement.removeAttribute('data-footer');
    };
  }, []);

  return (
    <footer>
      <div className="footer-content d-flex h-100 ">
        <Container>
          <Row>
            <Col xs="12" className='d-flex align-items-center justify-content-center mb-0'>
              <p className="mb-0 text-muted text-medium">{`Copyright ${new Date().getFullYear()}. All Rights Reserved`}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
