const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')

const config = require('./config')
const routes = require('./routes')

const port = process.env.PORT || config.port
const ajk = require('./scrapy/index.js')
const sfw = require('./scrapy/sfw.js')

const WebSocket = require('ws');
const app = new Koa();

// error handler
onerror(app)

// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'njk': 'nunjucks'},
    extension: 'njk'
  }))
  .use(router.routes())
  .use(router.allowedMethods())


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})


routes(router)
const ws = new WebSocket.Server({port: 3001});

    ws.on('connection', ws => {
    console.log('server connection');
      
    ws.on('message',async (msg) => {
      console.log(typeof(msg))
      console.log(msg.action)
      console.log(msg)
      let data = JSON.parse(msg);
      if(data.action == 1){
        //开始进行采集安居客
        console.log('server receive msg：开始采集安居客' );
        try {
          let data = await ajk(ws)
          let s = JSON.stringify({code:'200',result:data,msg:'抓取成功'})
          ws.send(s);
        }catch(err){
          console.log(err)
          let s = JSON.stringify({code:'0',result:[],msg:'抓取失败'})
          ws.send(s);
        }
      }else if (data.action == 2){
        try {
          let data = await sfw(ws)
          let s = JSON.stringify({code:'200',result:data,msg:'抓取成功',type:'2'})
          ws.send(s);
        }catch(err){
          console.log(err)
          let s = JSON.stringify({code:'0',result:[],msg:'抓取失败',type:'2'})
          ws.send(s);
        }
      }
    });

});



app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`)
})
