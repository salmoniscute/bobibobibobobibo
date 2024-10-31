import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User } from "../schemas/user"

let access_token = "";
let refresh_token = "";

export async function login(username: string, password: string): Promise<User> {
    let url = "/auth/login";
    try {
        const response = await axios.post(url,"username="+username+"&password="+password);
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        
    }
    catch {  
        //return ;
    }

    return jwtDecode(access_token) as User;
}
 
export async function getUser(uid:string): Promise<User| null>{
    let url = "/user/" + uid;
    
    try {
        const response = await axios.get(url,);
        return response.data;
    }
    catch {  
        
        //return ;
    }
    return null ; 
}

export async function refreshToken(){
    let url = "/auth/refresh";
    try {
        const response = await axios.post(url,{
            "refresh_token":localStorage.getItem("refresh_token")
        });
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        return refresh_token
    }
    catch {  
        return "" ;
    }

}