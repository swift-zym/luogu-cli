#!/usr/bin/env node
const config = require('./config.json');
const luogu = require('commander');
const cheerio = require('cheerio');

async function getCSRFToken(){
    let request=require('request-promise');
    let html=await request({
        url:config['luogu-domain'],
        timeout:1500
    });
    let $ = cheerio.load(html);
    let chapters = $('meta');
    chapters.each(function(item){
        if($(this).attr('name') == 'csrf-token'){
            return $(this).attr('content');
        }
    });
}

luogu.version(require('./package.json').version);
luogu
    .command('auth <command>')
    .description('login')
    .action(async function(command){
        if(command=="login"){
            await getCSRFToken();
        }
        else if(command=="logout"){
            
        }
        else{
            console.log("command not found,try --help");
        }
    })
luogu.parse(process.argv); 