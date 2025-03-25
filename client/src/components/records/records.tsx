import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';

const recordsDummyData = [
    {
      id: 1,
      description: 'Grocery Shopping',
      type: 'Expense',
      amount: '50',
      currency: 'Euro',
      paymentType: 'Credit Card',
      date: '2025-03-15',
      account: 'Checking Account',
    },
    {
      id: 2,
      description: 'Salary',
      type: 'Income',
      amount: '2,500',
      currency: 'CZK',
      paymentType: 'Bank Transfer',
      date: '2025-03-10',
      account: 'Savings Account',
    },
    {
      id: 3,
      description: 'Stock Dividend',
      type: 'Income',
      amount: '200',
      currency: 'CZK',
      paymentType: 'Bank Transfer',
      date: '2025-03-05',
      account: 'Investment Account',
    },
    {
      id: 4,
      description: 'Electricity Bill',
      type: 'Expense',
      amount: '100',
      currency: 'Euro',
      paymentType: 'Direct Debit',
      date: '2025-03-12',
      account: 'Checking Account',
    },
    {
      id: 5,
      description: 'Freelance Work',
      type: 'Income',
      amount: '1,000',
      currency: 'Euro',
      paymentType: 'Bank Transfer',
      date: '2025-03-08',
      account: 'Savings Account',
    },
    {
      id: 6,
      description: 'Car Repair',
      type: 'Expense',
      amount: '300',
      currency: 'Euro',
      paymentType: 'Credit Card',
      date: '2025-03-07',
      account: 'Checking Account',
    },
    {
      id: 7,
      description: 'Gym Membership',
      type: 'Expense',
      amount: '50',
      currency: 'Euro',
      paymentType: 'Credit Card',
      date: '2025-03-01',
      account: 'Checking Account',
    },
    {
      id: 8,
      description: 'Gift for Friend',
      type: 'Expense',
      amount: '75',
      currency: 'CZK',
      paymentType: 'Cash',
      date: '2025-03-14',
      account: 'Savings Account',
    },
    {
      id: 9,
      description: 'Stock Purchase',
      type: 'Expense',
      amount: '500',
      currency: 'CZK',
      paymentType: 'Bank Transfer',
      date: '2025-03-03',
      account: 'Investment Account',
    },
    {
      id: 10,
      description: 'Monthly Rent',
      type: 'Expense',
      amount: '1,200',
      currency: 'Euro',
      paymentType: 'Direct Debit',
      date: '2025-03-01',
      account: 'Checking Account',
    },
    {
      id: 11,
      description: 'Coffee Shop',
      type: 'Expense',
      amount: '15',
      currency: 'Euro',
      paymentType: 'Credit Card',
      date: '2025-03-16',
      account: 'Checking Account',
    },
    {
      id: 12,
      description: 'Online Course',
      type: 'Expense',
      amount: '200',
      currency: 'Euro',
      paymentType: 'Credit Card',
      date: '2025-03-11',
      account: 'Savings Account',
    },
    {
      id: 13,
      description: 'Bonus Payment',
      type: 'Income',
      amount: '3,000',
      currency: 'CZK',
      paymentType: 'Bank Transfer',
      date: '2025-03-09',
      account: 'Savings Account',
    },
    {
      id: 14,
      description: 'Book Purchase',
      type: 'Expense',
      amount: '30',
      currency: 'Euro',
      paymentType: 'Credit Card',
      date: '2025-03-20',
      account: 'Checking Account',
    },
  ];

export const Records: React.FC = () => {

  interface Record {
    id: number;
    description: string;
    type: string;
    amount: string;
    currency: string;
    paymentType: string;
    date: string;
    account: string;
  }

  const [recordData, setRecordData] = React.useState<Record[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/records/')
      .then((res) => res.json())
      .then((data) => {
        setRecordData(data);
      }).catch((error) => {
        console.error('Frontend Error:', error);
      });
  }, [])

  return (
    <div className="w-100">
      <h2 className="mb-4">Transaction Records</h2>
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
          {recordData.map((record) => (
            <tr key={record.id}>
              <td>{record.description}</td>
              <td>{record.type}</td>
              <td>{record.amount}</td>
              <td>{record.currency}</td>
              <td>{record.paymentType}</td>
              <td>{record.date}</td>
              <td>{record.account}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};