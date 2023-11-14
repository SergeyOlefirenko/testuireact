import React, { useState, useEffect, useContext } from 'react';
import './Loader.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../App";
const Loader = () => {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {setShow} = useContext(AppContext)
  const showNavi = {
    display: 'block'
  }
  // Имитация задержки загрузки
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigate("/home");
    }, 2200); // Имитация двух секунд загрузки
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setShow(showNavi);
  //   }, 2200); 
  // }, []);

  return isLoading ? (
    <div className="loader">
      <div className="loading">
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
      </div> 
    </div>  
  ): null;
};

export default Loader;



