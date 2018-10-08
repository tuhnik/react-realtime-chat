import React, { Component } from 'react';
import io from 'socket.io-client'
import Login from './Login.js'
const socketURL = "192.168.0.62:1234"
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      socket: null,
      input: "",
      chat: []
    }
  }
  messagesEnd = React.createRef()
  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
  }
  componentDidUpdate(){
    this.scrollToBottom()
  }
  initSocket(){
    const socket = io(socketURL)
    socket.on("connect", () => {
      this.setState({socket})
    })
    socket.on("msg", (data) => {
      let chat = [...this.state.chat, data]
      this.setState({chat})
    })
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
      <div className="container">
        {!this.state.username && <Login setUsername={this.setUsername.bind(this)}/>}
        {this.state.username &&  <div className = "container chat">
          <div className = "sidebar"><h1>USERS</h1></div>
          <div className = "main">
          <div>{this.state.chat.map((el, i)=>{
            return <div className= {(this.state.username === el.username)?"notification is-info":"notification"}  key = {i}>{el.username + ": " + el.msg}</div>
              })}
              <div ref={this.messagesEnd} />
          </div>
            <form className = "bottom" onSubmit={this.handleSubmit.bind(this)}>
              <input className= "input" type="text" value={this.state.input} onChange={this.handleChange.bind(this)} />
            </form></div>
          </div>}
      </div>
    );
  }
}
export default App;