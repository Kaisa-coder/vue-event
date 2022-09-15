const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 影响打包时, index.html 引入其他资源的前缀地址
  // ./ 可以让开发环境和生产环境都可以正常使用
  // 为了严谨一些
  // 开发环境: '/'
  // 生产环境: './'
  // 问题:可以让脚手架环境,自己来决定用哪个值
  // node 里面有个内置的环境变量 process.env.NODE_ENV
  // process.env.NODE_ENV 它可以根据你敲得命令,来使用不同的值
  // yarn server =>  process.env.NODE_ENV = 'development'
  // yarn build =>  process.env.NODE_ENV = 'production'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
})
