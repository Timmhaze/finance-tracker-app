import React, { useState } from 'react';
import { Account } from '../types/index'; // Adjust the path if necessary
import { Modal, Form, Button } from 'react-bootstrap';

interface AddRecordFormProps {
  accounts: Account[];
  show: boolean;
  onClose: () => void;
  onAddRecord: (record: {
    description: string;
    category: string;
    type: string;
    amount: string;
    currency: string;
    paymentType: string;
    accountId: string;
  }) => void;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({
  accounts,
  show, 
  onClose, 
  onAddRecord
}) => {
  // const [description, setDescription] = useState<string>('');
  // const [category, setCategory] = useState<string>('');
  // const [type, setType] = useState<string>('');
  // const [amount, setAmount] = useState<string>('');
  // const [currency, setCurrency] = useState<string>('');
  // const [paymentType, setPaymentType] = useState<string>('');
  // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    category: 'Groceries',
    type: 'Expense',
    amount: '',
    currency: 'Euro',
    paymentType: 'Credit/Debit Card',
    accountId: '' // Added accountId to form state
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation for the form, nesting would be the same memory use but harder to read
    if(!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if(!formData.category) {
      setError('Category is required');
    }

    if(isNaN(parseFloat(formData.amount))) {
      setError('Enter a valid number for amount');
      return;
    }

    if(!formData.currency) {
      setError('Currency is required');
      return;
    }

    if(!formData.paymentType) {
      setError('Payment type is required');
      return;
    }

    if(!formData.accountId) {
      setError('Account is required');
      return;
    }

    setIsSubmitting(true);
    try 
    {
      await onAddRecord({
        description: formData.description,
        category: formData.category,
        type: formData.type,
        amount: formData.amount || '0.00', // Fallback to '0.00' if empty
        currency: formData.currency,
        paymentType: formData.paymentType,
        accountId: formData.accountId // Added accountId to the record
      });

      setFormData({
        description: '',
        category: '',
        type: '',
        amount: '',
        currency: '',
        paymentType: '',
        accountId: '' // Reset accountId after submission
      });
      onClose();
    }

    catch(err)
    {
      setError('Failed to create record');
    }

    finally
    {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal show={show} onHide={onClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add New Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description*</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was the transaction for?"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category*</Form.Label>
            <Form.Select
              value={formData.category}
              name="category"
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Groceries">Groceries</option>
              <option value="Rent/Mortgage">Rent/Mortage</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
              <option value="Gifts">Gifts</option>
              <option value="Investments">Investments</option>
              <option value="Pets">Pets</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type*</Form.Label>
            <Form.Select
              value={formData.type}
              name="type"
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount*</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 100.00"
              step="0.10"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Currency*</Form.Label>
            <Form.Select 
              value={formData.currency} 
              name="currency"
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select currency</option>
              <option value="Euro">Euro (€)</option>
              <option value="Koruna">Czech Koruna (Kč)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Type*</Form.Label>
            <Form.Select 
              value={formData.paymentType} 
              name="paymentType"
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Digital Wallet">Digital Wallet</option>
              <option value="Cash">Cash</option>
              <option value="Direct Debit">Direct Debit</option>
              <option value="Check">Check</option>
            </Form.Select>
          </Form.Group>

          {/* Here is where the account will be added */}
          <Form.Group className="mb-3">
            <Form.Label>Account*</Form.Label>
            <Form.Select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.title} | ({account.currency})
                </option>
              ))}
            </Form.Select>
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
              {isSubmitting ? 'Creating...' : 'Create Record'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};