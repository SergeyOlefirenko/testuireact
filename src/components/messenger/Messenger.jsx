import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import './Messenger.css';
import background from './background.jpg';


var stompClient =null;
const Chat = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
    useEffect(() => {
      console.log(userData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }


    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        connect();
    }

    return (
    <div className="container" style={{ backgroundImage: `url(${background})` }}>
        {userData.connected?
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Send All</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="Type text here" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}><i class="bi bi-cursor"></i></button>
                </div>
          
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>
                <form onSubmit={sendPrivateValue}>
                <div className="send-message">
                    <input type="text" className="input-message" placeholder="Type text here" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}><i class="bi bi-cursor"></i></button>
                </div>
                </form>
            </div>}
        </div>
        :
        <div className="register">
            <input
                id="user-name"
                placeholder="Enter your name"
                name="userName"
                value={userData.username}
                onChange={handleUsername}
                margin="normal"
              />
              <button type="button" onClick={registerUser}>
                    Add
              </button> 
        </div>}
    </div>
    )
}

export default Chat





//Вариант рабочей версии


// import React, { useEffect, useState } from 'react';
// import { over } from 'stompjs';
// import SockJS from 'sockjs-client';
// import './Messenger.css';

// var stompClient = null;

// const Chat = () => {
//     const [privateChats, setPrivateChats] = useState(new Map());
//     const [publicChats, setPublicChats] = useState([]);
//     const [tab, setTab] = useState("CHATROOM");
//     const [users, setUsers] = useState([]);
//     const [userData, setUserData] = useState({
//         username: '',
//         receivername: '',
//         connected: false,
//         message: ''
//     });

//     useEffect(() => {
//         console.log(userData);
//     }, [userData]);

//     const connect = () => {
//         let Sock = new SockJS('http://localhost:8080/ws');
//         stompClient = over(Sock);
//         stompClient.connect({}, onConnected, onError);
//     }

//     const onConnected = () => {
//         setUserData({ ...userData, "connected": true });
//         stompClient.subscribe('/chatroom/public', onMessageReceived);
//         stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
//         userJoin();
//     }

//     const userJoin = () => {
//         var chatMessage = {
//             senderName: userData.username,
//             status: "JOIN"
//         };

//         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         stompClient.send("/app/user", {}, JSON.stringify(chatMessage));
//     }

//     const onMessageReceived = (payload) => {
//         var payloadData = JSON.parse(payload.body);
//         switch (payloadData.status) {
//             case "JOIN":
//                 if (!privateChats.get(payloadData.senderName)) {
//                     privateChats.set(payloadData.senderName, []);
//                     setPrivateChats(new Map(privateChats));
//                 }
//                 break;
//             case "MESSAGE":
//                 publicChats.push(payloadData);
//                 setPublicChats([...publicChats]);
//                 break;
//                 default:
//             // Действия для случая, когда status не соответствует ни одному case?
//             break;
//         }
//     }

//     const onPrivateMessage = (payload) => {
//         var payloadData = JSON.parse(payload.body);
//         if (privateChats.get(payloadData.senderName)) {
//             privateChats.get(payloadData.senderName).push(payloadData);
//             setPrivateChats(new Map(privateChats));
//         } else {
//             let list = [];
//             list.push(payloadData);
//             privateChats.set(payloadData.senderName, list);
//             setPrivateChats(new Map(privateChats));
//         }
//     }

//     const onError = (err) => {
//         console.log(err);
//     }

//     const handleMessage = (event) => {
//         const { value } = event.target;
//         setUserData({ ...userData, "message": value });
//     }

//     const sendValue = () => {
//         if (stompClient) {
//             var chatMessage = {
//                 senderName: userData.username,
//                 message: userData.message,
//                 status: "MESSAGE"
//             };
//             stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//             setUserData({ ...userData, "message": "" });
//         }
//     }

//     const sendPrivateValue = () => {
//         if (stompClient) {
//             var chatMessage = {
//                 senderName: userData.username,
//                 receiverName: tab,
//                 message: userData.message,
//                 status: "MESSAGE"
//             };

//             if (userData.username !== tab) {
//                 if (!privateChats.get(tab)) {
//                     privateChats.set(tab, []);
//                 }
//                 privateChats.get(tab).push(chatMessage);
//                 setPrivateChats(new Map(privateChats));
//             }
//             stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
//             setUserData({ ...userData, "message": "" });
//         }
//     }

