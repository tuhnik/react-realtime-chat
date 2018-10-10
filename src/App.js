import React, { Component } from 'react';
import io from 'socket.io-client'
import Login from './Login.js'
const socketURL = "192.168.0.62:1234"
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      userlist: [],
      socket: null,
      input: "",
      chat: []
    }
  }
  messagesEnd = React.createRef()
  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: 'instant' })
  }
  componentDidUpdate(){
    this.scrollToBottom()
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
  }
  timestamp(){
    return (new Date()).toTimeString().slice(0,8);
  }
  handleSubmit(evt){
    evt.preventDefault()
    let msg = {username: this.state.username, msg: this.state.input}
    this.state.socket.emit("msg", msg)
    this.setState({input: ""})
  }
  handleChange(evt){
    this.setState({input: evt.target.value})
  }
  setUsername(username){
    this.setState({username})
    this.initSocket()
  }
  render() {
    return (
      <div className="wrapper">
        {!this.state.username && <Login setUsername={this.setUsername.bind(this)}/>}
        {this.state.username &&  <div className = "chatroom">
          <div className = "sidebar"><div className = "sidebar-header">Online users ({this.state.userlist.length})</div>
          {this.state.userlist.map((el, i)=>{
            return <div className = "userlist-item" key = {el + i}> {el} </div>
          })}
          </div>
          <div className = "chat">
          <div className = "chat-top">{this.state.chat.map((el, i)=>{
            return <div className= {(this.state.username === el.username)?"msg msg-self":"msg"}  key = {i}>{
              "["+ el.time + "] "+ ((el.username === "Server")?"":el.username + ": ") + el.msg}
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