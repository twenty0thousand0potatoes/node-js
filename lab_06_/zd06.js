import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { log } from 'console';
import path from 'path';

const IMG = path.join(path.resolve(), 'MyFile.png');

const fileStream = fs.createReadStream(IMG);

const formData = new FormData();
formData.append('file', fileStream);

axios({
    method: "POST",
    url: "http://127.0.0.1:5100/upload",
    headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    data: formData,
}).then(response=>{
log(response.data)
})