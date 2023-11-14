import React from 'react';
import * as Components from './ExportRouter';
import { Routes, Route } from 'react-router-dom';

function AppRouter() {
  return (
    <Routes>
    <Route path='/home' element={<Components.Home />}/>
    <Route path='/messenger' element={<Components.Messenger />}/>
    <Route path='/taskplanner' element={<Components.Taskplanner />}/>
    <Route path='/menu' element={<Components.Menu />}/>
    <Route path='/navbar' element={<Components.Navbar />}/>

    {/* <Route path='/converter' element={<Components.MainConverter />}/> */}
      {/* <Route path='/account' element={<Components.Account />}/> */}
      {/* <Route path='/contacts' element={<Components.Contacts />}/> */}
      {/* <Route path='/payments' element={<Components.Payments />}/> */}
      {/* <Route path='/history' element={<Components.History />}/> */}
      {/* <Route path='/privatesettings' element={<Components.PrivateSettings />}/> */}
      {/* <Route path='/taskplanner' element={<Components.Data />}/> */}
      {/* <Route path='/signup' element={<Components.SignUp />}/> */}
      {/* <Route path='/english' element={<Components.English/>}/> */}
      {/* <Route path='/deutsch' element={<Components.Deutsch />}/> */}
    </Routes>
  );
}

export default AppRouter;
