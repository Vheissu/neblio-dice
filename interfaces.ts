import { ObjectID } from 'mongodb';

export interface Deposit {
    amount: string;
    userId: ObjectID;
    date: number;
}

export interface User {
    username: string;
    password: string;
}