import pack from '../package.json';

export default {
    development: {
        endpoint: pack.proxy
    },
    production: {
        endpoint: window.location.hostname
    }
}