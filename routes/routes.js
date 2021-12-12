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
        res.status(200).render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct, authenticated: true});
    }else{
        res.status(200).render('login/landing', {title: "E-banking"});
    }
});

router.get('/login', async (req,res) => {
    if(req.session.user){
        const allAcct = await userData.getUserById(req.session.user._id)
        res.status(200).render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct, authenticated: true});
    }else{
        res.status(200).render('login/login',{title:'Login'});
    }
});

router.post('/login', async (req,res) => {
    let userInfo = req.body;
    if (!userInfo) {
        res.status(400).render('login/login', {title: `Login`, warning: `You must provide a username and password`,  });
        return;
    }

    if (!userInfo.username || typeof userInfo.username != 'string' || userInfo.username.trim().length === 0) {
        res.status(400).render('login/login', {title: `Login`, warning: `You must provide a non empty username`,  });
        return;
    }

    if(userInfo.username.toLowerCase().trim() != userInfo.username.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/login', {title: `Login`, warning: `Username cannot contain spaces`,  });
        return;
    }

    // cannot check if bank is the domain since we are not creating a user 

    if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/i.test(userInfo.username.toLowerCase().trim()) == false) {
        res.status(400).render('login/login', {title: `Login`, warning: "You must provide a valid email address" });
        console.log(userInfo)
        return;
    }
   
    if (!userInfo.password || typeof userInfo.password != 'string' || userInfo.password.trim().length === 0) {
        res.status(400).render('login/login', {title: `Login`, warning: `You must provide a non empty password`,  });
        return;
    }

    if(userInfo.password.toLowerCase().trim() != userInfo.password.toLowerCase().trim().replace(/\s+/g, '')) {
        res.status(400).render('login/login', {title: `Login`, warning: `Password cannot contain spaces`,  });
        return;
    }

    let strippedPassword = userInfo.password.toLowerCase().trim().replace(/\s+/g, '');
    if (strippedPassword.length < 6) {
        res.status(400).render('login/login', {title: `Login`, warning: `Password must be at least six characters`,  });
        return;
    }

    // check user
    const userCollection = await users();
    try {
        const valid = await userData.checkUser(xss(req.body.username.toLowerCase()).toLowerCase(), xss(req.body.password));
        let newUser = await userCollection.findOne({username: xss(req.body.username.toLowerCase().toLowerCase())});
        req.session.user = newUser;
        res.redirect('/profile');
    } catch (e) {
        res.status(400).render('login/login',{title:`Login`, warning:`Either the username and/or password is invalid`,  });
    }
});

router.get('/signup', async (req,res) =>{
    if(req.session.user)
        res.redirect('/profile');
    else
        res.status(200).render('login/signup',{title:'Sign up', user:req.session.user});
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

    if ((!userInfo.age && parseInt(userInfo.age) != 0) || typeof parseInt(userInfo.age) != 'number') {
        res.status(400).render('login/signup', {title: `Sign up`, warning: `You must enter a number`});
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
    if(/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/i.test(userInfo.email.toLowerCase().trim()) == false) {
        res.status(400).render('login/signup', {title: `Sign up`, warning: "You must provide a valid email address "});
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
            res.redirect('/login');
        } catch (e) {
            res.status(400).render('login/signup',{title:'Sign up', warning:`The username is unavailable`});
        }
    } catch (e) {
        res.status(500).render('login/error',{title:'Error', error:`Internal server error`});
    }
});

router.get('/profile', async (req,res) => { 
    if(req.session.user){
        const allAcct = await userData.getUserById(req.session.user._id)
        res.status(200).render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct, authenticated: true });
    }else{
        res.redirect('/');
    }
});

