const express = require("express");
const bodyParser = require('body-parser');
const server = express();
const fs = require('fs');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

//Static files
server.use(express.static('public'));
server.use('/', express.static(__dirname+'public'));

//Set Views
server.set('views', './views');
server.set('view engine', 'ejs');

server.get('', (req, res)=>{
    res.render('index');
});

server.post('', (req, res)=> {
    let chat = req.body.chat;
    let user = req.body.username;
    let data = "<<"+user+">>\n"+chat+"\n";

    fs.appendFileSync('index.txt', data);
    res.send('');
});

server.post('/loadchats', async (req, res)=> {
    let data = fs.readFileSync('index.txt', 'utf-8');
    let datum = data.split('\n');
    let chats = []
    let username = null;
    let chat = '';

    await datum.forEach((line)=>{
        if(line.includes('<<') && line.includes('>>')){
            //If there is already a username you store the current username and chat info in an object and push to the array
            
            if(username!=null){
                chats.push({username: username, chat: chat});
                chat='';
            }
            username = line.substring(2, line.indexOf('>'));
        }else{
            chat+=line+'\n';
        }

        if(datum[datum.length-1] == line){
            if(username!=null){
                chats.push({username: username, chat: chat});
            }
            res.send(chats);
        }
    });
});

server.post('/update', async (req, res)=> {
    let msgNum = req.body.msgNum;
    let data = fs.readFileSync('index.txt', 'utf-8');
    let datum = data.split('\n');
    let chats = []
    let username = null;
    let chat = '';
    let counter = 0;

    await datum.forEach((line)=>{
        if(line.includes('<<') && line.includes('>>')){
            //If there is already a username you store the current username and chat info in an object and push to the array
            if(username!=null){
                if(counter>=msgNum){
                    chats.push({username: username, chat: chat});
                    console.log(username+' '+chat);
                    chat = '';
                }
                counter++;
            }
            username = line.substring(2, line.indexOf('>'));
        }else{
            if(counter>=msgNum){
                chat+=line+'\n';
            }
            
        }

        if(datum[datum.length-1] == line){
            if(counter>=msgNum && username!=null){
                chats.push({username: username, chat: chat});
            }
            res.send(chats);
        }
    });
});

server.listen('3001', (req, res)=>{
    console.log('Server running...');
});