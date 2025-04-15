//client/src/components/accounts/AccountView.tsx

import React, { useState } from 'react';
import { Account } from '../types/index';
import { AccountItem } from './AccountItem';
import { Row } from 'react-bootstrap';

interface AccountViewProps {
    accounts: Account[];
    exchangeRate: number;
}

export const AccountView: React.FC<AccountViewProps> = ({ accounts, exchangeRate }) => {
    return (
        <Row>
            {accounts.length > 0 ? (
            accounts.map((account) => (
                <AccountItem key={account._id} account={account} exchangeRate={exchangeRate} />
            ))
            ) : (
                <p className="text-center">
                    No accounts available.
                </p>
            )}
        </Row>
    );
}