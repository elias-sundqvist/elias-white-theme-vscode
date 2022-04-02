import { list } from 'recursive-readdir-async';
import editFile from 'edit-file'

(async ()=>{
    const files = await list("./themes")
    for(const file of files) {
        if(file.isDirectory) continue;
        editFile(file.fullname, text=>text)
    }
})()