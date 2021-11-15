const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
// ----------TYPE CHECKING----------
function isString(str, varName) {
    if (!str) throw `${varName} must be provided`
    if (typeof str != 'string') throw `${varName} must be a string`
    if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`
};
function isAdult(num) {
    if (!num && num != 0) throw `${varName} must be provided`
    if (typeof num != 'number') throw `${varName} must be a number`
    // if (num < MIN_ADULT_AGE || num > MAX_ADULT_AGE) throw  `${varName} must be a number between ${MIN_ADULT_AGE} and ${MAX_ADULT_AGE}`
}
// ----------ERROR HANDLING----------
function isEmail(bank, email) {
    if (email.toLowerCase().trim() != email.toLowerCase().trim().replace(/\s+/g, '')) throw `Email cannot have extra spaces in between`;
    if (email.trim().split("@")[1].toLowerCase() != `${bank.toLowerCase().replace(/\s/g,'')}.com`) throw `Email domain is not the same as the bank provider`;
   
    if (/([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(email.trim()) == false) throw `You must provide a valid email address
    • Starts with an alphanumeric character
    • Can contain underscores (_), dashes (-), or periods (.)
    • Username ends with an alphanumeric character
    • Domain name follows after at symbol (@)
    • Domain name is any alphanermic character(s) followed by .com`
}
// ----------EXPORT FUNCTIONS----------
async function createUser(firstName, lastName, bank, email, password, age) {
    isString(firstName, 'First name');
    isString(lastName, 'Last name');
    isString(bank, 'Bank provider');
    isString(email, 'Email');
    isString(password, 'Password');
    
    isAdult(age);

    isEmail(bank, email, 'Email');

    // create user
    const userCollection = await users();
    
    let newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bank: bank.trim(),
        email: email.trim(),
        password: password.trim(),
        age: age,
        accounts: []
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw `Could not create user`

    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);
    user._id = user._id.toString();

    let userUpdateInfo = {
        userId: user._id
    };
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(user._id)},
        { $set: userUpdateInfo}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Failed to update user`;

    return user;
};
async function getAllUsers() {
    // get all users
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    
    if(!userList) throw `No users in the system`
    for (let i of userList) {
        i._id = i._id.toString(); 
    }
    return userList;
};
async function getUserById(userId) {
    isString(userId, 'User ID');
    let parsedId;
    try {
        parsedId = ObjectId(userId.trim()); 
    } catch(e) {
        throw e.message
    };

    // get user 
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: parsedId}); 
    
    if (!user) throw `No user with the id of ${userId}`;
    user._id = user._id.toString(); 
    return user;
};
async function removeUser(userId) {
    isString(userId, 'User ID');
    let parsedId;
    try {
        parsedId = ObjectId(userId.trim()); 
    } catch(e) {
        throw e.message
    };

    // remove user
    const userCollection = await users();
    let user = await this.getUserById(userId.trim());
    if(!user) throw `No user with the id of ${userId}`;
    const deleteUser = await userCollection.deleteOne({_id: parsedId}); 
    if(deleteUser.deletedCount === 0) throw `Could not delete user with the id of ${userId}`;
};
async function updateUser(userId, firstName, lastName, bank, email, password, age) {
    isString(firstName, 'First name');
    isString(lastName, 'Last name');
    isString(bank, 'Bank provider');
    isString(email, 'Email');
    isString(password, 'Password');
    
    isAdult(age);

    isEmail(bank, email, 'Email');

    isString(userId, 'User ID');
    let parsedId;
    try {
        parsedId = ObjectId(userId.trim()); 
    } catch(e) {
        throw e.message
    };

    let oldUser = await this.getUserById(userId.trim());
    if (!oldUser) throw `There is no user it the id of ${userId}`;

    let userUpdateInfo = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bank: bank.trim(),
        email: email.trim(),
        password: password.trim(),
        age: age,
        accounts: oldUser.accounts
    };

    // check at least one input is different
    if ((userUpdateInfo.firstName === oldUser.firstName) &&
        (userUpdateInfo.lastName === oldUser.lastName) && 
        (userUpdateInfo.bank === oldUser.bank) &&
        (userUpdateInfo.email === oldUser.email) &&
        (userUpdateInfo.password === oldUser.password) &&
        (userUpdateInfo.age === oldUser.age)) throw `At least one user data input must be different from the original data`;
    
    // update user
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: parsedId},
        { $set: userUpdateInfo}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw `Failed to update user`;

    return await this.getUserById(userId.trim()); 

}
// ----------EXPORT----------
module.exports = {
    /* put function names here */
    createUser,
    getAllUsers,
    getUserById,
    removeUser,
    updateUser
}