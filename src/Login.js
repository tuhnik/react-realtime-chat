import React, { Component } from 'react';
import Avatar from './Avatar.js'
class Login extends Component {
    constructor(){
        super()
        this.state = {
            input: ""
        }
    }
    handleSubmit(evt){
        evt.preventDefault()
        this.props.login(this.state.input)
        }
    handleChange(evt){
            this.setState({input: evt.target.value})
        }    
    componentDidMount () {
            this._input.focus();
          }
    render(){
        return(
            <React.Fragment>
                <div className = "login">
                    <div className="login-icon" onClick={this.props.changeGender}>
                        <Avatar seed = {this.state.input} gender={this.props.gender}/>
                    </div>    
                    <form onSubmit={this.handleSubmit.bind(this)}>
                    {this.props.loginError && <div className = "login-error-container"><div className = "login-error">{this.props.loginError}</div></div>} 
                        <input onChange={this.handleChange.bind(this)} ref={(c) => this._input = c} className="login-input" type="text" placeholder= "Enter username..."/> 
                        <button className="login-button" type="submit">Continue</button>          
                    </form>              
                </div>
            </React.Fragment>
            )
    }
}
export default Login;