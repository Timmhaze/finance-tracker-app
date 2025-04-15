//server/src/routes/currencyRoutes.ts

import { Router, Request, Response } from 'express';

const router = Router();

interface CnbApiError {
  message: string;
  code?: string;
}

router.get('/', async (req: Request, res: Response<string | { error: string }>) => {
  try {
    const response = await fetch(
      'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt'
    );
    
    if (!response.ok) {
      throw new Error(`CNB API responded with status ${response.status}`);
    }

    const data = await response.text();
        res.send(data);
    
  } catch (error: unknown) {
    const err = error as CnbApiError;
    console.error('CNB API error:', err.message);
        res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

export default router;