//     const handleUsername = (event) => {
//         const { value } = event.target;
//         setUserData({ ...userData, "username": value });
//     }

//     const registerUser = () => {
//         const registrationData = {
//             username: userData.username
//         };

//         fetch('http://localhost:8080/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registrationData),
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     connect();
//                 } else {
//                     console.error('Ошибка регистрации:', response.status);
//                 }
//             })
//             .catch(error => {
//                 console.error('Ошибка регистрации:', error);
//             });
//     };

//     useEffect(() => {
//         fetch('http://localhost:8080/users')
//             .then(response => response.json())
//             .then(data => setUsers(data))
//             .catch(error => console.error('Ошибка получения списка пользователей:', error));
//     }, []);

//     return (
//         <div className="container">
//             {userData.connected ?
//                 <div className="chat-box">
//                     <div className="member-list">
//                         <ul>
//                             <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}>Общий чат</li>
//                             {users.map(user => (
//                                 <li onClick={() => { setTab(user.username) }} className={`member ${tab === user.username && "active"}`} key={user.id}>{user.username}</li>
//                             ))}
//                         </ul>
//                     </div>
//                     {tab === "CHATROOM" && <div className="chat-content">
//                         <ul className="chat-messages">
//                             {publicChats.map((chat, index) => (
//                                 <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                                     {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                                     <div className="message-data">{chat.message}</div>
//                                     {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
//                                 </li>
//                             ))}
//                         </ul>

//                         <div className="send-message">
//                             <input type="text" className="input-message" placeholder="type here" value={userData.message} onChange={handleMessage} />
//                             <button type="submit" className="send-button" onClick={sendValue}>send</button>
//                         </div>
//                     </div>}
//                     {tab !== "CHATROOM" && <div className="chat-content">
//                         <ul className="chat-messages">
//                             {privateChats.get(tab) && privateChats.get(tab).map((chat, index) => (
//                                 <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                                     {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                                     <div className="message-data">{chat.message}</div>
//                                     {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
//                                 </li>
//                             ))}
//                         </ul>

//                         <div className="send-message">
//                             <input type="text" className="input-message" placeholder="type your message here" value={userData.message} onChange={handleMessage} />
//                             <button type="submit" className="send-button" onClick={sendPrivateValue}>send</button>
//                         </div>
//                     </div>}
//                 </div>
//                 :
//                 <div className="register">
//                     <input
//                         id="user-name"
//                         placeholder="Enter your name"
//                         name="userName"
//                         value={userData.username}
//                         onChange={handleUsername}
//                         margin="normal"
//                     />
//                     <button type="button" onClick={registerUser}>
//                         Registration
//                     </button>
//                 </div>}
//         </div>
//     )
// }

// export default Chat;




















// import React, { useEffect, useState } from 'react'
// import {over} from 'stompjs';
// import SockJS from 'sockjs-client';
// import './Messenger.css';
// // import Stomp from 'stompjs-client';


// var stompClient =null;
// const Chat = () => {
//     const [privateChats, setPrivateChats] = useState(new Map());     
//     const [publicChats, setPublicChats] = useState([]); 
//     const [tab,setTab] =useState("CHATROOM");
//     const [users, setUsers] = useState([]);
//     const [userData, setUserData] = useState({
//         username: '',
//         receivername: '',
//         connected: false,
//         message: ''
//       });  
// console.log(users);
  

//     useEffect(() => {
//       console.log(userData);
//     }, [userData]);

//     const connect =()=>{
//         let Sock = new SockJS('http://localhost:8080/ws');
//         stompClient = over(Sock);
//         stompClient.connect({},onConnected, onError);
//     }

//     const onConnected = () => {
//         setUserData({...users,"connected": true});
//         console.log();
//         stompClient.subscribe('/chatroom/public', onMessageReceived);
//         console.log(stompClient.subscribe('/chatroom/public', onMessageReceived));
        
//         stompClient.subscribe('/user/'+users.username+'/private', onPrivateMessage);
//         console.log(stompClient.subscribe('/user/'+users.username+'/private', onPrivateMessage));
//         userJoin();
//     }

//     // const onConnected = () => {
//     //     setUserData({...userData,"connected": true});
//     //     console.log();
//     //     stompClient.subscribe('/chatroom/public', onMessageReceived);
//     //     console.log(stompClient.subscribe('/chatroom/public', onMessageReceived));
        
//     //     stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
//     //     console.log(stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage));
//     //     userJoin();
//     // }

