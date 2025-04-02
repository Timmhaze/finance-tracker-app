import React, { useState, useEffect } from 'react';
import { AccountView } from './AccountView'
import { fetchExchangeRates } from '../../../../server/src/services/exchangeRates'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap';

export interface Account {
    _id: string; // MongoDB ID
    title: string;
    balance: string;
    currency: string;
    date: string;
    convertedBalance?: string;
}


export const Accounts: React.FC = () => {

    const [accountData, setAccountData] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const [accountsRes, exchangeRate] = await Promise.all([
                    fetch('http://localhost:3001/api/accounts/'),
                    fetchExchangeRates()
                ]);

                const accounts = await accountsRes.json();

                const accountsWithConversion = accounts.map((account: Account) => ({
                    ...account,
                    convertedBalance: convertBalance(account, exchangeRate)
                }));

                setAccountData(accountsWithConversion);
            }

            catch(err) {
                console.error('Fetch error:', err)
            }

            finally {
                setIsLoading(false);
            }
        };

        fetchdata();
    }, []);

    const convertBalance = (account: Account, rate: number): string => {
        const balance = parseFloat(account.balance);
        if(account.currency === 'Euro') {
            return `${(balance * rate).toFixed(0)} Kč`;
        }
        return `${(balance / rate).toFixed(2)} €`;
    };

    if (isLoading) return <div>Loading accounts...</div>

        // fetch('http://localhost:3001/api/accounts/')
        //     .then((res) => res.json())
        //     .then((data) => {
        //         setAccountData(data);
        //     }).catch((error) => {
        //         console.error('Frontend Error:', error);
        //     });
    

    return (
        <Col>
            <AccountView accounts={accountData} />
            {/* <AddAccountForm /> */}
        </Col>
    );
};

