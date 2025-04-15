// client/src/components/records/Records.tsx

// React imports
import { useState, useEffect } from 'react';

// Records related imports
import { TransactionRecord, Account } from '../types/index';
import { RecordView } from './RecordView';

// Bootstrap imports
import { Col } from 'react-bootstrap';

// Props for accounts so records have access to account data
interface AccountsProps{
  accounts: Account[];
}

export const Records: React.FC<AccountsProps> = ({ accounts }) => {
  const [recordData, setRecordData] = useState<TransactionRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/records/');
        const data = await response.json();
        setRecordData(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchRecords();
  }, []);

  return (
    <Col>
      <h2 className="mb-4">Transaction Records</h2>
      <RecordView records={recordData} />
    </Col>
  );
};