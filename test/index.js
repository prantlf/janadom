(async () => {
  await require('./coded.test').run()
  await require('./compiled.test').default.run()
  await require('./compiled.test1').default.run()
  await require('./compiled.test2').default.run()
})()
