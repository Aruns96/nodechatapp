const log = document.getElementById("logout")

const socket = io(`http://localhost:3000`);

socket.on('common-message', () => {
  if (msgBtn.id == 0) {
      ShowCommonChats();
  }

})
socket.on('group-message', (groupId) => {
  if (msgBtn.id == groupId) {
      showGroupChats(groupId)
  }
})


log.addEventListener('click',logout);
function logout(){
   
    window.location.assign('login.html')
}
const formMsg = document.getElementById("message_form");
const msg = document.getElementById("flexInput");
const msgBtn = formMsg.querySelector('input[type="submit"]');
const fSwitch = document.getElementById("flexSwitch");
const fLabel = document.getElementById("flexSwitchLabel");
const fInput = document.getElementById("flexInput");

const grpName = document.getElementById("group_name");
const grpBody = document.getElementById("group_body");
const search = document.getElementById("search_bar");
const edit = document.getElementById("edit_status");

const createGrp =  document.getElementById("create_groupBtn");
const userList =  document.getElementById("user_list");
//const groupHead = document.getElementById("group_headContainer");
//const groupEdit = groupHead.querySelector('input[type="submit"]')
const modelSubmitBtn = document.getElementById("model_submibtn");
const modelHeading = document.getElementById("model_heading");
const modelCloseBtn = document.getElementById("modal_closeBtn");
const formGroup = document.getElementById("create_group_form");
const groupBody = document.getElementById("group_body");
const chatBody = document.getElementById("chatbody");
const chatContainer = document.getElementById("chat_container");
 
const groupEdit = group_headContainer.querySelector('input[type="submit"]');



fSwitch.addEventListener('change',()=>{
  console.log(fLabel)
  if(fLabel.innerText === "text"){
    fLabel.innerText = "image";
    fInput.setAttribute('accept','image/*');
    fInput.type="file"
  }else{
    fLabel.innerText = "text"
    fInput.removeAttribute('accept');
    fInput.type="text"
  }
})

msgBtn.addEventListener('click', SendMessage);
createGrp.addEventListener('click', showingAllUser)
groupEdit.addEventListener('click', showingGroupDetails)
search.addEventListener('keyup', searchUser);
modelSubmitBtn.addEventListener('click', createGroup)
group_body.addEventListener('click', showGroupChat)


async function SendMessage(e) {
  try {
   
    let token=localStorage.getItem('token')
      if (e.target && formMsg.checkVisibility()) {
          e.preventDefault();
          const groupId = e.target.id;
          console.log(groupId)
          if(fLabel.innerText === "text"){
           
              const data = {
                  message: msg.value,
                  GroupId: groupId
              }
            
              await axios.post('http://localhost:3000/chat/post-message', data,{headers:{Authorization:token}});
          }else{
              const file = msg.files[0];
             
              // if (file && file.type.startsWith('image/')){
              //     const formData = new FormData();
              //     formData.append('image', file);
              let formData;
              if(file){
                formData = new FormData();
                formData.append("image",file)
                  formData.append('GroupId',groupId);
                  console.log(file);
                  console.log(formData);
                  const imageResponse = await axios.post('http://localhost:3000/chat/post-image',formData,{headers:{Authorization:token}})
              }else{
                  alert('Please select a valid image file.');
              }              
          }           
          formMsg.reset();
          if (groupId == 0) {
              socket.emit('new-common-message')
              ShowCommonChats();

          } else {
              socket.emit('new-group-message', groupId)
              showGroupChats(groupId)
          }


      }
  } catch (error) {
      console.log(error);
      alert(error.response.data.message);
  }

}

