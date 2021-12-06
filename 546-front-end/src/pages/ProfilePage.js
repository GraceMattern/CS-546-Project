import SideNav from "../components/SideNav";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
const ProfilePage = () => {
  const history = useHistory();
  const [profileState, setProfileState] = useState("");

  return (
    <div>
      <div className="dashboard-home">
        <SideNav />
      </div>
      <div className="buttons-profile">
        <h1>
          Welcome to your User Profile, choose which action you would like to
          take below:
        </h1>
        <button onClick={() => setProfileState("deposit")}>
          Deposit Money
        </button>
        <button onClick={() => history.push(`/dashboard`)}>
          Edit payments
        </button>
        <button onClick={() => setProfileState("withdraw")}>
          Withdraw Money
        </button>
        <button onClick={() => setProfileState("create")}>
          Create/delete an account
        </button>
        <button onClick={() => setProfileState("edit")}>
          Edit/View my User Information
        </button>
        {profileState === "edit" && (
          <form className="form-profile" noValidate autoComplete="off">
            <TextField
              id="standard-basic"
              label="First Name"
              // inputRef="Type here"
              type="text"
            />
            <TextField
              id="standard-basic"
              label="Last Name"
              value={"Mashiach"}
            />
            <TextField
              id="standard-basic"
              label="Email"
              value={"mmashiac@stevens.edu"}
            />
            <TextField id="standard-basic" label="Age" type="number" />
          </form>
        )}
        {profileState === "create" && (
          <div className="create">
            <h1>Here are your current accounts:</h1>
            <ul>
              <div className="deleteAccount">
                <div className="each-account">
                  <li>Savings - Balance of $15,545</li>
                  <div className="deleteAccountLogo">
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </div>{" "}
                  <h3>Delete Account</h3>
                  <li>Checkings - Balance of $5,4545</li>
                  <div className="deleteAccountLogo">
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </div>{" "}
                  <h3>Delete Account</h3>
                </div>
              </div>{" "}
            </ul>
            <h1>Want to create a new account? Use the form below:</h1>
            <form className="form-create" noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Account Name"
                // inputRef="Type here"
              />
            </form>
            <button>Create new account</button>
          </div>
        )}
        {profileState === "deposit" && (
          <div className="deposit">
            <h1>Deposit Money:</h1>
            <form className="form-deposit" noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Enter Amount in USD"
                // inputRef="Type here"
              />
            </form>
            <div className="radios">
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Pick account to deposit:
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="Checking"
                    control={<Radio />}
                    label="Checking"
                  />
                  <FormControlLabel
                    value="Savings"
                    control={<Radio />}
                    label="Savings"
                  />
                  {/* <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                /> */}
                </RadioGroup>
              </FormControl>
              <button>Complete Transaction</button>
            </div>
          </div>
        )}
        {profileState === "withdraw" && (
          <div className="deposit">
            <h1>Withdraw Money:</h1>
            <form className="form-deposit" noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Enter Amount in USD"
                // inputRef="Type here"
              />
            </form>
            <div className="radios">
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  Pick account to withdraw:
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="Checking"
                    control={<Radio />}
                    label="Checking"
                  />
                  <FormControlLabel
                    value="Savings"
                    control={<Radio />}
                    label="Savings"
                  />
                  {/* <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                /> */}
                </RadioGroup>
              </FormControl>
              <button>Complete Transaction</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
