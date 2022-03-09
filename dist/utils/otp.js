"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
function sendOTP(mobile, otp) {
    const https = require('https');
    const options = {
        hostname: 'smartsmsgateway.com',
        port: 443,
        path: `/api/api_json.php?username=Tanzeelat&password=${process.env.SMS_PASSWORD}&senderid=${process.env.SMS_SENDERID}&to=${mobile}&text=${otp}&type=text`,
        method: 'GET'
    };
    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            console.error(d);
        });
    });
    req.on('error', (error) => {
        console.error(error);
    });
    req.end();
}
exports.sendOTP = sendOTP;
//# sourceMappingURL=otp.js.map