async function showingAllUser() {
  try {
    let token=localStorage.getItem('token')
     userList.parentElement.classList.remove('d-none');
      const usersResponse = await axios.get('http://localhost:3000/chat/get-users',{headers:{Authorization:token}});
      userList.innerHTML = "";
      let text = ""
      const { users } = usersResponse.data;
      users.forEach((user) => {
          text += `                                    
      <li class="list-group-item  d-flex  justify-content-between">
          <div class="d-flex  align-items-center justify-content-between">
             
              <h6><strong class="mb-1">${user.name}</strong></h6>
          </div>
          <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
      </li>`
      })
      userList.innerHTML = text;


  } catch (error) {
      console.log(error);
      alert(error.response.data.message);
  }
}
async function showingGroupDetails(e) {
  try {
    
    let token=localStorage.getItem('token')
      const groupId = e.target.id
      userList.parentElement.classList.remove('d-none');
      const usersResponse = await axios.get('http://localhost:3000/chat/get-users',{headers:{Authorization:token}});
      const memberApi = await axios(`http://localhost:3000/group/get-group-members?groupId=${groupId}`);
      const groupMebers = memberApi.data.users;
      const idSet = new Set(groupMebers.map(item => item.id));
      userList.innerHTML = "";
      let text = ""
      const { users } = usersResponse.data;
      users.forEach((user) => {
          if (idSet.has(user.id)) {
              text += `                                    
              <li class="list-group-item  d-flex  justify-content-between">
                  <div class="d-flex  align-items-center justify-content-between">
                      
                      <h6><strong class="mb-1">${user.name}</strong></h6>
                  </div>
                  <input type="checkbox" class="form-check-inline" name="users" value="${user.id}" checked>
              </li>`
          } else {
              text += `                                    
              <li class="list-group-item  d-flex  justify-content-between">
                  <div class="d-flex  align-items-center justify-content-between">
                      
                      <h6><strong class="mb-1">${user.name}</strong></h6>
                  </div>
                  <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
              </li>`
          }

      })
      userList.innerHTML = text;

      const GroupApiresponse = await axios(`http://localhost:3000/group/get-group?groupId=${groupId}`);
      const { group } = GroupApiresponse.data;
      grpName.value = group.name;
      modelSubmitBtn.innerHTML = "Update Details";
      modelHeading.innerHTML = `Update ${group.name} Details`;
      edit.value = groupId
      modelCloseBtn.classList.add("d-none")
  } catch (error) {
      console.log(error);
      alert(error.response.data.message);
  }
}
function searchUser(e) {
  const text = e.target.value.toLowerCase();
  const items = userList.querySelectorAll('li');
  const usersArr = Array.from(items);
  usersArr.forEach(blockdisplay);
  function blockdisplay(value) {
      const userName = value.querySelector('h6').textContent;
      if (userName.toLowerCase().indexOf(text) != -1) {
          value.classList.add('d-flex');
          value.style.display = 'block';
      }
      else {
          value.classList.remove('d-flex');
          value.style.display = 'none';
      }
  }
}
async function createGroup(e) {
  try {
    let token=localStorage.getItem('token')
      if (formGroup.checkValidity()) {
          e.preventDefault();
          const groupName = formGroup.querySelector('#group_name').value;
          const selectedUsers = Array.from(userList.querySelectorAll('input[name="users"]:checked'))
              .map(checkbox => checkbox.value);
          const data = {
              name: groupName,
              
              membersIds: selectedUsers
          }
          if (edit.value == "false") {
              await axios.post('http://localhost:3000/group/create-group', data,{headers:{Authorization:token}});
              alert("Group successfully created")

          } else {
              const groupId = edit.value
              await axios.post(`http://localhost:3000/group/update-group?groupId=${groupId}`, data,{headers:{Authorization:token}});

              modelSubmitBtn.innerHTML = "Create Group";
              modelHeading.innerHTML = `Create new group`;
              edit.value = "false"
              modelCloseBtn.classList.remove("d-none")
              alert("Group successfully updated")

          }
          formGroup.reset();
          $('#group_model').modal('hide');
          ShowGroup();
      } else {
          alert('fill all details ')
      }

  } catch (error) {
      console.log(error);
      alert(error.response.data.message);
  }
}

async function showGroupChat(e) {
  try {
    let token=localStorage.getItem('token')
      const groupId = e.target.id
     console.log("groupid",groupId)
     
      const getUserResponse = await axios.get('http://localhost:3000/group/get-user',{headers:{Authorization:token}});
      const userId = getUserResponse.data.userId
      if (groupId && groupId != "group_body") {
          setupGroup(groupId, userId)
          if (groupId == 0) {
              ShowCommonChats();
          } else {
              const APIresponse = await axios(`http://localhost:3000/group/get-group-messages?groupId=${groupId}`);
              const apiChats = APIresponse.data.chats
             
              showChatOnScreen(apiChats, userId)
          }
      } else {
          console.log("no group id");
      }

  } catch (error) {
      console.log(error);
      alert(error.response.data.message);
     
  }
}