router.post('/profile', async (req, res) => {
    if (req.session.user) {
        let accountInfo = req.body; // schema {accountType: "savings"}
        if(!accountInfo) {
            res.status(400).render('login/accounts', {title: `Create an Account`, warning: `You must select an account type`, authenticated: true, user:req.session.user});
            return;
        }
        if(!accountInfo.accountType || typeof accountInfo.accountType != 'string'){
            res.status(400).render('login/accounts', {title: `Create an Account`, warning: `You must select an account type`, authenticated: true,user:req.session.user});
            return;
        }

        // add account to user
        try {
            const newAccount = await accountData.createAccount(req.session.user._id, xss(req.body.accountType));
            const allAcct = await userData.getUserById(req.session.user._id)
            res.status(200).render('login/profile', {title:'User Profile', user: req.session.user, accts: allAcct, authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error: `Could not add account`, authenticated: true, user:req.session.user});
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login'});
    }
})

router.get('/logout', async (req,res) => {
    req.session.destroy();
    res.status(200).render('login/logout', {title:'Logout'});
});

router.get('/accounts', async (req, res) => {
    if(req.session.user){
        try {
            res.status(200).render('login/accounts', {title:`Create an Account`, authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load', authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login'});
    }
})

router.get('/delete/accounts/:acctId', async (req, res) => {
    if(req.session.user){
        let isAuth = false;
        let myUser = await userData.getUserById(req.session.user._id);
        for (let i =0; i< myUser.accounts.length; i++) {
            if(myUser.accounts[i] == req.params.acctId) {
                isAuth = true;
            }
        }
        if (!isAuth) {
                res.status(400).render('login/error', {title: `User  Profile`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
                return;
        }
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }
        
        try {
            const deleteAcct = await accountData.removeAccount(req.params.acctId)
            const user = await userData.getUserById(req.session.user._id)
            res.status(200).render('login/profile', {title:`User Profile`, user: user, accts: user, authenticated: true})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`, authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/user/:id', async (req,res) => { 
    if (req.session.user) {
        if(req.params.id != req.session.user._id) {
            res.status(400).render('login/error', {title: `Edit Profile`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
            return;
        }
        if(!req.params.id) {
            res.status(400).render('login/error', {title: `Edit Profile`, error: `You must supply an id to get user by Id`, authenticated: true, user:req.session.user});
            return;
        }
        // getUserById
        try {
            let user = await userData.getUserById(req.params.id); // so you cant enter other peoples ids
            res.status(200).render(`login/user`, {title: 'Edit Profile', userId: req.params.id, authenticated: true, user:req.session.user});
        } catch (e) {
            res.status(404).render('login/error', {title: 'Edit Profile', error:`No user with that id`, authenticated: true, user:req.session.user})
        }  
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/edit/user/:id', async (req, res) => { 
    if (req.session.user) {
        if(req.params.id != req.session.user._id) {
            res.status(400).render('login/error', {title: `Edit Profile`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
            return;
        }
        let userInfo = req.body;
        if (!userInfo) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must fill out the entire form`, authenticated: true, user:req.session.user});
            return;
        }

        if (!userInfo.firstName || typeof userInfo.firstName != 'string' || userInfo.firstName.trim().length === 0) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must provide a first name`, authenticated: true, user:req.session.user});
            return;
        }

        if (!userInfo.lastName || typeof userInfo.lastName != 'string' || userInfo.lastName.trim().length === 0) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must provide a last name`, authenticated: true, user:req.session.user});
            return;
        }

        if (!userInfo.bank || typeof userInfo.bank != 'string' || userInfo.bank.trim().length === 0) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must provide a bank`, authenticated: true, user:req.session.user});
            return;
        }

        if (!userInfo.email || typeof userInfo.email != 'string' || userInfo.email.trim().length === 0) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must provide an email`, authenticated: true, user:req.session.user});
            return;
        }

        if (!userInfo.password || typeof userInfo.password != 'string' || userInfo.password.trim().length === 0) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must provide a password`, authenticated: true, user:req.session.user});
            return;
        }

        if ((!userInfo.age && parseInt(userInfo.age) != 0) || typeof parseInt(userInfo.age) != 'number') {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `You must enter a number`, authenticated: true, user:req.session.user});
            return;
        }
        if(!req.params.id) {
            res.status(400).render('login/error', {title: `Error`, error: `You must supply an id to get user by Id`, authenticated: true, user:req.session.user});
            return;
        }
        
        // format checking
        if (userInfo.email.toLowerCase().trim() != userInfo.email.toLowerCase().trim().replace(/\s+/g, '')) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `Email cannot have spaces`, authenticated: true, user:req.session.user});
            return;
        }
        if (userInfo.email.trim().split("@")[1].toLowerCase() != `${userInfo.bank.trim().toLowerCase().replace(/\s/g,'')}.com`) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `Email domain is not the same as the bank provider followed by .com`, authenticated: true, user:req.session.user});
            return;
        }
        if(/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/i.test(userInfo.email.toLowerCase().trim()) == false) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: "You must provide a valid email address" , authenticated: true, user:req.session.user});
            return;
        }

        if(userInfo.password.toLowerCase().trim() != userInfo.password.toLowerCase().trim().replace(/\s+/g, '')) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `Password cannot contain spaces`, authenticated: true, user:req.session.user});
            return;
        }

        let strippedPassword = userInfo.password.toLowerCase().trim().replace(/\s+/g, '');
        if (strippedPassword.length < 6) {
            res.status(400).render('login/user', {title: `Edit Profile`, warning: `Password must be at least six characters`, authenticated: true, user:req.session.user});
            return;
        }

        const oldUser = await userData.getUserById(req.session.user._id)
        if ((oldUser.firstName == userInfo.firstName) &&
            (oldUser.lastName == userInfo.lastName) &&
            (oldUser.bank == userInfo.bank) &&
            (oldUser.email == userInfo.password) &&
            (oldUser.password == userInfo.password) &&
            (oldUser.age == userInfo.age)) {
                res.status(400).render('login/user', {title: `Edit Profile`, warning: `At least one field must be different then the orginial data`, authenticated: true, user:req.session.user});
                return;

        }
        
        // update user
        try {
            const updateUser = await userData.updateUser(
                req.session.user._id,
                xss(req.body.firstName).toLowerCase().trim(), 
                xss(req.body.lastName).toLowerCase().trim(), 
                xss(req.body.bank).toLowerCase().trim(),
                xss(req.body.email).toLowerCase().trim(),
                xss(req.body.password).trim(),
                parseInt(xss(req.body.age)));
            const allAcct = await userData.getUserById(req.session.user._id)
            res.status(200).render('login/profile', {title: 'User Profile', user: updateUser, accts: allAcct, authenticated: true})
        } catch (e) {
            res.status(404).render('login/error', {title: 'Edit Profile', error:`${e}`, authenticated: true, user:req.session.user})
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
}) 

router.get('/dashboard/:id', async (req, res) => {
    if(req.session.user){
        let isAuth = false;
        let myUser = await userData.getUserById(req.session.user._id);
        for (let i =0; i< myUser.accounts.length; i++) {
            if(myUser.accounts[i] == req.params.id) {
                isAuth = true;
            }
        }
        if (!isAuth) {
                res.status(400).render('login/error', {title: `Dashboard`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
                return;
        }
        if(!req.params.id) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.id != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.id.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }

        try {
            const account = await accountData.getAccount(req.params.id);
            const allTrans = await transData.getDetails(account.transactions)
            const user = await userData.getUserById(account.userId.toString())
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans, user: user, authenticated: true})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`, authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/dashboard/:acctId', async (req, res) => {
    if (req.session.user) {
        let isAuth = false;
        let myUser = await userData.getUserById(req.session.user._id);
        for (let i =0; i< myUser.accounts.length; i++) {
            if(myUser.accounts[i] == req.params.acctId) {
                isAuth = true;
            }
        }
        if (!isAuth) {
                res.status(400).render('login/error', {title: `User  Profile`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
                return;
        }
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }
        
        let info = req.body; // schema {deposit or transaction: amount, tag: "food"}
        if (req.body.deposit) {
            if(!info) {
                res.status(400).render('login/deposit', {title: `Make a deposit`, warning: `You must fill out all fields`, authenticated: true, user:req.session.user});
                return;
            }
            if(!info.deposit || parseFloat(info.deposit) < 0.01){
                res.status(400).render('login/deposit', {title: `Make a deposit`, warning: `You must enter the amount of money to deposit`, authenticated: true, user:req.session.user});
                return;
            }
            if(!info.tag || typeof info.tag != 'string'){
                res.status(400).render('login/deposit', {title: `Make a deposit`, warning: `You must select a tag`, authenticated: true, user:req.session.user});
                return;
            }
        
            // add deposit
            try {
                const newDeposit = await transData.createTrans(req.session.user._id, req.params.acctId,"internal_deposit",xss(req.body.deposit), xss(req.body.tag));
                const myAcct = await accountData.getAccount(req.params.acctId);
                const allTrans = await transData.getDetails(myAcct.transactions)
                const user = await userData.getUserById(myAcct.userId.toString())
                res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans, user: user, authenticated: true})
            } catch (e) {
                res.status(400).render('login/error',{title:'Error', error: `Could not add deposit`, authenticated: true, user:req.session.user});
            }
        }
        if (req.body.transaction) {
            if(!info) {
                res.status(400).render('login/transaction', {title: `Make a transaction`, warning: `You must fill out all fields`,  authenticated: true, user:req.session.user});
                return;
            }
            if(!info.transaction || parseFloat(info.transaction) < 0.01){
                res.status(400).render('login/transaction', {title: `Make a transaction`, warning: `You must enter the amount of money to transact`,  authenticated: true, user:req.session.user});
                return;
            }
            if(!info.tag || typeof info.tag != 'string'){
                res.status(400).render('login/transaction', {title: `Make a transaction`, warning: `You must select a tag`,  authenticated: true, user:req.session.user});
                return;
            }
        
            // add transaction
            try {
                const newTrans = await transData.createTrans(req.session.user._id, req.params.acctId,"external_transaction",xss(req.body.transaction), xss(req.body.tag));
                const myAcct = await accountData.getAccount(req.params.acctId);
                const allTrans = await transData.getDetails(myAcct.transactions)
                const user = await userData.getUserById(myAcct.userId.toString())
                res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans, user: user, authenticated: true})
            } catch (e) {
                res.status(400).render('login/error',{title:'Error', error: `${e}`,  authenticated: true, user:req.session.user});
            }
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login'});
    }
})

