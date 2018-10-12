import React from 'react';
import Avatars from '@dicebear/avatars';
import female from '@dicebear/avatars-female-sprites';
import male from '@dicebear/avatars-male-sprites';
import botsvg from './botsvg.js'

class Avatar extends React.Component {
    constructor(props){
        super()
        this.state = {
            svg: ""
        }
    }
    componentDidMount(){
        this.createSVG(this.props.seed, this.props.gender) 
    }
    componentWillReceiveProps(nextProps) {
        this.createSVG(nextProps.seed, nextProps.gender) 
      }
    createSVG(seed, gender){
        let sprites = male
        if(gender === "female") {
            sprites = female
        } 
        let avatars = new Avatars(sprites);
        let svg = avatars.create(seed);
        if(seed === "Security"){
            this.setState({svg:botsvg(this.props.width, this.props.height)})
        }
        else {
            this.setState({svg})
        }
       
    }
    render() {
      return  <div className="avatar" style={{width: this.props.width || 100, height: this.props.height || 100}} dangerouslySetInnerHTML={{__html: this.state.svg}}>
    </div>
    }
  }

  export default Avatar

