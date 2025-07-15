// MongoDB imports
import mongoose, { Schema, Document, Types } from 'mongoose';

// CNB Conversion rate service import
import { fetchExchangeRates } from '../services/cnbService';

export interface TransactionRecord extends Document {
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  currency: 'EUR' | 'CZK'; // Strictly matches Account currency types
  paymentType: string;
  dateCreated?: string;
  linkedAccount: Types.ObjectId;
}

const transactionRecordSchema: Schema = new Schema({
  description: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true,trim: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  amount: { type: Number, required: true},
  currency: { type: String, enum: ['EUR', 'CZK'], required: true },
  paymentType: { type: String, required: true },
  dateCreated: { type: Date, required: false },
  linkedAccount: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
});

// Pre-save hook for amount handling + currency conversion, should only run during post, not during update (findByIdAndUpdate circumvents the presave hook)
transactionRecordSchema.pre<TransactionRecord>('save', async function(next) 
{
  // 1. Ensure correct amount sign
  if(this.isNew) {
    this.amount = Math.abs(this.amount);
    this.dateCreated = new Date().toISOString().split('T')[0]; // Format date to YYYY-MM-DD
  }
  
  next();
});

export const TransactionRecordModel = mongoose.model<TransactionRecord>('Record', transactionRecordSchema);