router.get('/deposit/:acctId', async (req, res) => {
    if(req.session.user){
        let isAuth = false;
        let myUser = await userData.getUserById(req.session.user._id);
        for (let i =0; i< myUser.accounts.length; i++) {
            if(myUser.accounts[i] == req.params.acctId) {
                isAuth = true;
            }
        }
        if (!isAuth) {
                res.status(400).render('login/error', {title: `Make a deposit`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
                return;
        }
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id',  authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',  authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',  authenticated: true, user:req.session.user});
            return;
        }

        try {
            res.status(200).render('login/deposit', {title:`Make a deposit`, accountId: req.params.acctId, authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load', authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/transaction/:acctId', async (req, res) => {
    if(req.session.user){
        let isAuth = false;
        let myUser = await userData.getUserById(req.session.user._id);
        for (let i =0; i< myUser.accounts.length; i++) {
            if(myUser.accounts[i] == req.params.acctId) {
                isAuth = true;
            }
        }
        if (!isAuth) {
                res.status(400).render('login/error', {title: `Make a transaction`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
                return;
        }
        if(!req.params.acctId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id',  authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.acctId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string',  authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.acctId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string',  authenticated: true, user:req.session.user});
            return;
        }

        try {
            res.status(200).render('login/transaction', {title:`Make a transaction`, accountId: req.params.acctId, authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',  authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/transaction/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',  authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id must be a string',  authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id cannot be an empty string',  authenticated: true, user:req.session.user});
            return;
        }

        let details = await transData.getDetails([req.params.transId])
        if (!details) {
            res.status(400).render('login/error', {title: 'Error', error: 'could not find any transaction with that id', authenticated: true, user: req.session.user});
            return;
        }
        if (req.session.user._id != details[0]['userId']) {
            res.status(400).render('login/error', {title: 'Edit a transaction', error: `you are not authorized`, authenticated: true, user: req.session.user});
            return;
        }

        try {
            res.status(200).render('login/edit', {title:`Edit a transaction`, type: "transaction", transId: req.params.transId, acctId: req.params.acctId,  authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',  authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/deposit/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id',  authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id must be a string',  authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Transaction id cannot be an empty string',  authenticated: true, user:req.session.user});
            return;
        }

        let details = await transData.getDetails([req.params.transId])
        if (!details) {
            res.status(400).render('login/error', {title: 'Error', error: 'could not find any transaction with that id', authenticated: true, user: req.session.user});
            return;
        }
        if (req.session.user._id != details[0]['userId']) {
            res.status(400).render('login/error', {title: 'Edit a transaction', error: `you are not authorized`, authenticated: true, user: req.session.user});
            return;
        }

        try {
            res.status(200).render('login/edit', {title:`Edit a deposit`, type:"deposit", transId: req.params.transId,  authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:'Could not load',  authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/edit/:transId', async (req, res) => {
    if(req.session.user) {
        res.status(200).render('login/error', {title: `We do not need a GET route for /edit/:transId`, authenticated: true, user: user.session.user})
        return
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login'});
        return
    }
})

router.post('/edit/:transId', async (req, res) => {
    if (req.session.user) {
        if (!req.params.transId)  {
            res.status(400).render('login/error', {title: "Error", warning:"Please supply transaction id", authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }

        let details = await transData.getDetails([req.params.transId])
        if (!details) {
            res.status(400).render('login/error', {title: 'Error', error: 'could not find any transaction with that id', authenticated: true, user: req.session.user});
            return;
        }
        if (req.session.user._id != details[0]['userId']) {
            res.status(400).render('login/error', {title: 'Edit a transaction', error: `you are not authorized`, authenticated: true, user: req.session.user});
            return;
        }

        let info = req.body;
        if (req.body.deposit) {
            if(!info) {
                res.status(400).render('login/edit', {title: `Edit a deposit`, warning: `You must fill out all fields`, type:"deposit", authenticated: true, user:req.session.user});
                return;
            }
            if(!info.deposit || parseFloat(info.deposit) < 0.01){
                res.status(400).render('login/edit', {title: `Make a deposit`, warning: `You must enter the amount of money to deposit`, type:"deposit", authenticated: true, user:req.session.user});
                return;
            }
            if(!info.tag){
                res.status(400).render('login/edit', {title: `Make a deposit`, warning: `You must select a tag`, type:"deposit", authenticated: true, user:req.session.user});
                return;
            }
            if(!info.date){
                res.status(400).render('login/edit', {title: `Make a deposit`, warning: `You must select a date`, type:"deposit", authenticated: true, user:req.session.user});
                return;
            }
        
            // edit deposit
            try {
                const editDeposit = await transData.update(req.params.transId,"internal_deposit",parseFloat(xss(req.body.deposit)).toFixed(2), xss(req.body.tag), xss(req.body.date));
                const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
                const myAcct = await accountData.getAccount(accountId.toString());
                const allTrans = await transData.getDetails(myAcct.transactions)
                const user = await userData.getUserById(myAcct.userId.toString())
                res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans, user: user, authenticated: true})
            } catch (e) {
                res.status(400).render('login/error',{title:'Error', error: `Could not edit deposit`, authenticated: true, user:req.session.user});
            }
        }
        if (req.body.transaction) {
            if(!info) {
                res.status(400).render('login/edit', {title: `Edit a transaction`, warning: `You must fill out all fields`, type:"transaction", authenticated: true, user:req.session.user});
                return;
            }
            if(!info.transaction || parseFloat(info.transaction) < 0.01){
                res.status(400).render('login/edit', {title: `Make a transaction`, warning: `You must enter the amount of money to transact`, type:"transaction", authenticated: true, user:req.session.user});
                return;
            }
            if(!info.tag){
                res.status(400).render('login/edit', {title: `Make a transaction`, warning: `You must select a tag`, type:"transaction", authenticated: true, user:req.session.user});
                return;
            }
            if(!info.date){
                res.status(400).render('login/edit', {title: `Make a transaction`, warning: `You must select a date`, type:"transaction", authenticated: true, user:req.session.user});
                return;
            }
        
            // edit transaction
            try {
                const editDeposit = await transData.update(req.params.transId,"external_transaction",parseFloat(xss(req.body.transaction)).toFixed(2), xss(req.body.tag), xss(req.body.date));
                const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
                const myAcct = await accountData.getAccount(accountId.toString());
                const allTrans = await transData.getDetails(myAcct.transactions)
                const user = await userData.getUserById(myAcct.userId.toString())
                res.status(200).render('login/dashboard', {title:'Dashboard', account: myAcct, trans: allTrans, user: user, authenticated: true})
            } catch (e) {
                res.status(400).render('login/error',{title:'Error', error: `Could not edit transaction`, authenticated: true, user:req.session.user});
            }
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login'});
    }
}) 

router.get('/delete/deposit/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }

        let details = await transData.getDetails([req.params.transId])
        if (!details) {
            res.status(400).render('login/error', {title: 'Error', error: 'could not find any transaction with that id', authenticated: true, user: req.session.user});
            return;
        }
        if (req.session.user._id != details[0]['userId']) {
            res.status(400).render('login/error', {title: 'Edit a transaction', error: `you are not authorized`, authenticated: true, user: req.session.user});
            return;
        }

        try {
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const deleteTrans = await transData.deleteTrans(req.params.transId.toString(), type="deposit")
            const account = await accountData.getAccount(accountId.toString())
            const allTrans = await transData.getDetails(deleteTrans)
            const user = await userData.getUserById(account.userId.toString())
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans, user: user, authenticated: true})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`, authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

// Delete Transaction
router.get('/delete/transaction/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }

        let details = await transData.getDetails([req.params.transId])
        if (!details) {
            res.status(400).render('login/error', {title: 'Error', error: 'could not find any transaction with that id', authenticated: true, user: req.session.user});
            return;
        }
        if (req.session.user._id != details[0]['userId']) {
            res.status(400).render('login/error', {title: 'Edit a transaction', error: `you are not authorized`, authenticated: true, user: req.session.user});
            return;
        }

        try {
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const deleteTrans = await transData.deleteTrans(req.params.transId.toString(), type="transaction")
            const account = await accountData.getAccount(accountId.toString())
            const allTrans = await transData.getDetails(deleteTrans)
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans,authenticated: true, user:req.session.user})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`, authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
});

router.get('/edit/transaction/:transId', async (req, res) => {
    if(req.session.user){
        if(!req.params.transId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply transaction id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.transId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'transaction id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.transId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'transaction id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }

        let details = await transData.getDetails([req.params.transId])
        if (!details) {
            res.status(400).render('login/error', {title: 'Error', error: 'could not find any transaction with that id', authenticated: true, user: req.session.user});
            return;
        }
        if (req.session.user._id != details[0]['userId']) {
            res.status(400).render('login/error', {title: 'Edit a transaction', error: `you are not authorized`, authenticated: true, user: req.session.user});
            return;
        }

        try {
            const accountId = await accountData.getAccountByTransId(req.params.transId.toString())
            const deleteTrans = await transData.deleteTrans(req.params.transId.toString(), type="transaction") // TESTING RN
            const account = await accountData.getAccount(accountId.toString())
            const allTrans = await transData.getDetails(deleteTrans)
            const user = await userData.getUserById(account.userId.toString())
            res.status(200).render('login/dashboard', {title:`Dashboard`, account: account, trans: allTrans, user: user, authenticated: true})
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`, authenticated: true, user:req.session.user});
        }
    }else{
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/transfer', async (req, res) => {
    if(req.session.user){
        try {
            const user = await userData.getUserById(req.session.user._id);
            res.status(200).render('login/transfer',{title:'Transfer', accts: user.accounts, authenticated: true, user:req.session.user});
        } catch (e) {
            res.status(400).render('login/transfer',{title:'Transfer', warning:'Could not load', authenticated: true, user:req.session.user});
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.post('/transfer', async (req, res) => {
    if(req.session.user){
        let info = req.body; // schema {from: acct, amount: amount, to: acct}
        const user = await userData.getUserById(req.session.user._id);
        if(!info) {
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must fill out all fields`, authenticated: true, user:req.session.user,  accts: user.accounts});
            return;
        }
        if(!info.from){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must select which account to transfer from`, authenticated: true, user:req.session.user,  accts: user.accounts});
            return;
        }
        if(!info.amount){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must enter an amount to transfer`, authenticated: true, user:req.session.user,  accts: user.accounts});
            return;
        }
        if(!info.to){
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must select which account to recieve the transfer`, authenticated: true, user:req.session.user,  accts: user.accounts});
            return;
        }
        if(info.from == info.to){
            const user = await userData.getUserById(req.session.user._id);
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You must select a different from and to account to transfer`, authenticated: true, user:req.session.user, accts: user.accounts });
            return;
        }
        let fromAcct = await accountData.getAccount(info.from)
        let toAcct = await accountData.getAccount(info.to)
        if (fromAcct.balance < info.amount) {
            res.status(400).render('login/transfer', {title: `Transfer`, warning: `You do not have enough money to make that transaction from that account`, authenticated: true, user:req.session.user,  accts: user.accounts});
            return;
        }

        // error checking

        try {
            const transferFrom = await transData.createTrans(req.session.user._id,xss(req.body.from), "external_transaction", xss(req.body.amount), "other")
            const transferTo = await transData.createTrans(req.session.user._id, xss(req.body.to), "internal_deposit", xss(req.body.amount), "other")
            const allAcct = await userData.getUserById(req.session.user._id)
            res.status(200).render('login/profile',{title:'User Profile',user:req.session.user, accts: allAcct , authenticated: true, user:req.session.user});
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error: `Could not make transfer`, authenticated: true, user:req.session.user});
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login',});
    }
})

router.get('/transactions/:accountId', async (req, res) => { // TESTING POINT
    if (req.session.user) {
        // let isAuth = false;
        // let myUser = await userData.getUserById(req.session.user._id);
        // for (let i =0; i< myUser.accounts.length; i++) {
        //     if(myUser.accounts[i] == req.params.accountId) {
        //         isAuth = true;
        //     }
        // }
        // if (!isAuth) {
        //     res.status(400).render('login/error', {title: `Error`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
        //     return;
        // }
        if(!req.params.accountId) {
            res.status(400).render('login/error',{title:'Error', error:'Must supply account id', authenticated: true, user:req.session.user});
            return;
        }
        if (typeof req.params.accountId != "string") {
            res.status(400).render('login/error',{title:'Error', error:'Account id must be a string', authenticated: true, user:req.session.user});
            return;
        }
        if (req.params.accountId.trim().length == 0) {
            res.status(400).render('login/error',{title:'Error', error:'Account id cannot be an empty string', authenticated: true, user:req.session.user});
            return;
        }

        try {
            const account = await accountData.getAccount(req.params.accountId);
            const allTrans = await transData.getDetails(account.transactions)
            res.status(200).json(allTrans);
        } catch (e) {
            res.status(400).render('login/error',{title:'Error', error:`${e}`, authenticated: true, user:req.session.user});
        }
    } else {
        res.status(400).render('login/error',{title:'Error', error:'Please login'});
    }
})

//Filter by month, year and accountId
router.get('/transFilterByMonth/:accountId/:selectMonth/:sort', async (req, res) => {
    if(!req.params.accountId || !req.params.selectMonth || !req.params.sort){
        res.redirect('/dashboard/' + req.params.accountId);
    }
    var date = req.params.selectMonth.split('-');
    var YYYY = date[0];
    var MM = date[1];
    // let isAuth = false;
    // let myUser = await userData.getUserById(req.session.user._id);
    // for (let i =0; i< myUser.accounts.length; i++) {
    //     if(myUser.accounts[i] == req.params.accountId) {
    //         isAuth = true;
    //     }
    // }
    // if (!isAuth) {
    //         res.status(400).render('login/error', {title: `Error`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
    //         return;
    // }
    // if (req.session.user) {
    try {
        const transactions = await transData.transFilterByMonth(req.params.accountId, YYYY, MM, req.params.sort);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({message: error});
    }
    // } else {
    //     res.status(400).render('login/error',{title:'Error', error:'Please login'});
    // }
})

//Filter by tag and accountId
router.get('/transFilterByTag/:accountId/:selectTag/:sort', async (req, res) => {
    if(!req.params.accountId || !req.params.selectTag || !req.params.sort){
        res.redirect('/dashboard/' + req.params.accountId);
    }
    var accountId = req.params.accountId;
    var selectTag = req.params.selectTag;
    // let isAuth = false;
    // let myUser = await userData.getUserById(req.session.user._id);
    // for (let i =0; i< myUser.accounts.length; i++) {
    //     if(myUser.accounts[i] == req.params.accountId) {
    //         isAuth = true;
    //     }
    // }
    // if (!isAuth) {
    //         res.status(400).render('login/error', {title: `Error`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
    //         return;
    // }
    // if (req.session.user) {
    try {
        const transactions = await transData.transFilterByTag(accountId, selectTag, req.params.sort);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({message: error});
    }
    // } else {
    //     res.status(400).render('login/error',{title:'Error', error:'Please login'});
    // }
})

//Filter by type(toAccountId) and accountId
router.get('/transFilterByType/:accountId/:selectType/:sort', async (req, res) => {
    if(!req.params.accountId || !req.params.selectType || !req.params.sort){
        res.redirect('/dashboard/' + req.params.accountId);
    }
    var accountId = req.params.accountId;
    var selectType = req.params.selectType;
    // let isAuth = false;
    // let myUser = await userData.getUserById(req.session.user._id);
    // for (let i =0; i< myUser.accounts.length; i++) {
    //     if(myUser.accounts[i] == req.params.accountId) {
    //         isAuth = true;
    //     }
    // }
    // if (!isAuth) {
    //         res.status(400).render('login/error', {title: `Error`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
    //         return;
    // }
    // if(req.session.user) {
        try {
            const transactions = await transData.transFilterByType(accountId, selectType, req.params.sort);
            res.status(200).json(transactions);
        } catch (error) {
            res.status(400).json({message: error});
        }
    // } else {
    //     res.status(400).render('login/error',{title:'Error', error:'Please login'});
    // }
})

//Trend compared with last month by tag
router.get('/trendByTag/:accountId/:tag', async (req, res) => {
    if(!req.params.accountId || !req.params.tag){
        res.redirect('/dashboard/' + req.params.accountId);
    }
    var accountId = req.params.accountId;
    var tag = req.params.tag;
    var myDate = new Date();
    var YYYY = myDate.getFullYear();
    var thisMonth = myDate.getMonth() + 1; 
    // let isAuth = false;
    // let myUser = await userData.getUserById(req.session.user._id);
    // for (let i =0; i< myUser.accounts.length; i++) {
    //     if(myUser.accounts[i] == req.params.accountId) {
    //         isAuth = true;
    //     }
    // }
    // if (!isAuth) {
    //         res.status(400).render('login/error', {title: `Error`, error: `You are not authorized`, authenticated: true, user:req.session.user}); 
    //         return;
    // }
    // if (req.session.user) {
        try {
            const result = await transData.trendByTag(accountId, thisMonth, YYYY, tag);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({message: error});
        }
    // } else {
    //     res.status(400).render('login/error',{title:'Error', error:'Please login'});
    // }
})

module.exports = router;