import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'

class Seat extends Component {
    constructor(props){
        super(props)
        this.state = {
            seats:[]
        }
    }

    fetchSeats = () =>{
        let id = this.props.match.params.id
        axios.post('http://127.0.0.1:5000/getseats',{
            "screenid":id
        }).then
            (res =>{
                console.log(res.data)
                if(res.data.message == 'seat full'){
                    swal(res.data.message,"sorry","error")
                }
                else if(res.data.message == 'available') {
                    this.setState({
                        seats:res.data.availableSeats,
                    })
                }
                
            }
            ).catch(error => swal(error,"try again","error"))
    }

    componentDidMount=()=>{
        console.log(this.props)
        this.fetchSeats()
    }

    book = (e) =>{
        let screenid = this.props.match.params.id
        let path = String(this.props.location.pathname)
        let arr = path.split('/')
        // console.log(arr)
        let mid = arr[2]
        let token = localStorage.getItem("token")
        let isLoggedIn = localStorage.getItem("isLoggedIn")
        if(JSON.parse(token) != null && JSON.parse(isLoggedIn) === true){
            const tokenCheck = {
                headers : {Authorization : "Bearer "+JSON.parse(token)}
            }
            axios.post('http://127.0.0.1:5000/bookseat',{
                "screenid": screenid,
                "mid": mid,
                "seatid": e.target.value
            },tokenCheck).then
            (res =>{
                if(res.data.message === "seatbooked"){
                    swal(res.data.message,"welcome","success")
                    this.fetchSeats()
                }
                else{
                    swal("something went wrong","try again","error")
                }
            }
            ).catch(error => swal(error,"try again","error"))
        }

    }
    
    render() {
        return (
            <div className="container-fluid">
                    <h1 className="text-center">Seats are arranged in serially that is lowest is nearby screen</h1>
                <div className="row justify-content-center">
                    {this.state.seats.map(ele => (
                        <button className="btn btn-warning m-2" value={ele.seatid} onClick = {this.book}>Seat no {ele.seat_no}</button>
                    ))}
                </div>
                
            </div>
        )
    }
}


export default Seat
