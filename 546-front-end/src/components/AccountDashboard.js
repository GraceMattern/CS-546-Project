import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";

const AccountDashboard = ({ account, setAccount }) => {
  const handleChange = (event) => {
    setAccount(event.target.value);
  };
  return (
    <div className="account-dashboard-wrapper">
      <div className="account-balance">
        <p>Account Balance</p>
        <h2>$14,323.50</h2>
        <h3>For your {account} account</h3>
      </div>
      <div className="select-account">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Account:
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            classes="select-account"
            id="demo-simple-select-standard"
            value={account}
            onChange={handleChange}
            label="Choose Account"
          >
            {/* <MenuItem value="">
              <em>None</em>
            </MenuItem> */}
            <MenuItem value={"checking"}>Checking</MenuItem>
            <MenuItem value={"savings"}>Savings</MenuItem>
            {/* <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default AccountDashboard;
