import React, { Component } from 'react';
import { render } from 'react-dom';
import Webcam from "react-webcam";
import styled from 'styled-components';
import './style.css';
const camera = "environment";

const width = "15%";
const height = "10%";

const Styled = {
  Root: styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
  `,
  Webcam: styled(Webcam)`
    position: absolute;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  `,
  Border: styled.div`
    position: absolute;
    top: calc(${() => height} - 3px);
    left: calc(${() => width} - 3px);
    width:  calc(100% - ${() => width} * 2 - 4px);
    height: calc(100% - ${() => height} * 2 - 4px);
    border: 6px solid #ddd8e6;
    border-radius: 10px
    box-shadow: 0px 0px 0px 9999px rgba(0,0,0,0.5);

  `,
  Comments: styled.div`
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: #f8e71c;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    & > p {
      font-size: 14px;
      text-align: center;
      line-height: 1.3em;
    }
  `,
  Countdown: styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    & > span {
      color: white;
      font-size: 72px;
    }
  `,
  Confirm: styled.div`
    width: 100%;
    height: 100%;
    background-image: url("${({file}) => file}");
    background-position: center;
    background-size: cover;
  `,
  Center: styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    bottom: 20px;
  `,
  Button: styled.div`
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: red;
    bottom: 8%;
    z-index: 10;
  `,
}

class App extends Component {
  constructor(props){ 
    super(props);
    this.webcam = React.createRef();
    this.state = {
      viewState: 0,
      countdown: 3,
      file: undefined,
      happy: undefined,
      sad: undefined
    };
  }

  renderWebcam = () => (
    <Styled.Webcam audio={false} screenshotWidth={1080} videoConstraints={{ facingMode: camera, width: 1920, height: 1080 }} ref={this.webcam} />
  )

  renderWaitingShot = () => (
    <>
      {this.renderWebcam()}
      <Styled.Center>
        <Styled.Button onClick={this.handleTakePhoto} />
      </Styled.Center>
    </>
  )

  renderCountdown = () => (
    <>
      {this.renderWebcam()}
      <Styled.Countdown>
        <span>{this.state.countdown}</span>
      </Styled.Countdown>
    </>
  )

  renderConfirmScreen = () => (
    <Styled.Confirm file={this.state.file}>
      <Styled.Comments style={{top: "50%", left: "7%"}}>
        <p>Happy<br />{this.state.happy}</p>
      </Styled.Comments>
      <Styled.Comments style={{top: "7%", right: "3%"}}>
        <p>Sad<br />{this.state.sad}</p>
      </Styled.Comments>
    </Styled.Confirm>
  )

  handleTakePhoto = () => {
      this.timer = setInterval(() => {
        if(this.state.countdown === 1) {
          new Promise((resolve, reject) => {
            this.setState({file: this.webcam.current.getScreenshot()});
                let newImage=this.state.file.replace(/^data:image\/[a-z]+;base64,/, "");
                let payload={
                  "requests":[
                    {
                      "image":{
                        "content":newImage
                      },
                      "features":[
                        {
                          "type":"FACE_DETECTION",
                          "maxResults":5
                        },
                        {
                          "type":"LABEL_DETECTION",
                          "maxResults":5
                        },{
                          "type":"WEB_DETECTION",
                          "maxResults":5
                        }
                      ]
                    }
                  ]
                }
                let apiKey="AIzaSyC-VPmACN5h3DlWeo06GRznEzxFenC9Eeo"
                fetch("https://vision.googleapis.com/v1/images:annotate?key="+apiKey,{method:"post",body:JSON.stringify(payload)})
              .then(res => {
                if (res.status !== 200) {
                  console.log('Looks like there was a problem. Status Code: ' +
                    res.status);
                  return;
                }
                // Examine the text in the response
              res.json().then((data) =>{
                this.setState({sad: data.responses[0].faceAnnotations[0].sorrowLikelihood})
                this.setState({happy: data.responses[0].faceAnnotations[0].joyLikelihood})
                console.log(data.responses[0].faceAnnotations.joyLikelihood);
              });
              //.responses[0].faceAnnotations.joyLikelihood)
                //res.json()
              })
              .catch(function(err) {
                console.log('Fetch Error :-S', err);
              });
            resolve();
          });
        }

        if (this.state.countdown > 1) {
          this.setState({countdown: this.state.countdown - 1});
        }else{
          clearInterval(this.timer);
          this.setState({viewState: 2});
        }
      }, 1000);
      
      this.setState({viewState: 1, countdown: 3});
  }

  handleReTakePhoto = () => {

  }

  renderMainView = () => {
    switch(this.state.viewState) {
      case 0:
        return this.renderWaitingShot();
      case 1:
        return this.renderCountdown();
      case 2:
        return this.renderConfirmScreen();
    }
  }

  render() {
    return (
      <Styled.Root>
        {this.renderMainView()}
        <Styled.Border />
      </Styled.Root>
    );
  }
}

export default App;
