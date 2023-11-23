const ismemberChecked = false;

window.addEventListener('DOMContentLoaded', async()=>{

const AllGroups = document.getElementById('AllGroups');

    try {
      const token = localStorage.getItem('token')
        const groups = await axios.get('http://localhost:3000/group/AllMembers',{headers: { "Authorization": token}});
        const groupMembers = groups.data.Members;
        console.log("groupmembers=", groupMembers)
        
        const GroupContainer = document.getElementById('AllMembersContainer');

  
        GroupContainer.innerHTML = '';

        groupMembers.forEach((member) => {
        
            const groupNameElement = document.createElement('div');
            groupNameElement.textContent = `Group: ${member.groupName} (ID: ${member.id})`;
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
              window.location.href = '../CreateGroup/CreateGroup.html';

            })

            GroupContainer.appendChild(groupNameElement);
            GroupContainer.appendChild(deleteButton)
            GroupContainer.append(addRemoveButton)
          
             
            // const id = localStorage.getItem('SelectedGroupId')
            // const Name = localStorage.getItem('SelectedGroupName')
            // if(Name){
            // IsMember(id, Name)
            // }
           // ShowUserChatsOnScreen()
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
   const result = await axios.get(`http://localhost:3000/Group/IsMember/${groupId}`,{ headers: { "Authorization": token } } )
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


async function sendmessage(event){

  event.preventDefault();

  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  console.log("messageoutcome",message)


  const groupId = localStorage.getItem('SelectedGroupId')
  const token = localStorage.getItem('token')

  const content = {
      message:message,
      groupId:groupId
  }


  const response = await axios.post('http://localhost:3000/group/chats', content, {headers:{'Authorization':token}})
  console.log( "data",response.data.RetrievedData)

  const chatcontainer = document.getElementById('chats')
  const li = document.createElement('li')
  li.textContent = response.data.RetrievedData.Chats
  chatcontainer.appendChild(li)

  event.target.reset();
}


async function ShowUserChatsOnScreen(id){
  const token = localStorage.getItem('token')
  const groupId = id
  const groupdata = await axios.get(`http://localhost:3000/particulargroup/chats/${id}`,{headers:{'Authorization':token}})
      console.log(groupdata.data)
      const data = groupdata.data.RetrievedData
     const Name = groupdata.data.Name


  const chatcontainer = document.getElementById('chats')
  chatcontainer.innerHTML = "";
  data.forEach((Chat)=>{
    const li = document.createElement('li')
    li.textContent = Chat.Chats
    chatcontainer.appendChild(li)
  
  })

}
async function ShowMessagesOnScreen(groupId){
  const token = localStorage.getItem('token')
  const localstoragedata = JSON.parse(localStorage.getItem('GroupMessages')) || [];
  console.log('localstoragedata:',localstoragedata)
  const lastMessageId = localStorage.getItem('lastGroupMessageId') || 0;
  console.log('lastMessageId:',lastMessageId)

  const databasedata = await axios.get(`http://localhost:3000/server/Groupmessages/${groupId}?lastMessageId=${lastMessageId}`, { headers: { "Authorization": token } })
  
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
   const isAdmin = await axios.get(`http://localhost:3000/check/isAdmin/${groupId}`, { headers: { "Authorization": token } })
   console.log("isAdminData",isAdmin)
   if(isAdmin.data.Admin == true){
    alert('Deleted Sucessfully')
    window.location.href = './AllGroup.html';
   }else{
    alert('Only Admin Can Delete Group')
   }
}
