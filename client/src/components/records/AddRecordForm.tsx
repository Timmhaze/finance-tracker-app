import { useState } from 'react';
import { TransactionRecord } from './Records';

interface RecordFormProps {
  onAddRecord: (newRecord: TransactionRecord) => void;
}

export const AddRecordForm: React.FC<RecordFormProps> = ({ onAddRecord }) => {
  const [formData, setFormData] = useState<TransactionRecord>({
    _id: '',
    description: '',
    type: 'Income',
    amount: 0,
    currency: 'EUR',
    paymentType: 'Cash',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    account: 'Main Account',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: name === 'amount'
          ? (value === ''  // If the field is empty, leave it empty for now
            ? ''           // Keep it as an empty string to allow clearing the field
            : isNaN(parseFloat(value))  // If it's not a number, reset to 0
            ? 0
            : parseFloat(value))  // Otherwise, parse it as a number
          : value,
      }));
  };

  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddRecord(formData); // Pass the form data to the parent component
        setFormData({
            _id: '',
            description: '',
            type: 'Income',
            amount: 0,
            currency: 'EUR',
            paymentType: 'Cash',
            date: new Date().toISOString().split('T')[0],
            account: 'Main Account',
            }); // Reset the form
        };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Currency:</label>
        <select name="currency" value={formData.currency} onChange={handleChange}>
          <option value="EUR">EUR</option>
          <option value="CZK">CZK</option>
        </select>
      </div>
      <div>
        <label>Payment Type:</label>
        <select name="paymentType" value={formData.paymentType} onChange={handleChange}>
          <option value="Cash">Cash</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cheque">Cheque</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Account:</label>
        <select name="account" value={formData.account} onChange={handleChange}>
          <option value="Main Account">Main Account</option>
          <option value="Second Account">Second Account</option>
          <option value="Third Account">Third Account</option>
        </select>
      </div>
      <button type="submit">Add Record</button>
    </form>
  );
};