import React from 'react';
import { Table } from 'react-bootstrap';
import { RecordItem } from './RecordItem';

interface RecordViewProps {
  records: Record<string, any>[]; // The string, any part refers to the key-value pair of the data object
}

export const RecordView: React.FC<RecordViewProps> = ({ records }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Description</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Payment Type</th>
          <th>Date</th>
          <th>Account</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <RecordItem key={record.id} record={record} />
        ))}
      </tbody>
    </Table>
  );
};