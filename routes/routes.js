const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const accountData = data.accounts;
const transData = data.transactions;
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const xss = require('xss')

router.get('/', async (req,res) => {
    if(req.session.user){
        const allAcct = await userData.getUserById(req.session.user._id)
        res.render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct });
    }else{
        // res.render('login/error',{title:'Error', error:'Please login',});
        res.render('login/login',{title:'Login', user:req.session.user});
    }
});

router.post('/login', async (req,res) => {
    let userInfo = req.body;
    if (!userInfo) {
        res.status(400).render('login/login', {title: `Login`, warning: `You must provide a username and password`});
        return;
    }

    if (!userInfo.username || typeof userInfo.username != 'string' || userInfo.username.trim().length === 0) {
        res.status(400).render('login/login', {title: `Login`, warning: `You must provide a non empty username`});
        return;
    }

    if(userInfo.username.toLowerCase().trim() != userInfo.username.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/login', {title: `Login`, warning: `Username cannot contain spaces`});
        return;
    }

    // cannot check if bank is the domain since we are not creating a user 

    if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(userInfo.username.trim()) == false) {
        res.status(400).render('login/login', {title: `Login`, warning: "You must provide a valid email address \n• Starts with an alphanumeric character \n• Can contain underscores (_), dashes (-), or periods (.) \n• Username ends with an alphanumeric character \n• Domain name follows after at symbol (@) \n• Domain name is any alphanermic character(s) followed by .com"});
    }
   
    if (!userInfo.password || typeof userInfo.password != 'string' || userInfo.password.trim().length === 0) {
        res.status(400).render('login/login', {title: `Login`, warning: `You must provide a non empty password`});
        return;
    }

    if(userInfo.password.toLowerCase().trim() != userInfo.password.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/login', {title: `Login`, warning: `Password cannot contain spaces`});
        return;
    }

    let strippedPassword = userInfo.password.toLowerCase().trim().replace(/\s+/g, '');
    if (strippedPassword.length < 6) {
        res.status(400).render('login/login', {title: `Login`, warning: `Password must be at least six characters`});
        return;
    }

    // check user
    const userCollection = await users();
    try {
        const valid = await userData.checkUser(xss(req.body.username).toLowerCase(), xss(req.body.password));
        let newUser = await userCollection.findOne({username: xss(req.body.username)});
        req.session.user = newUser;
        res.redirect('/profile');
    } catch (e) {
        res.status(400).render('login/login',{title:`Login`, warning:`Either the username and/or password is invalid`});
    }
});

router.get('/signup', async (req,res) =>{
    if(req.session.user)
        res.redirect('/profile');
    else
        res.render('login/signup',{title:'Sign up', user:req.session.user});
});

