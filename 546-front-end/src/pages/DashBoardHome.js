import React from "react";
import SideNav from "../components/SideNav";
import AccountDashboard from "../components/AccountDashboard";
import QuickAccessDashboard from "../components/QuickAccessDashboard";
import TransactionDashboard from "../components/TransactionDashboard";
import SpendingDashboard from "../components/SpendingDashboard";
const DashboardHome = () => {
  const [account, setAccount] = React.useState("checking");

  return (
    <div>
      <div className="dashboard-home">
        <SideNav />
        
      </div>
      <div className="dashboard-home1">
        <AccountDashboard account={account} setAccount={setAccount} />
      </div>
      <div className="dashboard-home2">
        <QuickAccessDashboard />
      </div>
      <div className="dashboard-bottom">
        <TransactionDashboard account={account} />
      </div>
      <div className="dashboard-bottom2">
        <SpendingDashboard account={account} />
      </div>
    </div>
  );
};

export default DashboardHome;
