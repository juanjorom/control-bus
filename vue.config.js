module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  
  "transpileDependencies": [
    "vuetify"
  ],

  assetsDir: "./src/assets",

  pluginOptions: {
    electronBuilder: {
      customFileProtocol: './',
      nodeIntegration: true,
      externals: ['fs'],
      nodeModulesPath: ['../../node_modules', './node_modules']
    }
  }
}