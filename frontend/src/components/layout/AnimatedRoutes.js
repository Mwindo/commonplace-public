import { Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

import ItemSearchPage from "../../pages/ItemSearch";
import AboutPage from "../../pages/About";
import ItemDetailsPage from "../../pages/ItemDetails";
import LoginPage from "../../pages/Login";
import NotFoundPage from "../../pages/NotFound";
import NetworkErrorPage from "../../pages/NetworkError";

import { AnimatePresence } from "framer-motion";
import LoggOutPage from "../../pages/LoggedOut";
import PreviewItemPage from "../../pages/PreviewItemDetails";

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
