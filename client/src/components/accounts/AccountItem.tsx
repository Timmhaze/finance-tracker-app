import React from 'react';
import { Account } from './Accounts';
import { Col, Card } from 'react-bootstrap';

interface AccountItemProps {
    account: Account;
}

export const AccountItem: React.FC<AccountItemProps> = ({ account }) => {
    return (
        <Col md={4}>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>{account.title}</Card.Title>
                    <Card.Text>
                        <strong>Balance:</strong> {account.balance} {account.currency}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}