//client/src/components/records/AddRecordForm.tsx

// client/src/components/records/AddRecordModal.tsx

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Account } from '../types';

interface AddRecordModalProps {
  show: boolean;
  onHide: () => void;
  accounts: Account[];
  onRecordAdded: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({ show, onHide, accounts, onRecordAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    type: 'Expense',
    amount: '',
    currency: 'CZK',
    paymentType: '',
    linkedAccount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        onRecordAdded();
        onHide();
      } else {
        console.error('Failed to add record');
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={formData.category} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleChange}>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
              <option value="CZK">CZK</option>
              <option value="EUR">EUR</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Type</Form.Label>
            <Form.Control name="paymentType" value={formData.paymentType} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Linked Account</Form.Label>
            <Form.Select name="linkedAccount" value={formData.linkedAccount} onChange={handleChange} required>
              <option value="">-- Select Account --</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.title} ({account.currency})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            Add Record
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
