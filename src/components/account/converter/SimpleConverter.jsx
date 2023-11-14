import React, { useContext, useState, useEffect } from "react";
import { MainConverterContext } from "./MainConverter";
import "./MainConverter.css";
import './Simple.css';
import Select from 'react-select';

const SimpleConverter = () => {
  // setData оставляем для возможного изменения данных в JSON при необходимости
  const { data, setData } = useContext(MainConverterContext)
  // //Здесь хранятся данные об элементах переданных в селектор за исключением одинаковых элементов в списке
  const [options, setOptions] = useState([]);
 
  // Здесь хранятся данные о выбранных пользователем элементах
  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  const [found1, setFound1] = useState();
  const [found2, setFound2] = useState();

  // Здесь хранятся данные о результатах обработки для одного действия (по одному элементу в каждом поле)
  const [quantity, setQuantity] = useState(0)
  const [result, setResult] = useState(0);

  // Здесь хранятся сведения о полях ввода-вывода данных, полученных из селектора и переданных в обработчик
  const [cross1, setCross1] = useState()
  const [cross2, setCross2] = useState()
  // const [multi, setMulti] = useState(false)

  //Здесь мы передаем именно объекты

  var obj = data['currencies-pairs']

  // Обработчик данных из JSON файла для передачи в селектор

    useEffect(() => {
    let label = '';
    let value = '';
    let dataList = []
    let item = []
    data.data && data.data.map((i) => {
      label = i.currency
      value = i.price
      // Здесь используем проверку на наличие объекта в списке
      if (!item.includes(label)) {
        item.push(label);
        dataList.push({ label, value });
      }
    })
    setOptions(dataList);
  }, [])
 
  //Простой калькулятор для одного действия 
  useEffect(() => {
    let item1 = selected1['label']
    let item2 = selected2['label']
    setFound1(item1)
    setFound2(item2)
    let res = 0;
    let val = obj[item1 + '-' + item2]
      if((item1 == null || item1 == undefined || item1 == '') ||
       (item2 == null || item2 == undefined || item2 == '')){
        res = 0;
        setCross1('')
      }
      else if (item1 == item2 || val == undefined) {
        setQuantity(1)
        res = quantity * 1
      }
      else {
        setQuantity(1)
        res = quantity * val
      }
      setResult(res);
      setCross1(quantity);
      setCross2(result);
  }, [selected1, selected2, quantity, result])

  //Обработчики значений если в каждом поле выбрано по одному элементу

  // Обработчик изменения значения в первом поле
  const handleChange1 = (e) => {
    const value = e.target.value;
    setCross1(parseFloat(value >= 0 ? value : ''));
    // Выполняем вычисления и обновляем значение второго поля
    let res = parseFloat((value * result) >= 0 ? value * result : '');
    setCross2(res);
  };

  // Обработчик изменения значения во втором поле
  const handleChange2 = (e) => {
    const value = e.target.value;
    setCross2(parseFloat(value >= 0 ? value : ''));
    // Выполняем вычисления и обновляем значение первого поля
    let res = parseFloat((value / result) >= 0 ? value / result : '');
    setCross1(res.toFixed(6));
  };
  const removeHandler = () => {
    setCross1('')
    setCross2('')
  }

  const binStyle = {
    cursor: 'pointer'
  }
  const dataStyle = {
    color: 'white',
    fontSize: '24px'
  }

  return (
    <div className='container'>
    <div className='simple-container'>
      <p>Simple cryptoconverter</p>
      <div className='select-container1'>
      <div className='input1'>
           <input className='i1' type="number" placeholder='Quantity' onChange={handleChange1} value={cross1} />
         </div>
      <div className='select1'>
        <Select
          value={selected1}
          options={options}
          onChange={setSelected1}
          />
      </div>
      </div>
      <div className='select-container2'>
      <div className='input2'>
          <input className='i2' type="number" placeholder='Quantity' onChange={handleChange2} value={cross2} />
         </div>
      <div className='select2'>
        <Select
          value={selected2}
          options={options}
          onChange={setSelected2}
          />
      </div>
      </div>
      <div className='output'>
        <div className='out1'>
        {(cross1>0 && cross1!=NaN && cross1!=undefined && cross1!=null) ? <p style={dataStyle}>{cross1+' '+found1}</p>: ''}
        </div>
      <div className='out2'>
        {(cross2>0 && cross2!=NaN && cross2!=undefined && cross2!=null) ? <p style={dataStyle}>{cross2+' '+found2}</p>: ''}
      </div>
    </div>
      <div className='bin' style={binStyle}>{cross2>0 ? <i className="bi bi-trash3-fill" onClick={removeHandler}><p>Clear all</p></i>:''}</div>
    </div>
    </div>
  );
};

export default SimpleConverter;

