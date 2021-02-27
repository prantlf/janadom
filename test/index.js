(async () => {
  await require('./coded.test').run()
  await require('./compiled.test').default.run()
})()
