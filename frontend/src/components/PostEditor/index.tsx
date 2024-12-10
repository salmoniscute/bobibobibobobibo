import React, {
    Component,
    ReactElement,
    useState,
    useContext,
    useEffect,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import { Link, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import userDataContext from "../../context/userData";
import "./index.scss";
import { postDiary, getDiary, getDiaryList } from "../../api/diary";
import { Diary } from "../../schemas/diary";

import { RxCross2 } from "react-icons/rx";

const CustomToolbar: React.FC = () => (
    <div id="toolbar" style={{ display: "None" }}></div>
);
class Editor extends Component<
    { placeholder?: string },
    { editorHtml: string }
> {
    static modules = {
        toolbar: {
            container: "#toolbar",
            handlers: {
                //insertStar: insertStar
            },
        },
        clipboard: {
            matchVisual: false,
        },
    };

    static formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
    ];
}

type propsType = Readonly<{
    onClose: () => void;
    updatePost: () => void;
    mbtiColorNotice: string;
    mbtiColorButton: string;
    setNewDiary: (data: Diary) => void;
}>;

export default function PostEditor(props: propsType): ReactElement {
    const userData = useContext(userDataContext);
    // text editor
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [save, setSave] = useState(false);

    const {
        onClose,
        updatePost,
        mbtiColorNotice,
        mbtiColorButton,
        setNewDiary,
    } = props;

    const Close = () => {
        onClose();
        if (save === false) {
            setContent("");
            setTitle("");
        }
    };

    useEffect(() => {}, []);

    const handleContentChange = (value: any, delta: any) => {
        setContent(value);
    };

    const onSubmit = async () => {
        const uid = userData?.uid;
        if (uid) {
            const diary: Diary = {
                title: title,
                content: content,
            };
            try {
                const postedDiary = await postDiary(diary, uid);
                if (postedDiary) setNewDiary(postedDiary);
                Close();
                const interval = setInterval(async () => {
                    const updatedDiary = await getDiary(postedDiary?.id || 1);
                    if (updatedDiary.ai_feedback != "") {
                        clearInterval(interval);
                    }
                }, 3000);
            } catch (error) {
                console.error("Error while posting diary:", error);
            }
            updatePost();
            updatePost();
        } else {
        }
        setContent("");
        setTitle("");
    };

    const Save = async () => {
        setSave(true);
    };

    return (
        <>
            <div className="window">
                <div id="postEditor">
                    <button className="btn close-btn" onClick={Close}>
                        <RxCross2 />
                    </button>
                    <div className="text-editor">
                        <input
                            type="text"
                            placeholder="標題｜少於20字"
                            className="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <ReactQuill
                            placeholder=""
                            modules={Editor.modules}
                            formats={Editor.formats}
                            value={content}
                            onChange={handleContentChange}
                            theme={"snow"} // 设置为 "snow" 使用默认主题
                        />
                        <CustomToolbar />
                        <div className="bottom">
                            <button className="save" onClick={Save}>
                                Save
                            </button>
                            <button
                                className="post"
                                style={{ backgroundColor: mbtiColorNotice }}
                                onClick={onSubmit}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
