/**
 * 贝壳网爬虫
 * 2019年05月30日10:45:19
 */
const puppeteer = require('puppeteer');
bkw_data()
async function bkw_data(ws){
    let result = [] 
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
  });
  const page = await browser.newPage();
  await page.goto('https://xa.fang.ke.com/loupan/rs%E4%B8%87%E7%A7%91/');
//   await page.screenshot({path: 'example.png'});
    try{
     result = await page.evaluate(() => {
        let arr = []
        $('.resblock-list-wrapper .resblock-desc-wrapper').each(function(){
         
                     let name = $(this).find('.name').text().trim()
                     let href = $(this).find('.name').attr('href')
                     let address = $(this).find('.resblock-location').text().trim()
                     let price = $(this).find('.number').text().trim()
                     let tip = $(this).find('.resblock-tag').text().trim()
                     let data = {
                        'name':name,
                        'address':address,
                        'tip':tip,
                        'price':price,
                        'href':href
                    }
                    arr.push(data)

        })
        return arr
    });
    }catch(err){
        // let msg = {'msg':'抓取信息失败 请先完成验证','result':result,'code':0}
        // ws.send(JSON.stringify(msg))
        console.log(err)
    }
    await page.click('.next')
    await page.waitFor(1000); // 单位是毫秒
    result2 = await page.evaluate(() => {
        let arr = []
        $('.resblock-list-wrapper .resblock-desc-wrapper').each(function(){
         
            let name = $(this).find('.name').text().trim()
            let href = $(this).find('.name').attr('href')
            let address = $(this).find('.resblock-location').text().trim()
            let price = $(this).find('.number').text().trim()
            let tip = $(this).find('.resblock-tag').text().trim()
            let data = {
               'name':name,
               'address':address,
               'tip':tip,
               'price':price,
               'href':href
           }
           arr.push(data)

        })
        return arr
    });
    result2.forEach(item=>{
        result.push(item)
    })
    await page.click('.next')
    await page.waitFor(1000); // 单位是毫秒
    result3 = await page.evaluate(() => {
        let arr = []
        $('.resblock-list-wrapper .resblock-desc-wrapper').each(function(){
         
            let name = $(this).find('.name').text().trim()
            let href = $(this).find('.name').attr('href')
            let address = $(this).find('.resblock-location').text().trim()
            let price = $(this).find('.number').text().trim()
            let tip = $(this).find('.resblock-tag').text().trim()
            let data = {
               'name':name,
               'address':address,
               'tip':tip,
               'price':price,
               'href':href
           }
           arr.push(data)

        })
        return arr
    });
    result3.forEach(item=>{
        result.push(item)
    })
    if(result.length > 0){
        for(let i = 0; i < result.length; i++){
            if(result[i].href){
                let msg = {'msg':'正在抓取'+result[i].href,'result':result,'code':100}
                // ws.send(JSON.stringify(msg))
                console.log(msg)
                await page.goto('https://xa.fang.ke.com'+result[i].href);
            }
            let data = await page.evaluate(()=>{
                let kp = $('.open-date .content').text();
                let hx = $('.info-item .content').text()
                let inner_href = $('.more-building').attr('href')
                let data ={ 
                    'kp':kp,
                    'hx':hx,
                    'in_href':inner_href
                }
                return data
            })
            console.log(data);
        
            result[i] = Object.assign(result[i],data)
            let msg = {'msg':'正在抓取https://xian.newhouse.fang.com/'+result[i].href+'成功','result':result,'code':100}
            ws.send(JSON.stringify(msg))
        }
    }
    let msg = {'msg':'抓取结束','result':result,'code':100}
    // ws.send(JSON.stringify(msg))
    console.log(msg)
   await browser.close();
   return result 
}
 module.exports  = bkw_data;
