//client/src/components/records/RecordView.tsx

import React, { useState } from 'react';
import { RecordItem } from './RecordItem';
import { TransactionRecord } from '../types/index'; // Adjust the path if necessary

interface RecordViewProps {
  records: TransactionRecord[];
}

export const RecordView: React.FC<RecordViewProps> = ({ records }) => {
  return (
    <div className="container mt-4">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Payment Type</th>
            <th>Date Created</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <RecordItem key={record._id} record={record} />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};