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
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import "./index.scss";

export default function MainPage(): ReactElement {
    return (
        <div id="mainPage">
            <div className="mainContent">
                <IoCaretBackCircleSharp className="backwardButton" />
                <div className="diary">
                    <p>Title</p>
                    <p>Content</p>
                    <IoMdAddCircle className="addButton" />
                </div>
                <div className="mbti">
                    <img src="/assets/ENFJ.png"></img>
                    <p>ENFJ</p>
                </div>
            </div>
        </div>
    );
}
