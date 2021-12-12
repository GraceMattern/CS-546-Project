const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
// ----------TYPE CHECKNG----------
function isString(str, varName) {
  if (!str) throw `${varName} must be provided`;
  if (typeof str != "string") throw `${varName} must be a string`;
  if (str.trim().length == 0) throw `${varName} cannot just be empty spaces`;
}
function isAdult(num) {
  if (!num && parseFloat(num) != 0) throw `Age must be provided`;
  if (typeof parseFloat(num) != "number") throw `Age must be a number`;
  // if (parseFloat(num) < 18) throw `You must be at least 18 years old`;
}
// ----------ERROR HANDLING----------
function isEmail(bank, email) {
  if (
    email.toLowerCase().trim() != email.toLowerCase().trim().replace(/\s+/g, "")
  )
    throw `Email cannot have spaces`;
  if (
    email.trim().split("@")[1].toLowerCase() !=
    `${bank.trim().toLowerCase().replace(/\s/g, "")}.com`
  )
    throw `Email domain is not the same as the bank provider`;
  if (
    /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(
      email.trim()
    ) == false
  )
    throw "You must provide a valid email address \n• Starts with an alphanumeric character \n• Can contain underscores (_), dashes (-), or periods (.) \n• Username ends with an alphanumeric character \n• Domain name follows after at symbol (@) \n• Domain name is any alphanermic character(s) followed by .com";
}
function checkEmail(email) {
  if (
    email.toLowerCase().trim() != email.toLowerCase().trim().replace(/\s+/g, "")
  )
    throw `Email cannot have spaces`;
  if (
    /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])com/.test(
      email.trim()
    ) == false
  )
    throw "You must provide a valid email address \n• Starts with an alphanumeric character \n• Can contain underscores (_), dashes (-), or periods (.) \n• Username ends with an alphanumeric character \n• Domain name follows after at symbol (@) \n• Domain name is any alphanermic character(s) followed by .com";
}
function isPassword(str) {
  if (!str) throw `Password must be provided`;
  if (typeof str != "string") throw `Password must be a string`;
  if (str.trim().length == 0) throw `Password cannot just be empty spaces`;
  if (str.toLowerCase().trim() != str.toLowerCase().trim().replace(/\s+/g, ""))
    throw `Password cannot have spaces`;
  let strippedStr = str.toLowerCase().trim().replace(/\s+/g, "");
  if (strippedStr.length < 6) throw `Password must be at least six characters`;
}
// ----------EXPORT FUNCTION----------
module.exports = {
  async createUser(firstName, lastName, bank, email, password, age) {
    isString(firstName, "First name");
    isString(lastName, "Last name");
    isString(bank, "Bank provider");
    isString(email, "Email");
    isString(password, "Password");

    isAdult(age);

    isEmail(bank, email);
    isPassword(password);

    // check that the username i.e. the email is unique
    const userCollection = await users();
    const otherUser = await userCollection.findOne({ username: email });
    if (otherUser != null)
      throw `There is already a user with that email ${email} ${otherUser}`;

    // encrypt
    const hash = await bcrypt.hash(password, saltRounds);

    // create user
    let newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bank: bank.trim(),
      username: email.trim(),
      password: hash,
      age: age,
      accounts: [],
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw `Could not create user`;

    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);
    user._id = user._id.toString();

    return user;
    // return {userInserted: true}
  },
  async checkUser(username, password) {
    // login
    isString(username, "Username");
    isString(password, "Password");

    checkEmail(username);
    isPassword(password);

    // find user
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) throw `Either the username or password is invalid`;

    // check provided password is correct
    let compare = false;
    try {
      compare = await bcrypt.compare(password, user.password);
    } catch (e) {
      // no op
    }

    if (compare) {
      return { authenticated: true };
    } else {
      throw `Either the username or password is invalid`;
    }
  },
  async getAllUsers() {
    // get all users
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();

    if (!userList) throw `No users in the system`;
    for (let i of userList) {
      i._id = i._id.toString();
    }
    return userList;
  },
  async getUserById(userId) {
    isString(userId, "User ID");
    let parsedId;
    try {
      parsedId = ObjectId(userId.trim());
    } catch (e) {
      throw e.message;
    }

    // get user
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: parsedId });

    if (!user) throw `No user with the id of ${userId}`;
    user._id = user._id.toString();
    return user;
  },
  async removeUser(userId) {
    isString(userId, "User ID");
    let parsedId;
    try {
      parsedId = ObjectId(userId.trim());
    } catch (e) {
      throw e.message;
    }

    // remove user
    const userCollection = await users();
    let user = await this.getUserById(userId.trim());
    if (!user) throw `No user with the id of ${userId}`;
    const deleteUser = await userCollection.deleteOne({ _id: parsedId });
    if (deleteUser.deletedCount === 0)
      throw `Could not delete user with the id of ${userId}`;
  },
  async updateUser(userId, firstName, lastName, bank, email, password, age) {
    isString(firstName, "First name");
    isString(lastName, "Last name");
    isString(bank, "Bank provider");
    isString(email, "Email");
    isString(password, "Password");

    isAdult(age);

    isEmail(bank, email);

    isString(userId, "User ID");
    let parsedId;
    try {
      parsedId = ObjectId(userId.trim());
    } catch (e) {
      throw e.message;
    }

    let oldUser = await this.getUserById(userId.trim());
    if (!oldUser) throw `There is no user it the id of ${userId}`;

    // check that the new username ie the email is unique to the user collection
    const userCollection = await users();
    const otherUser = await userCollection.findOne({ username: email });
    if (otherUser != null) throw `There is already a user with that username`;

    // encrypt the password
    const hash = await bcrypt.hash(password, saltRounds);

    // update the user
    let userUpdateInfo = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bank: bank.trim(),
      username: email.trim(),
      password: hash,
      age: age,
      accounts: oldUser.accounts,
    };

    // check at least one input is different
    if (
      userUpdateInfo.firstName === oldUser.firstName &&
      userUpdateInfo.lastName === oldUser.lastName &&
      userUpdateInfo.bank === oldUser.bank &&
      userUpdateInfo.username === oldUser.username &&
      userUpdateInfo.password === oldUser.password &&
      userUpdateInfo.age === oldUser.age
    )
      throw `At least one user data input must be different from the original data`;

    // update user
    const updateInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw `Failed to update user`;

    return await this.getUserById(userId.trim());
  },
};
