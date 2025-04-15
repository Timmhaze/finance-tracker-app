//client/src/components/Dashboard.tsx

// React imports
import { useState, useEffect } from 'react';

import { Accounts } from './accounts/Accounts';
import { Records } from './records/Records';
import { Account } from './types/index';

import { fetchExchangeRates } from '../../../server/src/services/cnbService';

// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';

export const Dashboard: React.FC = () => {
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/accounts/');
        const data = await response.json();
        const exchangeRate = await fetchExchangeRates();
        setExchangeRate(exchangeRate);
        setAccountData(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <>
      <Row>
        <Col md={4}>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Accounts accounts={accountData} exchangeRate={exchangeRate}/>
      </Row>
      <Row>
        <Records accounts={accountData} /> 
      </Row>
    </>
  );
};