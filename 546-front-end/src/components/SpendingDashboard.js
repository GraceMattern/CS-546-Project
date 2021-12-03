import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import React from "react";

const SpendingDashboard = () => {
  const [tag, setTag] = React.useState("");
  const handleChange = (event) => {
    setTag(event.target.value);
  };
  return (
    <div className="spendingdashboard">
      <div className="title">
        <h1>Total spending vs. tag</h1>
      </div>
      <div className="month">
        <h2>This month, you spent $244.44</h2>
        <h2>vs.</h2>
        <h2>For tag {tag === "" ? "xx" : tag}, you spent $xxxx</h2>
      </div>
      <div className="select-tag">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Pick tag to compare
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            classes="select-account"
            id="demo-simple-select-standard"
            value={tag}
            onChange={handleChange}
            label="Choose Tag"
          >
            {/* <MenuItem value="">
              <em>None</em>
            </MenuItem> */}
            <MenuItem value={"tag1"}>Tag1</MenuItem>
            <MenuItem value={"tag2"}>Tag2</MenuItem>
            {/* <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default SpendingDashboard;
