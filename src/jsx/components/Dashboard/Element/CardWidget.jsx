import React from 'react';

const CardWidget = (props) => {
    return (
        <div className="card">
            <div className="card-body">
                <div className="media align-items-center">
                    <div className="media-body me-3">
                        <h2 className="fs-34 text-black font-w600">{props.number}</h2>
                        <span>{props.subtitle}</span>
                    </div>
                    {props.svg}
                </div>
            </div>
            <div className="progress  rounded-0" style={{height:"4px"}}>
                <div className="progress-bar rounded-0 bg-secondary progress-animated" style={{width: props.progress, height:"4px" }}>
                    <span className="sr-only">{props.progress} Complete</span>
                </div>
            </div>
        </div>
    );
};

export default CardWidget;