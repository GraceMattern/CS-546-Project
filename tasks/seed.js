const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
/* add data files here */
const users = data.users;
const transactions = data.transactions;
const accounts = data.accounts;

async function main() {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();

    // Create user
    const john = await users.createUser('John', 'Doe', 'Chase', 'jdoe@chase.com', 'password', 28);
    const johnId = john._id;

    const adam = await users.createUser('Adam', 'Smith', 'Citi', 'asmith@citi.com', 'test', 25);
    const adamId = adam._id;

    const alice = await users.createUser('Alice', 'Cooper', 'Chase', 'acooper@chase.com', 'root', 20);
    const aliceId = alice._id;

    const sally = await users.createUser('Sally', 'Winters', 'Bank of America', 'swinters@bankofamerica.com', 'acb123', 26);
    const sallyId = sally._id;


    //Create account

    const johnAccount = await accounts.createAccount(johnId.toString(),"saving");
    const johnAccountId = johnAccount._id.toString();

    const adamAccount = await accounts.createAccount(adamId.toString(),"saving");
    const adamAccountId = adamAccount._id.toString();

    const aliceAccount = await accounts.createAccount(aliceId.toString(),"saving");
    const aliceAccountId = aliceAccount._id.toString();

    const sallyAccount = await accounts.createAccount(sallyId.toString(),"saving");
    const sallyAccountId = sallyAccount._id.toString();

	console.log('Done seeding database');
    await dbConnection.closeConnection();

}
main();