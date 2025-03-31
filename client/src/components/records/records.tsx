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

  return (
    <div className="w-100">
      <h2 className="mb-4">Transaction Records</h2>
      <RecordView records={recordData} />
      <AddRecordForm />
    </div>
  );
};