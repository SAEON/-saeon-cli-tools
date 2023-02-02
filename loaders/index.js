export async function resolve(specifier, ctx, defaultResolve) {
  specifier = specifier.replace('@saeon/cli-tools', '../src/index.js')
  let { url } = await defaultResolve(specifier, ctx)

  return { url, format: null }
}
