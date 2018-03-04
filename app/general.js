import React from "react";
import axios from 'axios';

import Stream from "./stream";
import Filter from "./filter";
class GeneralRoom extends React.Component
{
    constructor(props){
        super(props);

        this.state = {
            videos : [],
            pageToken : "",
            total : 0,
            resultPerPage : 0,
            selectedVideo : null,
            messages : [],
            messagePageToken: "",
            pollingIntervalMillis: 0,
            intervalId: null,
            q: "games",
            filterMessages: [],
            filterUser: null


          };
        this.searchVideos = this.searchVideos.bind(this);
        this.searchMessage = this.searchMessage.bind(this);
        this.handleOnSelectVideo = this.handleOnSelectVideo.bind(this);
        this.renderStreamModule = this.renderStreamModule.bind(this);
        this.renderFilterModule = this.renderFilterModule.bind(this);
        this.handleSearchAttemptSubmit = this.handleSearchAttemptSubmit.bind(this);
        this.filterMessages = this.filterMessages.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.onChangefilterUsername = this.onChangefilterUsername.bind(this);
    }



    componentDidMount()
    {
        this.searchVideos();
    }

    searchVideos()
    {
        axios.get('/search?q=' + this.state.q)
        .then(res => {
            var videos = res.data.videos;
            var pageToken = res.data.nextPageToken;
            var total = res.data.totalResults;
            var resultPerPage = res.data.resultsPerPage;
            this.setState({ 
                videos,
                pageToken,
                total,
                resultPerPage
            });
        }).catch( err => {
            console.log(err);
        });
    }

    searchMessage()
    {
        if(!this.state.selectedVideo){
            return;
        }
        axios.get('/messages?pageToken='+ this.state.messagePageToken)
        .then(res => {
            var timerID;
            var pollingIntervalMillis = res.data.pollingIntervalMillis;
            var pageToken = res.data.nextPageToken;
            var messages = this.state.messages;
            if(res.data.messages && res.data.messages.length > 0){
                messages = this.state.messages.concat(res.data.messages);
                var elem = document.getElementById('messages'); 
                if(elem)
                {
                    elem.scrollTop = elem.scrollHeight + 50;
                }
            }
            if(pollingIntervalMillis){
                if(pollingIntervalMillis < 5000){
                    pollingIntervalMillis = 5000;
                }
                timerID =  setTimeout(
                    this.searchMessage,
                    pollingIntervalMillis
                );
            }
            
            this.setState({ 
            messages,
            messagePageToken: pageToken,
            pollingIntervalMillis,
            intervalId: timerID
            });
        }).catch( err => {
            console.log(err);
        });


    }

    filterMessages(){
        if(!this.state.filterUser && this.state.messages.length > 0){
            return;
        }
        var username = this.state.filterUser;
        var messages = this.state.messages.slice();
        var messages = messages.filter( (message) => {
            if(message.displayName == username){
                return true;
            }

            return false;
        });
        this.setState({ 
            filterMessages: messages
        });
    }

    removeFilter(){
        this.setState({ 
            filterMessages: []
        });
    }
    handleOnSelectVideo(video)
    {
        clearTimeout(this.state.intervalId);
        axios.get('/liveChat?videoId='+video.id.videoId)
        .then(res => {
            var videos = res.data.videos;
            var pageToken = res.data.nextPageToken;
            var total = res.data.totalResults;
            var resultPerPage = res.data.resultsPerPage;
            this.setState({ 
                selectedVideo : video,
                messages: [],
                messagePageToken: "",
                intervalId: null
            });
            this.searchMessage();
        }).catch( err => {
            console.log(err);
        });


    }

    handleSearchAttemptSubmit(event)
  {
    event.preventDefault();
    this.searchVideos();
  }

  onChangefilterUsername(event){
    this.setState({filterUser: event.target.value})
  }
    renderStreamModule()
    {
        if(!this.state.selectedVideo)
        {
            return;
        }else{
            return (
                <Stream video={this.state.selectedVideo} messages={this.state.messages} onChangefilterUsername={this.onChangefilterUsername} filterMessages={this.filterMessages}/>
            );  
        }
    }

    renderFilterModule()
    {
        if(!this.state.filterMessages || this.state.filterMessages.length < 1)
        {
            return;
        }else{
            return (
                <Filter filterMessages={this.state.filterMessages} filterUser={this.state.filterUser} removeFilter={this.removeFilter}/>
            );  
        }
    }

    render(){
        const videos = this.state.videos.map((video) => {
            var selected  = false;
                 if(video == this.state.selectedVideo){
                    selected = true;
                }
            return (
                <div key={video.id.videoId} className={ (selected) ? "row selected": "row"}>
                    <div className="width-70 text-left"> 
                        <label>{video.title}</label>
                    </div>
                    <div className="width-30 text-right"> 
                        { (selected) ? <label>Watching</label>: <button onClick={() => this.handleOnSelectVideo(video)}>Watch</button>}
                        
                    </div>
                </div>
            );
        });
        return (
            <div>
                <div className="video-container video-background">
                    {this.renderStreamModule()}
                </div>
                {this.renderFilterModule()}
                <div className="list">
                    <div className= "row">
                        <div className="width-70 text-left">
                            <label>Select a Stream Video</label>
                        </div>
                        <div className="row width-30 text-right">
                            <form onSubmit={ this.handleSearchAttemptSubmit }>
                                <input value={this.state.q} onChange={ (ev) => this.setState({q: ev.target.value})} />
                                <input type="submit" className="" value="Go!"/>
                            </form>
                        </div>
                    </div>
                    {videos}
                    
                </div>
            </div>
        );
    }
}

export default GeneralRoom;