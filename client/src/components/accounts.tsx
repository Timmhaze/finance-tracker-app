import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';

const accountsData = [
    { id: 1, name: 'Savings Account', balance: '€5,000' },
    { id: 2, name: 'Checking Account', balance: 'CZK2,500' },
    { id: 3, name: 'Investment Account', balance: 'CZK10,000' },
  ];

export const Accounts: React.FC = () => {
    return (
        <>
            {accountsData.map((account) => (
            <Col key={account.id} className="mb-3">
                <div className="p-3 border rounded">
                <h5>{account.name}</h5>
                <p>Balance: {account.balance}</p>
                </div>
            </Col>
            ))}
        </>
    );
};

