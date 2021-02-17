
import { Db, MongoClient } from 'mongodb';

export class Database {
    private db: Db = null;
    private client: MongoClient = null;

    async init(dbUrl: string, dbName: string) {
        this.client = await MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = await this.client.db(dbName);

        const invoices = await this.getCollection('invoices');

        if (invoices === null) {
            await this.db.createCollection('invoices');
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

    async getInvoice(invoiceId: string) {
        const invoicesTable = this.db.collection('invoices');
    
        return invoicesTable.findOne({ _id: invoiceId });
      }

    async addInvoice(invoice) {
        const invoicesTable = this.db.collection('invoices');
        const result = await invoicesTable.insertOne(invoice);

        const id = result[0]._id;

        return id;
    }
}