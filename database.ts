
import { Db, MongoClient } from 'mongodb';
import { Deposit, User } from './interfaces';

export class Database {
    private db: Db = null;
    private client: MongoClient = null;

    async init(dbUrl: string, dbName: string) {
        this.client = await MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = await this.client.db(dbName);

        const users = await this.getCollection('users');

        if (users === null) {
            await this.db.createCollection('users');
            await this.db.createCollection('wallets');
            await this.db.createCollection('deposits');
        }

        return this.db;
    }

    close() {
        this.client.close();
    }

    getCollection(name: string) {
        return new Promise((resolve) => {
            this.db.collection(name, { strict: true }, (err, collection) => {
              if (err) {
                resolve(null);
              }

              resolve(collection);
            });
          });
    }

    async getUser(userId: string) {
        const usersTable = this.db.collection('users');
    
        return usersTable.findOne({ _id: userId });
      }

    async addUser(user: User) {
        const usersTable = this.db.collection('users');
        const result = await usersTable.insertOne(user);

        const id = result[0]._id;

        return id;
    }

    async addDeposit(deposit: Deposit) {
      const depositTable = this.db.collection('deposits');
      const result = await depositTable.insertOne(deposit);

      const id = result[0]._id;

      return id;
  }
}