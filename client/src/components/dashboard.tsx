import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { Accounts } from './accounts';
import { Records } from './records/Records';

import '../styles/dashboard.module.css';

export const Dashboard: React.FC = () => {
  return (
    <>
      <Row>
        <Col md={4}>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Accounts />
      </Row>
      <Row>
        <Records />
      </Row>
    </>
  );
};