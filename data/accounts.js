const mongoCollections = require('../config/mongoCollections');
const accountsCollections = mongoCollections.accounts;
const usersCollection = mongoCollections.users;
const users= require('./users');
let { ObjectId } = require('mongodb');

//***TYPE CHECKING***

//Change stringID into ObjectID; return ObjectID
function getObjectIdByString(id){
    if (!id) throw 'Please input ID in string';
    isString(id);
    let parsedId = ObjectId(id);
    return parsedId;
}
//Check string and empty; Return T or F
function isString(a){
    if(typeof a != 'string') throw 'Type is not String';
    if (a.length == 0 || a.trim().length == 0) throw 'content is empty';
}
//Check ObjectId
function isObjectId(a){
    if((/^[0-9a-fA-F]{24}$/.test(a)) != true) throw 'objectId is not valid';
}


//***EXPORT FUNCTIONS****

//creat new account and return obj
async function createAccount(userId, accountType){
    if(!userId || isString(userId)) throw 'accounts.create(userId, accountType) Please input non-empty userId';
    if(!accountType || isString(accountType)) throw 'accounts.create(userId, accountType) Please input non-empty accountType';
    if(arguments.length != 2) throw 'accounts.create(userId, accountType) Please only input useId and accountType';

    let newAccount = {
        userId: userId,
        accountType: accountType,
        balance: 0,
        transactions: []
    }
    const accountCollection = await accountsCollections();
    const insertInfo = await accountCollection.insertOne(newAccount);
    if (insertInfo.insertedCount === 0) throw 'Could not add account';

    const newId = insertInfo.insertedId;        
    var newIdString = newId.toString();
    const accountResult = await this.getAccount(newIdString);

    //add accountId into users collection
    const userCollection = await usersCollection();
    let userInfo = await users.getUserById(userId);
    userInfo["accounts"].push(newIdString);
    delete userInfo._id;
    var ObjUserId = getObjectIdByString(userId);
    //const userCollection = await usersCollection();
    const updatedInfo = await userCollection.updateOne(
        { _id: ObjUserId },
        { $set: userInfo }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'accountsId Could not update successfully in userCollection when create';
    }
    
    return accountResult;
}
//return all accounts in array
async function getAllAccounts() {
    if(arguments.length != 0) throw 'accounts.getAllAccounts() please not input';
    const accountCollection = await accountsCollections();
    const accountList = await accountCollection.find({}).toArray();

    return accountList;
  }
//return an account in obj
async function getAccount(accountId){
    if(!accountId || isString(accountId)) throw 'accounts.getAccount(accountId) Please input non-empty accountId';
    if(arguments.length != 1) throw 'accounts.getAccount(accountId) Please only input accountId'

    var ObjAccountId = getObjectIdByString(accountId);
    const accountCollection = await accountsCollections();
    const accountResult = await accountCollection.findOne({ _id: ObjAccountId });
    if (accountResult === null) throw 'No account with that id';

    return accountResult; 
}

//get balance, return balance in number
async function getBalance(accountId){
    if(!accountId || isString(accountId)) throw 'accounts.getBalance(accountId) Please input non-empty accountId';
    if(arguments.length != 1) throw 'accounts.getAccount(accountId) Please only input accountId'

    var account = await getAccount(accountId);
    var balance = account['balance'];
    if(typeof balance != 'number') throw 'the type of balance in accounts is not number';
    
    return balance;
}
//get all transactions, return transactions ID in array
async function getTransactions(accountId){
    if(!accountId || isString(accountId)) throw 'accounts.getTransactions(accountId) Please input non-empty accountId';
    if(arguments.length != 1) throw 'accounts.getTransactions(accountId) Please only input accountId'

    var account = await getAccount(accountId);
    var transactions = account['transactions'];
    if(!(Array.isArray(transactions))) throw 'the type of balance in accounts is not array';
    
    return transactions;
}
/*
//return account type in string
async function getType(accountId){
    if(!accountId || isString(accountId)) throw 'accounts.getType(accountId) Please input non-empty accountId';
    if(arguments.length != 1) throw 'accounts.getType(accountId) Please only input accountId'

    var account = await getAccount(accountId);
    var type = account['accountType'];
    if(typeof type != 'string') throw 'the type of accountType in accounts is not string';
    
    return type;
}
*/
//add new transaction and update balance, return account.
async function addTransactions(accountId, transactionId, transactionAmount){
    if(!accountId || isString(accountId)) throw 'accounts.addTransactions(accountId, transactionId, transactionAmount) Please input non-empty accountId';
    if(!transactionId || isString(transactionId)) throw 'accounts.addTransactions(accountId, transactionId, transactionAmount) Please input non-empty transactionId';
    if(!transactionAmount || typeof transactionAmount != 'number') throw 'accounts.addTransactions(accountId, transactionId, transactionAmount) Please input transactionId in type of number';
    if(arguments.length != 3) throw 'accounts.addTransactions(accountId, transactionId, transactionAmount) Please input accountId, transactionId, transactionAmount'

    var newTransactions = await getTransactions(accountId);
    var newBalance = await getBalance(accountId);
    newTransactions.push(transactionId);
    newBalance += transactionAmount;
    if(newBalance < 0) throw "Insufficient balance";

    var ObjAccountId = getObjectIdByString(accountId);
    const accountCollection = await accountsCollections();
    const updatedAccount = {
        balance: newBalance,
        transactions: newTransactions
    };
    const updatedInfo = await accountCollection.updateOne(
        { _id: ObjAccountId },
        { $set: updatedAccount }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'accounts.addTransactions Could not update account successfully';
    }

    return await this.getAccount(accountId);
}

//remove account
async function removeAccount(accountId){
    if(!accountId || isString(accountId)) throw 'accounts.removeAccount(accountId) Please input non-empty accountId';
    if(arguments.length != 1) throw 'accounts.removeAccount(accountId) Please only input accountId'

    var ObjAccountId = getObjectIdByString(accountId);
    var accountInfo = await this.getAccount(accountId);

    const account = await accountsCollections();
    const deletionInfo = await account.deleteOne({ _id: ObjAccountId });
        
    if (deletionInfo.deletedCount === 0) throw `Could not delete account with id of ${id}`;
    //remove accountId in users collection
    const userCollection = await usersCollection();
    var userInfo = await users.getUserById(accountInfo.userId);
    var length = userInfo["accounts"].length;
    for(let i = 0; i < length; i++)
    {
        if(userInfo.accounts[i] == accountId)
        {
            userInfo.accounts.splice(i,1);
            break;
        }
        if(i == length -1) throw "Could not find that account ID";
    }
    console.log(userInfo.accounts);
    delete userInfo._id;
    var ObjUserId = getObjectIdByString(accountInfo["userId"]);
    
    const updatedInfo = await userCollection.updateOne(
        { _id: ObjUserId },
        { $set: userInfo }
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'accountId Could not remove successfully in userCollection when remove';
    }
        
    return 'accountId:' + accountInfo['_id'] + ' has been successfully deleted!';
}

module.exports = {
    createAccount,
    getAllAccounts,
    getAccount,
    addTransactions,
    removeAccount
}

