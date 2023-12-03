

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  const socket = io();


window.addEventListener('DOMContentLoaded', async()=>{

await updateactiveusers();
await activateusers();

      
})

const activateusers = async()=>{
const activeusers = await axios.get('http://13.49.249.217:3000/get/activeusers')
console.log(activeusers)
const user = document.getElementById('users')
user.innerHTML = '';
const active = activeusers.data.activeusers
console.log(active)
for(var i =0; i<active.length; i++){
const li = document.createElement('li')
li.textContent = `${active[i].Name} has joined`
user.appendChild(li)
}
console.log('33333333333333333333')

}


const updateactiveusers = async()=>{
    const token = localStorage.getItem('token')
const decodedtoken = parseJwt(token)
console.log(decodedtoken)
const userName = decodedtoken.name

const updateactive = await axios.put(`http://13.49.249.217:3000/user/active/${decodedtoken.id}`)
  if(updateactive.status === 201){
    ShowMessagesOnScreen()
  }
  console.log('22222222222222222222')

}

socket.on('new-user', async (data) => {
    console.log(data)
     await updateactiveusers();
     await activateusers();
});

// socket.on('remove-user', async(data)=>{
//     console.log('AAAAAAAAAAAAA')
//     const token = localStorage.getItem('token')
//     const decodedtoken = parseJwt(token)
//     const userId = decodedtoken.id
//     const obj = {
//         userId: userId
//     }
//     socket.emit('loggedUser',obj )
// })

// socket.on('removing',async(obj)=>{
//     console.log('bbbbbbbbbbb',obj)

//     await logoutUserFromDB(obj)
//     await updateactiveusers();
//     await activateusers();
// })

socket.on('chat-message',(data)=>{
    console.log('++++++++++++++++')
    chatMessages(data)

})



async function sendmessage(event){
    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA",decodedtoken)
    const userName = decodedtoken.name

    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    const contents = {
        Name:userName,
        Message:message
    }

    event.preventDefault();

    socket.emit('message',contents)

    const content = {
        message:message
    }

    const response = await axios.post('http://13.49.249.217:3000/user/message', content,  { headers: { "Authorization": token } })
    console.log("*",response.data)

}


async function chatMessages(userdata){
    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA",decodedtoken)
    const userName = decodedtoken.name

      console.log('~~~~~~~~~~~~~', userdata)
    const chatcontainer = document.getElementById('chats')
  const li = document.createElement('p')
  const isImage =userdata.Message.startsWith('https://appexpensetracking.s3.amazonaws.com/')

  if (isImage) {
    if (userName === userdata.Name) {
        li.innerHTML = `You: <img src="${userdata.Message}" alt="${userName}'s Image" style="width:20vw;height:auto">`
    } else {
        li.innerHTML = `${userdata.Name}: <img src="${userdata.Message}" alt="${userdata.Name}'s Image" style="width:20vw;height:auto">`
    }
}else{
  if(userName === userdata.Name){
    li.style.textAlign = 'left';
  li.textContent = `you: ${userdata.Message}`
  }else{
    li.style.textAlign = 'right';
    li.textContent = `${userdata.Name}: ${userdata.Message}`
  }
}
  chatcontainer.appendChild(li)
  scrollToBottom()

    messageInput.value = '';
}




