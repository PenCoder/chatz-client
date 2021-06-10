import { useAuth0 } from '@auth0/auth0-react';
import React, { FC, useEffect, useRef } from 'react';
import ReceivedItem from '../received';
import SentItem from '../sent';

interface IMessage {
    message: String,
    sender: String,
    receiver: String,
    datesent: Date,
}

interface Props {
    messages: IMessage[],
}

const ChatArea: FC<Props> = ({ messages }) => {
    const { user } = useAuth0();

    const msgBottomPointRef = useRef<HTMLDivElement>(null);
    // Scroll To Bottom Effect 
    useEffect(() => {
        if (msgBottomPointRef.current) {
            msgBottomPointRef.current.scrollIntoView({ behavior: "smooth" })
        }

    }, [messages]);

    return (
        <div className="chat-area">
            {messages.map((msg, index) =>
                msg.sender === user?.email ?
                    <SentItem key={index} {...msg} />
                    :
                    <ReceivedItem key={index} {...msg} />
            )
            }
            <div ref={msgBottomPointRef} />
        </div>
    )
}

export default ChatArea;