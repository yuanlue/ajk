/**
 * 安居客
 * 2019年05月30日10:45:19
 */
const puppeteer = require('puppeteer');

async function ajk_data(ws){
    let result = [] 
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
  });
  const page = await browser.newPage();
  await page.goto('https://xa.fang.anjuke.com/loupan/s?kw=%E4%B8%87%E7%A7%91');
//   await page.screenshot({path: 'example.png'});
    try{
     result = await page.evaluate(() => {
        let arr = []
        $('.key-list .item-mod ').each(function(){
         
                     let price = $(this).find('.favor-pos p span').text().trim()
                     let address = $(this).find('.list-map').text().trim()
                     let hx = $(this).find('.huxing').text().trim()
                     let href = $(this).find('.lp-name').attr('href')
                     let data = {
                        'price':price,
                        'address':address,
                        'hx':hx,
                        'href':href
                    }
                    arr.push(data)

        })
        return arr
    });
    }catch(err){
        let msg = {'msg':'抓取信息失败 请先完成验证','result':result,'code':0}
        ws.send(JSON.stringify(msg))
    }
    if(result.length > 0){
    for(let i = 0; i < result.length; i++){
        if(result[i].href){
            let msg = {'msg':'正在抓取'+result[i].href,'result':result,'code':100}
            ws.send(JSON.stringify(msg))
            await page.goto(result[i].href);
        }
        let data = await page.evaluate(()=>{
            let name = $('.basic-info h1').text().trim()
            let kp = $('.basic-parms dd span').eq(1).text()
            let jf = $('.basic-parms dd span').eq(2).text()
            let i_address = $('.lpAddr-text').text();
            let cp = $('.lp-title').text() + $('.p-info').text();
            let data ={ 
                'name':name,
                'kp':kp,
                'jf':jf,
                'address':i_address,
                'cp':cp
            }
            return data
        })
        result[i] = Object.assign(result[i],data)
        let msg = {'msg':'正在抓取'+result[i].href+'成功','result':result,'code':100}
        ws.send(JSON.stringify(msg))
    }
    }
    let msg = {'msg':'抓取结束','result':result,'code':100}
    ws.send(JSON.stringify(msg))
   await browser.close();
   return result 
}
 module.exports  = ajk_data;
