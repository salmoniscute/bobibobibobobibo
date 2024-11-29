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
import {
    IoCaretBackCircleSharp,
    IoCaretForwardCircleSharp,
} from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import "./index.scss";
import { getDiaryList } from "../../api/diary";
import { Diary } from "../../schemas/diary";
import userDataContext from "../../context/userData";

export default function MainPage(): ReactElement {
    const [diaryList, setDiaryList] = useState<Array<Diary>>([]);
    const [diary, setDiary] = useState<Diary>();
    const [currentDiary, setCurrentDiary] = useState(0);
    const [mbtiColor, setMbtiColor] = useState<string>("");

    const userData = useContext(userDataContext);

    useEffect(() => {
        handleDiaryList();
        setMbtiButtonColor(userData ? userData.mbti : "ENFJ");
    }, []);

    const backward = () => {
        if (currentDiary == 0) {
            setCurrentDiary(diaryList.length - 1);
        } else {
            setCurrentDiary(currentDiary - 1);
        }
        setDiary(diaryList[currentDiary]);
    };
    const forward = () => {
        if (currentDiary == diaryList.length - 1) {
            setCurrentDiary(0);
        } else {
            setCurrentDiary(currentDiary + 1);
        }
        setDiary(diaryList[currentDiary]);
    };

    const handleDiaryList = () => {
        getDiaryList(userData ? userData.uid : null).then((data) => {
            setDiaryList(data);
            setCurrentDiary(diaryList.length - 1);
            setDiary(diaryList[currentDiary]);
            //console.log(diaryList);
        });
    };

    const setTimeString = (release_time: string): string => {
        const releaseDate = new Date(release_time);
        const formattedDate = `${releaseDate.getFullYear()}年${
            releaseDate.getMonth() + 1
        }月${releaseDate.getDate()}日`;
        return formattedDate;
    };
    const setMbtiButtonColor = (mbti: string) => {
        const categoryColors: { [key: string]: string } = {
            Analysts: "blue",
            Diplomats: "green",
            Sentinels: "purple",
            Explorers: "yellow",
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
        setMbtiColor(categoryColors[group] || "gray");
    };

    return (
        <div id="mainPage">
            <div className="mainContent">
                <div className="buttons" style={{ color: mbtiColor }}>
                    <IoMdAddCircle className="addButton" />
                    <IoCaretForwardCircleSharp
                        className="forwardButton"
                        onClick={forward}
                    />
                    <IoCaretBackCircleSharp
                        className="backwardButton"
                        onClick={backward}
                    />
                </div>
                <div className="diary">
                    <p className="title">{diary?.title}</p>
                    <p>{setTimeString(diary?.release_time || "")}</p>
                    <p className="content">{diary?.content}</p>
                </div>
                <div className="mbti">
                    <img src="/assets/ENFJ.png"></img>
                    <p>{userData?.mbti}</p>
                </div>
            </div>
        </div>
    );
}
