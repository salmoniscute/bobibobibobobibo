import axios from "axios";
import { Diary } from "../schemas/diary"

export async function getUser(uid:string): Promise<Diary| null>{
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