import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Transaction = ({ transaction, transactions, setTransactions }) => {
  <div className="transaction">
    <h4>
      {transaction.date.MM}-{transaction.date.DD}-{transaction.date.YYYY}
    </h4>
    <h4>{transaction.transactionAmount}</h4>
    <h4>{transaction.tag[0]}</h4>
    <h4>{transaction.transactionId.substring(0, 5)}</h4>
    <div className="deleteTransaction">
      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
    </div>{" "}
  </div>;
};

export default Transaction;
