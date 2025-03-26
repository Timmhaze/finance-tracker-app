import React from 'react';
import { TransactionRecord } from './Records';

interface RecordItemProps {
  record: TransactionRecord;
};


export const RecordItem: React.FC<RecordItemProps> = ({ record }) => {
  return (
    <tr>
      <td>{record.description}</td>
      <td>{record.type}</td>
      <td>{record.amount}</td>
      <td>{record.currency}</td>
      <td>{record.paymentType}</td>
      <td>{record.date}</td>
      <td>{record.account}</td>
    </tr>
  );
};