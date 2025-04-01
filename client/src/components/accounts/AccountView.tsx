import React, { useState } from 'react';
import { Account } from './Accounts';
import { AccountItem } from './AccountItem';
import { Row } from 'react-bootstrap';

interface AccountViewProps {
    accounts: Account[];
}

export const AccountView: React.FC<AccountViewProps> = ({ accounts }) => {
    return (
        <Row>
            {accounts.length > 0 ? (
            accounts.map((account) => (
                <AccountItem key={account._id} account={account} />
            ))
            ) : (
                <p className="text-center">
                    No accounts available.
                </p>
            )}
        </Row>
    );
}