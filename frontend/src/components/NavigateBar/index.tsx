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
    }, []);

    const setMbtiColor = (mbti: string) => {
        const categoryColorsBotton: { [key: string]: string } = {
            Analysts: "blue",
            Diplomats: "green",
            Sentinels: "purple",
            Explorers: "yellow",
        };
        const categoryColorsNotice: { [key: string]: string } = {
            Analysts: "#C9EAFB",
            Diplomats: "#B4E9B4",
            Sentinels: "#E8CEED",
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
