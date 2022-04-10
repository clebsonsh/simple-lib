const { queryString, parse } = require('./queryString')

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

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Clebson&profession=developer'

    expect(parse(qs)).toEqual({
      name: 'Clebson',
      profession: 'developer',
    })
  })

  it('should convert a query string of a single key-value pair to object', () => {
    const qs = 'name=Clebson'

    expect(parse(qs)).toEqual({
      name: 'Clebson',
    })
  })

  it('should convert a query string to object taking care of comma separated values', () => {
    const qs = 'name=Clebson&abilities=JS,TDD'

    expect(parse(qs)).toEqual({
      name: 'Clebson',
      abilities: ['JS', 'TDD'],
    })
  })
})
