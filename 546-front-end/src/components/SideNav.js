import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

const SideNav = () => {
  const history = useHistory();

  return (
    <div className="sidebar">
      <div className="welcome">
        <h2>Welcome, Maor</h2>
        <p>Account ID: 4334</p>
      </div>
      <div className="sidebar">
        <ul>
          <li onClick={() => history.push(`/dashboard`)}>
            {" "}
            <FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Overview
          </li>
          {/* <li onClick={() => history.push(`/stocks`)}>
            {" "}
            <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon> Stocks
          </li> */}
          <li onClick={() => history.push(`/profile`)}>
            {" "}
            <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon> Profile
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
