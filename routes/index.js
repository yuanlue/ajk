const ajk = require('../scrapy/index.js')
const websockify = require('koa-websocket')

module.exports =  (router) => {
  router.get('/', async function (ctx, next) {
    await ctx.render('index', {title: ctx.state});
  })
  router.get('/getAjk',async function(ctx,next){
    try {
      let data = await ajk()
      ctx.body = {code:'200',result:data};
    }catch(err){
      ctx.body = {code:'500',result:[]};
    }
  
  })
}
