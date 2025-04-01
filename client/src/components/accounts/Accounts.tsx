import React, { useState, useEffect } from 'react';
import { AccountView } from './AccountView'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';

// const accountsData = [
//     { id: 1, name: 'Savings Account', balance: '€5,000' },
//     { id: 2, name: 'Checking Account', balance: 'CZK2,500' },
//     { id: 3, name: 'Investment Account', balance: 'CZK10,000' },
//   ];
export interface Account {
    _id: string; // MongoDB ID
    title: string;
    balance: string;
    currency: string;
    date: string;
}


export const Accounts: React.FC = () => {

    const [accountData, setAccountData] = useState<Account[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/accounts/')
            .then((res) => res.json())
            .then((data) => {
                setAccountData(data);
            }).catch((error) => {
                console.error('Frontend Error:', error);
            });
    }, []);

    return (
        <Col>
            <AccountView accounts={accountData} />
            {/* <AddAccountForm /> */}
        </Col>
    );
};

