import DonutLarge from "../images/donut_large.svg";
import EuroSymbol from "../images/euro_symbol.svg";
import TrendingUp from "../images/trending_up.svg";
const BankBanner = () => {
  return (
    <div className="bank-banner">
      <div className="text">
        <h1>The best bank for your needs</h1>
        <h3>Stocks, investments, we have it all!</h3>
      </div>
      <div className="images">
        <img src={EuroSymbol} alt="EuroSymbol" />
        <img src={DonutLarge} alt="DonutLarge" />
        <img src={TrendingUp} alt="EuroSymbol" />
      </div>
    </div>
  );
};

export default BankBanner;