//     // const userJoin=()=>{
//     //       var chatMessage = {
//     //         senderName: userData.username,
//     //         status:"JOIN"
//     //       };
        
//     //       console.log(stompClient.send("/app/message", {}, JSON.stringify(chatMessage)));
//     //       stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//     //       console.log(chatMessage);

//     //       console.log(stompClient.send("/app/user", {}, JSON.stringify(chatMessage)));
//     //       stompClient.send("/app/user", {}, JSON.stringify(chatMessage));
//     //       console.log(chatMessage);
//     // }

//     const userJoin=()=>{
//         var chatMessage = {
//           senderName: users.username,
//           status:"JOIN"
//         };
      
//         console.log(stompClient.send("/app/message", {}, JSON.stringify(chatMessage)));
//         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         console.log(chatMessage);

//         console.log(stompClient.send("/app/user", {}, JSON.stringify(chatMessage)));
//         stompClient.send("/app/user", {}, JSON.stringify(chatMessage));
//         console.log(chatMessage);
//   }



//     const onMessageReceived = (payload)=>{
//         var payloadData = JSON.parse(payload.body);
//         switch(payloadData.status){
//             case "JOIN":
//                 if(!privateChats.get(payloadData.senderName)){
//                     privateChats.set(payloadData.senderName,[]);
//                     setPrivateChats(new Map(privateChats));
//                 }
//                 break;
//             case "MESSAGE":
//                 publicChats.push(payloadData);
//                 setPublicChats([...publicChats]);
//                 break;
//         }
//     }
    
//     const onPrivateMessage = (payload)=>{
//         console.log(payload);
//         var payloadData = JSON.parse(payload.body);
//         if(privateChats.get(payloadData.senderName)){
//             privateChats.get(payloadData.senderName).push(payloadData);
//             setPrivateChats(new Map(privateChats));
//         }else{
//             let list =[];
//             list.push(payloadData);
//             privateChats.set(payloadData.senderName,list);
//             setPrivateChats(new Map(privateChats));
//         }
//     }

//     const onError = (err) => {
//         console.log(err);
        
//     }

//     const handleMessage =(event)=>{
//         const {value}=event.target;
//         // setUserData({...userData,"message": value});


//         setUsers({...users,"message": value});
//         console.log( setUsers({...users,"message": value}));


//     }
//     // const sendValue=()=>{
//     //         if (stompClient) {
//     //           var chatMessage = {
//     //             senderName: userData.username,
//     //             message: userData.message,
//     //             status:"MESSAGE"
//     //           };
//     //         //   console.log(chatMessage);
//     //         //   stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//     //         //   setUserData({...userData,"message": ""});
//     //         console.log(chatMessage);
//     //         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//     //         setUserData({...userData,"message": ""});
//     //         }
//     // }

//     const sendValue=()=>{
//         if (stompClient) {
//           var chatMessage = {
//             senderName: users.username,
//             message: users.message,
//             status:"MESSAGE"
//           };
//         //   console.log(chatMessage);
//         //   stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         //   setUserData({...userData,"message": ""});
//         console.log(chatMessage);
//         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         setUserData({...users,"message": ""});
//         }
// }

//     const sendPrivateValue=()=>{
//         if (stompClient) {
//           var chatMessage = {
//             senderName: userData.username,
//             receiverName:tab,
//             message: userData.message,
//             status:"MESSAGE"
//           };
          
//           if(userData.username !== tab){
//             privateChats.get(tab).push(chatMessage);
//             setPrivateChats(new Map(privateChats));
//           }
//           stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
//           setUserData({...userData,"message": ""});
//         }
//     }

//     const handleUsername=(event)=>{
//         const {value}=event.target;
//         setUserData({...userData,"username": value});
//     }

//     // const registerUser=()=>{
//     //     connect();
//     // }

//     const registerUser = () => {
//         const registrationData = {
//             username: userData.username,
//             // Добавить остальные данные пользователя 
//         };
//         // fetch('http://localhost:8080/ws/users', {
//         fetch('http://localhost:8080/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registrationData),
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     connect();
//                     // Пользователь успешно зарегистрирован
//                 } else {
//                     // Ошибкa регистрации
//                 }
//             })
//             .catch(error => {
//                 console.error('Ошибка регистрации:', error);
//             });
//             console.log(registrationData);
//     };

//     useEffect(() => {
//         fetch('http://localhost:8080/users')
//             .then(response => response.json())
//             .then(data => setUsers(data))
//             .catch(error => console.error('Ошибка получения списка пользователей:', error));
//     }, []);

