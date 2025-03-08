import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Compare from "./Compare";
import Navbar from "./Navbar";
import Home from "./Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>

  );
}

export default App;
