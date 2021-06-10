import React, { FC } from 'react';

interface IMessage {
    message: String,
    sender: String,
    receiver: String,
    datesent: Date,
}

const ReceivedItem: FC<IMessage> = (props) => {
    return (
        <div className="received-item">
            <div className="msg">
                <div>{props.message}</div>
            </div>
            <span className="time">{props.datesent}</span>
        </div>
    )
}

export default ReceivedItem;