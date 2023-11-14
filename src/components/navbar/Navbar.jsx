import React from "react";
import "./Navbar.css";
import { useState, useContext } from 'react';
import SidebarItem from '../menu/SidebarItem';
import { AppContext } from "../../App";


export default function Navbar({menuOpen, setMenuOpen}) {

  const {navi} = useContext(AppContext)
  // const [showText, setShowText] = useState(false)


  return (
    <div className={menuOpen ? "navbar active": "navbar"}>
      <div className="wrapper">
          <div onClick={() => setMenuOpen(!menuOpen)} className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        <div id='navi' className='navi'>
          <div className="items">
          { navi.map((item) => <SidebarItem item={item}/>) }
          </div>
      </div>
        </div>
      </div>
  );
}
