const express = require("express");
const bodyParser = require('body-parser');
const server = express();
const fs = require('fs');

server.use(express.json());
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

server.post('/send', (req, res)=> {
    let chat = req.body.chat;
    let user = req.body.username;
    let data = "<<"+user+">>\n"+chat+"\n";

    fs.appendFileSync('index.txt', data);
    res.send('');
});

server.get('/loadchats', async (req, res)=> {
    let data = fs.readFileSync('index.txt', 'utf-8');
    let datum = data.split('\n');
    let chats = []
    let username = null;
    let chat = '';
    for(let i=0; i<datum.length; i++){
        if(datum[i].includes('<<') && datum[i].includes('>>')){
            //If there is already a username you store the current username and chat info in an object and push to the array
            
            if(username!=null){
                chats.push({username: username, chat: chat});
                chat= '';
            }
            username = datum[i].substring(2, datum[i].indexOf('>'));
        }else{
            chat+= datum[i]+'\n';
        }

        if(i==datum.length-1 && username!=null){
            chats.push({username: username, chat: chat});
            await res.send(chats);
        }
    }
    
    return;
});

server.post('/update', async (req, res)=> {
    let msgNum = req.body.msgNum;
    let data = fs.readFileSync('index.txt', 'utf-8');
    let datum = data.split('\n');
    let chats = []
    let username = null;
    let chat = '';
    let counter = 0;
    for(let i=0; i<datum.length; i++){
        if(datum[i].includes('<<') && datum[i].includes('>>')){
            //If there is already a username you store the current username and chat info in an object and push to the array
            if(username!=null){
                if(counter>=msgNum){
                    chats.push({username: username, chat: chat});
                    chat = '';
                }
                counter++;
            }
            username = datum[i].substring(2, datum[i].indexOf('>'));
        }else{
            if(counter>=msgNum){
                chat+=datum[i]+'\n';
            }
            
        }

        if(i==datum.length-1){
            if(counter>=msgNum && username!=null){
                chats.push({username: username, chat: chat});
            }

            await res.send(chats);
        }
    }

    return;
});

server.listen('3001', (req, res)=>{
    console.log('Server running...');
});