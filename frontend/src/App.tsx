import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import NavigateBar from "./components/NavigateBar";
import Footer from "./components/Footer";

export default function App(): ReactElement {
    return (
        <div id="app">
            <NavigateBar />
            <Footer />
        </div>
    );
}
