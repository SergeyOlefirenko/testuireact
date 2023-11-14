import React, { useContext, useState, useEffect } from "react";
import { MainConverterContext } from "./MainConverter";
import { MultiSelect } from "react-multi-select-component";
import "./MainConverter.css";
import "./Converter.css";

const Converter = () => {
  // setData оставляем для возможного изменения данных в JSON при необходимости
  const { data, setData } = useContext(MainConverterContext)
  //Здесь хранятся данные об элементах переданных в селектор за исключением одинаковых элементов в списке
  const [options, setOptions] = useState([]);
  // Здесь хранятся данные о всех элементах полученных из JSON файла за исключением одинаковых элементов в списке
  const [items, setItems] = useState([])
  // Здесь хранятся данные о выбранных пользователем элементах
  const [selected1, setSelected1] = useState([]);
  const [selected2, setSelected2] = useState([]);
  // Здесь хранятся данные о результатах обработки для одного действия (по одному элементу в каждом поле)
  const [quantity, setQuantity] = useState(1)
  const [result, setResult] = useState(0);
  // Здесь хранятся сведения о результатах обработки данных когда в одном из полей одно значение, в во втором 
  // длина полученного массива меньше длины массива, переданного в селектор
  let [storage, setStorage] = useState([])
  // Здесь хранятся сведения о результатах обработки данных когда в одном из полей одно или несколько значений,
  // но меньше длины массива, переданного в селектор, а в во втором длина полученного массива равна длине массива,
  //  переданного в селектор. Параметры состояния изменяемы поэтому оно не может быть const.
  let [counter1, setCounter1] = useState(0)
  let [counter2, setCounter2] = useState(0)
  let [counter3, setCounter3] = useState(0)
  let [counter4, setCounter4] = useState(0)
  // Здесь хранятся сведения о результатах обработки данных когда значения обоих полей больше 1, и длина 
  // длина полученного массива меньше длины массива, переданного в селектор. Параметры состояния изменяемы поэтому оно не может быть const.
  const [elements, setElements] = useState([])
  // Здесь хранятся сведения о полях ввода-вывода данных, полученных из селектора и переданных в обработчик
  const [cross1, setCross1] = useState(0)
  const [cross2, setCross2] = useState(0)
  const [disabled, setDisabled] = useState(false)
 

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
        dataList.push({ label, value, disabled });
      }
    })
    setOptions(dataList);
    setItems(item);

  }, [disabled])

  //Калькулятор
  useEffect(() => {
    const found1 = selected1.map((i) => i.label)
    const found2 = selected2.map((i) => i.label)
    let item1 = '';
    let item2 = '';
    let res = 0;
    let elem = []
    item1 = found1[found1.length - 1]
    item2 = found2[found2.length - 1]
    let val = obj[item1 + '-' + item2]

    //Простой калькулятор для одного действия когда в каждом поле выбрано по одному элементу

    if (found1.length == 1 && found2.length == 1) {
      if (item1 == item2 || val == undefined) {
        res = quantity * 1
      }
      else {
        res = quantity / val
      }
      setResult(res);
      setStorage(res);
      setCross1(quantity);
      setCross2(result);
      elem.push(item2);
      setElements(elem)
    }
    //Если в первом поле выбран 1 элемент, а во втором несколько но меньше всех имеющихся в селекторе элементов
    else if (found1.length == 1 && (found2.length > 1 && found2.length < items.length)) {
      if (item1 == item2 || val == undefined) {
        res = (quantity * 1)
        setStorage(storage += res)
        setCross1(quantity)
      }
      else {
        res = quantity / val
        setStorage(storage += res)
      }
      setCross1(quantity)
      setCross2(storage)
      setDisabled(true)
    }
    //Если вo втором поле выбран 1 элемент, а в первом несколько но меньше всех имеющихся в селекторе элементов
    else if (found2.length == 1 && (found1.length > 1 && found1.length < items.length)) {
      if (item1 == item2 || val == undefined) {
        res = (quantity * 1)
        setStorage(storage += res)
        setCross2(quantity)

      }
      else {
        res = quantity / val
        setStorage(storage += res)
      }
      setCross2(storage)
      console.log(cross2);
      setCross1(quantity)
      console.log(cross1);
      setDisabled(true)
    }

    // Эта проверка отключена
    //Если в первом поле больше одного элемента, и во втором больше одного элемента но меньше всех имеющихся в селекторе элементов

    else if ((found1.length > 1 && found1.length < items.length) && (found2.length > 1 && found2.length < items.length)) {
      elements.push(item2);
      setElements(elements)
      elements.map((i) => {
      let val3 = obj[item1 + '-' + i]
      let res3 = 0;
      let count3 = 0;
      if (item1 == i || val3 == undefined) {
        setQuantity(quantity)
        setCounter3(count3)
        res3 = (quantity * 1)
        setCounter3(counter3 += res3)
        setCross1(quantity)
      }
      else {
        res3 = quantity / val3
        setCounter3(counter3 += res3)
      }
        setCross2(counter3)
        setStorage(counter3);
      })
    }

    //Если в первом поле больше одного элемента, и во втором больше одного элемента но меньше всех имеющихся в селекторе элементов

    else if ((found2.length > 1  && found2.length < items.length) && (found1.length > 1 && found1.length < items.length)) {
      elements.push(item1);
      setElements(elements)
      elements.map((i) => {
      let val4 = obj[item1 + '-' + i]
      let res4 = 0;
      let count4 = 0;
      if (item1 == i || val4 == undefined) {
        setQuantity(quantity)
        setCounter4(count4)
        res4 = (quantity * 1)
        setCounter4(counter4 += res4)
        setCross1(quantity)
      }
      else {
        res4 = quantity / val4
        setCounter4(counter4 += res4)
      }
        setCross2(counter4)
        setStorage(counter4);
      })
    }
    // Предыдущая проверка отключена за отсутствием необходимости по причине отсутствия постановки задачи
    // и решения использовать блокировку выборора элементов селектора

    //Если в первом поле выбран 1 элемент, а во втором поле выбраны все элементы

    // else if ((found1.length == 1 || found1.length > 1) && found2.length == items.length) {
      else if (found1.length == 1 && found2.length == items.length) {
      items.map((i) => {
      let val1 = obj[item1 + '-' + i]
      let res1 = 0;
      let count1 = 0;
      setCounter1(count1)
      if (item1 == i || val1 == undefined) {
          setQuantity(quantity)
          res1 = (quantity * 1)
          setCounter1(counter1 += res1)
          setCross1(quantity)
      }
      else {
          res1 = quantity / val1
          setCounter1(counter1 += res1)
      }
        setStorage(counter1);
        setCross2(counter1)
      })
      setDisabled(true)
    }

    //Если во втором поле выбран 1 элемент, а в первом поле выбраны все элементы

    // else if ((found2.length == 1 || found2.length > 1) && found1.length == items.length) {
      else if (found2.length == 1 && found1.length == items.length) {
      items.map((i) => {
      let val2 = obj[item2 + '-' + i]
      let res2 = 0;
      let count2 = 0;
      if (item2 == i || val2 == undefined) {
        setQuantity(quantity)
        setCounter2(count2)
        res2 = (quantity * 1)
        setCounter2(counter2 += res2)
        setCross1(quantity)
      }
      else {
        res2 = quantity / val2
        setCounter2(counter2 += res2)
      }
        setStorage(counter2);
        setCross2(counter2)
      })
      setDisabled(true)
    }
  }, [selected1, selected2, quantity, result])

  //Обработчики значений если в каждом поле выбрано по одному элементу

  // Обработчик изменения значения в первом поле
  const handleChange1 = (e) => {
    const value = e.target.value;
    setCross1(parseFloat(value >= 0 ? value : ''));
    console.log(cross1);
    // Выполняем вычисления и обновляем значение второго поля
    let res = parseFloat((value * result) >= 0 ? value * result : '');
    setCross2(res.toFixed(6));
  };

  // Обработчик изменения значения во втором поле
  const handleChange2 = (e) => {
    const value = e.target.value;
    setCross2(parseFloat(value >= 0 ? value : ''));
    // Выполняем вычисления и обновляем значение первого поля
    let res = parseFloat((value / result) >= 0 ? value / result : '');
    setCross1(res.toFixed(6));
  };

  // Функция очистки полей и изменения параметров селектора. По хорошему ее нужно привязывать к кнопке 'X'
  // когда происходит очистка полей ввода нанных из селектора, но решил так, для наглядности
  const removeHandler = () => {
    setDisabled(false)
    setCross1(0)
    setCross2(0)
    setStorage(0)
    setCounter1(0)
    setCounter2(0)
    setCounter3(0)
    setCounter4(0)
  }

  const binStyle = {
    cursor: 'pointer'
  }
  return (
    <div className="selector">
      <p>Select currency</p>
      <div className='data1'>
        <input type="number" placeholder='Quantity' onChange={handleChange2} value={cross2} />
        <MultiSelect
          options={options}
          value={selected1}
          onChange={setSelected1}
          labelledBy="Select"
        />
      </div>
      <div className='data2'>
        <input type="number" placeholder='Quantity' onChange={handleChange1} value={cross1} />
        <MultiSelect
          options={options}
          value={selected2}
          onChange={setSelected2}
          labelledBy="Select"
        />
      </div>
      <div className='trash'>{storage > 0 ? <i className="bi bi-trash3-fill" style={binStyle} onClick={removeHandler}><p className='t'>Clear all</p></i> : ''}</div>
    </div>
  );
};

export default Converter;

