


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  

window.addEventListener('DOMContentLoaded', async()=>{
    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log(decodedtoken)
    const userName = decodedtoken.name

   const activateusers = async()=>{
    const activeusers = await axios.get('http://localhost:3000/get/activeusers')
    console.log(activeusers)
    
    const active = activeusers.data.activeusers
    console.log(active)
    for(var i =0; i<active.length; i++){
    const user = document.getElementById('users')
    const li = document.createElement('li')
    li.textContent = `${active[i].Name} has joined`
    user.appendChild(li)
    }
   }
    


   const updateactiveusers = async()=>{
    const updateactive = await axios.put(`http://localhost:3000/user/active/${decodedtoken.id}`)
      if(updateactive.status === 201){
        ShowMessagesOnScreen()
      }

   }

//    const updateChatMessages = async () => {
//     const allmessagesofpartiuser = await axios.get('http://localhost:3000/user/getmessage', { headers: { "Authorization": token } });
//     const data = allmessagesofpartiuser.data.retrievedvalue;
//     console.log('Response from getmessage API:', data);

//     // Update the chat messages on the screen
//     const user = document.getElementById('chats');
//     user.innerHTML = ''; // Clear previous messages

//     for (var i = 0; i < data.length; i++) {
//         const li = document.createElement('li');
//         li.textContent = `${data[i].message}`;
//         user.appendChild(li);
//     }
// };

// Call functions on initial load
//await activateusers();
await updateactiveusers();
await activateusers();

//await updateChatMessages();

// Set up a timeout to update the chat messages every second
// setInterval(async () => {
//     await updateactiveusers();
//     await updateChatMessages();
// }, 1000);
      
})


async function sendmessage(event){

    event.preventDefault();

    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    console.log("messageoutcome",message)


    const token = localStorage.getItem('token')
    const decodedtoken = parseJwt(token)
    console.log(decodedtoken)
    const userName = decodedtoken.name

    const content = {
        message:message
    }


    const response = await axios.post('http://localhost:3000/user/message', content,  { headers: { "Authorization": token } })
    console.log("*",response.data.Name)

    const chatcontainer = document.getElementById('chats')
    const li = document.createElement('li')
    li.textContent = response.data.Name
    chatcontainer.appendChild(li)

    event.target.reset();
}




async function ShowMessagesOnScreen(){
    const token = localStorage.getItem('token')
    const localstoragedata = JSON.parse(localStorage.getItem('chatMessages')) || [];
    console.log('localstoragedata:',localstoragedata)
    const lastMessageId = localStorage.getItem('lastMessageId') || 0;
    console.log('lastMessageId:',lastMessageId)

    const databasedata = await axios.get(`http://localhost:3000/server/messages?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token } })
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


     ShowMergeMessageOnScreen(mergedData)
      StoreMergeMessageOnLS(mergedData,lastMessageId)
}

}

function ShowMergeMessageOnScreen(mergedData){
    console.log("under ShowMergeMessageOnScreen function")
    for(var i =0; i<mergedData.length; i++){
            const user = document.getElementById('chats')
        const li = document.createElement('li')
        li.textContent = `${mergedData[i].message}`
        user.appendChild(li)
        }
}

function StoreMergeMessageOnLS(mergedData,lastMessageId){
    localStorage.setItem('chatMessages', JSON.stringify(mergedData));
    localStorage.setItem('lastMessageId',lastMessageId)
}

const LogOut = document.getElementById('logout');
    LogOut.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const update = await axios.put('http://localhost:3000/update',null, { headers: { "Authorization": token } })

    if(update.data.message === 'success'){
        window.location.href = '../Login/login.html'
    }

})
