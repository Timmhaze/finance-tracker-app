import { useState, useEffect } from 'react';
import { RecordView } from './RecordView';
import { AddRecordForm } from './AddRecordForm'; // Adjust the path if necessary

import 'bootstrap/dist/css/bootstrap.min.css';

export interface TransactionRecord {
  _id: string; // MongoDB ID
  description: string;
  type: string;
  amount: number;
  currency: string;
  paymentType: string;
  date: string;
  account: string;
}

export const Records: React.FC = () => {

  const [recordData, setRecordData] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/records/')
      .then((res) => res.json())
      .then((data) => {
        setRecordData(data);
      }).catch((error) => {
        console.error('Frontend Error:', error);
      });
  }, []);

  const addRecord = (newRecord: TransactionRecord) => {
    fetch('http://localhost:3001/api/records/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    })
      .then((res) => res.json())
      .then((savedRecord) => {
        setRecordData((prev) => [...prev, savedRecord]); // Add the new record to the state
      })
      .catch((error) => {
        console.error('Error adding record:', error);
      });
  };

  const updateRecord = (id: string, updatedField: Partial<TransactionRecord>) => {
    fetch(`http://localhost:3001/api/records/${id}`, {
      method: 'PATCH', // Use PATCH to update specific fields
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedField),
    })
      .then((res) => res.json())
      .then((updatedData) => {
        setRecordData((prev) =>
          prev.map((record) => (record._id === id ? { ...record, ...updatedField } : record))
        ); // Update the record in the state
      })
      .catch((error) => {
        console.error('Error updating record:', error);
      });
  };

  const deleteRecord = (id: string) => {
    fetch(`http://localhost:3001/api/records/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          setRecordData((prev) => prev.filter((record) => record._id !== id)); // Remove the record from the state
        } else {
          console.error('Failed to delete record');
        }
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
      });
  };

  return (
    <div className="w-100">
      <h2 className="mb-4">Transaction Records</h2>
      <RecordView records={recordData} onDeleteRecord={deleteRecord} onUpdateRecord={updateRecord} />
      <AddRecordForm onAddRecord={addRecord} /> 
    </div>
  );
};