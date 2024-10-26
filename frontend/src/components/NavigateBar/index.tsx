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

import "./index.scss";

export default function NavigateBar(): ReactElement {
    return (
        <div id="navigateBar">
            <div></div>
        </div>
    );
}
