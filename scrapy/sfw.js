/**
 * 搜房网
 * 2019年05月30日10:45:19
 */
const puppeteer = require('puppeteer');
async function sfw_data(ws){
    let result = [] 
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
  });
  const page = await browser.newPage();
  await page.goto('https://xian.newhouse.fang.com/house/s/a9%CD%F2%BF%C6/?xf_source=%CD%F2%BF%C6');
//   await page.screenshot({path: 'example.png'});
    
     result = await page.evaluate(() => {
        let arr = []
   
     
        $('.nhouse_list .nl_con ul li').each(function(){
            let price ;
            let address; 
            let hx;
            let href;
            let name; 
            let status;
            let tel;
           
            if($(this).find('.house_type').text()){
                hx = $(this).find('.house_type').text()
            }
            if($(this).find('.pr').text()){
                status  = $(this).find('.pr').text()
            }
            if($(this).find('.nhouse_price').text()){
                price = $(this).find('.nhouse_price').text()
            }
            if($(this).find('.tel').text()){
                tel = $(this).find('.tel').text()
            }
            if($(this).find('.nlcd_name a').attr('href')){
                href = $(this).find('.nlcd_name a').attr('href')
            }
            if($(this).find('.address a').text()){
                address = $(this).find('.address a').text()
            }
            if($(this).find('.nlcd_name').text()){
                name = $(this).find('.nlcd_name').text();
                let data = {
                    'name':name,
                    'price':price,
                    'hx':hx,
                    'status':status,
                    'price':price,
                    'tel':tel,
                    'href':href
                }
                console.log(data)
                arr.push(data)
           }
         
    
        })
        return arr
    });
    await page.click('.fr .next')
    await page.waitFor(1000); // 单位是毫秒
    result2 = await page.evaluate(() => {
        let arr = []
   
     
        $('.nhouse_list .nl_con ul li').each(function(){
            let price ;
            let address; 
            let hx;
            let href;
            let name; 
            let status;
            let tel;
           
            if($(this).find('.house_type').text()){
                hx = $(this).find('.house_type').text()
            }
            if($(this).find('.pr').text()){
                status  = $(this).find('.pr').text()
            }
            if($(this).find('.nhouse_price').text()){
                price = $(this).find('.nhouse_price').text()
            }
            if($(this).find('.tel').text()){
                tel = $(this).find('.tel').text()
            }
            if($(this).find('.nlcd_name a').attr('href')){
                href = $(this).find('.nlcd_name a').attr('href')
            }
            if($(this).find('.address a').text()){
                address = $(this).find('.address a').text()
            }
            if($(this).find('.nlcd_name').text()){
                name = $(this).find('.nlcd_name').text();
                let data = {
                    'name':name,
                    'price':price,
                    'hx':hx,
                    'status':status,
                    'price':price,
                    'tel':tel,
                    'href':href,
                    'address':address
                }
                console.log(data)
                arr.push(data)
           }
         
    
        })
        return arr
    });
    result2.forEach(item=>{
        result.push(item)
    })
    console.log(result.length)
    if(result.length > 0){
    for(let i = 0; i < result.length; i++){
        if(result[i].href){
            let msg = {'msg':'正在抓取'+result[i].href,'result':result,'code':100}
            ws.send(JSON.stringify(msg))
            await page.goto('https:'+result[i].href);
        }
        let data = await page.evaluate(()=>{
            let kp = $('.kaipan').text();
            let i_href = $(' .more a').attr('href')
            if($('.lp-type').eq(2).text()){
                 kp = $('.lp-type').eq(2).text()
            }
            if($('.more-info').attr('href')){
                i_href = $(' .more a').attr('href')
           }
            let data ={ 
                'kp':kp,
                i_href:i_href
            }
            return data
        })
        console.log(data);
    
        result[i] = Object.assign(result[i],data)
        let msg = {'msg':'正在抓取https://xian.newhouse.fang.com/'+result[i].href+'成功','result':result,'code':100}
        ws.send(JSON.stringify(msg))
    }
    }
    
  
   
    let msg = {'msg':'抓取结束','result':result,'code':100,type:2}
    ws.send(JSON.stringify(msg))
   await browser.close();
   return result 
}

 module.exports  = sfw_data;
