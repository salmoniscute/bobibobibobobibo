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
import { login, refreshToken } from "../../api/user";
import { User } from "../../schemas/user";

type propsType = Readonly<{
    setRefreshToken: Dispatch<SetStateAction<string>>;
}>;

export default function LoginPage(props: propsType): ReactElement {
    const { setRefreshToken } = props;
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User>();
    const navigate = useNavigate();

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
        <div id="loginPage">
            <p>Login Page</p>
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
            </div>
            <div className="loginButton" onClick={handleLogin}>
                <p>Login</p>
            </div>
        </div>
    );
}