//  console.log(users);

//  console.log(userData);

// const [dataDB, setDataDB] = useState([])
// useEffect(() => {
//     let user = '';
//     let dataList = []
//     users.map((u) => {
//       user = u.username
//     //   fetch('http://localhost:8080/users')
//     //   .then(response => response.json())
//     //   .then(data => setUsers(data))
//       // Здесь используем проверку на наличие объекта в списке

//     //   if (!user.includes(users)) {
//     //     dataList.push({user});
//     //   }

//         dataList.push({user});
      
//     })
//     setDataDB(dataList);

//   }, [])

// console.log(dataDB);


//     return (
//     <div className="container">
//         {userData.connected?
//         <div className="chat-box">
//             <div className="member-list">
//                 <ul>
//                     <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Общий чат</li>
//                     {/* {[...privateChats.keys()].map((name,index)=>(
//                         <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
//                     ))} */}
                  
//                      {users.map(user => (
//                     <li onClick={()=>{setTab(user.id)}} className={`member ${tab===user.username && "active"}`} key={user.id}>{user.username}</li>
//                     ))}
//                 </ul>

//             </div>
//             {tab==="CHATROOM" && <div className="chat-content">
//                 <ul className="chat-messages">
//                     {publicChats.map((chat,index)=>(
//                         <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                             {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                             <div className="message-data">{chat.message}</div>
//                             {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
//                         </li>
//                     ))}
//                 </ul>

//                 <div className="send-message">
//                     <input type="text" className="input-message" placeholder="type your message here" value={userData.message} onChange={handleMessage} /> 
//                     <button type="submit" className="send-button" onClick={sendValue}>send</button>
//                 </div>
//             </div>}
//             {tab!=="CHATROOM" && <div className="chat-content">
//                 <ul className="chat-messages">
//                     {[...privateChats.get(tab)].map((chat,index)=>(
//                         <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                             {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                             <div className="message-data">{chat.message}</div>
//                             {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
//                         </li>
//                     ))}
//                 </ul>

//                 <div className="send-message">
//                     <input type="text" className="input-message" placeholder="type your message here" value={userData.message} onChange={handleMessage} /> 
//                     <button type="submit" className="send-button" onClick={sendPrivateValue}>send</button>
//                 </div>
//             </div>}
//         </div>
//         :
//         <div className="register">
//             <input
//                 id="user-name"
//                 placeholder="Enter your name"
//                 name="userName"
//                 value={userData.username}
//                 onChange={handleUsername}
//                 margin="normal"
//               />
//               <button type="button" onClick={registerUser}>
//                     Registration
//               </button> 
//         </div>}
        
//     </div>
//     )
// }

// export default Chat






// import React, { useEffect, useState } from 'react'
// import {over} from 'stompjs';
// import SockJS from 'sockjs-client';
// import './Messenger.css';
// // import Stomp from 'stompjs-client';


// var stompClient =null;
// const Chat = () => {
//     const [privateChats, setPrivateChats] = useState(new Map());     
//     const [publicChats, setPublicChats] = useState([]); 
//     const [tab,setTab] =useState("CHATROOM");
//     // const [userData, setUserData] = useState({
//     //     username: '',
//     //     receivername: '',
//     //     connected: false,
//     //     message: ''
//     //   });

//     const [users, setUsers] = useState({
//         username: '',
//         receivername: '',
//         connected: false,
//         message: ''
//       });
 
//     //   const [users, setUsers] = useState([]);
// console.log(users);
  

//     // useEffect(() => {
//     //   console.log(userData);
//     // }, [userData]);

//     useEffect(() => {
//         console.log(users);
//       }, [users]);

//     const connect =()=>{
//         let Sock = new SockJS('http://localhost:8080/ws');
//         stompClient = over(Sock);
//         stompClient.connect({},onConnected, onError);
//     }

//     const onConnected = () => {
//         // setUserData({...userData,"connected": true});
//         setUsers({...users,"connected": true});
//         console.log();
//         stompClient.subscribe('/chatroom/public', onMessageReceived);
//         console.log(stompClient.subscribe('/chatroom/public', onMessageReceived));
        
//         // stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
//         // console.log(stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage));
//         // userJoin();
//         stompClient.subscribe('/user/'+users.username+'/private', onPrivateMessage);
//         console.log(stompClient.subscribe('/user/'+users.username+'/private', onPrivateMessage));
//         userJoin();
//     }

