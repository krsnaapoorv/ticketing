import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import {Link} from 'react-router-dom'


class Theatre extends Component {
    constructor(props){
        super(props)
        this.state = {
            theatre:[]
        }
    }

    componentDidMount=()=>{
        let id = this.props.match.params.id
        axios.post('http://127.0.0.1:5000/gettheatre',{
            "mid":id
        }).then
            (res =>{
                console.log(res.data)
                this.setState({
                    theatre:res.data.theatres,
                })
            }
            ).catch(error => swal(error,"try again","error"))
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                        <div className="row justify-content-center">
                            {this.state.theatre.map(ele => (
                            <div className="card m-2" style={{width:"12rem"}}>
                                    <img className="card-img-top" src="/thinkify.png" alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{ele.tname}</h5>
                                        <p className="card-text">contact - {ele.phone}</p>
                                        <Link to={`/screen/${this.props.match.params.id}/${ele.tid}`}><button className="btn btn-warning">Book seat</button></Link>
                                    </div>
                                </div> 
                            ))}
                        </div>
                    </div>
            </div>
        )
    }
}


export default Theatre
