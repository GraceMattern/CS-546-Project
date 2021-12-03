import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
const UserWelcome = () => {
  const [userWelcomeState, setUserWelcomeState] = useState("home");
  return (
    <div className="sidebarlogin">
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
          <div className="form-group">
            <form className="form-div" noValidate autoComplete="off">
              <TextField id="standard-basic" label="Email" />
              <TextField id="standard-basic" label="Password" type="password" />
            </form>
            <button onClick={() => setUserWelcomeState("")}>Log In →</button>
            <button onClick={() => setUserWelcomeState("home")}>
            ← Back Home
            </button>
          </div>
        )}
        {userWelcomeState === "signup" && (
          <div className="form-group">
            <form className="form-div" noValidate autoComplete="off">
              <TextField id="standard-basic" label="First Name" />
              <TextField id="standard-basic" label="Last Name" />
              <TextField id="standard-basic" label="Email" />
              <TextField id="standard-basic" label="Password" type="password" />
              <TextField id="standard-basic" label="Age" type="number" />
            </form>
            <button onClick={() => setUserWelcomeState("")}>Sign Up →</button>
            <button onClick={() => setUserWelcomeState("home")}>
            ← Back Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWelcome;
