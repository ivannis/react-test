import React from "react";
import FreeScrollBar from 'react-free-scrollbar';

const styles = `   
    .scrollbar-vertical-track {
        background-color: transparent;
        width: 10px;
        transition: opacity 0.3s;
    }
    .scrollbar-horizontal-track {
        background-color: transparent;
        height: 10px;
        transition: opacity 0.3s;
    }
    .scrollbar-vertical-handler {
        width: 8px;
        right: 1px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
    }
    .scrollbar-vertical-handler:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }
    .scrollbar-horizontal-handler {
        height: 8px;
        bottom: 1px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
    }
    .scrollbar-horizontal-handler:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }
`
const globalStyles = `   
    .FreeScrollbar-container {
        padding-right: 17px;
    }    
`

export default class Scrollbar extends React.Component {
    render() {        
        return (
            <div style={{width: "100%", height: "100%"}}>
                <style jsx="true">{styles}</style>
                <style global="true" jsx="true">{globalStyles}</style>
                <FreeScrollBar
                    className="scrollbar"
                    tracksize="20px"
                    style={{width: "100%", height: "100%"}} 
                    autohide={true}
                >
                    {this.props.children}
                </FreeScrollBar>
            </div> 
        );
    }
}