import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import {Link} from 'react-router-dom'


class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            movie:[],
            categorySelect: "",
            languageSelect: "",
            category:[],
            language:[]
        }
    }

    fetchMovie = () => {
        axios.get('http://127.0.0.1:5000/getmovies',{}).then
        (res =>{
            this.setState({
                movie:res.data.movies,
            })
        }
        ).catch(error => swal(error,"try again","error"))
    }


    componentDidMount = () =>{
        axios.get('http://127.0.0.1:5000/category',{}).then
            (res =>{
                this.setState({
                    category:res.data.category,
                    language:res.data.language
                })
            }
            ).catch(error => swal(error,"try again","error"))

            this.fetchMovie()
    }

    categoryChange = (e) => {
        this.setState({
            categorySelect: e.target.value
        })
        axios.post('http://127.0.0.1:5000/categoryfilter',{
            "cid" : e.target.value
        }).then
        (res =>{
            this.setState({
                movie:res.data.movies,
            })
        }
        ).catch(error => swal(error,"try again","error"))
    }

    languageChange = (e) => {
        this.setState({
            languageSelect: e.target.value
        })
        axios.post('http://127.0.0.1:5000/languagefilter',{
            "language" : e.target.value
        }).then
        (res =>{
            this.setState({
                movie:res.data.movies,
            })
        }
        ).catch(error => swal(error,"try again","error"))
    }


    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className = "col ml-3 mt-2">
                            <div className="card" style={{width:"12rem"}}>
                                <div className="card-body">
                                    <h5 className="card-title">Category Filter</h5>
                                    <select className="custom-select" id="inputGroupSelect01" name="categorySelect" value={this.state.categorySelect} onChange={this.categoryChange} >
                                        <option defaultValue>Choose..</option>
                                        <option value="all">All</option>
                                        {this.state.category.map(ele => (
                                            <option key={ele.cname} value={ele.cid}>{ele.cname}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className = "col mt-2">
                            <div className="card" style={{width:"12rem"}}>
                                <div className="card-body">
                                    <h5 className="card-title">Language Filter</h5>
                                    <select className="custom-select" id="inputGroupSelect01" name="languageSelect" value={this.state.languageSelect} onChange={this.languageChange} >
                                        <option defaultValue>Choose..</option>
                                        <option value="all">All</option>
                                        {this.state.language.map(ele => (
                                            <option key={ele.language} value={ele.language}>{ele.language}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            {this.state.movie.map(ele => (
                            <div className="card m-2" style={{width:"12rem"}}>
                                    <img className="card-img-top" src="/thinkify.png" alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{ele.mname}</h5>
                                        <p className="card-text">Language - {ele.language}</p>
                                        <Link to={`/theatre/${ele.mid}`}><button className="btn btn-warning">Show Theatre</button></Link>
                                    </div>
                                </div> 
                            ))}
                        </div>
                    </div>
                </div>              
            </div>  
        )
    }
}


export default Home