//     // const userJoin=()=>{
//     //       var chatMessage = {
//     //         senderName: userData.username,
//     //         status:"JOIN"
//     //       };
        
//     //       console.log(stompClient.send("/app/message", {}, JSON.stringify(chatMessage)));
//     //       stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//     //       console.log(chatMessage);

//     //       console.log(stompClient.send("/app/user", {}, JSON.stringify(chatMessage)));
//     //       stompClient.send("/app/user", {}, JSON.stringify(chatMessage));
//     //       console.log(chatMessage);
//     // }

//     const userJoin=()=>{
//         var chatMessage = {
//           senderName: users.username,
//           status:"JOIN"
//         };
      
//         console.log(stompClient.send("/app/message", {}, JSON.stringify(chatMessage)));
//         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         console.log(chatMessage);

//         console.log(stompClient.send("/app/user", {}, JSON.stringify(chatMessage)));
//         stompClient.send("/app/user", {}, JSON.stringify(chatMessage));
//         console.log(chatMessage);
//   }



//     const onMessageReceived = (payload)=>{
//         var payloadData = JSON.parse(payload.body);
//         switch(payloadData.status){
//             case "JOIN":
//                 if(!privateChats.get(payloadData.senderName)){
//                     privateChats.set(payloadData.senderName,[]);
//                     setPrivateChats(new Map(privateChats));
//                 }
//                 break;
//             case "MESSAGE":
//                 publicChats.push(payloadData);
//                 setPublicChats([...publicChats]);
//                 break;
//         }
//     }
    
//     const onPrivateMessage = (payload)=>{
//         console.log(payload);
//         var payloadData = JSON.parse(payload.body);
//         if(privateChats.get(payloadData.senderName)){
//             privateChats.get(payloadData.senderName).push(payloadData);
//             setPrivateChats(new Map(privateChats));
//         }else{
//             let list =[];
//             list.push(payloadData);
//             privateChats.set(payloadData.senderName,list);
//             setPrivateChats(new Map(privateChats));
//         }
//     }

//     const onError = (err) => {
//         console.log(err);
        
//     }

//     const handleMessage =(event)=>{
//         const {value}=event.target;
//         // setUserData({...userData,"message": value});


//         setUsers({...users,"message": value});
//         console.log( setUsers({...users,"message": value}));


//     }
//     // const sendValue=()=>{
//     //         if (stompClient) {
//     //           var chatMessage = {
//     //             senderName: userData.username,
//     //             message: userData.message,
//     //             status:"MESSAGE"
//     //           };
//     //         //   console.log(chatMessage);
//     //         //   stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//     //         //   setUserData({...userData,"message": ""});
//     //         console.log(chatMessage);
//     //         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//     //         setUserData({...userData,"message": ""});
//     //         }
//     // }

//     const sendValue=()=>{
//         if (stompClient) {
//           var chatMessage = {
//             senderName: users.username,
//             message: users.message,
//             status:"MESSAGE"
//           };
//         //   console.log(chatMessage);
//         //   stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         //   setUserData({...userData,"message": ""});
//         console.log(chatMessage);
//         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
//         setUsers({...users,"message": ""});
//         }
// }

//     // const sendPrivateValue=()=>{
//     //     if (stompClient) {
//     //       var chatMessage = {
//     //         senderName: userData.username,
//     //         receiverName:tab,
//     //         message: userData.message,
//     //         status:"MESSAGE"
//     //       };
          
//     //       if(userData.username !== tab){
//     //         privateChats.get(tab).push(chatMessage);
//     //         setPrivateChats(new Map(privateChats));
//     //       }
//     //       stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
//     //       setUserData({...userData,"message": ""});
//     //     }
//     // }

//     const sendPrivateValue=()=>{
//         if (stompClient) {
//           var chatMessage = {
//             senderName: users.username,
//             receiverName:tab,
//             message: users.message,
//             status:"MESSAGE"
//           };
          
//           if(users.username !== tab){
//             privateChats.get(tab).push(chatMessage);
//             setPrivateChats(new Map(privateChats));
//           }
//           stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
//           setUsers({...users,"message": ""});
//         }
//     }

//     // const handleUsername=(event)=>{
//     //     const {value}=event.target;
//     //     setUserData({...userData,"username": value});
//     // }

//     const handleUsername=(event)=>{
//         const {value}=event.target;
//         setUsers({...users,"username": value});
//     }

//     // const registerUser=()=>{
//     //     connect();
//     // }

