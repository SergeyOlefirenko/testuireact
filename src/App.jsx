import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createContext } from 'react';
import elements from './data/sidebar.json';
import Loader from './loader/Loader';
import { Menu } from './exportrouter/ExportRouter';
import { Navbar } from './exportrouter/ExportRouter';
import AppRouter from './exportrouter/Approuter';

export const AppContext = createContext();

function App() {
  const [navi, setNavi] = useState(elements);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [count, setCount] = useState(0);
  const [task, setTask] = useState('tasks');
  // const [loader, setLoader] = useState(true); 
 

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoader(false);
  //   }, 2200); 
  // }, []);
// const showNavbar = {
//   display: 'none'
// }
// const showNavi ={
//   display: 'none'
// }
// const [show, setShow] = useState(showNavi)

  return (
    <AppContext.Provider
      value={{
        navi,
        setNavi,
        count,
        setCount,
        task,
        setTask,
        isLaptop,
         setIsLaptop
        // setShow
      }}
    >
       {/* <div className="App">
        <AppRouter />
        {loader ? (
         <Routes> 
          <Route path="/" element={<Loader />} />
          </Routes>
        ) : (
          <>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Menu menuOpen={menuOpen} />
          </>
        )}
      </div> */}
      
      <div className="App">
        <AppRouter />
        <div className='show'>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
            <Menu menuOpen={menuOpen} />
         
            </div>
            <Routes> 
          <Route path="/" element={<Loader />} />
          </Routes>
         
        {/* {showNavi ? (
         <Routes> 
          <Route path="/" element={<Loader />} />
          </Routes>
        ) : (
          <>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Menu menuOpen={menuOpen} />
          </>
        )} */}
      </div>
    </AppContext.Provider>
  );
}

export default App;

// import React from 'react';
// // import Home from './components/home/Home';
// import { Routes, Route } from 'react-router-dom';
// import { createContext, useState } from 'react';
// import elements from "./data/sidebar.json"
// import Loader from './loader/Loader';
// import { Menu } from './exportrouter/ExportRouter';
// import {Navbar} from './exportrouter/ExportRouter';
// import AppRouter from './exportrouter/Approuter';
// export const AppContext = createContext();

// function App() {
//   const [navi, setNavi] = useState(elements);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [count, setCount] = useState(0);
//   const [todo, setTodo] = useState('todos')
//   const [showNavi, setShowNavi] = useState(false)
//   return (
//     <AppContext.Provider value={{
//       navi,
//       setNavi,
//       count,
//       setCount,
//       todo,
//       setTodo
//     }}>
//       <div className="App">
//       <AppRouter />
//       {/* <li><a onClick={() => {setShowNavi(!showNavi)}}>Add to wishlist</a></li> */}
//       <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
//         <Menu menuOpen={menuOpen} />
//         <Routes>
//         {showNavi === false && <Route path="/" element={<Loader />} />} 
         
//           {/* <Route path="/home" element={<Home />} /> */}
//         </Routes>
//       </div>
//     </AppContext.Provider>
//   );
// }

// export default App;

