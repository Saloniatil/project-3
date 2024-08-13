import React, { useEffect, useState } from "react";
import "./cartstyle.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeToCart,
  removeSingleIteams,
  emptycartIteam,
} from "../redux/features/cartSlice";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import "./style.css";
import Languageoption from "./language-dropdown";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import CurrencyRow from "./CurrencyRow";
import "./app.css";

const BASE_URL =
  "https://v6.exchangerate-api.com/v6/35759e1554b0961a58d9b749/latest/USD";

const CartDetails = () => {
  const { carts } = useSelector((state) => state.allCart);
  const [totalprice, setPrice] = useState(0);
  const [totalquantity, setTotalQuantity] = useState(0);

  const [billAmt, setBillAmt] = useState("");
  const [percentage, setPercentage] = useState("0");
  const [discountAmt, setDiscountAmt] = useState("");
  const [finalPay, setFinalPay] = useState("");

  const dispatch = useDispatch();

  // Add to cart
  const handleIncrement = (e) => {
    dispatch(addToCart(e));
  };

  // Remove from cart
  const handleDecrement = (e) => {
    dispatch(removeToCart(e));
    toast.success("Item Removed From Your Cart");
  };

  // Remove single item
  const handleSingleDecrement = (e) => {
    dispatch(removeSingleIteams(e));
  };

  // Empty cart
  const emptycart = () => {
    dispatch(emptycartIteam());
    toast.success("Your Cart is Empty");
  };

  // Count total price
  const total = () => {
    let totalprice = 0;
    carts.forEach((ele) => {
      totalprice += ele.price * ele.qnty;
    });
    setPrice(totalprice);
    setBillAmt(totalprice); // Update bill amount for discount calculation
  };

  // Count total quantity
  const countquantity = () => {
    let totalquantity = 0;
    carts.forEach((ele) => {
      totalquantity += ele.qnty;
    });
    setTotalQuantity(totalquantity);
  };

  useEffect(() => {
    total();
  }, [carts]);

  useEffect(() => {
    countquantity();
  }, [carts]);

  useEffect(() => {
    handleCalculate(); // Recalculate on billAmt or percentage change
  }, [billAmt, percentage]);

  // Format currency based on language
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(i18next.language, {
      style: "currency",
      currency: "INR", // You may want to adjust this based on your currency
    }).format(amount);
  };

  // // Payment integration
  // const makePayment = async () => {
  //   const stripe = await loadStripe(
  //     "pk_test_51NkbT5SEBW6CSGsWFxTKNueAVF8kXmZQxr5F3FHOI1LK0PTT9Q8HFXEMGc3yNpxICkH72a9uUCWize4E9WC7VlHb00zC5JzcvZ"
  //   );

  //   const body = {
  //     products: carts,
  //     totalprice: totalprice,
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };
  //   const response = await fetch(
  //     "http://localhost:7000/api/create-checkout-session",
  //     {
  //       method: "POST",
  //       headers: headers,
  //       body: JSON.stringify(body),
  //     }
  //   );

  //   const session = await response.json();

  //   const result = stripe.redirectToCheckout({
  //     sessionId: session.id,
  //   });

  //   if (result.error) {
  //     console.log(result.error);
  //   }
  // };

  // For converting into different languages
  const { t } = useTranslation();
  const handleClick = (e) => {
    i18next.changeLanguage(e.target.value);
  };

  // Update finalPay when language changes
  useEffect(() => {
    handleCalculate(); // Recalculate on language change
  }, [i18next.language]);

  const handleCalculate = () => {
    const percentageValue = parseFloat(percentage);
    if (
      billAmt &&
      !isNaN(percentageValue) &&
      percentageValue >= 0 &&
      percentageValue <= 100
    ) {
      const discount = (billAmt * percentageValue) / 100;
      setDiscountAmt(formatCurrency(discount));
      setFinalPay(formatCurrency(billAmt - discount));
    }
  };

  // Function to extract numerical value from a formatted currency string
  const getNumericValue = (formattedValue) => {
    return parseFloat(formattedValue.replace(/[^0-9.-]+/g, ""));
  };

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        // setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setCurrencyOptions([data.base, ...Object.keys(data.conversion_rates)]);
      });
  }, []);

  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.conversion_rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.conversion_rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.conversion_rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `https://v6.exchangerate-api.com/v6/35759e1554b0961a58d9b749/pair/${fromCurrency}/${toCurrency}`
      )
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.conversion_rate));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <div className="row justify-content-center m-0">
        <div className="col-md-8 mt-5 mb-5 cardsdetails">
          <div className="card">
            <div className="card-header bg-dark p-3">
              <div className="card-header-flex">
                <h5 className="text-white m-0">
                  Cart Calculation{carts.length > 0 ? `(${carts.length})` : ""}
                </h5>
                {carts.length > 0 ? (
                  <button
                    className="btn btn-danger mt-0 btn-sm"
                    onClick={emptycart}
                  >
                    <i className="fa fa-trash-alt mr-2"></i>
                    <span>EmptyCart</span>
                  </button>
                ) : null}
              </div>
            </div>
            <form className="card-body p-0">
              {carts.length === 0 ? (
                <table className="table cart-table mb-0">
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="cart-empty">
                          <i className="fa fa-shopping-cart"></i>
                          <p>Your Cart Is Empty</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="table cart-table mb-0 table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total Amount</th>
                      <th className="text-left">Discount</th>
                      <th className="text-right">Amount with Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((data, index) => (
                      <tr key={index}>
                        <td>
                          <div className="product-img">
                            <img src={data.imgdata} alt="" />
                          </div>
                        </td>
                        <td>
                          <div className="product-name">
                            <p>{data.dish}</p>
                          </div>
                        </td>
                        <td>{formatCurrency(data.price)}</td>
                        <td>
                          <div className="prdct-qty-container">
                            <button
                              className="prdct-qty-btn"
                              type="button"
                              onClick={
                                data.qnty <= 1
                                  ? () => handleDecrement(data.id)
                                  : () => handleSingleDecrement(data)
                              }
                            >
                              <i className="fa fa-minus"></i>
                            </button>
                            <input
                              type="text"
                              className="qty-input-box"
                              value={data.qnty}
                              disabled
                            />
                            <button
                              className="prdct-qty-btn"
                              type="button"
                              onClick={() => handleIncrement(data)}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="text-left">
                          {formatCurrency(data.price * data.qnty)}
                        </td>
                        <td>
                          <div className="prdct-qty-container">
                            <input
                              className="prdct-amt-btn"
                              type="text"
                              placeholder="Enter value"
                              value={percentage}
                              onChange={(e) => setPercentage(e.target.value)}
                            />
                            <button
                              type="button"
                              className="prdct-qty-btn"
                              onClick={handleCalculate}
                            >
                              Add
                            </button>
                          </div>
                        </td>
                        <td>{percentage}%</td>
                        <td>{finalPay}</td>
                        <td>
                          <h5>Conversion</h5>
                          <CurrencyRow
                            currencyOptions={currencyOptions}
                            selectedCurrency={fromCurrency}
                            onChangeCurrency={(e) =>
                              setFromCurrency(e.target.value)
                            }
                            onChangeAmount={handleFromAmountChange}
                            amount={getNumericValue(finalPay)}
                          />
                          <div className="equals">=</div>
                          <CurrencyRow
                            currencyOptions={currencyOptions}
                            selectedCurrency={toCurrency}
                            onChangeCurrency={(e) =>
                              setToCurrency(e.target.value)
                            }
                            onChangeAmount={handleToAmountChange}
                            amount={toAmount}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>&nbsp;</th>
                      <th colSpan={2}>&nbsp;</th>
                      <th>
                        Items In Cart <span className="ml-2 mr-2">:</span>
                        <span className="text-danger">{totalquantity}</span>
                      </th>
                      <th className="text-right">
                        Total Price<span className="ml-2 mr-2">:</span>
                        <span className="text-danger">
                          {toAmount} with Discount
                        </span>
                      </th>
                      <th className="text-right">
                        {/* <button
                          className="btn btn-success"
                          onClick={makePayment}
                          type="button"
                        >
                          Checkout
                        </button> */}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
