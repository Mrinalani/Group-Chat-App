function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


const ismemberChecked = false;

const socket = io();

window.addEventListener('DOMContentLoaded', async()=>{

const AllGroups = document.getElementById('AllGroups');

    try {
      const token = localStorage.getItem('token')
        const groups = await axios.get('http://13.49.249.217:3000/group/AllMembers',{headers: { "Authorization": token}});
        const groupMembers = groups.data.Members;
        console.log("groupmembers=", groupMembers)
        
        const GroupContainer = document.getElementById('AllMembersContainer');

  
        GroupContainer.innerHTML = '';

        groupMembers.forEach((member) => {
        
            const groupNameElement = document.createElement('div');
            groupNameElement.textContent = `Group:  ${member.groupName} `;
            groupNameElement.style.cursor = 'pointer';
            groupNameElement.style.color = 'blue'; 
           
            const deleteButton = document.createElement('button');
             deleteButton.textContent = 'Delete Group';
             deleteButton.style.marginLeft = '10px'; 
             deleteButton.style.color = 'red'; 

             const addRemoveButton = document.createElement('button')
             addRemoveButton.textContent = 'Add & Remove Participants'
             addRemoveButton.style.marginLeft = '10px'; 
             addRemoveButton.style.color = 'red'; 


            groupNameElement.addEventListener('click', () => {
                IsMember(member.id, member.groupName)
            });

            deleteButton.addEventListener('click',()=>{
                userIsAdmin(member.id)
            })

            addRemoveButton.addEventListener('click',()=>{
             const setgroupId = localStorage.setItem('groupId',member.id)
              console.log("id under addRemoveButton is",setgroupId )
              window.location.href = '../CreateGroup/Creategroup.html';

            })

            GroupContainer.appendChild(groupNameElement);
            GroupContainer.appendChild(deleteButton)
            GroupContainer.append(addRemoveButton)
          
        });
    } catch (error) {
        console.error(error);
        // Handle error
     }
  });
//})

async function IsMember(groupId, Name) {
    try{
    const token = localStorage.getItem('token')
   const result = await axios.get(`http://13.49.249.217:3000/Group/IsMember/${groupId}`,{ headers: { "Authorization": token } } )
   console.log("isMemberResult = ", result)

   if(result.data.isMember === true){

    // const SelectedGroup = localStorage.setItem('SelectedGroupId',groupId)
    // const selectedGroupName = localStorage.setItem('SelectedGroupName',Name)

    const groupNames = result.data.groupMembers;
   const groupNamesArray = groupNames.map(group => group.Name);
const groupNamesString = groupNamesArray.join(', ');


     const usercontainer  = document.getElementById('usersContainer') 
     usercontainer.innerHTML = ""
     const para = document.createElement('p');
     para.textContent = `${Name}: ${groupNamesString}`;
     
     // Append the paragraph to the container
     usercontainer.appendChild(para);
     ShowUserChatsOnScreen(groupId)
    //ShowMessagesOnScreen(groupId)
    const SelectedGroup = localStorage.setItem('SelectedGroupId',groupId)
    const selectedGroupName = localStorage.setItem('SelectedGroupName',Name)
   }else{
    alert("Only group Members can chat in this group")
    // const SelectedGroup = localStorage.setItem('SelectedGroupId',"")
    // const selectedGroupName = localStorage.setItem('SelectedGroupName',"")
   }
}catch(err){
    console.log(err)
  }
}
socket.on('group-chat-message',(content)=>{
      groupChatmessages(content)
})


async function sendmessage(event){

  event.preventDefault();
  const token = localStorage.getItem('token')
  const decodedtoken = parseJwt(token)
  console.log(decodedtoken)
  const userName = decodedtoken.name

  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  console.log("messageoutcome",message)


  const groupId = localStorage.getItem('SelectedGroupId')

  const content = {
      message:message,
      groupId:groupId,
      Name:userName,
  }
  socket.emit('groupMessage', content)

  const response = await axios.post('http://13.49.249.217:3000/group/chats', content, {headers:{'Authorization':token}})
  console.log( "data",response.data.RetrievedData)
}
  

