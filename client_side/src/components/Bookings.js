import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'


class Bookings extends Component {
    constructor(props){
        super(props)
        this.state = {
            bookings : []
        }
    }

    fetchData = () => {
        let token = localStorage.getItem("token")
        let isLoggedIn = localStorage.getItem("isLoggedIn")
        if(JSON.parse(token) != null && JSON.parse(isLoggedIn) === true){
            const tokenCheck = {
                headers : {Authorization : "Bearer "+JSON.parse(token)}
            }
            axios.post('http://127.0.0.1:5000/bookings',{},tokenCheck).then
            (res =>{
                this.setState({
                    bookings: res.data.bookings
                })
            }
            ).catch(error => swal(error,"try again","error"))
        }
    }

    componentDidMount = () =>{
        this.fetchData()
    }

    cancel = (e) =>{
        let seatid = e.target.value
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                let local = localStorage.getItem("token")
                if(JSON.parse(local) != null){
                    const token = {
                        headers : {Authorization : "Bearer "+JSON.parse(local)}
                    }
                    axios.post('http://127.0.0.1:5000/cancel',{
                        "seatid" : seatid
                    },token).then
                    (res =>
                         {
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                          })
                        this.fetchData()
                         }
                    ).catch(error => console.log(error))
                }
              
            } else {
              swal("Your imaginary file is safe!");
            }
          });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    {this.state.bookings.map(ele => (
                        <div className="card m-5" style={{width:"12rem"}}>
                            <h5>{ele.mname}</h5>
                            <h5>{ele.seat_no}</h5>
                            <button className="btn btn-warning m-2" value={ele.seatid} onClick = {this.cancel}>Cancel ticket</button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}



export default Bookings
