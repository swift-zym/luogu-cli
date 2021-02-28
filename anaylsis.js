const request = require('request-promise')
const os = require('os');

module.exports = async function () {
    if (data.user.uid != undefined) {
        let anaylsis_data = {}
        anaylsis_data.user = data.user
        anaylsis_data.node_version = process.version
        anaylsis_data.system_type = os.type()
        anaylsis_data.system_version = os.release()
        let b = new Buffer.from(JSON.stringify(anaylsis_data));
        let s = b.toString('base64');
        try {
            let res = await request({
                method:'GET',
                url: config['anaylsis-domain'] + '?log=' + s,
                timeout: 1500
            });
        }catch(e){
            console.log(e);
        }
    }
}