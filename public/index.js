let timeout;

window.addEventListener('load', function(){
	loadchat();
	if(window.sessionStorage.getItem("username")){
		document.getElementById('username').innerText = window.sessionStorage.getItem("username");	
	}else{
		let username = prompt("What's your username");
		window.sessionStorage.setItem("username", username);
		document.getElementById('username').innerText = window.sessionStorage.getItem("username");
	}
	timeout = setInterval(update, 5000);
});

function logout(){
	window.sessionStorage.removeItem("username");
	clearTimeout(timeout);
	let child = document.getElementsByTagName('body')[0].lastElementChild;
	while(child){
		document.getElementsByTagName('body')[0].removeChild(child);		
		child = document.getElementsByTagName('body')[0].lastElementChild;
	}
}

function loadchat(){
	$.post('http://localhost:3001/loadchats', {
		
    }, (data)=>{
		console.log(data);
		if(data.length != 0){
			data.forEach(data => {
				console.log('loadchats'+data);
				render(data.username, data.chat);
			});
		}
	});
}

function send(){
	let chat = document.getElementById('chatinput').value;
	if(chat.trim() != ''){
		let username = document.getElementById('username').innerText;
		$.post('http://localhost:3001/', {
			username: username,
			chat: chat,
		}, (data)=>{
			console.log('send'+username+'	'+chat);
			render(username, chat);
			document.getElementById('chatinput').value = '';
		});
	}
}

function update(){
	//Get the last chat to checck whether there are any new ones
	let lastnum = document.getElementsByClassName('divContainer').length; 

	$.post('http://localhost:3001/update', {
		msgNum: lastnum
    }, (data)=>{
		if(data.length != 0){
			data.forEach(data => {
				render(data.username, data.chat);
			});
		}
		console.log(data);
	});
}

function render(username, chat){
	let myusername = document.getElementById('username').innerText;
	console.log('render');
	let div = document.createElement('div');
	div.className = 'divContainer';
	let userdiv = document.createElement('div');
	
	userdiv.className = myusername==username?'userDiv me':'userDiv';
	userdiv.innerText = username;
	let chatdiv = document.createElement('div');
	chatdiv.className = myusername==username?'chatDiv me':'chatDiv';
	chatdiv.innerText = chat;
	div.append(userdiv);
	div.append(chatdiv);
	document.getElementById('chats').append(div);
}

