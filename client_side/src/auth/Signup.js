import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'

class SignUp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name : "",
            email : "",
            password : "",
            mobile : "",
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
      }

    handleClick = (e) =>{
    e.preventDefault()
    let name = this.state.name
    let email = this.state.email
    let password = this.state.password
    let mobile = this.state.mobile
    axios.post('http://127.0.0.1:5000/auth/signup',{
            "name" : name,
            "email" : email,
            "password" : password,
            "phone" : mobile,
        }).then
        (res =>{
            if(res.data.message === "Email Already exist"){
                swal(res.data.message,"try again","error")
            }
            else if(res.data.message === "user created"){
                swal(res.data.message,"welcome","success")
            }
            else{
                swal(res.data,"try again","error")
            }
        }
        ).catch(error => swal(error))

    this.setState({
        name : "",
        email : "",
        password : "",
        mobile: "",
    })
    }


    render(){
        return (
            <div>
                <div className="bgLogin mt-5">
                    <h3 className="text-center mt-1">SignUp Form</h3>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Name</label>
                        <input className="form-control" onChange={this.handleChange} type="text" value={this.state.name} name="name" placeholder="Enter Name" />
                    </div>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Email</label>
                        <input className="form-control" onChange={this.handleChange} type="email" value={this.state.email} name="email" placeholder="Enter email" />
                    </div>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Password</label>
                        <input className="form-control" onChange={this.handleChange} type="password" value={this.state.password} name="password" placeholder="Enter password" />
                    </div>
                    <div className="mx-3">
                        <label className="ml-1 mt-2">Mobile</label>
                        <input className="form-control" onChange={this.handleChange} type="number" value={this.state.mobile} name="mobile" placeholder="Enter Contact Number" />
                    </div>
                    <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.handleClick}>Sign Up</button>
                </div>
            </div>
        )
    }
}

export default SignUp
