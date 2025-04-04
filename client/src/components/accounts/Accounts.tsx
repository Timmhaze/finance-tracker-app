import React, { useState } from 'react';
import { AccountView } from './AccountView';
import { AddAccountForm } from './AddAccountForm';
import { Account } from '../types/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Button } from 'react-bootstrap';

interface AccountsProps {
  accounts: Account[];
  isLoading: boolean;
  onAddAccount: (account: { title: string; currency: 'Euro' | 'Koruna'; balance: string }) => Promise<void>;
  refreshTrigger: number;
}

export const Accounts: React.FC<AccountsProps> = ({ 
  accounts, 
  isLoading, 
  onAddAccount 
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);

  if (isLoading) return <div>Loading accounts...</div>;

  return (
    <Col>
      <Button 
        variant='success' 
        className='mb-3'
        onClick={() => setShowForm(true)}
      >
        + Add New Account
      </Button>
      <AddAccountForm 
        show={showForm}
        onClose={() => setShowForm(false)}
        onAddAccount={onAddAccount}
      />
      <AccountView accounts={accounts} />
    </Col>
  );
};