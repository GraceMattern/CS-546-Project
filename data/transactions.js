const mongoCollections = require("../config/mongoCollections");
const transactions = mongoCollections.transactions;
let { ObjectId } = require("mongodb");
const accounts = require("./accounts");
const accountsCollections = mongoCollections.accounts;

function isString(a) {
  if (typeof a != "string") throw "Type is not String";
  if (a.trim().length == 0) throw "content is empty";
}
//create new transaction after successful transaction and return object
async function createTrans(userId, accountId, toAccountId, amount, tag) {
  if (!accountId || isString(accountId) || !toAccountId || isString(toAccountId))
    throw "Please input a non empty Account Ids!";

  if (!amount || typeof parseFloat(amount) !== "number")
    throw `Amount must be a number`;

  if (parseFloat(amount) <= 0)
    throw "Amount must be a positive, non zero number";
  // TODO must do more error checking

  let CurrDate = new Date();
  let newTrans = {
    accountId: accountId,
    userId: userId,
    toAccountId: toAccountId,
    transAmount: parseFloat(amount),
    date: {
      MM: CurrDate.getMonth() + 1,
      DD: CurrDate.getDate(),
      YYYY: CurrDate.getFullYear(),
    },
    tag: tag,
  };
  const transCollection = await transactions();
  const insertInfo = await transCollection.insertOne(newTrans);
  if (insertInfo.insertedCount === 0) throw "Could not add Transaction";

  const newId = insertInfo.insertedId.toString();
  const transResult = await this.getTransById(newId);
  transResult._id = transResult._id.toString();

  // add transaction to user's account and update balance
  const accCollect = await accountsCollections();
  const found = await accounts.getAccount(accountId);
  if (!found) throw "The Account does not exists!";
  found["transactions"].push(newId);
  if (toAccountId == "internal_deposit") { // deposit
    found.balance = parseFloat(found.balance) + parseFloat(amount);
    delete found._id; 
    const updatedInfo = await accCollect.updateOne(
      { _id: ObjectId(accountId) },
      { $set: found }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw "Update failed";
    // return await accounts.getAccount(accountId);
    return transResult;
  }
  if (toAccountId == "external_transaction") { // transaction
    if (found.balance < amount) throw `You have insuffient funds to make this transaction`
    found.balance = parseFloat(found.balance) -  parseFloat(amount);
    delete found._id; 
    const updatedInfo = await accCollect.updateOne(
      { _id: ObjectId(accountId) },
      { $set: found }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw "Update failed";
    // return await accounts.getAccount(accountId);
    return transResult;
  }
  
}

//return all Transaction in array
async function getAlltrans() {
  const transCollection = await transactions();
  const transList = await transCollection.find({}).toArray();
  if (!transList) throw `No transaction in the system`;
  for (let i of transList) {
    i._id = i._id.toString();
  }
  return transList;
}

async function updateTag(transID, newComment) {
  if (!transID || isString(transID) || !newComment)
    throw "Please input Valid and non empty Trans Ids and New Comment!";

  let objId = ObjectId(transID);
  const transCollection = await transactions();
  const found = await transCollection.findOne({ _id: objId });
  if (!found) throw "trans not found";
  let updatedInfo = await transCollection.updateOne(
    { _id: objId },
    { $set: { tag: newComment } }
  );
  if (updatedInfo.modifiedCount === 0) throw "could not update transaction";

  return getTransById(transID);
}

//return userId in string
async function getTransById(transID) {
  if (!transID || isString(transID))
    throw "Please input non-empty Transaction ID";
  if(arguments.length != 1) throw 'transaction.getTransById(transID) Please only input transaction id'
  let objId = ObjectId(transID);
  const transCollection = await transactions();
  const transact = await transCollection.findOne({ _id: objId });
  if (!transact) throw "trans not found";

  return transact;
}

async function update(transId, toAccountId, amount, tag, date) {
  if (!transId || isString(transId) || !toAccountId || isString(toAccountId))
    throw "Please input a non empty Account Ids!";

  if (!amount || typeof parseFloat(amount) !== "number")
    throw `Amount must be a number`;

  if (parseFloat(amount) <= 0)
    throw "Amount must be a positive, non zero number";
  
  // if (!type) throw `You must provide the type of the transaction you are editing`
  // TODO must do more error checking
  // const transCollection = await transactions();

  if (toAccountId === "internal_deposit") {
    const transCollect = await transactions();
    let objId = ObjectId(transId);
    // let toactId = ObjectId(toAccountId);

    const foundFrom = await transCollect.findOne({ _id: objId });
    if (!foundFrom) throw "transaction not found";
    // if (foundFrom["balance"] < amount)
    //   throw "Minimum balance requirement(Cant deduct amount)!!!";
    // foundFrom["balance"] -= amount;

    // const foundTo = await accCollect.findOne({ _id: toactId });
    // if (!foundTo) throw "account not found";
    // foundTo["balance"] += amount;

    let updatedFrom = await transCollect.updateOne(
      { _id: objId },
      { $set: { transAmount: parseFloat(amount) } }
    );
    if (updatedFrom.modifiedCount === 0) throw "could not update transaction";

    // let updatedTo = await accCollect.updateOne(
    //   { _id: toactId },
    //   { $set: { balance: foundTo["balance"] } }
    // );
    // if (updatedTo.modifiedCount === 0) throw "could not update transaction";
    //console.log("Updated in fo is====================",updatedTo);
    // createTrans(accountId, toAccountId, amount);
    // return await accounts.getAccount(accountId);
    return await this.getTransById(transId)
  } 
  if (toAccountId == 'external_transaction') { // TODO need to alter
    let objId = ObjectId(accountId);
    const transCollect = await transactions();
    const foundFrom = await transCollect.findOne({ _id: objId });
    if (!foundFrom) throw "transaction not found";
    // if (foundFrom["balance"] < amount)
    //   throw "Minimum balance requirement(Cant deduct amount)!!!";
    // foundFrom["balance"] -= amount;

    let updatedFrom = await accCollect.updateOne(
      { _id: objId },
      { $set: { balance: foundFrom["balance"] } }
    );
    if (updatedFrom.modifiedCount === 0) throw "could not update transaction";

    console.log("Withdrawl");
    createTrans(accountId, accountId, amount);
    return await accounts.getAccount(accountId);
  }
}

async function getDetails(arr) {
  let result = []
  for (let id of arr) {
    let temp = await this.getTransById(id)
    result.push(temp)
  }
  if(!result) throw `unable to find details of the transaction id(s) given`
  return result
}

module.exports = {
  createTrans,
  getAlltrans,
  getTransById,
  updateTag,
  update,
  getDetails,
};
