//client/src/components/records/RecordItem.tsx

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
      <td>{record.currency}</td>
      <td>
        {record.type === 'Expense' ? '-' : ''}
        {record.amount}
      </td>
      <td>{record.paymentType}</td>
      <td>{record.dateCreated}</td>
      <td>{record.linkedAccount?.title || 'No Account'}</td>
      {/* <td>{record.originalAmount}</td> */}
      {/*<td>{record.originalCurrency}</td>*/}
    </tr>
  );
};