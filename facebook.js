let puppeteer = require("puppeteer");
let fs = require("fs");
let BASE_URL = "https://www.facebook.com/";
let page;
let cFile = process.argv[2];
let mFile = process.argv[3];
const facebook = {
    initialize : async () => {
        // Browser Create
        browser = await puppeteer.launch({
            headless : false,
            defaultViewport : null,
            slowMo :10,
            args : ["--incognito" , "--start-maximized"]
        })

        let pages = await browser.pages();
        page = pages[0];
        // await page.setViewport({ width: 1280, height: 600});
    },
    //Login
    login : async() => {
        try{
            await page.goto(BASE_URL , {waitUntil : 'networkidle2'});

            let credentialFile = await fs.promises.readFile(cFile);
            let {username , password} =  JSON.parse(credentialFile);
            
            await page.waitForSelector("input[type=email]");
            await page.type('input[name="email"]', username, { delay: 50 });
            await page.type('input[name="pass"]', password, { delay: 50 });

            await Promise.all([
                page.click("input[type=submit]", {delay : 50}),
                page.waitForNavigation({waitUntil : 'networkidle2'})
            ]);

        }catch(err){
            console.log(err);
        }
    },
    // post like code
    postLikeCode : async (pageName) =>{
       
       try{
        // home page
        await page.waitForSelector(".ijkhr0an.pnx7fd3z.sgqwj88q.b3i9ofy5.hzruof5a.pmk7jnqg.rnx8an3s.fcg2cn6m");
        await page.type(".ijkhr0an.pnx7fd3z.sgqwj88q.b3i9ofy5.hzruof5a.pmk7jnqg.rnx8an3s.fcg2cn6m" , pageName , {delay : 50});
        await page.keyboard.press("Enter")
        await page.waitForNavigation({waitUntil:"networkidle2"})

        // search page
        await page.waitForSelector("li[data-edge=keywords_pages]");
        await Promise.all([page.click("li[data-edge=keywords_pages] a")]);
        page.waitForNavigation({waitUntil:"networkidle2"})
        await page.waitForSelector("._1glk._6phc.img");
        await Promise.all([
            page.waitForNavigation({waitUntil:"networkidle2"}),
            page.click("._1glk._6phc.img")
        ])

        await page.waitForSelector("div[data-key=tab_posts]");
        await Promise.all([
            page.click("div[data-key=tab_posts] "),
            page.waitForNavigation({waitUntil:"networkidle2"})
        ]);
        await page.waitForNavigation({waitUntil:"networkidle2"})

        let idx = 0;
        do{
            await page.waitForSelector("#pagelet_timeline_main_column ._1xnd .clearfix.uiMorePager")
            let posts = await page.$$("#pagelet_timeline_main_column ._1xnd>._4-u2._4-u8")
            let cPost = posts[idx];
            let likeBtn = await cPost.$("._666k ._8c74");
            await likeBtn.click({delay : 120});

            await page.waitForSelector(".uiMorePagerLoader.pam.uiBoxLightblue" , {hidden:true });
            idx++;
        }while(idx < 10) 
        
       }catch(err){
           console.log(err);
       }
    },
    //message
    message : async (receiverName) => {
        try{
            /*
            await page.waitForSelector("._1frb");
            await page.type("._1frb" , receiverName , {delay : 50});
            await page.keyboard.press("Enter")
            await page.waitForNavigation({waitUntil:"networkidle2"});
            await page.goto("https://www.facebook.com/profile.php?id=100002084287036" , {waitUntil:"networkidle2"});
            sleep(3000);

            let allButtons = await page.$$("a[role=button]");
            let messageClikable;
            console.log(allButtons.length);
            for(let i=0;i<allButtons.length;i++){
                const element = allButtons[i];
                const buttonText = await page.evaluate(element => element.textContent,element);
                if(buttonText.includes('Message')){
                    console.log(buttonText);
                    messageClikable = element;
                }
            }
            messageClikable.click();
            */

           // Selectig Messenger Button
            await page.waitForSelector(".jewelButton._3eo8");
            await Promise.all([
                page.click(".jewelButton._3eo8")
            ])
            sleep(2000);

            // Clicking on see all in meesenger
            await page.waitForSelector("._80au");
            await Promise.all([page.click("._80au a")]);

            // await page.waitForSelector("#Fill-2");
            // await Promise.all([page.click("#Fill-2")]);
            sleep(2000)
            // await page.waitForSelector("input[type=text]");
            // await Promise.all([page.click("._58-0_58ah input[type=text]")]);
            // await page.type("._58-0_58ah input[type=text]" , receiverName , {delay : 100});
            // 
            //Search Input
            await page.waitForSelector("._5iwm._6-_b._150g._58ah ._58ak input[type=text]");
            await page.type("._5iwm._6-_b._150g._58ah ._58ak input[type=text]" , receiverName , {delay : 100});
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("Enter");
            sleep(2000);


            let messageFile = await fs.promises.readFile(mFile);
            // console.log(messageFile)
            let {message1} = JSON.parse(messageFile);
            // ,message2 , message3 , message4 , message5 , message6
            // console.log(message1)
            // console.log(message2)
            // console.log(message3)
            // console.log(message4)
            // console.log(message5)
            // console.log(message6)

            // let cont = await fs.promises.readFile(mFile, 'utf-8');
            await page.waitForSelector("._1mf._1mj");
            let inputClick = await page.$("._1mf._1mj");
            await inputClick.click();
            await page.type("._1mf._1mj [data-text=true]"  , message1, {delay : 100})    // + message2 + message3 + message4 + message5 + message6 
            await page.keyboard.press("Enter");

            await page.close();

        }catch(err){
            console.log(err)
        }
    }
}
function sleep(duration){
    var cur = Date.now();
    var limit = cur+duration;
    while(cur<limit){
        cur = Date.now();
    }
}

module.exports = facebook;