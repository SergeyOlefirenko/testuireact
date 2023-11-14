import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
import './Home.css';
import './Avatar.css';
import Avatar from './Avatar';
// import Menu from '../menu/Menu';
// import Navbar from '../navbar/Navbar';
// import Theme from '../theme/Theme';



function Home() {
  // const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const restartLoader = () => {
    navigate("/");
    // window.location.reload();
  };

  return (
    <div>
      {/* <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Menu menuOpen={menuOpen} /> */}
        {/* <Theme/> */}
      <div className="container">
        <button className="reload" onClick={restartLoader}>&#123;Invitation&#125;</button>
        <Avatar />
        <div className="background"></div>
      </div>
    </div>
  );
}

export default Home;
