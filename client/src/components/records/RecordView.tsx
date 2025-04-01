import React, { useState } from 'react';
import { TransactionRecord } from './Records';
import { RecordItem } from './RecordItem';

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
            <th>Amount</th>
            <th>Currency</th>
            <th>Payment Type</th>
            <th>Date</th>
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