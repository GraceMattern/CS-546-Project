import { useHistory } from "react-router-dom";

const QuickAccessDashboard = () => {
  const history = useHistory();

  return (
    <div className="three-buttons">
      <h2>Quick Access</h2>
      <button onClick={() => history.push(`/transactions`)}>Make a payment</button>
      <button onClick={() => history.push(`/transactions`)}>Transaction history</button>
      <button onClick={() => history.push(`/profile`)}>View my profile</button>
    </div>
  );
};

export default QuickAccessDashboard;
