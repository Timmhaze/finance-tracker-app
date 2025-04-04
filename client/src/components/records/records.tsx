import { useState, useEffect } from 'react';
import { RecordView } from './RecordView';
import { AddRecordForm } from './AddRecordForm';
import { Col, Button } from 'react-bootstrap';
import { Account, TransactionRecord } from '../types/index';

interface RecordsProps {
  accounts: Account[];
  onAccountUpdate: () => void; // Add this prop
}

export const Records: React.FC<RecordsProps> = ({ accounts, onAccountUpdate }) => {
  const [recordData, setRecordData] = useState<TransactionRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/records/');
        const data = await response.json();
        setRecordData(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [refreshTrigger]);

  const handleAddRecord = async (record: {
    description: string;
    category: string;
    type: string;
    amount: string;
    currency: string;
    paymentType: string;
    accountId: string;
  }) => {
    try {
      const response = await fetch('http://localhost:3001/api/records/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...record,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (!response.ok) throw new Error('Failed to create record');
      
      // Trigger updates for both records and accounts
      setRefreshTrigger(prev => prev + 1);
      onAccountUpdate(); // Call the parent's update function
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating record:', err);
    }
  };

  return (
    <Col>
      <h2 className="mb-4">Transaction Records</h2>
      <Button 
        variant='success' 
        className='mb-3' 
        onClick={() => setShowAddForm(true)}
      >
        + Add New Record
      </Button>
      <AddRecordForm 
        accounts={accounts}
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddRecord={handleAddRecord}
      />
      {isLoading ? (
        <div>Loading records...</div>
      ) : (
        <RecordView records={recordData} />
      )}
    </Col>
  );
};