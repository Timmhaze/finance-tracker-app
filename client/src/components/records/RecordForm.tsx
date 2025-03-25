import { useState } from "react"

interface RecordFormProps {
    onAddRecord: (newRecord: Record<string, any>) => void; // Callback to pass the new record to the parent
  }
  
  export const RecordForm: React.FC<RecordFormProps> = ({ onAddRecord }) => {
    const [formData, setFormData] = useState({
      description: '',
      type: 'Income', // Default to 'Income'
      amount: '',
      currency: 'EUR', // Default to 'EUR'
      payment: 'Cash', // Default to 'Cash'
      date: new Date().toISOString().split('T')[0], // Default to today's date
      account: 'Main Account', // Default to 'Main Account'
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onAddRecord(formData); // Pass the new record to the parent
      setFormData({
        description: '',
        type: 'Income',
        amount: '',
        currency: 'EUR',
        payment: 'Cash',
        date: new Date().toISOString().split('T')[0],
        account: 'Main Account',
      }); // Reset the form
    };
  
    return (
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="currency" className="form-label">Currency</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="form-select"
          >
            <option value="EUR">EUR</option>
            <option value="CZK">CZK</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="payment" className="form-label">Payment</label>
          <select
            id="payment"
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cheque">Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="account" className="form-label">Account</label>
          <select
            id="account"
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Main Account">Main Account</option>
            <option value="Second Account">Second Account</option>
            <option value="Third Account">Third Account</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Record</button>
      </form>
    );
  };