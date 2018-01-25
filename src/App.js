import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import  Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js'


const app = new Clarifai.App({
  apiKey: 'eb08fd288188422685a7265fdbc5c099'
 });

const particlesOptions = {
                  particles: {
                      number: {
                        value: 30,
                        density: {
                          enable: true,
                          value_area: 800
                        }
                      }
                    }
                  }

class App extends Component { 
  /*
  State knows the value the user entered,
  updates it and changes if needed
  */
    constructor() {  // constructor to add state to the app, the app will remember user inputs
      super();
      this.state = {
        // user input
        input: '',
        imageURL: '',
        box: {},
        route:'signin', // Keep track of where we are on the page
        isSignedIn: false
      }
    }

  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height = Number(image.height);
     //console.log( width, height);
     return {
       leftCol: clarifaiFace.left_col * width,
       topRow: clarifaiFace.top_row * height,
       rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height)
     }

  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  // event listener on a web page, we also receive an event
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }  
 
  onButtonSubmit = () => {
       this.setState({imageURL: this.state.input});
       app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
       .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
       .catch(error => console.log(error));
  }

  onRouteChange = (route) => {
    if ( route === 'signout') {
      this.setState({isSignedIn: false})
    } else if ( route === 'home') {
      this.setState({ isSignedIn: true})
    }
    this.setState({route:route});
    
  }

  render() {
    
   const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className = 'particles' params = {particlesOptions} />
         <Navigation isSignedIn= {isSignedIn} onRouteChange = {this.onRouteChange } />  
         { 
           route === 'home'
             ?  <div>
                <Logo />
                <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit}/* this. must be in because on input change is a property of App */ />
                <Rank /> 
                <FaceRecognition box= {box} imageURL = {imageURL}/>
         </div>
             : (
                route === 'signin'
              ? <Signin onRouteChange = {this.onRouteChange}/>
              : <Register onRouteChange = {this.onRouteChange} /> 
             )
         }
      </div>
    );
  }
}

export default App;
