const axios = require('axios')

const headers = {
  headers: {
    "Authorization": process.env.TWITCH_TOKEN, 
    "Client-Id": process.env.TWITCH_CLIENT_ID
  }
}

module.exports = class TeamService{
    constructor(){}

    async getStreamersOnline(feras){
        // const params = feras.join('&user_login=')
        const url = `https://api.twitch.tv/helix/streams?user_login=${feras.join('&user_login=')}`;
        try{
            const data = await axios.get(url, headers)
            return data.data.data
        }
        catch(e){
            console.log(e)
        }
    }

    async getStreamersInfo(feras){
        // const params_users = feras.join('&login=')
        const url_users = `https://api.twitch.tv/helix/users?login=${feras.join('&login=')}`; 
        try{
            const data = await axios.get(url_users, headers) 
            return data.data.data
        }
        catch(e){ console.log(e)}
    }

}