const { queryString } = require('./queryString')

describe('Object to query string', () => {
  it('should create a valid query string when an object is provided', () => {
    const obj = {
      name: 'Clebson',
      profession: 'developer',
    }

    expect(queryString(obj)).toBe('name=Clebson&profession=developer')
  })

  it('should create a valid query string even when a array is passed as value', () => {
    const obj = {
      name: 'Clebson',
      abilities: ['JS', 'TDD'],
    }

    expect(queryString(obj)).toBe('name=Clebson&abilities=JS,TDD')
  })

  it('should throw a error when a object is passed', () => {
    const obj = {
      name: 'Clebson',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    }

    expect(() => queryString(obj)).toThrowError()
  })
})

// describe("Query string to object", () => {
// });
