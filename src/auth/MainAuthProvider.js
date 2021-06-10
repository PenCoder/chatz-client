import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useHistory } from "react-router-dom";

import keys from '../secret/keys.json';

function MainAuthProvider(props) {
    const history = useHistory();

    const { domain, client } = keys;
    const onRedirect = (state) => {
        history.push(state?.returnTo || window.location.pathname);
    }
    return (
        <Auth0Provider
            domain={domain}
            clientId={client}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirect}
        >
            {props.children}
        </Auth0Provider>
    )
}

export default MainAuthProvider;