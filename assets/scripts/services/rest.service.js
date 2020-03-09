var api_url = 'http://project_uno.local/api/';

var data = {
    // PROPERTIES
    callback_done: null,
    callback_fail: null,
    callback_always: null,
    token: null,
    server: null,

    // FUNCTIONS
    register: function() {
        return this.xhr('post', pub_api('auth/register'));
    },

    login: function(data) {
        return this.xhr('post', pub_api('auth/login'), data);
    },

    getPlayerData: function() {
        return this.xhr('get', api('player'));
    },

    getCampaignData: function(world, stage) {
        return this.xhr('get', api('campaign/' + world + '/' + stage));
    },

    savePlayerCampaignChars: function(data) {
        return this.xhr('post', api('campaign/save_chars'), data);
    },

    campaignWin: function() {
        return this.xhr('get', api('campaign/verify_win'));
    },

    test: function() {
        return this.xhr('get', api('test'));
    },

    // PRIVATE FUNCTIONS
    xhr: function(method, url, data) {
        let self = this,
            xhr = new XMLHttpRequest();

        // request result
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                console.log("(DEBUG) XHR Request: " + url);
                console.log("(DEBUG) XHR Result: " + xhr.responseText);
                
                // success
                if (xhr.status >= 200 && xhr.status < 400) {
                    let response = xhr.responseText;

                    if (typeof self.callback_done === 'function') {
                        self.callback_done(JSON.parse(response));
                    }

                // fail
                } else {
                    if (typeof self.callback_fail === 'function') {
                        self.callback_fail(JSON.parse(response));
                    }

                    connectionLost();
                }

                // always
                if (typeof self.callback_always === 'function') {
                    self.callback_always(JSON.parse(response));
                }
            }
        };

        // timeout 3 secs
        xhr.timeout = 3000;
        xhr.ontimeout = function (e) {
            connectionLost();
        };

        // send request
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        if (this.token) {
            xhr.setRequestHeader("Authorization", "Bearer " + this.token);
        }
        xhr.send(typeof data !== "undefined" ? JSON.stringify(data) : null);

        return self;
    },

    // CHAINS
    done: function(callback) {
        this.callback_done = callback;
        return this;
    },

    fail: function(callback) {
        this.callback_fail = callback;
        return this;
    },

    always: function(callback) {
        this.callback_always = callback;
        return this;
    },
}
module.exports = data;

function pub_api(url) 
{
    return api_url + url;
}

function api(url)
{
    return api_url + data.server + "/" + url;
}

function connectionLost() 
{
    cc.loader.loadRes("prefab/connection_lost", function (err, prefab) {
        cc.find("Canvas").addChild(cc.instantiate(prefab));
    });
}