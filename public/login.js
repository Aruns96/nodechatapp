let form = document.getElementById("formLogin");
form.addEventListener("submit", saveToLocal);


 function saveToLocal(event){
    event.preventDefault();
   
    const email = event.target.email.value;
    const password = event.target.password.value;
   

   const obj = {
   
    email,
    password
   }
   
    
    axios.post("http://localhost:3000/user/login" ,obj)
    .then(res =>{
        console.log(res);

        if (res.status == 203){
           alert("password incorrect")
        }else if(res.status == 205){
            alert("user not exists")
        }else{
            alert(res.data.message);    
            localStorage.setItem("token",res.data.token);
        window.location.href = "./chat.html";
        localStorage.setItem('groupid',0)
        }
        
        
    })
    .catch(e => {
        console.log(e)

        document.body.innerHTML=document.body.innerHTML + `<h3>${e}</h3>`
    })
    
    event.target.email.value="";
    event.target.password.value="";


   }