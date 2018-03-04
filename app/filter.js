import React from "react";
import axios from 'axios';

class Filter extends React.Component
{
    constructor(props){
        super(props);
    }

    
    render(){
        const messages = this.props.filterMessages.map((message) => {
            return (
                <div key={message.id}>
                    <p><span>{message.displayName}:</span>{message.textMessageDetails}</p>
                </div>
            );
        });
        return (
            <div className="section-filter">
                <div className="row">
                    <div className="width-70 text-left">
                        <h2> Messages From the User {this.props.filterUser}</h2>
                    </div>
                    <div className="width-30 text-right">
                        <input onClick={this.props.removeFilter} type="submit" className="" value="Close"/>
                    </div>
                </div>
                {messages}
            </div>
        );
    }
}

export default Filter;