// client/src/components/accounts/Accounts.tsx

// React imports
import React, { useState } from 'react';

// Accounts related imports
import { Account } from '../types/index';
import { AccountView } from './AccountView';

//Bootstrap imports
import { Col } from 'react-bootstrap';

interface AccountsProps {
  accounts: Account[];
  exchangeRate: number;
}

export const Accounts: React.FC<AccountsProps> = ({ accounts, exchangeRate }) => {

  return (
    <Col>
      <AccountView accounts={accounts} exchangeRate={exchangeRate}/>
    </Col>
  );
};