import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTestimonialsLoaded: false,
      isTagsLoaded:         false,
      testimonial:          [],
      tags:                 [],
      error:                ""
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:1337/testimonial/get_all")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isTestimonialsLoaded: true,
            testimonial: result.data
          });
        },
        (error) => {
          this.setState({
            isTestimonialsLoaded: true,
            error
          });
        }
      )

      fetch("http://127.0.0.1:1337/testimonial/get_tags")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isTagsLoaded: true,
            tags: result.data
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

  getTestimonialByTag(tag_id){
    var postData = { id: tag_id };

    axios.post("http://127.0.0.1:1337/testimonial/get_testmonial_by_tag", postData)
        .then((result) => {
            console.log(result.data.data);
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
      var tags = this.state.tags.map(function (item, index) {
                  return (
                    <span key={"tag_"+item.id+"_"+item.tag} className="Tag Tag-info Tag-small" onClick={() => that.getTestimonialByTag(item.id)}> {item.tag} </span>
                  )
              })

      var testimonial = this.state.testimonial.map(function (item, index) {
        
                  var tags = item.tags.map(function (tag, index) {
                              return  <span key={item.id+"_"+tag} className="Tag Tag-info"> {tag} </span>
                            })

                  return (
                    <div className="row Card" key={"testimonial_"+item.id}>
                        <div className="col-sm-6">
                          <p>
                            {item.title}
                          </p>
                        </div>
                        <div className="col-sm-2">
                          {item.cl_year}/{item.cl_month}
                        </div>
                        <div className="col-sm-4">
                          {tags}
                        </div>
                      </div>
                  )
              })

      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Testimonial Library</h1>
            <br/>
              <input type="text" placeholder="Search..." required className="Search-box"/>
              <input type="button" value="Search" className="Search-button"/>
            <br/>
            {tags}
          </header>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <label><b>Title</b></label>
              </div>
              <div className="col-sm-2">
                <label><b>CL Issue</b></label>
              </div>
              <div className="col-sm-4">
                <label><b>Tags</b></label>
              </div>
            </div>
            {testimonial}
          </div>
          
        </div>
      )
    }
    
  }
}



export default App;
