import React,{useEffect} from 'react'
import {Switch, Route,Link} from 'react-router-dom'
import Home from '../components/Home'
import Theatre from '../components/Theatre'
import Seat from '../components/Seat'
import Booking from '../components/Bookings'
import SignUp from '../auth/Signup'
import SignIn from '../auth/Signin'
import {signout,login} from '../redux/Action'
import { connect } from "react-redux"


function Routes(props){
    useEffect(() => {
        let name = localStorage.getItem('user')
        if(localStorage.getItem('user') != null){
            props.login({"isloggedIn":true,"user":name})
        }
      });

    const handleclick = ()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem("isLoggedIn")
            localStorage.setItem("isLoggedIn",false)
            props.signout(false)
        }

        return (
            <div>
                <nav className="navbar navbar-expand-lg bg-dark" >
                    <h3 className="navbar-brand text-white" ><Link to="/">Watcher's</Link></h3>
                    <div className=" navbar-collapse" id="navbarNav">
                        <div className="ml-auto text-white">Hello {props.user}!</div>
                        <ul className="navbar-nav float-left">
                            <li className="nav-item active ml-3 ">
                                <Link to="/booking" >My Bookings</Link>
                            </li>
                        </ul>
                        {props.isloggedIn ? (
                            <div className="ml-auto">
                                <button className = "btn btn-info m-2" onClick={handleclick}>Sign off</button>
                            </div> 
                            ):(
                                <div className="ml-auto">
                                    <Link to="/signin" className = "btn btn-info">Sign In</Link>
                                </div> 
                            )}
                    </div>
                </nav>
                <Switch>
                    <Route path="/" exact component = {Home} />
                    <Route path="/theatre/:id" component = {(props) => <Theatre {...props} />} />
                    <Route path="/screen/:id" component = {(props) => <Seat {...props} />} />
                    <Route path="/booking" exact component = {Booking} />
                    <Route path="/signin" exact component = {SignIn} />
                    <Route path="/signup" exact component = {SignUp} />
                </Switch>
            </div>
        )
}

const mapStateToProps = state => ({
    user: state.user,
    isloggedIn : state.isloggedIn
});
  
const mapDispatchToProps = dispatch => ({
    signout: payload => dispatch(signout(payload)),
    login: payload => dispatch(login(payload))
});

export default connect(mapStateToProps,mapDispatchToProps) (Routes)
