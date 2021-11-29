import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
const UserWelcome = () => {
  const [userWelcomeState, setUserWelcomeState] = useState("home");
  return (
    <div className="sidebar">
      <div className="buttons-menu">
        <h1>Bank-546</h1>
        <h3>
          the <strong>only</strong> bank for your needs
        </h3>
        {userWelcomeState === "home" && (
          <div className="buttons-div">
            <button onClick={() => setUserWelcomeState("signup")}>
              Sign Up
            </button>
            <button onClick={() => setUserWelcomeState("login")}>Log In</button>
          </div>
        )}
        {userWelcomeState === "login" && (
          <form className="form-div" noValidate autoComplete="off">
            <TextField id="standard-basic" label="Username" />
            <TextField id="standard-basic" label="Password" />
            <button onClick={() => setUserWelcomeState("")}>Log In</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserWelcome;
