import {
    CSSProperties,
    Dispatch,
    ReactElement,
    SetStateAction,
    useContext,
    useMemo,
    useState,
    useEffect,
} from "react";
import { Link } from "react-router-dom";
import userDataContext from "../../context/userData";

import "./index.scss";

export default function NavigateBar(): ReactElement {
    const userData = useContext(userDataContext);
    return (
        <div id="navigateBar">
            <Link to="/" className="logo">
                <h1>HIHI</h1>
            </Link>
            {userData === null ? (
                <Link className="loginButton body-bold" to={"/login"}>
                    LOGIN
                </Link>
            ) : (
                <Link to="/logout">LOGOUT</Link>
            )}
        </div>
    );
}
