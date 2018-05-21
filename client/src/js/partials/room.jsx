import React, { Component } from 'react';
import {connect} from "react-redux"; //read
import {bindActionCreators} from "redux"; //write

import event from "../actions/selectRoom"

class room extends Component {
    getState(check) {
        let toReturn;
        if(check === true) {
            toReturn = (<h6 className="card-subtitle text-dark">Available</h6>);
        } else if(check === false) {
            toReturn = (<h6 className="card-subtitle text-muted">In use</h6>);
        }
        return toReturn;
    }

    render() {
        let room = this.props.room.room;
        let state = (
        <div className={"card mt-1 md-1text-center animated fadeIn " + (this.props.room.available === true ? "available" : "unavailable")} onClick={ () => this.props.roomSelect(this.props.room)}>
            <div className="card-body pt-4 pb-4 pl-2 pr-2">
                <h5 className="card-title">{room.name}</h5>
                <p className="location" hidden>{room.location}</p> 

                {this.getState(this.props.room.available)}
            </div>
        </div>);
        return(state);
    }
}

function read(db) {
    return{};
  }
  
  function write(dispatch) {
    return bindActionCreators({
      roomSelect: event
    }, dispatch);
  }
  
  export default connect(read, write)(room);
  
