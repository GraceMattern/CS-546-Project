const express = require('express');
const router = express.Router();
const data = require('../data');
const accountData = data.accounts;

//***TYPE CHECKING***

//Check string and empty; Return T or F
function isString(a){
    if(typeof a != 'string') throw 'Type is not String';
    if (a.length == 0 || a.trim().length == 0) throw 'content is empty';
}

//***ROUTES***
//creatAccount
router.post('/', async (req, res) => {
    let accountInfo = req.body;
    if(!accountInfo){
        res.status(400).json({ error: 'You must provide data to create a account' });
        return;
    }
    if(!accountInfo.userId){
        res.status(400).json({ error: 'You must provide userId to create a account' });
        return;
    }
    if(!accountInfo.accountType){
        res.status(400).json({ error: 'You must provide accountType to create a account' });
        return;
    }

    try {
        isString(accountInfo.userId);
        isString(accountInfo.accountType);
        const newAccount = await accountData.createAccount(
            accountInfo.userId,
            accountInfo.accountType
        );
        res.status(200).json(newAccount);
    } catch (e) {
        res.status(400).json({error:e})
    }
})

//getAllAccounts
router.get('/', async (req,res) => {
    try {
        let accountList = await accountData.getAllAccounts();
        res.status(200).json(accountList);
    } catch (e) {
        res.status(500).json({eror: 'Could not get all accounts'})
    }
});

//getAccount
router.get('/:id', async (req,res) => {
    try {
        if(!req.params.id) {
            res.status(400).json({error: `You must supply an id to get account by Id`});
            return;
        }
        isString(req.params.id);
        const account = await accountData.getAccount(req.params.id);
        res.status(200).json(account);
    } catch (e) {
        res.status(404).json({eror: e})
    }
});

//addTransaction
router.post('/addTransaction', async (req,res) =>{
    let accountInfo = req.body;
    if(!accountInfo){
        res.status(400).json({ error: 'You must provide userId to remove a account' });
        return;
    }
    if(!accountInfo.userId){
        res.status(400).json({ error: 'You must provide userId to create a account' });
        return;
    }
    try {
        isString(accountInfo.userId);
        const result = await accountData.removeAccount(accountInfo.userId);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({error:e})
    }
});

module.exports = router;