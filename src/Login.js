import React, { Component } from 'react';
class Login extends Component {
    handleSubmit(evt){
        evt.preventDefault()
        this.props.setUsername(evt.target.children[0].value)
        }
    render(){
        return(
            <React.Fragment>
                <div>Enter username:</div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                <input className="input" type="text"/>
                </form>
            </React.Fragment>
            )
    }
}
export default Login;