async function ShowMessagesOnScreen(){
    const token = localStorage.getItem('token')
    const localstoragedata = JSON.parse(localStorage.getItem('chatMessages')) || [];
    console.log('localstoragedata:',localstoragedata)
    const lastMessageId = localStorage.getItem('lastMessageId') || 0;
    console.log('lastMessageId:',lastMessageId)

    const databasedata = await axios.get(`http://13.49.249.217:3000/server/messages?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token } })
    console.log('databasedata:',databasedata)

    const newmessages = databasedata.data.message
    console.log('newmessages:',newmessages)

    
    let mergedData = [...localstoragedata, ...newmessages];
    console.log('mergedData:',mergedData)


     const maxMessages = 10;
     const startindex = Math.max(0, mergedData.length-maxMessages)
     console.log('startindex:',startindex)

     
      if (startindex >= 0 ) {
      mergedData = mergedData.slice(startindex);
      console.log('mergedData:',mergedData)


      const lastMessageId = mergedData[mergedData.length-1].id
      console.log('lastMessageId:',lastMessageId)

     console.log('checkingmergedData:',mergedData)
     ShowMergeMessageOnScreen(mergedData)
      StoreMergeMessageOnLS(mergedData,lastMessageId)
}

}

function ShowMergeMessageOnScreen(mergedData){
    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log(decodedtoken)
    const userName = decodedtoken.name

    const user = document.getElementById('chats')
    user.innerHTML = ''
    
    console.log("under ShowMergeMessageOnScreen function")
    console.log(mergedData)
    for(var i =0; i<mergedData.length; i++){
        const li = document.createElement('p')

        const isImage =mergedData[i].message.startsWith('https://appexpensetracking.s3.amazonaws.com/')

  if (isImage) {
    if (userName === mergedData[i].userName) {
        li.innerHTML = `You: <img src="${mergedData[i].message}" alt="${userName}'s Image" style="width:20vw;height:auto">`
    } else {
        li.innerHTML = `${mergedData[i].userName}: <img src="${mergedData[i].message}" alt="${mergedData[i].userName}'s Image" style="width:20vw;height:auto">`
    }
}else{
        if(mergedData[i].userName === userName){
            li.style.textAlign = 'left';
            li.textContent = `you: ${mergedData[i].message}`
        }else{
            li.style.textAlign = 'right';
            li.textContent = `${mergedData[i].userName}: ${mergedData[i].message}`
        }
    }
        user.appendChild(li)
        }
}

function StoreMergeMessageOnLS(mergedData,lastMessageId){
    localStorage.setItem('chatMessages', JSON.stringify(mergedData));
    localStorage.setItem('lastMessageId',lastMessageId)
}


const LogOut = document.getElementById('logout');
    LogOut.addEventListener('click', async () => {
    
        const token = localStorage.getItem('token')
        const decodedtoken = parseJwt(token)
        const userId = decodedtoken.id
        const obj = {
            userId: userId
        }
    
       const update =  await logoutUserFromDB(obj)
       console.log('+++++++++++++', update)

        // if(update.data.message === 'success'){
            alert("user logged Out Successfully")
            window.location.href = '../Login/login.html'
        // }

})

async function logoutUserFromDB(obj){
    console.log('inside logout DB')
    const token = localStorage.getItem('token');
    const update = await axios.put('http://13.49.249.217:3000/update',obj, { headers: { "Authorization": token } })
    console.log('>>>>>>>>>>>>>>>',update)
    console.log('111111111111111')
}


function scrollToBottom(){
    const chatcontainer = document.getElementById('chatContainer')
    chatcontainer.scrollTo(0,chatcontainer.scrollHeight)
}


function usersScrollToBottom(){
    const usersContainer = document.getElementById('usersContainer')
    usersContainer.scrollTo(0,usersContainer.scrollHeight)
}

async function uploadFile(event){
    event.preventDefault();
    const token = localStorage.getItem('token')
    const fileInput = document.querySelector('#fileInput')
    const uploadedFile = fileInput.files[0];
    console.log('////////////////////////// ', uploadedFile)

    if (!uploadedFile) {
        alert('No file selected')
        return
    }

    const formData = new FormData()
   // formData.append('groupId', groupId)
    formData.append('file', uploadedFile)
     console.log('///////////////////////// ', formData)

     const data =  await axios.post('http://13.49.249.217:3000/chat/add-file', formData, {headers: {
        'Authorization': token,
        'Content-Type': 'multipart/form-data'
    }
})
const contents = {
    Name:data.data.userName,
    Message:data.data.message
}

socket.emit('message',contents)


      
}





