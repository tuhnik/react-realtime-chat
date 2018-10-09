import React, { Component } from 'react';
class Login extends Component {
    handleSubmit(evt){
        evt.preventDefault()
        this.props.setUsername(evt.target.children[0].value)
        }
    componentDidMount () {
            this._input.focus();
          }
    render(){
        return(
            <React.Fragment>
                <div className = "login">
                <form onSubmit={this.handleSubmit.bind(this)}>
                <input ref={(c) => this._input = c} className="input" type="text" placeholder= "Enter username..."/>
                </form>
                </div>
            </React.Fragment>
            )
    }
}
export default Login;