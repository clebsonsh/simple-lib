module.exports.queryString = obj =>
  Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        throw new Error('Plese check your params')
      }

      return `${key}=${value}`
    })
    .join('&')
