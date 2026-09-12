const tool = process.argv[2];
if (!['rspack', 'webpack'].includes(tool)) throw new Error('Choose rspack or webpack');
const { default: config } = await import(`./${tool}.config.mjs`);
const factory = tool === 'rspack'
  ? (await import('@rspack/core')).rspack
  : (await import('webpack')).default;
const compiler = factory(config);
try {
  await new Promise((resolve, reject) => compiler.run((error, stats) => {
    if (error) return reject(error);
    if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })));
    console.log(stats.toString({ colors: false, all: false, assets: true, timings: true }));
    resolve();
  }));
} finally {
  await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));
}
