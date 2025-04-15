//client/src/components/accounts/AccountItem.tsx

// React imports
import React from 'react';

// Account imports
import { Account } from '../types/index';


// Bootstrap imports
import { Col, Card } from 'react-bootstrap';

interface AccountItemProps {
    account: Account;
    exchangeRate: number;
}

export const AccountItem: React.FC<AccountItemProps> = ({ account, exchangeRate }) => {
    // Display card depending on bank account currency
    return (
        <Col md={4}>
        <Card className="mb-3">
            {account.currency === 'EUR' ? (
            <Card.Body>
                <Card.Title>{account.title}</Card.Title>
                <Card.Text className="mb-1">
                <strong>Balance:</strong> {account.accountBalance.toFixed(2)} EUR
                </Card.Text>
                <Card.Text className="text-muted small">
                ≈ {(account.accountBalance * exchangeRate).toFixed(2)} CZK
                </Card.Text>
            </Card.Body>
            ) : (
            <Card.Body>
                <Card.Title>{account.title}</Card.Title>
                <Card.Text className="mb-1">
                <strong>Balance:</strong> {account.accountBalance.toFixed(2)} CZK
                </Card.Text>
                <Card.Text className="text-muted small">
                ≈ {(account.accountBalance / exchangeRate).toFixed(2)} EUR
                </Card.Text>
            </Card.Body>
            )}
        </Card>
        </Col>
    );    
};