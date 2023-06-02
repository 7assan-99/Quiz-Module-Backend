import { extname, join } from "path"
import * as fs from 'fs'
export const jsFileFilter = (req: any, file: any, callback: any)=>{
    if(!file.originalname.match(/\.(js)$/)){
        return callback(new Error('Only javascript files are allowed!'),false)
    }
    return callback(null,true)
}

export  const editFileName=(req,file,callback)=>{
    let path1 = join(process.cwd(), 'src/uploadedfiles','user-code-file', file.originalname).toString();
    let path2 = join(
      process.cwd(),
      'src/uploadedfiles',
      'test-cases',
      file.originalname,
    ).toString();
    let doesExist = fs.existsSync(path1) || fs.existsSync(path2)
    
    if (!doesExist) {
        
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
            .fill(null)
            .map(() => (Math.random() * 16).toString(16))
            .join('');
        if (file.originalname === 'code.js') {
            callback(null, `${name}-${randomName}.test${fileExtName}`);
        }
        else
            callback(null, `${name}-${randomName}${fileExtName}`);
        
    } else {
        callback(null, `${file.originalname}`);
    }
}