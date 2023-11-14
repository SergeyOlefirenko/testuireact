import React, { createContext, useState } from "react";
import Converter from './Converter';
import SimpleConverter from './SimpleConverter';
import items from '../../../data/data.json'
export const MainConverterContext = createContext();
function MainConverter (){
  const [data, setData] = useState(items)
  const [simple, setSimple] = useState(false)
  const changeConverter = () => {
    setSimple(!simple);
  };
  const reloadHandler = () => {
    window.location.reload();
  }
  // Пример1:
  // Если необходимо получение данных из внешнего файла
  // const [data, setData] = useState([]);
  // useEffect(() => {
  // Загрузка данных из JSON файла
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/path/to/data.json');
  //       const json = await response.json();
  //       setData(json.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

// Пример 2:
// Если необходимо изменть данные JSON извне, как пример - JSON Server
// const [admin, setAdmin] = useState([])
//  function fetching(){
//   axios('https://jsonserver-bd7n.onrender.com/').then(i=> setAdmin(i.data))
//  }
//  useEffect(()=>{
//   fetching()
//  },[])

// Пример 3:
// Если необходимо получить данные извне:
// const Something_URL = 'https://api.какой-то API'
// const [currency, setCurrency] = useState([])
// const [from, setFrom] = useState()
// const [to, setTo] = useState()
// const [rate, setRate] = useState()
// useEffect(() => {
//   fetch(BASE_URL)
//     .then(res => res.json())
//     .then(data => {
//       const firstSelected = Object.keys(data.rates)[0]
//       setCurrency([data.base, ...Object.keys(data.rates)])
//       setFrom(data.base)
//       setTo(firstSelected)
//       setRate(data.rates[firstSelected])
//     })
// }, [])
// Примерно так

  return (
    <MainConverterContext.Provider value={{
      data,
      setData
     }}>
      <div className='changeConverter'>
      <i className="bi bi-arrow-clockwise" onClick={reloadHandler}><p className='r'>Reload</p></i>
      <i className="bi bi-currency-bitcoin" onClick={changeConverter}>{simple ? <p className='c'>Converter</p>:<p>Simple converter</p>}</i>
      </div>
      {simple ? <SimpleConverter/> : <Converter/>}
     </MainConverterContext.Provider>
  );
};

export default MainConverter;
