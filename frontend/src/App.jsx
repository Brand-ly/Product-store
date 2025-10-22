import NavBar from "./Components/Navbar.jsx";
import {Routes, Route} from 'react-router-dom';
import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import { useThemeStore } from "./store/useThemeStore";  
import { useEffect } from "react";

function App() {

  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return(
    <div className="min-h-screen bg-base-200 transition-colors duration-300" >
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/product/:id" element={<ProductPage />}></Route>
      </Routes>
    </div>
  )
  
}

export  default App
