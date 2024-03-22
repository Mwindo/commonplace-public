import { Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./ScrollToTop.js";

import ItemSearchPage from "../../pages/ItemSearch.js";
import AboutPage from "../../pages/About.tsx";
import ItemDetailsPage from "../../pages/ItemDetails.js";
import LoginPage from "../../pages/Login.js";
import NotFoundPage from "../../pages/NotFound.js";
import NetworkErrorPage from "../../pages/NetworkError.js";

import { AnimatePresence } from "framer-motion";
import LoggOutPage from "../../pages/LoggedOut.js";
import PreviewItemPage from "../../pages/PreviewItemDetails.js";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ItemSearchPage />} />
        <Route path="/item">
          <Route path=":itemId" element={<ItemDetailsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/preview" element={<PreviewItemPage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/networkerror" element={<NetworkErrorPage />} />
        <Route path="/alligator" element={<LoggOutPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
