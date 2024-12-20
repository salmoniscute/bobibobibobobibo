import axios from "axios";
import { Diary } from "../schemas/diary"

export async function getDiaryList(uid:string | null): Promise<Array<Diary>>{
    let url = "http://localhost:8080/diary?uid="+uid;
    
    try {
        const response = await axios.get(url,);
        return response.data;
    }
    catch {  
        
        return [];
    }
}

export async function getDiary(id:number): Promise<Diary>{
    let url = "http://localhost:8080/diary/" + id;
    let diary;
    try {
        const response = await axios.get(url,);
        diary = response.data;
    }
    catch {  
        
        //return ;
    }
    return diary ; 
}

export async function postDiary(diary:Diary , uid:string){
    let url = "http://localhost:8080/diary?uid="+uid;
    try {
        const response = await axios.post(url,diary);
    }
    catch(error) {  
        
    }
    return;
}
