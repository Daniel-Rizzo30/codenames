import React, { Component } from "react";
import "./Card.css"



class Card extends Component{
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            task: '',
            team: '',
            content: '',
            turn: true, // true = blue turn && false = red turn
            redteamid: '',
            blueteamid: '',

            // WebSocket
            ws: null,
            number: 0, // Need to get number of card from props, can just pass it in from the game page when calling Row
            // So all checkboxes should check with one check for right now

            winningTeam: '',
        }
        //this.socketSend = this.socketSend.bind(this);
    }

    // socketSend = () => {
    //     var data = {
    //         "number": this.state.number,
    //         "checked": true //this.state.checked // Hard coded to true, it'll never be false ?
    //     }
    //     this.state.ws.send(JSON.stringify(data)) // Testing send
    //     console.log(data)
    // }
    
    componentDidMount = () => {
        this.setState({
            task: this.props.task,
            team: this.state.team,
            turn: this.state.turn,
            number: this.props.number            
        })
        // if (this.props.task === "O") {
        //     this.connect();
        // }
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures 
     * constant reconnection if connection closes
    */
    // connect = () => {
    //     var ws = new WebSocket('ws://localhost:8000/ws2/game/');
    //     let that = this; // cache the this
    //     var connectInterval;

    //     // websocket onopen event listener
    //     ws.onopen = () => {
    //         console.log("connected websocket main component");
    //         this.setState({ ws: ws });

    //         that.timeout = 250; // reset timer to 250 on open of websocket connection 
    //         clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    //     };

    //     // websocket onclose event listener
    //     ws.onclose = e => {
    //         console.log(
    //             `Socket is closed. Reconnect will be attempted in ${Math.min(
    //                 10000 / 1000,
    //                 (that.timeout + that.timeout) / 1000
    //             )} second.`,
    //             e.reason
    //         );

    //         that.timeout = that.timeout + that.timeout; //increment retry interval
    //         connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    //     };

    //     // websocket onerror event listener
    //     ws.onerror = err => {
    //         console.error(
    //             "Socket encountered error: ",
    //             err.message,
    //             "Closing socket"
    //         );

    //         ws.close();
    //     };

    //     ws.onmessage = evt => {
    //         // listen to data sent from the websocket server
    //         const data = JSON.parse(evt.data)
    //         console.log(data)
    //         console.log("received check!")
    //         let number = data.number
    //         let checked = data.checked
    //         if (number === this.state.number) {
    //             this.setState(prevState => {
    //                 return {
    //                     checked: checked
    //                 }
    //             })
    //         }
    //     };
    //     this.setState(prevState => {
    //         return {
    //             ws: ws
    //         }
    //     })
    // };

    // /**
    //  * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
    //  */
    // check = () => {
    //     const { ws } = this.state.ws;
    //     if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    // };

    componentDidUpdate = (event) => {
        if (event.word !== this.props.word) {
            this.setState(prevState => {
                return {
                    content: this.props.word,
                }
            })

            if(this.props.word.category === 'A' || this.props.word.category === 'R' || this.props.word.category === 'B') {
                let wordGuessed = localStorage.getItem(this.props.word.word_id);
                this.setState({
                    checked: wordGuessed
                })
            }
        }
    }

    handleChange = () => {

        if(!this.state.checked) {
            this.setState({
                checked: true,
                turn: !this.state.turn            
            })
            console.log(this.state.checked)
            this.props.increaseTeamPoints(this.state.content.category, this.state.content.word_id)
            localStorage.setItem(this.state.content.word_id, JSON.stringify(true))
            //this.socketSend() 
        }


    }
    

    render(){
        return(
            <div>

                {(this.state.task === 'O') ?
                <div>
                <div className="card-deck">
                <div className="card-style"></div>    
                <input  className = "checkboxStructure"
                        id = "checkbox"
                        type = "checkbox"
						checked = {this.state.checked}
                        onChange={this.handleChange}/><br/> {/* onChange */}
                <div>
                {(!this.state.checked) ?
                <div>
                    <h5 className="card-text">{this.state.content.word}</h5><br/>
                </div>
                :
                <div>
                    <h5 className={`card-text-${this.state.content.category}`}>{this.state.content.word}</h5><br/>
                </div>
                }
                </div>
                </div>
                </div>
                :
                <div>
                    <br/>
                    <h5 className={`card-deck-${this.state.content.category}`} >{this.state.content.word}</h5>
                    <br/>
                </div>
                }
                

            </div>
        )
    }
}

export default Card