async function groupChatmessages(userdata){

  const token = localStorage.getItem('token')
  const decodedtoken = parseJwt(token)
  const userName = decodedtoken.name

  console.log('%%%%%%%%%%%%%%%%%%%%%%:', userdata)

  const chatcontainer = document.getElementById('chats')
  const li = document.createElement('p')

  const isImage =userdata.message.startsWith('https://appexpensetracking.s3.amazonaws.com/')

  if (isImage) {
    if (userName === userdata.Name) {
        li.innerHTML = `You: <img src="${userdata.message}" alt="${userName}'s Image" style="width:20vw;height:auto">`
    } else {
        li.innerHTML = `${userdata.Name}: <img src="${userdata.message}" alt="${userdata.Name}'s Image" style="width:20vw;height:auto">`
    }
}else{
  if(userdata.Name === userName){
    li.style.textAlign = 'left';
  li.textContent = `you: ${userdata.message}`
  }else{
    li.style.textAlign = 'right';
    li.textContent = `${userdata.Name}: ${userdata.message}`
  }
}
  chatcontainer.appendChild(li)

  const messageInput = document.getElementById('messageInput');
  scrollToBottom()
  messageInput.value = '';
}



async function ShowUserChatsOnScreen(id){
  const token = localStorage.getItem('token')
  const decodedtoken = parseJwt(token)
  console.log(decodedtoken)
  const userName = decodedtoken.name

  const groupdata = await axios.get(`http://13.49.249.217:3000/particulargroup/chats/${id}`,{headers:{'Authorization':token}})
      console.log("checking@@@@@",groupdata.data)
      const data = groupdata.data.RetrievedData

  const chatcontainer = document.getElementById('chats')
  chatcontainer.innerHTML = "";
  data.forEach((Chat)=>{
    const li = document.createElement('p')

    const isImage =Chat.Chats.startsWith('https://appexpensetracking.s3.amazonaws.com/')

  if (isImage) {
    if (userName === Chat.userName) {
        li.innerHTML = `You: <img src="${Chat.Chats}" alt="${userName}'s Image" style="width:20vw;height:auto">`
    } else {
        li.innerHTML = `${Chat.userName}: <img src="${Chat.Chats}" alt="${Chat.userName}'s Image" style="width:20vw;height:auto">`
    }
}else{
    if(Chat.userName===userName){
      li.style.textAlign = 'left';
      li.textContent = `you: ${Chat.Chats}`
    }else{
      li.style.textAlign = 'right';
      li.textContent = `${Chat.userName}: ${Chat.Chats}`
    }
  }
    chatcontainer.appendChild(li)
  
  })

}
async function ShowMessagesOnScreen(groupId){
  const token = localStorage.getItem('token')
  const localstoragedata = JSON.parse(localStorage.getItem('GroupMessages')) || [];
  console.log('localstoragedata:',localstoragedata)
  const lastMessageId = localStorage.getItem('lastGroupMessageId') || 0;
  console.log('lastMessageId:',lastMessageId)

  const databasedata = await axios.get(`http://13.49.249.217:3000/server/Groupmessages/${groupId}?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token } })
  
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
  console.log("length", mergedData.length)
  console.log("under ShowMergeMessageOnScreen function")
  const user = document.getElementById('chats')
  user.textContent = ""
  for(var i =0; i<mergedData.length; i++){
        //  const user = document.getElementById('chats')
      const li = document.createElement('li')
      li.textContent = `${mergedData[i].Chats}`
      user.appendChild(li)
      }
}

function StoreMergeMessageOnLS(mergedData,lastMessageId){
  localStorage.setItem('GroupMessages', JSON.stringify(mergedData));
  localStorage.setItem('lastGroupMessageId',lastMessageId)
}



async function userIsAdmin(groupId){
  const token = localStorage.getItem('token')
   const isAdmin = await axios.get(`http://13.49.249.217:3000/check/isAdmin/${groupId}`, { headers: { "Authorization": token } })
   console.log("isAdminData",isAdmin)
   if(isAdmin.data.Admin == true){
    alert('Deleted Sucessfully')
    window.location.href = './AllGroup.html';
   }else{
    alert('Only Admin Can Delete Group')
   }
}

function scrollToBottom(){
  const chatcontainer = document.getElementById('chatContainer')
  chatcontainer.scrollTo(0,chatcontainer.scrollHeight)
}


async function uploadFile(event){
  event.preventDefault();
  const token = localStorage.getItem('token')
  const groupId = localStorage.getItem('SelectedGroupId')


  const fileInput = document.querySelector('#fileInput')
  const uploadedFile = fileInput.files[0];
  console.log('////////////////////////// ', uploadedFile)

  if (!uploadedFile) {
      alert('No file selected')
      return
  }

  const formData = new FormData()
  formData.append('groupId', groupId)
  formData.append('file', uploadedFile)
   console.log('///////////////////////// ', formData)

   const data =  await axios.post('http://13.49.249.217:3000/groupchat/add-file', formData, {headers: {
      'Authorization': token,
      'Content-Type': 'multipart/form-data'
  }
})
 console.log('00000000000000000000000', data.data)
const content = {
  message:data.data.message,
  groupId:data.data.groupId,
  Name:data.data.userName,
}
socket.emit('groupMessage', content)


    
}
