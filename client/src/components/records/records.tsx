import { useState, useEffect } from 'react';
import { RecordView } from './RecordView';
import { RecordForm } from './RecordForm';

import 'bootstrap/dist/css/bootstrap.min.css';


interface Record {
  id: number;
  description: string;
  type: string;
  amount: string;
  currency: string;
  paymentType: string;
  date: string;
  account: string;
}

export const Records: React.FC = () => {

  const [recordData, setRecordData] = useState<Record[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/records/')
      .then((res) => res.json())
      .then((data) => {
        setRecordData(data);
      }).catch((error) => {
        console.error('Frontend Error:', error);
      });
  }, []);

  const addRecord = (newRecord: Omit<Record, 'id'>) => {
    // Send the new record to the backend
    fetch('http://localhost:3001/api/records/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    })
      .then((res) => res.json())
      .then((savedRecord) => {
        // Add the saved record (with ID) to the state
        setRecordData((prev) => [...prev, savedRecord]);
      })
      .catch((error) => {
        console.error('Error adding record:', error);
      });
  };

  return (
    <div className="w-100">
      <h2 className="mb-4">Transaction Records</h2>
      <RecordView records={recordData} />
      <RecordForm onAddRecord={addRecord} />
    </div>
  );
};