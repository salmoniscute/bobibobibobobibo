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
    const [mbtiColorButton, setMbtiColorButton] = useState<string>("");
    const [mbtiColorNotice, setMbtiColorNotice] = useState<string>("");
    useEffect(() => {
        setMbtiColor(userData ? userData.mbti : "ENFJ");
    }, [userData]);

    const setMbtiColor = (mbti: string) => {
        const categoryColorsBotton: { [key: string]: string } = {
            Sentinels: "#32acbe",
            Diplomats: "green",
            Analysts: "purple",
            Explorers: "#dda900",
        };
        const categoryColorsNotice: { [key: string]: string } = {
            Sentinels: "#C9EAFB",
            Diplomats: "#B4E9B4",
            Analysts: "#E8CEED",
            Explorers: "#FFFFBF",
        };

        const mbtiGroups: { [key: string]: string } = {
            INTJ: "Analysts",
            INTP: "Analysts",
            ENTJ: "Analysts",
            ENTP: "Analysts",
            INFJ: "Diplomats",
            INFP: "Diplomats",
            ENFJ: "Diplomats",
            ENFP: "Diplomats",
            ISTJ: "Sentinels",
            ISFJ: "Sentinels",
            ESTJ: "Sentinels",
            ESFJ: "Sentinels",
            ISTP: "Explorers",
            ISFP: "Explorers",
            ESTP: "Explorers",
            ESFP: "Explorers",
        };

        const group = mbtiGroups[mbti];
        setMbtiColorButton(categoryColorsBotton[group] || "gray");
        setMbtiColorNotice(categoryColorsNotice[group] || "gray");
    };
    return (
        <div id="navigateBar" style={{ backgroundColor: mbtiColorNotice }}>
            <Link to="/" className="logo">
                <h1>WriteType</h1>
            </Link>
            {userData === null ? (
                <div className="buttons">
                    <Link
                        className="loginButton body-bold"
                        to={"/login"}
                        style={{ backgroundColor: mbtiColorButton }}
                    >
                        Login
                    </Link>
                    <Link
                        className="signupButton body-bold"
                        to={"/signup"}
                        style={{ backgroundColor: mbtiColorButton }}
                    >
                        Sign Up
                    </Link>
                </div>
            ) : (
                <Link
                    to="/logout"
                    className="logoutButton body-bold"
                    style={{ backgroundColor: mbtiColorButton }}
                >
                    LOGOUT
                </Link>
            )}
        </div>
    );
}
