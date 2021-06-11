import { useAuth0 } from '@auth0/auth0-react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import ChatArea from '../../components/chat_area';
import config from '../../config';


function ChatRoom() {
    const [hub, setHub] = useState<null | HubConnection>(null);
    const [messages, setMessages] = useState(Array());
    const [users, setUsers] = useState(Array());
    const [selectedUser, setSelectedUser] = useState(null);
    console.log(window.location.hostname);

    const endpoint = config.production.endpoint;

    const { logout, user } = useAuth0();

    const name = user?.name as string;
    const picture = user?.picture;
    const email = user?.email as string;

    const msgForm = useRef<HTMLFormElement>(null)

    useEffect(() => {
        try {
            // Set Connection 
            const con = new HubConnectionBuilder()
                .withUrl(`${endpoint}/hubs/chatter`)
                .withAutomaticReconnect()
                .build();

            con.start()
                .then(result => {
                    console.log(result);

                    con.on('NewSignIn', async (user) => {
                        await getUsers();
                    });

                    con.on('ReceiveMessage', async (sender, receiver) => {
                        if (selectedUser) {
                            if ((selectedUser as any).email === sender && email === receiver) {
                                console.log('received...');
                                getUserMessages(selectUser);
                            }
                        }
                    });

                    con.on('BlockUser', async (blocked, by) => {
                        // alert(blocked)
                        // alert(by)
                        if (blocked === email) {
                            if (selectedUser && (selectedUser as any).email === by) {
                                setSelectedUser(null);
                            }
                        }

                        getUsers();
                    });
                    con.on('UnBlockUser', async (blocked, by) => {
                        getUsers();
                    });

                    con.on('LogoutUser', async (userEmail) => {
                        if (email === userEmail) {
                            logout({ returnTo: window.location.origin });
                        }
                        else {
                            if (selectedUser && (selectedUser as any).email === userEmail) {
                                setSelectedUser(null);
                            }
                            await getUsers();
                        }
                    });
                });
        } catch (error) {
            console.log(error);
        }

        onSignedIn();

    }, [user, messages])

    // After User Signed In 
    const onSignedIn = async () => {

        try {
            let response = await fetch(`${endpoint}/api/users/signed_in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, picture })
            });
            let result = await response.text();

            if (result === 'success') {

                await getUsers();

                console.log(result)
            } else {
                console.log(result)
            }
        }
        catch (e) {
            console.log(e);
        }
    }


    const onLogout = async () => {
        try {
            let response = await fetch(`${endpoint}/api/users/logout?email=${email}`);
            let results = await response.text();
            logout({ returnTo: window.location.origin });
        } catch (error) {
            console.log(error);
        }
    }


    // Submit Message 
    const onSubmitMsg = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { target } = event;
        const elements = (target as HTMLFormElement);
        const message = elements.msg.value;

        const params = `sender=${email}&receiver=${(selectedUser as any).email}&message=${message}`;

        try {
            var response = await fetch(`${endpoint}/api/message/send?` + params);
            var results = await response.text();
            if (results === 'success') {
                // Clear Form 
                msgForm.current?.reset();
                // Fetch Messages
                await getUserMessages(selectedUser);
            }
        }
        catch (e) {

        }
    }

    const selectUser = async (user: any) => {
        setSelectedUser(user);
        await getUserMessages(user);
    }
    // Fetch Messages 
    const getUserMessages = async (user: any) => {
        try {
            let userEmail = user.email;

            var response = await fetch(`${endpoint}/api/message/messages/?sender=${email}&receiver=${userEmail}`);
            var results = await response.json();
            setMessages([...results]);
        }
        catch (e) {
            console.log(e);
        }
    }
    // Block User 
    const onBlockUser = async () => {
        let userEmail = (selectedUser as any).email;
        let response = await fetch(`${endpoint}/api/users/block_user?user=${userEmail}&by=${email}`);
        let results = await response.text();
        if (results === 'success') {
            let user = selectedUser as any;
            user['status'] = 'blocked';
            setSelectedUser(user);
            getUsers();
        }
    }
    // UnBlock User 
    const onUnBlockUser = async () => {

        let userEmail = (selectedUser as any).email;
        let response = await fetch(`${endpoint}/api/users/unblock_user?user=${userEmail}&by=${email}`);
        let results = await response.text();
        if (results === 'success') {
            let user = selectedUser as any;
            user['status'] = 'active';
            setSelectedUser(user);
            getUsers();
        }
    }

    const getUsers = async () => {
        let onlineUsers = users;

        try {
            let res = await fetch(`${endpoint}/api/users/load_users?email=${email}`);
            let results = await res.json();

            onlineUsers = results;


        } catch (error) {
            console.error();
        }
        finally {
            setUsers([...onlineUsers]);
        }
    }

    return (
        <div className="container">
            <aside className="side-nav">
                <header>
                    <img src={picture} alt="" />
                    <div>
                        <h5>{name}</h5>
                        <span>{email}</span>
                    </div>
                </header>
                <ul>
                    {users.map((user, index) =>
                        <li key={index} onClick={() => selectUser(user)} >
                            {user.status === 'active' ?
                                <span className={"status success"}></span>
                                :
                                <span className={"status warning"}></span>

                            }

                            <img src={user.picture} alt="" />
                            <div>
                                <h4 className="user-name">{user.name}</h4>
                                <p></p>
                                <span className="user-email">{user.email}</span>
                            </div>
                        </li>
                    )
                    }
                </ul>
            </aside>

            <main className="main">
                <header>
                    <div>
                        <h5 className="main-title">{(selectedUser as any)?.name}</h5>
                    </div>
                    <button className="logout-btn"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                    {selectedUser &&
                        <button className="logout-btn"
                            onClick={(selectedUser as any).status === 'active' ? onBlockUser : onUnBlockUser}
                        >
                            {(selectedUser as any).status === 'active' ? 'Block' : 'Unblock'}
                        </button>
                    }
                </header>
                {selectedUser &&
                    <div>
                        <ChatArea messages={messages} />

                        <div className="message-input-area">
                            <fieldset disabled={(selectedUser as any).status !== 'active'}>
                                <form onSubmit={onSubmitMsg} ref={msgForm}>
                                    <input type="text" className="msg-input" name="msg" placeholder="Type message here" />
                                    <button type="submit" >Send</button>
                                </form>
                            </fieldset>
                        </div>
                    </div>
                }
            </main>
        </div>
    )
}

export default ChatRoom;