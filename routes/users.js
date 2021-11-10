const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
// ----------VARIABLES----------
let MIN_ADULT_AGE = 18;
let MAX_ADULT_AGE = 100
// ----------TYPE CHECKING----------
function isString(str, varName) {
    if (!str) throw `${varName} must be provided`
    if (typeof str != 'string') throw `${varName} must be a string`
    if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`
};
function isAdult(num) {
    if (!num && num != 0) throw `${varName} must be provided`
    if (typeof num != 'number') throw `${varName} must be a number`
    if (num < MIN_ADULT_AGE || num > MAX_ADULT_AGE) throw  `${varName} must be a number between ${MIN_ADULT_AGE} and ${MAX_ADULT_AGE}`
}
// ----------ERROR HANDLING----------
function isEmail(bank, email) {
    if (email.trim() != email.trim().replace(/\s+/g, '')) throw `Email cannot have extra spaces in between`;
    if (email.trim().split("@")[1].toLowerCase() != `${bank.trim().toLowerCase()}.com`) throw `Email domain is not the same as the bank provider`;
   
    if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(email.trim()) == false) throw `You must provide a valid email address
    • Starts with an alphanumeric character
    • Can contain underscores (_), dashes (-), or periods (.)
    • Username ends with an alphanumeric character
    • Domain name follows after at symbol (@)
    • Domain name is any alphanermic character(s) followed by .com`
}
// ----------ROUTES----------
router.get('/', async (req,res) =>{
    // getAllUsers
    try {
        let userList = await userData.getAllUsers();
        res.status(200).json(userList);
    } catch (e) {
        res.status(500).json({eror: 'Could not get all users'})
    }
});
router.post('/', async (req,res) =>{
    let userInfo = req.body;
    if(!userInfo) {
        res.status(400).json({error: `You must provide data to create a user`});
        return;
    }

    isString(userInfo.firstName, 'First name');
    isString(userInfo.lastName, 'Last name');
    isString(userInfo.bank, 'Bank provider');
    isString(userInfo.email, 'Email');
    isString(userInfo.password, 'Password');
    
    isAdult(userInfo.age);

    isEmail(userInfo.bank, userInfo.email, 'Email');

    // createUser
    try {
        const newUser = await userData.createUser(
            userInfo.firstName,
            userInfo.lastName,
            userInfo.bank,
            userInfo.email,
            userInfo.password,
            userInfo.age,
        );
        res.status(200).json(newUser);
    } catch (e) {
        res.status(500).json({eror: `Could not create user`});
        return;
    }
});
router.get('/:id', async (req,res) =>{
    if(!req.params.id) {
        res.status(400).json({error: `You must supply an id to get user by Id`});
        return;
    }

    // getUserById
    try {
        let user = await userData.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({error:`No user with that id`})
    }
});
router.put('/:id', async (req,res) =>{
    if(!req.params.id) {
        res.status(400).json({error: `Yu must supply an id to update a user`});
        return;
    }
    let userInfo = req.body;
    if (!userInfo) {
        res.status(400).json({error: `Yu must supply data to update a user`});
        return;
    }
    isString(userInfo.firstName, 'First name');
    isString(userInfo.lastName, 'Last name');
    isString(userInfo.bank, 'Bank provider');
    isString(userInfo.email, 'Email');
    isString(userInfo.password, 'Password');
    
    isAdult(userInfo.age);

    isEmail(userInfo.bank, userInfo.email, 'Email');

    try {
        await userData.getUserById(req.params.id.trim())
    } catch (e) {
        res.status(404).json({error: `User not found`})
    }
    const oldUser = await userData.getUserById(req.params.id.trim());
    if ((userInfo.firstName === oldUser.firstName) &&
        (userInfo.lastName === oldUser.lastName) && 
        (userInfo.bank === oldUser.bank) &&
        (userInfo.email === oldUser.email) &&
        (userInfo.password === oldUser.password) &&
        (userInfo.age === oldUser.age)) {
            res.status(400).json({error: `You must provide data that is different from the original user data`});
            return;
        }

    // updateUser
    try {
        const updatedUser = await userData.updateUser(
            req.params.id.trim(),
            userInfo.firstName.trim(),
            userInfo.lastName.trim(),
            userInfo.bank.trim(),
            userInfo.email.trim(),
            userInfo.password.trim(),
            userInfo.age,
        );
        res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json({error: `Could not update user`});
        return;
    }
});
router.delete('/:id', async (req,res) =>{
    if(!req.params.id) {
        res.status(400).json({error:`You must supply an id to delete a user`});
        return;
    }
    try {
        await userData.getUserById(req.params.id.trim());
    } catch (e) {
        res.status(404).json({error: `User not found`});
        return;
    }

    // removeUser
    try {
        await userData.removeUser(req.params.id.trim());
        res.status(200).json({ok: "deleted"});
    } catch (e) {
        res.status(500).json({error: `could not delete user`});
        return;
    }
});

module.exports = router;