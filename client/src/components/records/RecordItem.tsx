import React from 'react';
import { TransactionRecord } from '../types/index'; // Adjust the path if necessary

interface RecordItemProps {
  record: TransactionRecord;
};


export const RecordItem: React.FC<RecordItemProps> = ({ record }) => {
  return (
    <tr>
      <td>{record.description}</td>
      <td>{record.category}</td>
      <td>{record.type}</td>
      <td>{record.amount}</td>
      <td>{record.currency}</td>
      <td>{record.paymentType}</td>
      <td>{record.date}</td>
      <td>{record.account?.title || 'No Account'}</td>
    </tr>
  );
};