function showChatOnScreen(chatHistory, userId) {
  
  chatBody.innerHTML = "";
  let messageText = "";
  chatHistory.forEach((ele) => {
    
      if (ele.userId == userId) {
          if(ele.isImage){
              messageText+=`      
          <div class="col-12 mb-2 pe-0">
              <div class="card p-2 float-end rounded-4 self-chat-class">
                  <p class="text-primary my-0"><small>${ele.name}</small></p>
                  <a href="${ele.message}" target="_blank">
                    <img src="${ele.message}" class="chat-image">
                  </a>
                 
              </div>
          </div>
              `
          }else{
              messageText += `                            
              <div class="col-12 mb-2 pe-0">
                  <div class="card p-2 float-end rounded-4 self-chat-class">
                      <p class="text-primary my-0"><small>${ele.name}</small></p>
                      <p class="my-0">${ele.message}</p>
                     
                  </div>
              </div>`
          }
      } else {
          if(ele.isImage){
              messageText += `                            
              <div class="col-12 mb-2 pe-0">
                  <div class="card p-2 float-start rounded-4 chat-class">
                      <p class="text-danger my-0"><small>${ele.name}</small></p>
                      <a href="${ele.message}" target="_blank">
                      <img src="${ele.message}" class="chat-image">
                    </a>
                     
                  </div>
              </div>`

          }else{
              messageText += `                            
              <div class="col-12 mb-2 pe-0">
                  <div class="card p-2 float-start rounded-4 chat-class">
                      <p class="text-danger my-0"><small>${ele.name}</small></p>
                      <p class="my-0">${ele.message}</p>
                     
                  </div>
              </div>`
          }
      }

  })
  
  chatBody.innerHTML = messageText;
  

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function ShowGroup() {
  try {
    let token=localStorage.getItem('token')
      const groupsResponse = await axios.get(`http://localhost:3000/group/get-mygroups`,{headers:{Authorization:token}});
      const { groups } = groupsResponse.data;
      groupBody.innerHTML = `
      <button class="list-group-item list-group-item-action py-2" 
          data-bs-toggle="list">
          <div class="d-flex w-100 align-items-center justify-content-between" id="0">
         
              <strong class="mb-1">Common-group</strong>
              
          </div>
      </button>
      `
      let html = "";
      groups.forEach((ele) => {
          
          html += `               
      <button class="list-group-item list-group-item-action py-2" 
          data-bs-toggle="list">
          <div class="d-flex w-100 align-items-center justify-content-between" id="${ele.id}">
             
              <strong class="mb-1">${ele.name}</strong>
             
          </div>
      </button>`
      })
      groupBody.innerHTML += html;

  } catch (error) {
      console.log(error);
  }
}
async function ShowCommonChats() {
  try {
      let savingChats
      const chats = localStorage.getItem('chatHistory');
      if (chats && chats.length!=2) {
          const parsedChatHistory = JSON.parse(chats);
          const lastMessageId = parsedChatHistory[parsedChatHistory.length - 1].messageId;
          const APIresponse = await axios.get(`http://localhost:3000/chat/get-messages?lastMessageId=${lastMessageId}`);
          const apiChats = APIresponse.data.chats
          const mergedChats = [...parsedChatHistory, ...apiChats];
          savingChats = mergedChats.slice(-1000);
      } else {
          const APIresponse = await axios.get(`http://localhost:3000/chat/get-messages?lastMessageId=0`);
          const apiChats = APIresponse.data.chats
          savingChats = apiChats.slice(-1000);
      }
      let token=localStorage.getItem('token')
      const getUserResponse = await axios.get('http://localhost:3000/group/get-user',{headers:{Authorization:token}});
      const userId = getUserResponse.data.userId
      localStorage.setItem("chatHistory", JSON.stringify(savingChats));
      showChatOnScreen(savingChats, userId)

  } catch (error) {
      console.log(error);
      //alert(error.response.data.message);
     
  }
}
async function showGroupChats(groupId) {
  try {
    
    let token=localStorage.getItem('token')
      const APIresponse = await axios.get(`http://localhost:3000/group/get-group-messages?groupId=${groupId}`);
      const apiChats = APIresponse.data.chats
      
      const getUserResponse = await axios.get('http://localhost:3000/group/get-user',{headers:{Authorization:token}});
      const userId = getUserResponse.data.userId
      showChatOnScreen(apiChats, userId)
  } catch (error) {
      console.log(error);
      //alert(error.response.data.message);
  }
}
async function setupGroup(groupId, userId) {
  try {
      if (groupId == 0) {
          
        group_heading.innerHTML = `Common Group`;
          // group_members.innerHTML = ` All Members`;
          // group_members.setAttribute("data-bs-original-title", `All Members can access this group !`);
          msgBtn.id = groupId;
          groupEdit.classList.add('d-none')

      } else {
        
          const APIresponse = await axios.get(`http://localhost:3000/group/get-group?groupId=${groupId}`);
          const { group } = APIresponse.data;
         
          group_heading.innerHTML = `${group.name}`;
         // group_members.innerHTML = ` ${group.membersNo} Members`;
          const memberApi = await axios.get(`http://localhost:3000/group/get-group-members?groupId=${groupId}`);
          const { users } = memberApi.data;
          
          // const usersString = users.map(item => item.name.trim()).join(',');
          // group_members.setAttribute("data-bs-original-title", `${usersString}`);
          msgBtn.id = groupId
         
          if (group.adminId == userId) {
            groupEdit.id = groupId;
           
            groupEdit.classList.remove('d-none')
          } else {
            groupEdit.classList.add('d-none')
          }
      }


  } catch (error) {
      console.log(error);
      alert(error.response.data.message);
  }
}
ShowGroup();
ShowCommonChats();
