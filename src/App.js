import Headers from "./components/Headers";
import Home from "./components/Home";
import CartDetails from "./components/CartDetails";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cancel from "./components/Cancel";
import Success from "./components/Success";
import CurrencyRow from "./components/CurrencyRow";
import Aboutus from './pages/about';
import React, { useEffect, useState } from 'react'

const BASE_URL = 'https://v6.exchangerate-api.com/v6/35759e1554b0961a58d9b749/latest/USD'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState() 
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
 
  let toAmount, fromAmount 
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
   }
   
    useEffect(() => {
        fetch(BASE_URL)
          .then(res =>  res.json())
          .then(data => {
            const firstCurrency = Object.keys(data.conversion_rates)[0]
            setCurrencyOptions([data.base, ...Object.keys(data.conversion_rates)])
            setFromCurrency(data.base)
            setToCurrency(firstCurrency)
            setExchangeRate(data.conversion_rates[firstCurrency])

          })
  }, [])
  
  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
  
  
  return (
    <>
      
        <Headers />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route  path='/cart' element={<CartDetails />}/>
        <Route path='/success' element={<Success />}/>
        <Route path='/cancel' element={<Cancel />} />

        <Route path='/aboutus' element={<Aboutus/>}/>
        
     </Routes> 
      
      <Toaster /> 
       
    </>
  );
}

export default App;
// import React, { useEffect, useState } from 'react';
// import CurrencyRow from './components/CurrencyRow';
 

// const BASE_URL = 'https://v6.exchangerate-api.com/v6/35759e1554b0961a58d9b749/latest/USD';

// function App() {
//   const [currencyOptions, setCurrencyOptions] = useState([]);
//   const [fromCurrency, setFromCurrency] = useState();
//   const [toCurrency, setToCurrency] = useState();
//   const [exchangeRate, setExchangeRate] = useState();
//   const [amount, setAmount] = useState(1);
//   const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

//   let toAmount, fromAmount;
//   if (amountInFromCurrency) {
//     fromAmount = amount;
//     toAmount = amount * exchangeRate;
//   } else {
//     toAmount = amount;
//     fromAmount = amount / exchangeRate;
//   }

//   useEffect(() => {
//     fetch(BASE_URL)
//       .then(res => res.json())
//       .then(data => {
//         const firstCurrency = Object.keys(data.conversion_rates)[0];
//         setCurrencyOptions([data.base, ...Object.keys(data.conversion_rates)]);
//         setFromCurrency(data.base);
//         setToCurrency(firstCurrency);
//         setExchangeRate(data.conversion_rates[firstCurrency]);
//       });
//   }, []);

//   useEffect(() => {
//     if (fromCurrency != null && toCurrency != null) {
//       fetch(`https://v6.exchangerate-api.com/v6/35759e1554b0961a58d9b749/pair/${fromCurrency}/${toCurrency}`)
//         .then(res => res.json())
//         .then(data => setExchangeRate(data.conversion_rate));
//     }
//   }, [fromCurrency, toCurrency]);

//   function handleFromAmountChange(e) {
//     setAmount(e.target.value);
//     setAmountInFromCurrency(true);
//   }

//   function handleToAmountChange(e) {
//     setAmount(e.target.value);
//     setAmountInFromCurrency(false);
//   }

//   return (
//     <>
//       <div>
//         <h5>Convert</h5>
//         <CurrencyRow
//           currencyOptions={currencyOptions}
//           selectedCurrency={fromCurrency}
//           onChangeCurrency={e => setFromCurrency(e.target.value)}
//           onChangeAmount={handleFromAmountChange}
//           amount={fromAmount}
//         />
//         <div className="equals">=</div>
//         <CurrencyRow
//           currencyOptions={currencyOptions}
//           selectedCurrency={toCurrency}
//           onChangeCurrency={e => setToCurrency(e.target.value)}
//           onChangeAmount={handleToAmountChange}
//           amount={toAmount}
//         />
//       </div>
//     </>
//   );
// }

// export default App;
