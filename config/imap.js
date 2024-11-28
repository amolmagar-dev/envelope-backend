const { ImapFlow } = require('imapflow');
const createIMAPClient = (accountConfig) => {
    return new ImapFlow({
        host: accountConfig.host,
        port: accountConfig.port,
        secure: accountConfig.secure,
        auth: {
            user: accountConfig.user,
            pass: accountConfig.password,
        },
    });
};
module.exports = createIMAPClient;