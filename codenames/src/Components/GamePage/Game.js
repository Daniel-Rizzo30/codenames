import React, {Component} from 'react'
import './Game.css'
import axios from 'axios'
import SpymastersGame from './Spymasters/SpymastersGame.js'
import OperativesGame from './Operatives/OperativesGame.js'


class Game extends Component {
    constructor() {
        super()
        this.state = {
            room_key: '',
            roomid: '',
            nickname: '',
            team: '',
            playerid: '',
            task: '',
            red_score: 0,
            blue_score: 0,
            gameid: '',
            gameData: '', 
            gameWords: '',
            doubleAgent: '',
            doubleAgentIndex: '',
            playersdata: '',
            agentClicked: false,

            redteamid: '',
            blueteamid: '',
            

            
        }
    }

    



    componentDidMount = async () =>{
        let gameWords = this.props.location.state.gameWords;
        for(let i = 0; i < gameWords.length; i++) {
            if(gameWords[i].category === 'D') {
                this.setState({
                    doubleAgent: gameWords[i],
                    doubleAgentIndex: i
                })
            }
        }


        await axios.get('http://127.0.0.1:8000/codenames/players').then(res => {
            this.setState({
                playersdata: res.data
            })
            let playerExist = false;
            for(let i = 0; i < res.data.length; i++) {
                if(res.data[i].game_id === this.props.location.state.gameid && res.data[i].room === this.props.location.state.room_key && res.data[i].user_id === this.props.location.state.playerid) {
                    playerExist = true;
                }
            }

            if(playerExist === false) {
                axios.post('http://127.0.0.1:8000/codenames/players', {
                    operative_screen_name: this.props.location.state.nickname,
                    team: this.props.location.state.team,
                    role: this.props.location.state.task,
                    room: this.props.location.state.room_key,
                    game_id: this.props.location.state.gameid,
                    user_id: this.props.location.state.playerid
                }).then(response =>{
                    this.setState({
                        playersdata: [...this.state.playersdata, response.data]
                    })
                })
            }
        })
        this.setState({
            room_key: this.props.location.state.room_key,
            roomid: this.props.location.state.roomid,
            nickname: this.props.location.state.nickname,
            team: this.props.location.state.team,
            task: this.props.location.state.task,
            gameid: this.props.location.state.gameid,
            gameData: this.props.location.state.gameData,
            gameWords: this.props.location.state.gameWords,
            playerid: this.props.location.state.playerid,
            redteamid: this.props.location.state.redteamid,
            blueteamid: this.props.location.state.blueteamid,
        })

        this.updateGameWords(this.props.location.state.gameid)

    }
    setDoubleAgent = () => {
        let doubleAgent = { ...this.state.doubleAgent}; 
        doubleAgent.category = this.state.team;
        let agentClicked = this.state.agentClicked;
        agentClicked = true;
        this.setState({
            doubleAgent,
            agentClicked
        })

        axios.put(`http://127.0.0.1:8000/codenames/games/word/${this.state.doubleAgent.word_id}`, doubleAgent)
            .then(res => {
                console.log(res)
                this.updateGameWords(this.state.gameid)
            })
    }

    updateGameWords = (gameid) => {
        axios.get(`http://127.0.0.1:8000/codenames/games/${gameid}`).then(res => {
            this.setState({ 
                gameWords: res.data.gameWords 
            })
        
        })
    }

    increaseTeamPoints = (team, word) => {
        let redPoints = this.state.red_score
        let bluePoints = this.state.blue_score
        if(team === 'R'){
            console.log("IT RAN")
            this.setState(prevState => {
                return {
                    red_score: prevState.red_score+1,
                }
            })
            redPoints += 1
            
            axios.patch(`http://127.0.0.1:8000/codenames/games/word/${word}`, {guessed:true}).then(response => {
                console.log(response.data)
            })
            axios.patch(`http://127.0.0.1:8000/codenames/redTeam/${this.state.redteamid}`, {red_team_score: redPoints}).then(response => {
                console.log(response.data)
            })
        }
        else if(team === 'B'){
            this.setState(prevState => {
                return {
                    blue_score: prevState.blue_score+1,
                }
            })
            bluePoints += 1
            axios.patch(`http://127.0.0.1:8000/codenames/games/word/${word}`, {guessed:true}).then(response => {
                console.log(response.data)
            })
            axios.patch(`http://127.0.0.1:8000/codenames/blueTeam/${this.state.blueteamid}`, {blue_team_score: bluePoints}).then(response => {
                console.log(response.data)
            })
        }

        
        
    }

    
    

    render() {
        
        return(
            <div>
                {
                    this.state.task === 'S' ?
                    
                    <div>
                        {
                        this.state.agentClicked === false ?
                        <div>
                            <button onClick={this.setDoubleAgent}>I WANT FIRST</button> 
                            <SpymastersGame 
                                room_key = {this.state.room_key}
                                gameWords = {this.state.gameWords}
                                increaseTeamPoints = {this.increaseTeamPoints}
                                redPoints = {this.state.red_score}
                                bluePoints = {this.state.blue_score}
                                playersdata = {this.state.playersdata}
                                gameid = {this.state.gameid}
                            />
                        </div>

                        :

                        <div>
                            <SpymastersGame 
                                    room_key = {this.state.room_key}
                                    gameWords = {this.state.gameWords}
                                    increaseTeamPoints = {this.increaseTeamPoints}
                                    redPoints = {this.state.red_score}
                                    bluePoints = {this.state.blue_score}
                                    playersdata = {this.state.playersdata}
                                    gameid = {this.state.gameid}
                            />
                        </div>
                        }
                    </div>
                    : 

                    <OperativesGame 
                        room_key = {this.state.room_key}
                        gameWords = {this.state.gameWords}
                        increaseTeamPoints = {this.increaseTeamPoints}
                        redPoints = {this.state.red_score}
                        bluePoints = {this.state.blue_score}
                        playersdata = {this.state.playersdata}
                    />
                }
            </div>
        )
    }
}

export default Game