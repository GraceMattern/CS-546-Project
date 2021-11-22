    const express = require('express');
    const mongoCollections = require('../config/mongoCollections');
    const router = express.Router();
    const data = require('../data');
    const transData = data.transactions;

    // ----------ROUTES----------
    router.get('/', async (req,res) =>{
        
        // getAllUsers
        try {
            let userList = await transData.getAlltrans();
            res.status(200).json(userList);
        } catch (e) {
            res.status(500).json({error: 'Could not get all transactions'})
        }
    });

    router.post('/tag/:id', async(req,res)=>{
        if(!req.params.id) {
            res.status(400).json({error: `You must supply an id to get transaction by Id`});
            return;
        }
        try{
            // console.log(req.body," reci");
            const transId = req.params.id;
            const tag = req.body;
            if(!tag) {
                res.status(400).json({error: `You must provide data to Update Task`});
                return;
            }
            let trans = await transData.updateTag(transId,tag);
            res.status(200).json(trans);
        }catch(e){
            res.status(500).json({error: e});
        }
    })

    router.post('/payment/:id', async(req,res)=>{
        try{
            //console.log(req.body," reci");
            const accountId = req.params.id;
            const {amount, toAccountId, paytype} = req.body;
            if(!amount || !paytype) {
                res.status(400).json({error: `You must provide data to Update Balance`});
                return;
            }
            if (amount<=0){
                res.status(400).json({error: `You must provide valid amount for transaction`});
                return;
            }
            if(toAccountId===undefined){
                let trans = await transData.updateBalance(accountId,amount,accountId ,paytype);      
                res.status(200).json(trans);      
            }
            else{
                let trans = await transData.updateBalance(accountId,amount,toAccountId, paytype);   
                res.status(200).json(trans);
            }
            
        }catch(e){
            console.log(e);
            res.status(500).json({error: e})   
        }
    })


    router.get('/:id', async (req,res) =>{
        if(!req.params.id) {
            res.status(400).json({error: `You must supply an id to get user by Id`});
            return;
        }
        // getUserById
        try {
            let trans = await transData.getTransById(req.params.id);
            res.status(200).json(trans);
        } catch (e) {
            res.status(404).json({error:`No Transaction with that id`})
        }
    });



    module.exports = router;