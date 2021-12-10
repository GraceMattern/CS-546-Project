const mongoCollections = require("../config/mongoCollections");
const accountsCollections = mongoCollections.accounts;
const usersCollection = mongoCollections.users;
const users = require("./users");
let { ObjectId } = require("mongodb");

//***TYPE CHECKING***

//Check string and empty; Return T or F
function isString(a) {
  if (typeof a != "string") throw `Type is not String ${a} is a ${typeof a}`;
  if (a.length == 0 || a.trim().length == 0) throw "content is empty";
}
//Check ObjectId
function isObjectId(a) {
  if (/^[0-9a-fA-F]{24}$/.test(a) != true) throw "objectId is not valid";
}

//***EXPORT FUNCTIONS****

//creat new account and return obj
async function createAccount(userId, accountType) {
  if (!userId || isString(userId))
    throw "accounts.create(userId, accountType) Please input non-empty userId";
  if (!accountType || isString(accountType))
    throw "accounts.create(userId, accountType) Please input non-empty accountType";
  if (arguments.length != 2)
    throw "accounts.create(userId, accountType) Please only input useId and accountType";

  let newAccount = {
    userId: userId,
    accountType: accountType,
    balance: 0,
    transactions: [],
  };
  const accountCollection = await accountsCollections();
  const insertInfo = await accountCollection.insertOne(newAccount);
  if (insertInfo.insertedCount === 0) throw "Could not add account";

  const newId = insertInfo.insertedId.toString();
  const accountResult = await this.getAccount(newId);
  accountResult._id = accountResult._id.toString();

  //add account into user
  const userCollection = await usersCollection();
  let userInfo = await users.getUserById(userId);
  if (!userInfo) throw `The user does not exist`;
  userInfo["accounts"].push(newId);
  delete userInfo._id;
  let ObjUserId;
  try {
    ObjUserId = ObjectId(userId.trim());
  } catch (e) {
    throw e.message;
  }
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjUserId },
    { $set: userInfo }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "accountsId Could not update successfully in userCollection when create";
  }

  return accountResult;
}
//return all accounts in array
async function getAllAccounts() {
  if (arguments.length != 0) throw "accounts.getAllAccounts() please not input";
  const accountCollection = await accountsCollections();
  const accountList = await accountCollection.find({}).toArray();
  if (!accountList) throw `No account in the system`;
  for (let i of accountList) {
    i._id = i._id.toString();
  }
  return accountList;
}

//return an account in obj
async function getAccount(accountId) {
  if (!accountId || isString(accountId))
    throw "accounts.getAccount(accountId) Please input non-empty accountId";
  if (arguments.length != 1)
    throw "accounts.getAccount(accountId) Please only input accountId";

  let ObjAccountId;
  try {
    ObjAccountId = ObjectId(accountId.trim());
  } catch (e) {
    throw e.message;
  }
  const accountCollection = await accountsCollections();
  const accountResult = await accountCollection.findOne({ _id: ObjAccountId });
  if (accountResult === null) throw "No account with that id";
  accountResult._id = accountResult._id.toString();
  return accountResult;
}

//get balance, return balance in number
async function getBalance(accountId) {
  if (!accountId || isString(accountId))
    throw "accounts.getBalance(accountId) Please input non-empty accountId";
  if (arguments.length != 1)
    throw "accounts.getAccount(accountId) Please only input accountId";

  var account = await getAccount(accountId);
  var balance = account["balance"];
  if (typeof balance != "number")
    throw "the type of balance in accounts is not number";

  return balance;
}
//get all transactions, return transactions ID in array
async function getTransactions(accountId) {
  if (!accountId || isString(accountId))
    throw "accounts.getTransactions(accountId) Please input non-empty accountId";
  if (arguments.length != 1)
    throw "accounts.getTransactions(accountId) Please only input accountId";

  var account = await getAccount(accountId);
  if (!account) throw `there is not account with that id`;
  var transactions = account["transactions"];
  if (!Array.isArray(transactions))
    throw "the type of balance in accounts is not array";

  return transactions;
}

//remove account
async function removeAccount(accountId) {
  if (!accountId || isString(accountId))
    throw "accounts.removeAccount(accountId) Please input non-empty accountId";
  if (arguments.length != 1)
    throw "accounts.removeAccount(accountId) Please only input accountId";

  let ObjAccountId;
  try {
    ObjAccountId = ObjectId(accountId.trim());
  } catch (e) {
    throw e.message;
  }
  const account = await accountsCollections();
  var accountInfo = await this.getAccount(accountId);
  if (!accountInfo) throw `there is no account with that id`;

  //remove accountId in users collection
  const userCollection = await usersCollection();
  var userInfo = await users.getUserById(accountInfo.userId);
  if (!userInfo) throw `there is no user that that id`;
  var length = userInfo["accounts"].length;
  for (let i = 0; i < length; i++) {
    if (userInfo.accounts[i] == accountId) {
      userInfo.accounts.splice(i, 1);
      break;
    }
    if (i == length - 1) throw "no user with that account ID";
  }
  // console.log(userInfo.accounts);
  delete userInfo._id;
  let ObjUserId;
  try {
    ObjUserId = ObjectId(accountInfo["userId"].trim());
  } catch (e) {
    throw e.message;
  }

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjUserId },
    { $set: userInfo }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "accountId Could not remove successfully in userCollection when remove";
  }

  // return "accountId:" + accountInfo["_id"] + " has been successfully deleted!";
  const deletionInfo = await account.deleteOne({ _id: ObjAccountId });
  if (deletionInfo.deletedCount === 0)
    throw `Could not delete account with id of ${id}`;

  return updatedInfo.accounts;
}

async function getAccountByTransId(transId) {
  if (!transId || isString(transId)) throw `must provide trans id`;
  let parsedId;
  try {
    parsedId = ObjectId(transId.trim());
  } catch (e) {
    throw e.message;
  }

  let accountCollection = await accountsCollections();
  let accountList = await accountCollection.find({}).toArray();
  if (!accountList)
    throw `there are no accounts in the systems thus no transaction`;
  let result;
  for (let i of accountList) {
    for (let j = 0; j < i.transactions.length; j++) {
      if (i.transactions[j] == transId) {
        result = i._id;
      }
    }
  }
  if (!result)
    throw `no transaction with that id was found in a user's history`;
  return result;
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccount,
  getBalance,
  getTransactions,
  removeAccount,
  getAccountByTransId,
};
