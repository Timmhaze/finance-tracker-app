import React, { useState } from 'react';
import { Row, Modal, Form, Button } from 'react-bootstrap';

interface AddAccountFormProps {
  show: boolean;
  onClose: () => void;
  onAddAccount: (account: { 
    title: string; 
    currency: 'Euro' | 'Koruna';
    balance: string; // Now accepts balance
  }) => void;
}

export const AddAccountForm: React.FC<AddAccountFormProps> = ({ 
  show, 
  onClose, 
  onAddAccount 
}) => {
  const [title, setTitle] = useState<string>('');
  const [currency, setCurrency] = useState<'Euro' | 'Koruna'>('Euro');
  const [balance, setBalance] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Account name is required');
      return;
    }
    if (isNaN(parseFloat(balance))) {
      setError('Enter a valid number for balance');
      return;
    }

    setIsSubmitting(true);
    try {
      onAddAccount({ 
        title, 
        currency, 
        balance: balance || '0' // Fallback to '0' if empty
      });
      setTitle('');
      setBalance('');
      onClose();
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return ( 
      // Modals, as per Bootstrap documentation don't go insaide a row or col as they are to maintain top level on the HTML doc
      <Modal show={show} onHide={onClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Account Name*</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Main Savings"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Currency*</Form.Label>
              <Form.Select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as 'Euro' | 'Koruna')}
                disabled={isSubmitting}
              >
                <option value="Euro">Euro (€)</option>
                <option value="Koruna">Czech Koruna (Kč)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Initial Balance*</Form.Label>
              <Form.Control
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="e.g., 1000.00"
                step="0.10"
                required
              />
              <Form.Text className="text-muted">
                Enter the current balance of this account.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
  );
};