router.post('/signup', async (req,res)=>{
    let userInfo = req.body;
    if (!userInfo) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must fill out the entire form`});
        return;
    }

    if (!userInfo.firstName || typeof userInfo.firstName != 'string' || userInfo.firstName.trim().length === 0) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must provide a first name`});
        return;
    }

    if (!userInfo.lastName || typeof userInfo.lastName != 'string' || userInfo.lastName.trim().length === 0) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must provide a last name`});
        return;
    }

    if (!userInfo.bank || typeof userInfo.bank != 'string' || userInfo.bank.trim().length === 0) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must provide a bank provider`});
        return;
    }

    if (!userInfo.email || typeof userInfo.email != 'string' || userInfo.email.trim().length === 0) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must provide an email`});
        return;
    }

    if (!userInfo.password || typeof userInfo.password != 'string' || userInfo.password.trim().length === 0) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must provide a non empty password`});
        return;
    }

    if ((!userInfo.age && parseInt(userInfo.age) != 0) || typeof parseInt(userInfo.age) != 'number' || parseInt(userInfo.age) < 18) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must be 18 years or older`});
        return;
    }

    // format checking
    if (userInfo.email.toLowerCase().trim() != userInfo.email.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `Email cannot have spaces`});
        return;
    }
    if (userInfo.email.trim().split("@")[1].toLowerCase() != `${userInfo.bank.trim().toLowerCase().replace(/\s/g,'')}.com`) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `Email domain is not the same as the bank provider followed by .com`});
        return;
    }
    if(/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(userInfo.email.trim()) == false) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: "You must provide a valid email address \n• Starts with an alphanumeric character \n• Can contain underscores (_), dashes (-), or periods (.) \n• Username ends with an alphanumeric character \n• Domain name follows after at symbol (@) \n• Domain name is any alphanermic character(s) followed by .com"});
        return;
    }

    if(userInfo.password.toLowerCase().trim() != userInfo.password.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/signup', {title: `Sign Up`, warning: `Password cannot contain spaces`});
        return;
    }

    let strippedPassword = userInfo.password.toLowerCase().trim().replace(/\s+/g, '');
    if (strippedPassword.length < 6) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `Password must be at least six characters`});
        return;
    }

    // create user
    try {
        try {
            const newUser = await userData.createUser(
                xss(req.body.firstName).toLowerCase().trim(), 
                xss(req.body.lastName).toLowerCase().trim(), 
                xss(req.body.bank).toLowerCase().trim(),
                xss(req.body.email).toLowerCase().trim(),
                xss(req.body.password).trim(),
                xss(req.body.age));
            res.redirect('/');
        } catch (e) {
            res.status(400).render('login/signup',{title:'Sign up', warning:`Either the username and/or password is invalid`});
        }
    } catch (e) {
        res.status(500).render('login/error',{title:'Error', error:`Internal server error`});
    }
});

router.get('/profile', async (req,res) => { 
    if(req.session.user){
        const allAcct = await userData.getUserById(req.session.user._id)
        res.render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct });
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
});

router.post('/profile', async (req, res) => {
    let accountInfo = req.body; // schema {accountType: "savings"}
    if(!accountInfo) {
        res.status(400).render('login/accounts', {title: `Create an Account`, warning: `You must select an account type`});
        return;
    }
    if(!accountInfo.accountType){
        res.status(400).render('login/accounts', {title: `Create an Account`, warning: `You must select an account type`});
        return;
    }

    // TODO make sure account type is string

    // add account to user
    try {
        const newAccount = await accountData.createAccount(req.session.user._id, xss(req.body.accountType));
        const allAcct = await userData.getUserById(req.session.user._id)
        res.status(200).render('login/profile', {title:'User Profile', user: req.session.user, accts: allAcct})
    } catch (e) {
        res.render('login/error',{title:'Error', error: `Could not add account`});
    }
})

router.get('/logout', async (req,res) => {
    req.session.destroy();
    res.render('login/logout', {title:'Logout'});
});

router.get('/accounts', async (req, res) => {
    if(req.session.user){
        try {
            res.status(200).render('login/accounts', {title:`Create an Account`})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/delete/accounts/:acctId', async (req, res) => {
    if(req.session.user){
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string',});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check
        
        try {
            const deleteAcct = await accountData.removeAccount(req.params.acctId)
            const user = await userData.getUserById(req.session.user._id)
            res.status(200).render('login/profile', {title:`User Profile`, user: user, accts: user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/user/:id', async (req,res) => { 
    if(!req.params.id) {
        res.status(400).render('login/error', {title: `Edit Profile`, error: `You must supply an id to get user by Id`});
        return;
    }
    if (req.session.user) {
        if(req.params.id != req.session.user._id) {
            res.status(400).render('login/error', {title: `Edit Profile`, error: `You must supply your id`}); // TODO this prob should be implemented in every function where applicable
            return;
        }
        // getUserById
        try {
            let user = await userData.getUserById(req.params.id); // so you cant enter other peoples ids
            res.status(200).render(`login/user`, {title: 'Edit User Profile', userId: req.params.id});
        } catch (e) {
            res.status(404).render('login/error', {title: 'Edit User Profile', error:`No user with that id`})
        }  
    } else {
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/edit/user/:id', async (req, res) => { // TODO post edit user profile
    let userInfo = req.body;
    if (!userInfo) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must fill out the entire form`});
        return;
    }

    if (!userInfo.firstName || typeof userInfo.firstName != 'string' || userInfo.firstName.trim().length === 0) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must provide a first name`});
        return;
    }

    if (!userInfo.lastName || typeof userInfo.lastName != 'string' || userInfo.lastName.trim().length === 0) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must provide a last name`});
        return;
    }

    if (!userInfo.bank || typeof userInfo.bank != 'string' || userInfo.bank.trim().length === 0) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must provide a bank`});
        return;
    }

    if (!userInfo.email || typeof userInfo.email != 'string' || userInfo.email.trim().length === 0) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must provide an email`});
        return;
    }

    if (!userInfo.password || typeof userInfo.password != 'string' || userInfo.password.trim().length === 0) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must provide a password`});
        return;
    }

    if ((!userInfo.age && parseInt(userInfo.age) != 0) || typeof parseInt(userInfo.age) != 'number' || parseInt(userInfo.age) < 18) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `You must be 18 years or older`});
        return;
    }
    if(!req.params.id) {
        res.status(400).render('login/error', {title: `Error`, error: `You must supply an id to get user by Id`});
        return;
    }
    
    // format checking
    if (userInfo.email.toLowerCase().trim() != userInfo.email.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `Email cannot have spaces`});
        return;
    }
    if (userInfo.email.trim().split("@")[1].toLowerCase() != `${userInfo.bank.trim().toLowerCase().replace(/\s/g,'')}.com`) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `Email domain is not the same as the bank provider followed by .com`});
        return;
    }
    if(/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(userInfo.email.trim()) == false) {
        res.status(400).render('login/user', {title: `Edit User`, warning: "You must provide a valid email address \n• Starts with an alphanumeric character \n• Can contain underscores (_), dashes (-), or periods (.) \n• Username ends with an alphanumeric character \n• Domain name follows after at symbol (@) \n• Domain name is any alphanermic character(s) followed by .com"});
        return;
    }

    if(userInfo.password.toLowerCase().trim() != userInfo.password.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `Password cannot contain spaces`});
        return;
    }

    let strippedPassword = userInfo.password.toLowerCase().trim().replace(/\s+/g, '');
    if (strippedPassword.length < 6) {
        res.status(400).render('login/user', {title: `Edit User`, warning: `Password must be at least six characters`});
        return;
    }

    // TODO at least one data is different than old data
    

    if (req.session.user) {
        if(req.params.id != req.session.user._id) {
            res.status(400).render('login/error', {title: `Edit Profile`, error: `You must supply your id`}); // TODO this prob should be implemented in every function where applicable
            return;
        }
        // update user
        const updateUser = await userData.updateUser(
            req.session.user._id,
            xss(req.body.firstName).toLowerCase().trim(), 
            xss(req.body.lastName).toLowerCase().trim(), 
            xss(req.body.bank).toLowerCase().trim(),
            xss(req.body.email).toLowerCase().trim(),
            xss(req.body.password).trim(),
            parseFloat(req.body.age));
        const allAcct = await userData.getUserById(req.session.user._id)
        res.status(200).render('login/profile', {title: 'User Profile', user: updateUser, accts: allAcct })
    } else {
        res.render('login/error',{title:'Error', error:'Please login',});
    }
}) 

router.get('/dashboard/:id', async (req, res) => {
    if(req.session.user){
        if(!req.params.id) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id',});
            return;
        }
        if (typeof req.params.id != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',});
            return;
        }
        if (req.params.id.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            const account = await accountData.getAccount(req.params.id);
            const allTrans = await transData.getDetails(account.transactions)
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans})
            // res.status(200).render('login/dashboard', {title:`Dashboard`});
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/dashboard/:acctId', async (req, res) => {
    if(!req.params.acctId) {
        res.status(400).render('login/error',{title:'Error', error:'Must supply account id',});
        return;
    }
    if (typeof req.params.acctId != "string") {
        res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',});
        return;
    }
    if (req.params.acctId.trim().length == 0) {
        res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',});
        return;
    }

    // TODO do i need to try to mongodb objId check
    
    let info = req.body; // schema {deposit or transaction: amount, tag: "food"}
    if (req.body.deposit) {
        if(!info) {
            res.status(400).render('login/deposit', {title: `Make a deposit`, warning: `You must fill out all fields`});
            return;
        }
        if(!info.deposit){
            res.status(400).render('login/deposit', {title: `Make a deposit`, warning: `You must enter the amount of money to deposit`});
            return;
        }
        if(!info.tag){
            res.status(400).render('login/deposit', {title: `Make a deposit`, warning: `You must select a tag`});
            return;
        }
    
        // TODO check that the amount is num, >0, only up to 2 decimal places
        // TODO error check inputs
    
        // add deposit
        try {
            const newDeposit = await transData.createTrans(req.session.user._id, req.params.acctId,"internal_deposit",xss(req.body.deposit), xss(req.body.tag));
            const myAcct = await accountData.getAccount(req.params.acctId);
            const allTrans = await transData.getDetails(myAcct.transactions)
            res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans})
        } catch (e) {
            res.render('login/error',{title:'Error', error: `Could not add deposit`});
            // res.render('login/error',{title:'Error', error: `${e}`});
        }
    }
    if (req.body.transaction) {
        if(!info) {
            res.status(400).render('login/transaction', {title: `Make a transaction`, warning: `You must fill out all fields`});
            return;
        }
        if(!info.transaction){
            res.status(400).render('login/transaction', {title: `Make a transaction`, warning: `You must enter the amount of money to transact`});
            return;
        }
        if(!info.tag){
            res.status(400).render('login/transaction', {title: `Make a transaction`, warning: `You must select a tag`});
            return;
        }
    
        // TODO check that the amount is num, >0, only up to 2 decimal places
    
        // add transaction
        try {
            const newTrans = await transData.createTrans(req.session.user._id, req.params.acctId,"external_transaction",xss(req.body.transaction), xss(req.body.tag));
            const myAcct = await accountData.getAccount(req.params.acctId);
            const allTrans = await transData.getDetails(myAcct.transactions)
            res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans})
        } catch (e) {
            res.render('login/error',{title:'Error', error: `${e}`});
        }
    }
    
})

router.get('/deposit/:acctId', async (req, res) => {
    if(req.session.user){
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id',});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            res.status(200).render('login/deposit', {title:`Make a deposit`, accountId: req.params.acctId})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/transaction/:acctId', async (req, res) => {
    if(req.session.user){
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id',});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            res.status(200).render('login/transaction', {title:`Make a transaction`, accountId: req.params.acctId})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/transaction/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id must be a string',});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            res.status(200).render('login/edit', {title:`Edit a transaction`, type: "transaction", transId: req.params.transId, acctId: req.params.acctId})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/deposit/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id must be a string',});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            res.status(200).render('login/edit', {title:`Edit a deposit`, type:"deposit", transId: req.params.transId})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/edit/:transId', async (req, res) => {
    if (!req.params.transId)  {
        res.status(400).render('login/error', {title: "Error", warning:"Please supply transaction id"});
        return;
    }
    if (typeof req.params.transId != "string") {
        res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string',});
        return;
    }
    if (req.params.transId.trim().length == 0) {
        res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string',});
        return;
    }

    // TODO error checking more

    let info = req.body;
    if (req.body.deposit) {
        if(!info) {
            res.status(400).render('login/edit', {title: `Edit a deposit`, warning: `You must fill out all fields`, type:"deposit"});
            return;
        }
        if(!info.deposit){
            res.status(400).render('login/edit', {title: `Make a deposit`, warning: `You must enter the amount of money to deposit`, type:"deposit"});
            return;
        }
        if(!info.tag){
            res.status(400).render('login/edit', {title: `Make a deposit`, warning: `You must select a tag`, type:"deposit"});
            return;
        }
        if(!info.date){
            res.status(400).render('login/edit', {title: `Make a deposit`, warning: `You must select a date`, type:"deposit"});
            return;
        }
    
        // TODO error checking of inputs
    
        // edit deposit
        try {
            const editDeposit = await transData.update(req.params.transId,"internal_deposit",xss(req.body.deposit), xss(req.body.tag), xss(req.body.date));
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const myAcct = await accountData.getAccount(accountId.toString());
            const allTrans = await transData.getDetails(myAcct.transactions)
            res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans})
        } catch (e) {
            res.render('login/error',{title:'Error', error: `Could not edit deposit`});
        }
    }
    if (req.body.transaction) {
        if(!info) {
            res.status(400).render('login/edit', {title: `Edit a transaction`, warning: `You must fill out all fields`, type:"transaction"});
            return;
        }
        if(!info.transaction){
            res.status(400).render('login/edit', {title: `Make a transaction`, warning: `You must enter the amount of money to transact`, type:"transaction"});
            return;
        }
        if(!info.tag){
            res.status(400).render('login/edit', {title: `Make a transaction`, warning: `You must select a tag`, type:"transaction"});
            return;
        }
        if(!info.date){
            res.status(400).render('login/edit', {title: `Make a transaction`, warning: `You must select a date`, type:"transaction"});
            return;
        }
    
        // TODO error checking of inputs
    
        // edit transaction
        try {
            const editDeposit = await transData.update(req.params.transId,"external_transaction",xss(req.body.transaction), xss(req.body.tag), xss(req.body.date));
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const myAcct = await accountData.getAccount(accountId.toString());
            const allTrans = await transData.getDetails(myAcct.transactions)
            res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans})
        } catch (e) {
            res.render('login/error',{title:'Error', error: `Could not edit transaction`});
        }
    }
}) 

router.get('/delete/deposit/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string',});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const deleteTrans = await transData.deleteTrans(req.params.transId.toString(), type="deposit")
            const account = await accountData.getAccount(accountId.toString())
            const allTrans = await transData.getDetails(deleteTrans)
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/delete/transaction/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string',});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string',});
            return;
        }

        // TODO do i need to try to mongodb objId check

        try {
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const deleteTrans = await transData.deleteTrans(req.params.transId.toString(), type="transaction") // TESTING RN
            const account = await accountData.getAccount(accountId.toString())
            const allTrans = await transData.getDetails(deleteTrans)
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`});
        }
    }else{
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/transfer', async (req, res) => {
    if(req.session.user){
        try {
            const user = await userData.getUserById(req.session.user._id);
            res.status(200).render('login/transfer',{title:'Transfer', accts: user.accounts});
        } catch (e) {
            res.status(200).render('login/transfer',{title:'Transfer', warning:'Could not load',});
        }
    } else {
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/transfer', async (req, res) => {
    if(req.session.user){
        let info = req.body; // schema {from: acct, amount: amount, to: acct}
        if(!info) {
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must fill out all fields`});
            return;
        }
        if(!info.from){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must select which account to transfer from`});
            return;
        }
        if(!info.amount){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must enter an amount to transfer`});
            return;
        }
        if(!info.to){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must select which account to recieve the transfer`});
            return;
        }
        if(info.from == info.to){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must select a different from and to account to transfer`});
            return;
        }
        let fromAcct = await accountData.getAccount(info.from)
        let toAcct = await accountData.getAccount(info.to)
        if (fromAcct.balance < info.amount) {
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You do not have enough money to make that transaction from that account`});
            return;
        }

        // error checking

        try {
            const transferFrom = await transData.createTrans(req.session.user._id,xss(req.body.from), "external_transaction", xss(req.body.amount), "other")
            const transferTo = await transData.createTrans(req.session.user._id, xss(req.body.to), "internal_deposit", xss(req.body.amount), "other")
            const allAcct = await userData.getUserById(req.session.user._id)
            res.render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct });
        } catch (e) {
            res.render('login/error',{title:'Error', error: `Could not make transfer`});
        }
    } else {
        res.render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/transactions/:accountId', async (req, res) => {
    if(!req.params.accountId) {
        res.status(400).render('login/error',{title:'Error', error:'Must supply account id',});
        return;
    }
    if (typeof req.params.accountId != "string") {
        res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',});
        return;
    }
    if (req.params.accountId.trim().length == 0) {
        res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',});
        return;
    }

    try {
        const account = await accountData.getAccount(req.params.accountId);
        const allTrans = await transData.getDetails(account.transactions)
        res.status(200).json(allTrans);
    } catch (e) {
        res.status(400).render('login/error',{title:'Error', error:`${e}`});
    }
})

//Filter
router.get('/transFilter/:accountId/:selectMonth', async (req, res) => {
    if(!req.params.accountId || !req.params.selectMonth){
        res.redirect('/dashboard/' + req.params.accountId);
    }
    var date = req.params.selectMonth.split('-');
    var YYYY = date[0];
    var MM = date[1];
    try {
        const transactions = await transData.transFilterByMonth(req.params.accountId, YYYY, MM);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({message: error});
    }
})

module.exports = router;