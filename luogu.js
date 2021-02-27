#!/usr/bin/env node
const cheerio = require('cheerio');
let request=require('request-promise');
const fs = require('fs');


global.config = require('./config.json');

const luogu = require('commander');

global.data = {
    get user(){
        if(!isFileExist(__dirname+'/user.json')){
            return {}
        }
        return JSON.parse(fs.readFileSync(__dirname+'/user.json'));
    },
    set user(obj){
        fs.writeFileSync(__dirname+'/user.json',JSON.stringify(obj));
    }
}

global.getCSRFToken=async function(){
    return new Promise(async (resolve,reject)=>{
        let html=await request({
            url:config['luogu-domain'],
            timeout:1500,
            jar:await makeJar()
        });
        let $ = cheerio.load(html);
        let chapters = $('meta');
        chapters.each(function(item){
            if($(this).attr('name') == 'csrf-token'){
                resolve($(this).attr('content'));
            }
        });
        reject('csrf-token not found');
    });
}

global.isFileExist=function(filename) {
    return fs.existsSync(filename);
}



global.makeJar=function(){
    let tough = require('tough-cookie');
    let uidCookie = new tough.Cookie({
        key:"_uid",
        value: `${data.user.uid}`,
        value:`${data.user.uid}`,
        domain: ".luogu.com.cn",
        httpOnly: true
    });
    let clientidCookie = new tough.Cookie({
        key:"__client_id",
        value: `${data.user.clientid}`,
        domain: ".luogu.com.cn",
        httpOnly: true
    });
    var jar = request.jar();
    jar.setCookie(`_uid=${data.user.uid};`,'https://www.luogu.com.cn');
    jar.setCookie(`__client_id=${data.user.clientid}`,'https://www.luogu.com.cn');
    return jar;
}

global.checkTokenStatus=async function(){
    if(data.user.uid == undefined)return false;
    try{
        let json=await request({
            uri:config['luogu-domain']+'auth/unlock',
            timeout:1500,
            headers:{
                'referer':config['luogu-domain']+'auth/unlock',
                'x-luogu-type':'content-only'
            },
            json:true,
            jar:makeJar()
        });
        if(json.code == 200 && json.currentData.mode != undefined)return true;
        return false;
    }catch(e){
        return false;
    }
}

luogu.version(require('./package.json').version);

require('./auth')(luogu);
require('./problem')(luogu);
require('./benben')(luogu);

luogu.parse(process.argv); 