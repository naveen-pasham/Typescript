
import  path from 'path';
const rootdir=require('../util/path');

exports.get404= (req:any, res:any)=>{
    res.status(404).sendFile(path.join(rootdir, 'views', '404.html'));
}
