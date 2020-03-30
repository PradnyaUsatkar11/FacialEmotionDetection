import React, { Component } from 'react';
import { render } from 'react-dom';
import Webcam from "react-webcam";
import styled from 'styled-components';
import './style.css';
import {
  Rectangle
} from 'draw-shape-reactjs';
const camera = "environment";
const request = require('request-promise');


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
    background-image: url("${({ file }) => file}");
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
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      viewState: 0,
      countdown: 3,
      emotion: undefined,
      file: undefined,
      faces: [],
      // Angry: undefined,
      // Disgusted: undefined,
      // Happy: undefined,
      // Sad: undefined,
      // Neutral: undefined,
      // Fearful: undefined,
      // Surprised: undefined,
      rectangle: undefined,
    };
  }

  renderWebcam = () => (
    <Styled.Webcam audio={false} screenshotWidth={1080} videoConstraints={{ facingMode: camera, width: 1920, height: 1080 }} ref={this.webcam} screenshotFormat="image/jpeg" />
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


  renderMultipleFace = (response) => (

    this.setState({
      faces: response.map((i) => {
        return (<li><Styled.Comments style={{ top: 25 + "%", left: 7 + "%" }}>
          <p>{response[i].emotion}</p>
        </Styled.Comments></li>
        )
      })
    })

  )

  renderConfirmScreen = (emotion, i) => (
    <Styled.Confirm file={this.state.file}>
      {this.state.faces}
    </Styled.Confirm>

  )

  handleTakePhoto = async () => {
    this.timer = setInterval(() => {
      if (this.state.countdown === 1) {
        new Promise(async (resolve, reject) => {
          this.setState({ file: this.webcam.current.getScreenshot() });
          //    let newImage=this.state.file.replace(/^data:image\/[a-z]+;base64,/, "");
          var options = {
            'method': 'POST',
            'url': 'http://34.93.166.145:8080/api/image/',
            'headers': {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "image": this.state.file })

          };
          try {
            let response = await request(options);
            console.log("code..", typeof response)
            if (response) {
              response = JSON.parse(response)
              console.log("response.body[success][0].emotion", response["success"])
              if (response["success"].length > 0) {
                this.renderMultipleFace(response["success"])
                // for (let i = 0; i < response["success"].length; i++) {
                //   console.log("response.body[success][0].emotion", response["success"][0].emotion)
                //   this.setState({ emotion: response["success"][i].emotion })
                //   this.renderMultipleFace(i)
                //   this.updateCanvas()
                // }
              }
              else {
                this.setState({ emotion: "No face" })
              }
            }
            else {
              console.log("Some error occurred")
            }
            resolve();
          }
          catch (error) {
            console.log("error in api call...")
            reject();
          }
        })
      }
      if (this.state.countdown > 1) {
        this.setState({ countdown: this.state.countdown - 1 });
      } else {
        clearInterval(this.timer);
        this.setState({ viewState: 2 });
      }
    }, 1000);

    this.setState({ viewState: 1, countdown: 3 });
  }

  handleReTakePhoto = () => {

  }

  rect = (values) => {
    const { ctx, x, y, width, height } = values;
    ctx.fillRect(x, y, width, height);
  }

  updateCanvas = () => {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0, 0, 300, 300);
    // draw children “components”
    this.rect({ ctx, x: 10, y: 10, width: 50, height: 50 });
    this.rect({ ctx, x: 110, y: 110, width: 50, height: 50 });
  }

  renderMainView = () => {
    switch (this.state.viewState) {
      case 0:
        return this.renderWaitingShot();
      case 1:
        return this.renderCountdown();
      case 2:
        {
          return this.renderConfirmScreen();
        }
    }
  }

  render() {
    return (
      <Styled.Root>
        {this.renderMainView()}
        <canvas ref="canvas" />
        <Styled.Border />
      </Styled.Root>
    );
  }
}

export default App;
