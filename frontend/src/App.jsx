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
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/product/:id" element={<ProductPage />}></Route>
      </Routes>
    </div>
  )
  
}

//export  default App
export default function App() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl text-primary">Hello DaisyUI</h1>
      <button className="btn btn-primary">Primary Button</button>
      <button className="btn btn-secondary">Secondary Button</button>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>If DaisyUI is working, this should be styled.</p>
        </div>
      </div>
    </div>
  );
}
