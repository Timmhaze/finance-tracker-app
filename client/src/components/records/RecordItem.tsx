import React from 'react';

interface RecordItemProps {
  record: Record<string, any>;
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