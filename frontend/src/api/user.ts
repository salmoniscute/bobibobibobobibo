import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User , SignUpUser } from "../schemas/user"

let access_token = "";
let refresh_token = "";

export async function login(username: string, password: string): Promise<User> {
    let url = "http://localhost:8080/auth/login";
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

export async function signUp(user:SignUpUser):Promise<Boolean>{
    let url = "http://localhost:8080/user";
    try {
        const response = await axios.post(url,user);
        return true
    }
    catch {  
        //return ;
    }

    return false;
}
 
 
export async function getUser(uid:string): Promise<User| null>{
    let url = "http://localhost:8080/user/" + uid;
    
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
    let url = "http://localhost:8080/auth/refresh";
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

export async function updateUser(uid:string): Promise<User| null>{
    let url = "http://localhost:8080/user/" + uid;
    
    try {
        const response = await axios.put(url,);
        return response.data;
    }
    catch {  
        
        //return ;
    }
    return null ; 
}
