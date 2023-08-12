import React, { Component } from 'react';
import "../css/popup.css";

class PoPUp extends Component {
    state = {  } 
    render() { 
        return <React.Fragment>
            <div className="popup" id={this.props.id}>
                <span id='popup_header'>{ this.props.header }</span>
                <span id='popup_body'>{this.props.text }</span>
            </div>
        </React.Fragment>;
    }
}
 

export default PoPUp;