import "./styles/app.scss";
import HomePage from "./pages/HomePage";
import DashboardHome from "./pages/DashBoardHome";
import TransactionPage from "./pages/TransactionPage";
import ProfilePage from "./pages/ProfilePage";
import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import StocksPage from "./pages/StocksPage";

// import { useHistory } from "react-router-dom";

const App = () => {
  const [page, setPage] = useState("");
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <HomePage page={page} setPage={setPage} />
        </Route>
        <Route path="/dashboard" exact>
          <DashboardHome page={page} setPage={setPage}/>
        </Route>
        <Route path="/transactions" exact>
          <TransactionPage page={page} setPage={setPage} />
        </Route>
        <Route path="/stocks" exact>
          <StocksPage page={page} setPage={setPage}/>
        </Route>
        <Route path="/profile" exact>
          <ProfilePage page={page} setPage={setPage}/>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
