import React from "react";
import axios from 'axios';

class Stream extends React.Component
{
    constructor(props){
        super(props);
        this.renderVideo = this.renderVideo.bind(this);
    }

    renderVideo(){
        return (
            <iframe key={this.props.video.id.videoId} width="600" height="350" src={"https://www.youtube.com/embed/live_stream?autoplay=1&channel="+this.props.video.channelId} frameBorder="0" allowFullScreen></iframe>
        );
    }
    render(){
        

        const messages = this.props.messages.map((message) => {
            return (
                <div key={message.id}>
                    <p><span>{message.displayName}:</span>{message.textMessageDetails}</p>
                </div>
            );
        });
        return (   
            <div className="video-container">        
                <div className="video">
                    {this.renderVideo()}
                </div>
                <div className="section-messages">
                    <div id="messages" className="messages">
                        {messages}
                    </div>
                    <div className="row">
                        <div className="width-70 text-left">
                            <input value={this.props.filterUsername} onChange={ this.props.onChangefilterUsername } />
                        </div>
                        <div className="width-30 text-right">
                            <input onClick={this.props.filterMessages} type="submit" className="" value="Filter!"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Stream;