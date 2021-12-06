import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";

const TransactionDashboard = ({ account }) => {
  const [filter, setFilter] = useState("");
  const [month, setMonth] = useState("");
  const [transactions, setTransactions] = useState([
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 10,
      date: { MM: 11, DD: 29, YYYY: 2021 },
      tag: ["Gas"],
    },
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 130,
      date: { MM: 10, DD: 29, YYYY: 2021 },
      tag: ["Gas"],
    },
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 4400,
      date: { MM: 5, DD: 29, YYYY: 2021 },
      tag: ["Gas"],
    },
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 540,
      date: { MM: 4, DD: 29, YYYY: 2021 },
      tag: ["Gas"],
    },
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 140,
      date: { MM: 12, DD: 29, YYYY: 2020 },
      tag: ["Gas"],
    },
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 500,
      date: { MM: 10, DD: 29, YYYY: 2021 },
      tag: ["Gas"],
    },
    {
      transactionId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
      accountId: "7b7997a2-c0d2-4f8c-6a1d4e9b7832",
      userId: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
      toAccountId: "7b7997a2-c0d2-4f8c-6a1d4e9c0234",
      transactionAmount: 990,
      date: { MM: 8, DD: 19, YYYY: 2021 },
      tag: ["Gas"],
    },
  ]);
  // const filterLowToHigh = () => {
  // let lowestToHighest = transactions.sort(
  //   (a, b) =>
  //     parseFloat(b.transactionAmount) - parseFloat(a.transactionAmount)
  // );

  // setTransactions(lowestToHighest);
  // };
  // const deleteTransaction = () => {
  //   setTransactions(transactions.filter(state) => state. !)
  // }
  useEffect(() => {
    if (filter === "hl") {
      let transactionsCloned = transactions.map((a) => {
        return { ...a };
      });
      let lowestToHighest = transactionsCloned.sort(
        (a, b) =>
          parseFloat(b.transactionAmount) - parseFloat(a.transactionAmount)
      );
      setTransactions(lowestToHighest);
    }
    if (filter === "lh") {
      let transactionsCloned = transactions.map((a) => {
        return { ...a };
      });
      let lowestToHighest = transactionsCloned.sort(
        (a, b) =>
          parseFloat(b.transactionAmount) - parseFloat(a.transactionAmount)
      );
      setTransactions(lowestToHighest.reverse());
    }
    // if (filter === "month") {
    //   let transactionsCloned = transactions.map((a) => {
    //     return { ...a };
    //   });
    //   var newArray = transactionsCloned.filter(function (transaction) {
    //     return transaction.MM === month;
    //   });
    //   setTransactions(newArray);
    // }
  }, [filter]);

  // useEffect(() => {
  // let transactionsCloned2 = transactions.map((a) => {
  //   return { ...a };
  // });
  // var newArray2 = transactionsCloned2.filter(function (transaction) {
  //   return transaction.MM === month;
  // });
  // setTransactions(newArray2);
  // }, [month]);

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };
  const handleMonth = (event) => {
    setMonth(event.target.value);
    // let transactionsCloned2 = transactions.map((a) => {
    //   return { ...a };
    // });
    // var newArray2 = transactionsCloned2.filter(function (transaction) {
    //   return transaction.MM == month;
    // });
    // setTransactions(newArray2);
  };
  return (
    <div className="transaction-dashboard">
      <div className="headers-transaction">
        <h1>Recent {account} transactions</h1>
        <div className="add-transaction">
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </div>
      </div>{" "}
      <div className="filter-transaction">
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            // minWidth: 180,
            minWidth: "190px",
            marginLeft: "71px",
            // display: "flex",
            flexDirection: "column",
            // paddingBottom: "10px",
          }}
        >
          <InputLabel id="demo-simple-select-standard-label">
            Filter transaction
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            classes="select-account"
            id="demo-simple-select-standard"
            // MenuProps={{ classes: styles.dropdownStyle }}

            value={filter}
            onChange={handleFilter}
            label="Choose Tag"
          >
            <MenuItem value={"hl"}>Highest to lowest</MenuItem>
            <MenuItem value={"lh"}>Lowest to highest</MenuItem>
            <MenuItem value={"expenses"}>Show only expenses</MenuItem>
            <MenuItem value={"income"}>Show only incomes</MenuItem>
            <MenuItem value={"month"}>Filter by month</MenuItem>
          </Select>
        </FormControl>
        {filter === "month" && (
          <FormControl
            variant="standard"
            sx={{
              m: 1,
              minWidth: "190px",
              // display: "flex",
              flexDirection: "column",
            }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Pick month to filter
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              classes="select-account"
              id="demo-simple-select-standard"
              // MenuProps={{ classes: styles.dropdownStyle }}

              value={month}
              onChange={handleMonth}
              label="Choose Tag"
            >
              {/* <MenuItem value="">
              <em>None</em>
            </MenuItem> */}
              <MenuItem value={"1"}>January</MenuItem>
              <MenuItem value={"2"}>February</MenuItem>
              <MenuItem value={"3"}>March</MenuItem>
              <MenuItem value={"4"}>April</MenuItem>
              <MenuItem value={"5"}>May</MenuItem>
              <MenuItem value={"6"}>June</MenuItem>
              <MenuItem value={"7"}>July</MenuItem>
              <MenuItem value={"8"}>August</MenuItem>
              <MenuItem value={"9"}>September</MenuItem>
              <MenuItem value={"10"}>October</MenuItem>
              <MenuItem value={"11"}>November</MenuItem>
              <MenuItem value={"12"}>December</MenuItem>

              {/* <MenuItem value={30}>Thirty</MenuItem> */}
            </Select>
          </FormControl>
        )}
      </div>
      <div className="headers">
        <h3>Date</h3>
        <h3>Amount</h3>
        <h3>Tag</h3>
        <h3>Transaction ID</h3>
      </div>
      <div className="transactions">
        {transactions.map((transaction) => {
          return (
            <div className="transaction">
              <h4>
                {transaction.date.MM}-{transaction.date.DD}-
                {transaction.date.YYYY}
              </h4>
              <h4>{transaction.transactionAmount}</h4>
              <h4>{transaction.tag[0]}</h4>
              <h4>{transaction.transactionId.substring(0, 5)}</h4>
              <div className="deleteTransaction">
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
              </div>{" "}
              <div className="editTransaction">
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
              </div>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionDashboard;
