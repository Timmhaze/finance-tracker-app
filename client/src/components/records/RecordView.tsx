import React, { useState } from 'react';

interface TransactionRecord {
  description: string;
  type: string;
  amount: number;
  currency: string;
  paymentType: string;
  date: string;
  account: string;
  _id: string; // Dynamically added by the database
}

interface RecordViewProps {
  records: TransactionRecord[];
  onDeleteRecord: (id: string) => void;
  onUpdateRecord: (id: string, updatedField: Partial<TransactionRecord>) => void;
}

export const RecordView: React.FC<RecordViewProps> = ({ records, onDeleteRecord, onUpdateRecord }) => {
  const [editingField, setEditingField] = useState<{ id: string; field: keyof TransactionRecord } | null>(null);
  const [tempValue, setTempValue] = useState<string | number | null>(null); // Temporary value for the field being edited

  const handleFieldClick = (id: string, field: keyof TransactionRecord) => {
    setEditingField({ id, field }); // Set the field to edit mode
    const record = records.find((r) => r._id === id);
    if (record) {
      setTempValue(record[field]); // Store the original value
    }
  };

  const handleFieldChange = (value: string | number) => {
    setTempValue(value); // Update the temporary value
  };

  const handleBlur = (id: string, field: keyof TransactionRecord) => {
    if (tempValue === '' || tempValue === null) {
      // If the field is empty, revert to the original value
      const record = records.find((r) => r._id === id);
      if (record) {
        setTempValue(record[field]); // Reset tempValue to the original value
      }
    } else {
      // Otherwise, update the backend with the new value
      onUpdateRecord(id, { [field]: field === 'amount' ? parseFloat(tempValue as string) || 0 : tempValue });
    }
    setEditingField(null); // Exit edit mode
    setTempValue(null); // Clear the temporary value
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Payment Type</th>
            <th>Date</th>
            <th>Account</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              {Object.keys(record).map((key) => {
                const field = key as keyof TransactionRecord;
                if (field === '_id') return null; // Skip the _id field

                return (
                  <td key={field}>
                    {editingField?.id === record._id && editingField.field === field ? (
                      field === 'type' || field === 'paymentType' || field === 'currency' ? (
                        <select
                          value={tempValue as string || ''} // Use the temporary value
                          onChange={(e) => handleFieldChange(e.target.value)}
                          onBlur={() => handleBlur(record._id, field)} // Exit edit mode on blur
                          autoFocus
                        >
                          {field === 'type' && (
                            <>
                              <option value="Income">Income</option>
                              <option value="Expense">Expense</option>
                            </>
                          )}
                          {field === 'paymentType' && (
                            <>
                              <option value="Cash">Cash</option>
                              <option value="Debit Card">Debit Card</option>
                              <option value="Credit Card">Credit Card</option>
                              <option value="Cheque">Cheque</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                            </>
                          )}
                          {field === 'currency' && (
                            <>
                              <option value="EUR">EUR</option>
                              <option value="CZK">CZK</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <input
                          type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'}
                          value={tempValue as string || ''} // Use the temporary value
                          onChange={(e) => handleFieldChange(e.target.value)}
                          onBlur={() => handleBlur(record._id, field)} // Exit edit mode on blur
                          autoFocus
                        />
                      )
                    ) : (
                      <span onClick={() => handleFieldClick(record._id, field)}>{record[field] || ''}</span>
                    )}
                  </td>
                );
              })}
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => onDeleteRecord(record._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};