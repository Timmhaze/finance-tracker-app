import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { Accounts } from './accounts/Accounts';
import { Records } from './records/Records';
import { Account } from './types/index';
import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../../../server/src/services/cnbService';
import '../styles/dashboard.module.css';

export const Dashboard: React.FC = () => {
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountsRefreshTrigger, setAccountsRefreshTrigger] = useState<number>(0);
  const [recordsRefreshTrigger, setRecordsRefreshTrigger] = useState<number>(0);

  // Fetch accounts data with exchange rates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [accountsRes, exchangeRate] = await Promise.all([
          fetch('http://localhost:3001/api/accounts/'),
          fetchExchangeRates()
        ]);

        const accounts = await accountsRes.json();
        setAccountData(accounts.map((account: Account) => ({
          ...account,
          convertedBalance: convertBalance(account, exchangeRate)
        })));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accountsRefreshTrigger]); // Only trigger on accountsRefreshTrigger changes

  const convertBalance = (account: Account, rate: number): string => {
    const balance = parseFloat(account.balance);
    if (account.currency === 'Euro') {
      return `${(balance * rate).toFixed(0)} Kč`;
    }
    return `${(balance / rate).toFixed(2)} €`;
  };

  const handleAddAccount = async (account: { title: string; currency: 'Euro' | 'Koruna'; balance: string }) => {
    try {
      const response = await fetch('http://localhost:3001/api/accounts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...account,
          date: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to create account');
      setAccountsRefreshTrigger(prev => prev + 1); // Refresh accounts data
    } catch (err) {
      console.error('Account creation error:', err);
    }
  };

  // This function will be passed to Records to trigger account updates
  const handleAccountUpdate = () => {
    setAccountsRefreshTrigger(prev => prev + 1); // Refresh accounts when records change
  };

  return (
    <>
      <Row>
        <Col md={4}>
          <h1>Dashboard</h1>
        </Col>
      </Row>
      <Row>
        <Accounts 
          accounts={accountData} 
          isLoading={isLoading}
          onAddAccount={handleAddAccount}
          refreshTrigger={accountsRefreshTrigger}
        />
      </Row>
      <Row>
        <Records 
          accounts={accountData} 
          onAccountUpdate={handleAccountUpdate}
        />
      </Row>
    </>
  );
};