//     // const registerUser = () => {
//     //     const registrationData = {
//     //         username: userData.username,
//     //         // Добавить остальные данные пользователя 
//     //     };

//         const registerUser = () => {
//             const registrationData = {
//                 username: users.username,
//                 // Добавить остальные данные пользователя 
//             };




//         // fetch('http://localhost:8080/ws/users', {
//         fetch('http://localhost:8080/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registrationData),
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     connect();
//                     // Пользователь успешно зарегистрирован
//                 } else {
//                     // Ошибкa регистрации
//                 }
//             })
//             .catch(error => {
//                 console.error('Ошибка регистрации:', error);
//             });
//             console.log(registrationData);
//     };
    
//     useEffect(() => {
//         fetch('http://localhost:8080/users')
//             .then(response => response.json())
//             .then(data => setUsers(data))
//             .catch(error => console.error('Ошибка получения списка пользователей:', error));
//     }, []);
    
//  console.log(users);




//     return (
//     <div className="container">
//         {/* {userData.connected? */}
//         {users.connected?
//         <div className="chat-box">
//             <div className="member-list">
//                 <ul>
//                     <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Общий чат</li>
//                     {[...privateChats.keys()].map((name,index)=>(
//                         <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
//                     ))}
//                 </ul>
//     <div>
//         <h3>Список пользователей</h3>
//         <ul>
//             {users.map(user => (
//                 <li key={user.id}>{user.username}</li>
//             ))}
//               {/* {[...privateChats.keys()].map((user)=>(
//                         <li onClick={()=>{setTab(user.username)}} className={`member ${tab===user.username && "active"}`} key={user.id}>{user.username}</li>
//                     ))} */}
//         </ul>
    
//     </div>
//             </div>
//             {tab==="CHATROOM" && <div className="chat-content">
//                 <ul className="chat-messages">
//                     {publicChats.map((chat,index)=>(
//                         // <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                         <li className={`message ${chat.senderName === users.username && "self"}`} key={index}>
//                             {/* {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>} */}
//                             {chat.senderName !== users.username && <div className="avatar">{chat.senderName}</div>}
//                             <div className="message-data">{chat.message}</div>
//                             {/* {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>} */}
//                             {chat.senderName === users.username && <div className="avatar self">{chat.senderName}</div>}
//                         </li>
//                     ))}
//                 </ul>

//                 <div className="send-message">
//                     {/* <input type="text" className="input-message" placeholder="type your message here" value={userData.message} onChange={handleMessage} />  */}
//                     <input type="text" className="input-message" placeholder="type your message here" value={users.message} onChange={handleMessage} /> 
//                     <button type="submit" className="send-button" onClick={sendValue}>send</button>
//                 </div>
//             </div>}
//             {tab!=="CHATROOM" && <div className="chat-content">
//                 <ul className="chat-messages">
//                     {[...privateChats.get(tab)].map((chat,index)=>(
//                         // <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                         //     {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                         //     <div className="message-data">{chat.message}</div>
//                         //     {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
//                         // </li>
//                         // <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
//                         <li className={`message ${chat.senderName === users.username && "self"}`} key={index}>
//                         {chat.senderName !== users.username && <div className="avatar">{chat.senderName}</div>}
//                         <div className="message-data">{chat.message}</div>
//                         {chat.senderName === users.username && <div className="avatar self">{chat.senderName}</div>}
//                     </li>
//                     ))}
//                 </ul>

//                 <div className="send-message">
//                     {/* <input type="text" className="input-message" placeholder="type your message here" value={userData.message} onChange={handleMessage} />  */}
//                     <input type="text" className="input-message" placeholder="type your message here" value={users.message} onChange={handleMessage} /> 
//                     <button type="submit" className="send-button" onClick={sendPrivateValue}>send</button>
//                 </div>
//             </div>}
//         </div>
//         :
//         <div className="register">
//             {/* <input
//                 id="user-name"
//                 placeholder="Enter your name"
//                 name="userName"
//                 value={userData.username}
//                 onChange={handleUsername}
//                 margin="normal"
//               /> */}

//             <input
//                 id="user-name"
//                 placeholder="Enter your name"
//                 name="userName"
//                 value={users.username}
//                 onChange={handleUsername}
//                 margin="normal"
//               />
        
//              <div>
//              <button type="button" onClick={registerUser}>
//                     Registration
//               </button> 
//              </div>
//               {/* <button type="button" onClick={registerUser}>
//                     Registration
//               </button>  */}
//         </div>}
        
//     </div>
//     )
// }

// export default Chat