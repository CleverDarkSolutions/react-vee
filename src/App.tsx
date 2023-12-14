import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import InfiniteScroll from "./components/infinite-scroll";



function App() {

  return (
      <div className="App">
          <h1>Scroll component with a little bit of humor</h1>
          <div>
              <InfiniteScroll/>
          </div>
      </div>
  );
}

export default App;
