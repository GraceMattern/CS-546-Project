const mongoCollections = require('../config/mongoCollections');
const transactions = mongoCollections.transactions;
let { ObjectId } = require('mongodb');
const accounts= require('./accounts');
const accountsCollections= mongoCollections.accounts;

function isString(a){
    if(typeof a != 'string') throw 'Type is not String';
    if (a.length == 0 || a.trim().length == 0) throw 'content is empty';
}
//create new transaction after successful transaction and return object
async function createTrans(accountId,toAccountId,balance){
    if(!accountId || isString(accountId) || !toAccountId || isString(toAccountId) || !balance || typeof(balance)!=="number") throw 'Please input Valid and non empty Account Ids and balance!';
    if (balance<0) throw "Balance should be positive Value";
    let CurrDate=new Date();
    const foundUserId= await accounts.getAccount(accountId);
    let newTrans = {
        accountId:accountId,
        userId:foundUserId['userId'],
        toAccountId:toAccountId,
        transAmount:balance,
        date:{MM: CurrDate.getMonth()+1, DD:CurrDate.getDate(),YYYY: CurrDate.getFullYear()},
        tag:[]
    }
    const transCollection = await transactions();
    const insertInfo = await transCollection.insertOne(newTrans);
    if (insertInfo.insertedCount === 0) throw 'Could not add Transaction';

    const newId = insertInfo.insertedId;        
    var newIdString = newId.toString();

    const accCollect= await accountsCollections();
    const found= await accounts.getAccount(accountId);
    if(!found) throw 'The Account does not exists!';
    let tempArr=[];
    if(found['transactions']) {
        tempArr=found['transactions'];
    }
    tempArr.push(newId.toString())
    const updatedInfo = await accCollect.updateOne({_id:ObjectId(accountId)},{ $set: {transactions:tempArr}});
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Update failed';
    return await accounts.getAccount(accountId);
}

//return all Transaction in array
async function getAlltrans() {
    const transCollection = await transactions();
    const transList = await transCollection.find({}).toArray();
    return transList;
}

//Get all transactions between given intervals
async function getFilterTrans(fromDate,toDate){
    if(!fromDate || !toDate) throw 'Please provide both dates'
    const transCollection = await transactions();
    const transList = await transCollection.find({}).toArray();
    var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
 
    allDates=[]
    const startDate= new Date(fromDate);
    const endDate= new Date(toDate);
    if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
        throw 'Date is not Valid'
    } 
    
    if(startDate.getTime()>endDate.getTime()){
        throw 'Start Date should not be greater than End Date'
    }
    if(endDate.getTime()>new Date()){
        throw 'End Date should not be greater than Current Date'
    }
    // console.log(moment("06/22/2015", "MM/DD/YYYY", true).isValid())
    for(i=0; i<transList.length;i++){
        tempDate=transList[i]['date']['MM']+'-'+transList[i]['date']['DD']+'-'+transList[i]['date']['YYYY'];
        tempDate= new Date(tempDate)
        if (tempDate>=startDate && tempDate<=endDate){
            allDates.push({"id":transList[i]['_id'].toString(),"date": tempDate})
        }
    }
    allDates.sort((a,b) => a.date- b.date)
    finalList=[]
    for(i=0; i<allDates.length;i++){
        finalList.push({"id":allDates[i]['id'],"Date":allDates[i]['date'].getMonth()+1+'-'+allDates[i]['date'].getDate()+'-'+allDates[i]['date'].getFullYear()});
    }
    return finalList;
}

async function updateTag(transID, newComment){
    if(!transID || isString(transID) || !newComment) throw 'Please input Valid and non empty Trans Ids and New Comment!';
    
    let objId = ObjectId(transID);
    const transCollection = await transactions();
    const found= await transCollection.findOne({_id:objId});
    if(!found) throw "trans not found";
    let updatedInfo = await transCollection.updateOne({_id: objId},{$set:{tag:newComment}});
    if(updatedInfo.modifiedCount === 0) throw "could not update transaction";

    return getTransById(transID);
}

//return userId in string
async function getTransById(transID){
    if(!transID || isString(transID)) throw 'Please input non-empty Transaction ID';
    //if(arguments.length != 1) throw 'accounts.getUserId(accountId) Please only input accountId'
    let objId = ObjectId(transID);
    const transCollection = await transactions();
    const transact = await transCollection.findOne({_id:objId});
    if(!transact) throw "trans not found";
    
    return transact;
}


async function updateBalance(accountId, amount, toAccountId, paytype){
    if(!accountId || isString(accountId) || !toAccountId || isString(toAccountId) || !amount || typeof(amount)!=="number") throw 'Please input Valid and non empty Account Ids and balance!';
    if (amount<0) throw "Balance should be positive Value";

    if(paytype==="DEPOSITE"){
        const accCollect= await accountsCollections();
        if (accountId===toAccountId){
            throw 'same account should not transfer funds!!!';
        }
        let objId = ObjectId(accountId);
        let toactId = ObjectId(toAccountId);
        
        const foundFrom= await accCollect.findOne({_id:objId});
        if(!foundFrom) throw "account not found";
        if(foundFrom['balance']<amount) throw 'Minimum balance requirement(Cant deduct amount)!!!';
        foundFrom['balance']-=amount;

        const foundTo= await accCollect.findOne({_id:toactId});
        if(!foundTo) throw "account not found";
        foundTo['balance']+=amount;


        let updatedFrom = await accCollect.updateOne({_id: objId},{$set:{balance:foundFrom['balance']}});
        if(updatedFrom.modifiedCount === 0) throw "could not update transaction";
        

        let updatedTo = await accCollect.updateOne({_id: toactId},{$set:{balance:foundTo['balance']}});
        if(updatedTo.modifiedCount === 0) throw "could not update transaction";
        //console.log("Updated in fo is====================",updatedTo);
        createTrans(accountId,toAccountId,amount);        
        return await accounts.getAccount(accountId);
    }else{
        let objId = ObjectId(accountId);   
        const accCollect= await accountsCollections();     
        const foundFrom= await accCollect.findOne({_id:objId});
        if(!foundFrom) throw "account not found";
        if(foundFrom['balance']<amount) throw 'Minimum balance requirement(Cant deduct amount)!!!';
        foundFrom['balance']-=amount;
        
        let updatedFrom = await accCollect.updateOne({_id: objId},{$set:{balance:foundFrom['balance']}});
        if(updatedFrom.modifiedCount === 0) throw "could not update transaction";

        console.log("Withdrawl");
        createTrans(accountId,accountId,amount);
        return await accounts.getAccount(accountId);
    }
}

module.exports = {
    createTrans,
    getAlltrans,
    getTransById,
    getFilterTrans,
    updateTag,
    updateBalance
}

