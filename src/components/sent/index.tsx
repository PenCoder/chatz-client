import React, { FC } from 'react';

interface IMessage {
    message: String,
    sender: String,
    receiver: String,
    datesent: Date,
}

const SentItem: FC<IMessage> = (props) => {
    return (
        <div className="sent-item">
            <div className="msg">
                <div>{props.message}</div>
            </div>
            <span className="time">{props.datesent}</span>
        </div>
    )
}

export default SentItem;