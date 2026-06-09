import React from "react";
import Homepage from "./pages/Homepage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import NavBar from "./components/layout/NavBar.jsx";
import ProductDetails from "./pages/ProductDetail.jsx";
import CheckEmail from "./pages/CheckEmail.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import SellPage from "./pages/SellPage.jsx";
import ListingPage from "./pages/ListingPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/listings" element={<ListingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
