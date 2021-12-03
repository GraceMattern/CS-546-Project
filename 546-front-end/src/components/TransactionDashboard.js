const TransactionDashboard = ({account}) => {
  return (
    <div className="transaction-dashboard">
        <h1>Recent {account} transactions</h1>
      <div className="headers">
        <h3>Date</h3>
        <h3>Amount</h3>
        <h3>Tag</h3>
        <h3>Transaction ID</h3>
      </div>
      <div className="transactions">
        <div className="transaction">
          <h4>09-13-2021</h4>
          <h4>+54.43</h4>
          <h4>Gas</h4>
          <h4>7b7997</h4>
        </div>
        <div className="transaction">
          <h4>09-13-2021</h4>
          <h4>+54.43</h4>
          <h4>Gas</h4>
          <h4>7b7997</h4>
        </div>
        <div className="transaction">
          <h4>09-13-2021</h4>
          <h4>+54.43</h4>
          <h4>Gas</h4>
          <h4>7b7997</h4>
        </div>
        <div className="transaction">
          <h4>09-13-2021</h4>
          <h4>+54.43</h4>
          <h4>Gas</h4>
          <h4>7b7997</h4>
        </div>
        <div className="transaction">
          <h4>09-13-2021</h4>
          <h4>+54.43</h4>
          <h4>Gas</h4>
          <h4>7b7997</h4>
        </div>
        <div className="transaction">
          <h4>09-13-2021</h4>
          <h4>+54.43</h4>
          <h4>Gas</h4>
          <h4>7b7997</h4>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
