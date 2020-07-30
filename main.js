let fb = require("./facebook");

let pageName = "google";
let receiverName = " Lakshay mehraa";

(async () => {

    await fb.initialize();

    await fb.login();

    // await fb.postLikeCode(pageName);
    sleep(3000);

    await fb.message(receiverName);

})();


function sleep(duration){
    var cur = Date.now();
    var limit = cur+duration;
    while(cur<limit){
        cur = Date.now();
    }
}