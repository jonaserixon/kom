import React, { Component } from 'react';
import logo from '../../logo.svg';
import {connect} from "react-redux"; //read
import {bindActionCreators} from "redux"; //write
import room from "../actions/room-state";
import $ from "jquery";

class Schedule extends Component {
    checkinModalBody() {
        return(
            <div>
                <label><i class="fas fa-user"></i>Username</label>
                <input id="checkinName" type="text" className="form-control" placeholder="Username"/>
            </div>
        );
    }

    checkinModal() {
        return(
            <div className="modal fade" id="checkinModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content text-center">
                        <div className="modal-header">
                            <h5 className="modal-title">Checkin</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        {this.checkinModalBody()}
                        </div>
                        <div className="modal-footer">
                            <button id="checkin" type="button" className="btn btn-dark" data-dismiss="modal">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onClick() {
        console.log(this.props)
        this.props.roomManager("CHECK_IN", {name: this.props.name, user: $("#checkinName").val()})
    }

    content() {
        let schedule = this.props.schedule;
        if(schedule != null) {
            $( document ).ready(() => {
                $("#checkin").off();
                $("#checkin").on("click", () => {
                    console.log("PLZZZ")
                    this.onClick();
                });
            });
            let rows = [];
            if(schedule.length > 0) {
                schedule.forEach(function(booking) {
                    rows.push((
                        <tr>
                            <th scope="row">{booking.username}</th>
                            <td>{booking.startTime}</td>
                            <td>{booking.endTime}</td>
                            <td className="pt-1"><button className="btn btn-sm btn-outline-dark checkin" data-toggle="modal" data-target="#checkinModal"><i class="fas fa-check"></i>Checkin</button></td>
                        </tr>
                    ));
                });
                return(
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Booker</th>
                                <th scope="col">Start</th>
                                <th scope="col">End</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                );
            } else {
                return <p>No bookings today</p>;
            }
        } else {
            return <p>Loading</p>
        }
    }

    render() {
        return (
            <div className="modal fade" id="test" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content text-center">
                        <div className="modal-header">
                            <h5 className="modal-title">Today's Schedule</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        {this.content()}
                        {this.checkinModal()}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" data-dismiss="modal">Done</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

  
function write(dispatch) {
    return bindActionCreators({
        roomManager: room
    }, dispatch);
}


function read(db) {
    return{};
}
  
export default connect(read, write)(Schedule);