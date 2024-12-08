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
import {
    IoCaretBackCircleSharp,
    IoCaretForwardCircleSharp,
} from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { BiSolidComment } from "react-icons/bi";
import "./index.scss";
import { getDiaryList } from "../../api/diary";
import { Diary } from "../../schemas/diary";
import PostEditor from "../../components/PostEditor";
import userDataContext from "../../context/userData";
import Dots from "../../components/Dots";

export default function MainPage(): ReactElement {
    const [diaryList, setDiaryList] = useState<Array<Diary>>([]);
    const [diary, setDiary] = useState<Diary>();
    const [openEditor, setopenEditor] = useState(false);
    const [currentDiary, setCurrentDiary] = useState(0);
    const [mbtiColorButton, setMbtiColorButton] = useState<string>("");
    const [mbtiColorNotice, setMbtiColorNotice] = useState<string>("");
    const [aiFeedbackTyping, setAiFeedbackTyping] = useState<string>("");
    const [generating, setGenerating] = useState<number>(0);

    const userData = useContext(userDataContext);

    useEffect(() => {
        handleDiaryList();
        setMbtiColor(userData ? userData.mbti : "ENFJ");
    }, []);

    useEffect(() => {
        if (diary?.ai_feedback) {
            typeEffect(diary.ai_feedback);
        }
    }, [diary?.ai_feedback]);

    const typeEffect = (text: string) => {
        setAiFeedbackTyping(""); // 清空現有的文字
        let index = 0;

        const interval = setInterval(() => {
            const currentChar = text.charAt(index);
            if (["!", ".", "?"].includes(currentChar)) {
                setAiFeedbackTyping((prev) => prev + currentChar + "\n");
            } else {
                setAiFeedbackTyping((prev) => prev + currentChar);
            }
            index++;
            if (index === text.length) {
                clearInterval(interval);
            }
        }, 50);
    };

    const Open = () => {
        setopenEditor(true);
    };
    const Close = () => {
        setopenEditor(false);
    };

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
        getDiaryList(userData ? userData.uid : "").then((data) => {
            console.log(data); // Log the fetched diary list
            setDiaryList(data);
            const lastDiary = data[data.length - 1];
            setCurrentDiary(data.length - 1);
            setDiary(lastDiary);
            console.log(lastDiary); // Log the last diary immediately
        });
    };

    const handleNewPostDiary = (data: Diary) => {
        setDiaryList([data]);
        setDiary(data);
    };

    const setTimeString = (release_time: string): string => {
        const releaseDate = new Date(release_time);
        const formattedDate = `${releaseDate.getFullYear()}年${
            releaseDate.getMonth() + 1
        }月${releaseDate.getDate()}日`;
        return formattedDate;
    };
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

    const isToday = (release_time: string): boolean => {
        const today = new Date();
        const releaseDate = new Date(release_time);

        return (
            releaseDate.getFullYear() === today.getFullYear() &&
            releaseDate.getMonth() === today.getMonth() &&
            releaseDate.getDate() === today.getDate()
        );
    };

    return (
        <div id="mainPage">
            <div className="mainContent">
                <div className="buttons" style={{ color: mbtiColorButton }}>
                    {diaryList.length != 0 &&
                    diaryList[diaryList.length - 1] &&
                    isToday(
                        diaryList[diaryList.length - 1]?.release_time || ""
                    ) ? (
                        <div></div>
                    ) : (
                        <IoMdAddCircle className="addButton" onClick={Open} />
                    )}
                    <IoCaretForwardCircleSharp
                        className="forwardButton"
                        onClick={forward}
                    />
                    <IoCaretBackCircleSharp
                        className="backwardButton"
                        onClick={backward}
                    />
                </div>
                <div
                    className="notice"
                    style={{ backgroundColor: mbtiColorNotice }}
                >
                    {diaryList &&
                    diaryList[diaryList.length - 1] &&
                    isToday(
                        diaryList[diaryList.length - 1]?.release_time || ""
                    ) ? (
                        <div>you have posted diary today</div>
                    ) : (
                        <div>you have not posted diary today</div>
                    )}
                </div>
                <div className="diary">
                    {diaryList.length != 0 ? (
                        <div>
                            <p className="title">{diary?.title}</p>
                            <p>{setTimeString(diary?.release_time || "")}</p>
                            <p
                                className="content"
                                dangerouslySetInnerHTML={{
                                    __html: diary?.content || "",
                                }}
                            ></p>
                            <div
                                className="line"
                                style={{ color: mbtiColorButton }}
                            ></div>
                            <div className="icon-with-text">
                                <BiSolidComment
                                    className="ai"
                                    style={{ color: mbtiColorNotice }}
                                />
                                <span className="icon-text">
                                    Hi {userData?.uid}
                                </span>
                            </div>
                            <p className="ai_feedback">{aiFeedbackTyping}</p>
                        </div>
                    ) : (
                        <div>nothing</div>
                    )}
                </div>
                <div className="mbti">
                    <img src={`/assets/${userData?.mbti}.png`} />
                    <p>{userData?.mbti}</p>
                </div>
            </div>
            <div className={openEditor === true ? "" : "editor"}>
                <PostEditor
                    onClose={Close}
                    updatePost={handleDiaryList}
                    mbtiColorNotice={mbtiColorNotice}
                    mbtiColorButton={mbtiColorButton}
                    setNewDiary={handleNewPostDiary}
                />
            </div>
        </div>
    );
}
