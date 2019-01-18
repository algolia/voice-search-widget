var fs = require('fs');

let obj = {
    "type": process.env.CRED_TYPE,
    "project_id": process.env.CRED_PROJECT_ID,
    "private_key_id": process.env.CRED_PRIVATE_KEY_ID,
    "private_key": process.env.CRED_PRIVATE_KEY,
    "client_email": process.env.CRED_CLIENT_EMAIL,
    "client_id": process.env.CRED_CLIENT_ID,
    "auth_uri": process.env.CRED_AUTH_URI,
    "token_uri": process.env.CRED_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.CRED_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.CRED_CLIENT_CERT_URL,
}

fs.writeFile('./config/gcp-credentials.json', JSON.stringify(obj), 'utf8', () => {
    console.log("done");
});