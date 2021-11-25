import UserWelcome from "../components/UserWelcome";
import BankBanner from "../components/BankBanner";
import React from "react";
const HomePage = () => {
  return (
    <div className="home-page">
      <UserWelcome />
      <BankBanner />
    </div>
  );
};

export default HomePage;
