import React from 'react';
import './Menu.css';
import SidebarItem from './SidebarItem';
import itemsMobile from '../../data/sidebar.json'; // Данные боковой панели на телефоне/планшете
import itemsLaptop from '../../data/sidebar_laptop.json'; // Данные боковой панели на ноутбуке

export default function Menu({ menuOpen, isLaptop }) {
    const items = isLaptop ? itemsLaptop : itemsMobile;

    return (
        <div className={menuOpen ? 'menu active' : 'menu'}>
            <div className="sidebar">
                {items.map((item, index) => (
                    <SidebarItem key={index} item={item} />
                ))}
            </div>
        </div>
    );
}


// import React from 'react';
// import './Menu.css';
// import SidebarItem from "./SidebarItem"
// import items from "../../data/sidebar.json"

// export default function Menu({ menuOpen}) {
 
//   return (
//     <div className={menuOpen ? "menu active" : "menu"}>
//        <div className="sidebar">
//           { items.map((item, index) => <SidebarItem key={index} item={item} />) }
//           {/* <ul>
//         <li><a href="#home">Home</a></li>
//         <li><a href="#menu">Menu</a></li>
//       </ul> */}
//         </div>
//     </div>
   
//   )
// }
