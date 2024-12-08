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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import "./index.scss";
import { login, refreshToken, signUp } from "../../api/user";
import { User, SignUpUser } from "../../schemas/user";

type propsType = Readonly<{
    setRefreshToken: Dispatch<SetStateAction<string>>;
}>;

export default function SignUpPage(props: propsType): ReactElement {
    const { setRefreshToken } = props;
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [mbti, setMbti] = useState("");
    const [user, setUser] = useState<User>();
    const navigate = useNavigate();

    const handleSignUp = async () => {
        const user: SignUpUser = {
            uid: userName,
            mbti: mbti,
            password: password,
        };
        const status = await signUp(user);
        if (status === true) {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        const user = await login(userName, password);
        console.log(user);
        if (localStorage.getItem("access_token") && user) {
            setUser(user);
            navigate("/");
        } else {
        }
    };
    return (
        <div id="signUpPage">
            <p>Sign Up Page</p>
            <div className="info">
                <p>User Name</p>
                <input
                    type="text"
                    className="loginInput"
                    placeholder="user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <p>Password</p>
                <input
                    type="password"
                    className="loginInput"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>Your Current MBTI</p>
                <input
                    type="text"
                    className="loginInput"
                    placeholder="Enter in Capital Letters"
                    value={mbti}
                    onChange={(e) => setMbti(e.target.value)}
                />
            </div>
            <div className="loginButton" onClick={handleSignUp}>
                <p>Sign Up</p>
            </div>
        </div>
    );
}
