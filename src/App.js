import React, { Component } from 'react';
import io from 'socket.io-client'
import Login from './Login.js'
const socketURL = "localhost:1234"
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      userlist: [],
      socket: null,
      input: "",
      gender: "male",
      loginError: null,
      chat: []
    }
  }
  messagesEnd = React.createRef()
  scrollToBottom = () => {
    if(this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: 'instant' })
    }  
  }
  componentDidUpdate(){
    this.scrollToBottom()
  }
  componentDidMount(){
    this.initSocket() 
  }

  initSocket(){
    const socket = io(socketURL)
    socket.on("connect", () => {
      this.setState({socket})
      socket.emit("connected", this.state.username)
    })
    socket.on("msg", (data) => {
      data.time = this.timestamp()
      let chat = [...this.state.chat, data]
      this.setState({chat})
    })
    socket.on("userlist", (data) => {
      let userlist = data
      this.setState({userlist})
    })
    socket.on("login", (username)=>{
      this.setState({username}) 
      this.setState({loginError: null})
    })
    socket.on("loginerror", (error)=>{
      this.setState({loginError: error})
    })

  }
  timestamp(){
    return (new Date()).toTimeString().slice(0,8);
  }
  handleSubmit(evt){
    evt.preventDefault()
    let msg = {username: this.state.username, msg: this.state.input, gender: this.state.gender}
    this.state.socket.emit("msg", msg)
    this.setState({input: ""})
    
  }
  handleChange(evt){
    this.setState({input: evt.target.value})
  }
  login(username){
    if(this.state.socket){
      this.state.socket.emit("login", {username, gender: this.state.gender})
    }
    else {
      this.setState({loginError: "Server is offline!"})
    }
  }

  changeGender(){
    if(this.state.gender === "male"){
      this.setState({gender: "female"})
    }
    else {
      this.setState({gender: "male"})
    }
  }

  render() {
    return (
      <div className="wrapper">
        {!this.state.username && <Login gender = {this.state.gender} changeGender = {this.changeGender.bind(this)}loginError ={this.state.loginError} login={this.login.bind(this)}/>}
        {this.state.username &&  <div className = "chatroom">
          <div className = "sidebar"><div className = "sidebar-header">Online users ({this.state.userlist.length})</div>
          {this.state.userlist.map((el, i)=>{
            return (
                <div className = "userlist-item" key = {el.username + i}>
                 <svg width="50" height="50">       
                    <image xlinkHref={"https://avatars.dicebear.com/v2/" + el.gender +"/"+ el.username + ".svg"} width="50" height="50"/>    
                    </svg>
                 {el.username} </div>
            )
          })}
          </div>
          <div className = "chat">
          <div className = "chat-top">{this.state.chat.map((el, i)=>{
            return <div className= {(this.state.username === el.username)?"msg msg-self":"msg"}  key = {i}>{
              <React.Fragment>
               <div className = "msg-icon">
              <svg width="50" height="50">       
                    <image xlinkHref={"https://avatars.dicebear.com/v2/"+ el.gender +"/"+  ((el.username === "Server")?el.msg.split(" ")[0]:el.username) + ".svg"} width="50" height="50"/>    
              </svg>
              </div>
              
              <div className = {(el.username === "Server")?"msg-server":"msg-text"}> 
              <div className="username">{((el.username === "Server")?"":el.username)}</div>
              <div className="timestamp"> {el.time}</div>
              <div className="text">{el.msg}</div> 
              </div>
             
              </React.Fragment>
            }
                  </div>
              })}
              <div ref={this.messagesEnd} />
          </div>
            <form className = "chat-bottom" onSubmit={this.handleSubmit.bind(this)}>
              <input autoFocus className= "input" type="text" placeholder= "Type here..."value={this.state.input} onChange={this.handleChange.bind(this)} />
            </form>
          </div>
          </div>}
      </div>
    );
  }
}
export default App;