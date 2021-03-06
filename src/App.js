import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
var base_url = require('./common.js').base_url; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTestimonialsLoaded:     false,
      isTagsLoaded:             false,
      testimonial:              [],
      tags:                     [],
      error:                    "",
      searchText:               "",
      currentPage:              0,
      sizeOfTestimonial:        0,
      pageNumberskey:           [], 
   
    };

    this.onSearchChange   = this.onSearchChange.bind(this);
    this.getTestimonial   = this.getTestimonial.bind(this);
    this.onPageChange     = this.onPageChange.bind(this);
  }

  componentDidMount() {
      this.getTestimonial(this.state.currentPage)

      fetch(base_url+"/testimonial/get_tags")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isTagsLoaded: true,
            tags: [
                  {
                      "id": 0,
                      "tag": "All"
                  }].concat(result.data)
          });
        },
        (error) => {
          this.setState({
            isTagsLoaded: true,
            error
          });
        }
      )
  }

  getTestimonial(pagination){
    axios.post(base_url+"/testimonial/get_all", {pagination: pagination})
        .then((result) => {

           // Logic for displaying page numbers
          const pageNumbers = [];
          for (let i = 1; i <= Math.ceil(result.data.size.count / 100); i++) {
            pageNumbers.push(i);
          }

          this.setState({
            isTestimonialsLoaded: true,
            testimonial: result.data.data,
            sizeOfTestimonial: result.data.size.count,
            pageNumberskey: pageNumbers
          });
        })
        .catch((error) => {
           this.setState({
            isTestimonialsLoaded: true,
            error
          });
        })
  }

  getTestimonialByTag(tag_id){
    if(tag_id === 0){
      this.getTestimonial(0) //reset page to 1
      this.setState({
        currentPage: 0
      })
      return
    }
    else{
      var postData = { id: tag_id };

      axios.post(base_url+"/testimonial/get_testmonial_by_tag", postData)
          .then((result) => {
            this.setState({
              testimonial: result.data.data
            });
          })
          .catch((error) => {
             this.setState({
              error
            });
          })
    }
  }

  onPageChange(e){
    var page = Number(e.target.id)-1
    if(this.state.currentPage !== page){
      this.setState({
        currentPage: page
      })
      this.getTestimonial(page)
    }
  }

  onSearch(){
    if(this.state.searchText.trim() === ''){
      alert("Enter some text")
      return
    }
    var postData = { search_text: this.state.searchText.trim() };

    axios.post(base_url+"/testimonial/search", postData)
        .then((result) => {
          this.setState({
            testimonial: result.data.data
          });
        })
        .catch((error) => {
           this.setState({
            error
          });
        })
  }

  onSearchChange(e) {
    this.setState({ searchText: e.target.value });
  }

  render() {
    if(this.state.isLoaded === false){
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              Loading....
            </p>
          </div>
        )
    }
    else{
      var that = this
      var body
      var tags = this.state.tags.map(function (item, index) {
                  return (
                    <span key={"tag_"+item.id+"_"+item.tag} className="Tag Tag-info Tag-small" onClick={() => that.getTestimonialByTag(item.id)}> {item.tag} </span>
                  )
              })

      var testimonial = this.state.testimonial.map(function (item, index) {
        
                  var tags = item.tags.map(function (tag, index) {
                              return  <span key={item.id+"_"+tag} className="Tag Tag-info Tag-small" onClick={() => that.getTestimonialByTag(tag.id)}> {tag} </span>
                            })

                  return (
                    <div className="row Card" key={"testimonial_"+item.id}>
                            <div className="col-md-12 col-sm-12">
                              <b>{item.title}</b> ({item.division})
                            </div>
                            <div className="col-md-12 col-sm-12 Card-h4">
                              {item.from}
                            </div>
                            <div className="col-md-12 col-sm-12 Card-h4">
                              Issue: {item.cl_year}/{item.cl_month} 
                            </div>
                            <div className="col-md-12 col-sm-12 Card-h4">
                              Page: {item.page}
                            </div>
                            <div className="col-md-12 col-sm-12 Card-offset-margin">
                              {tags}
                            </div>
                            <div className="col-md-12 col-sm-12 Card-h3 Card-description-margin">
                              {item.description}
                            </div>
                    </div>
                  )
              })
      
      var pagination = this.state.pageNumberskey.map(number => {
                var classname 
                if(this.state.currentPage === number-1){
                  classname = "Pagination-body Pagination-current"
                }
                else{
                  classname = "Pagination-body"
                }
                return (
                  <span key={number} id={number} className={classname} onClick={this.onPageChange}>{number} </span>
                )
            })


      pagination = <div>{pagination}</div>

      if(this.state.testimonial.length === 0){
        body = <div className="container">
          <p>No testimonial found</p>
        </div>
      }
      else{
        body = <div className="container">
          {testimonial}
        </div>
      }

      return (
        <div className="App ">
          <div className="">
            <div className="row">
              <div className="col-sm-2 col-2 flower_left">
              </div>
              <div className="col-sm-8 col-8">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Creative Life Testimonial Reference</h1>
                  <div className="Search-body">
                      <input type="text" placeholder="Search..." required className="Search-box" onChange={this.onSearchChange} onSubmit={()=>this.onSearch()}/>
                      <input type="button" value="Search" className="Search-button" onClick={()=>this.onSearch()}/>
                  </div>
                  {tags}
                  
                </header>
                {body}
                {pagination}
              </div>
              <div className="col-sm-2 col-2 flower_right">
              </div>
            </div>
          </div>

        </div>
      )
    }
    
  }
}



export default App;
