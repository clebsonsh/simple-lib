import Cart from './Cart'

describe('Cart', () => {
  let cart
  let product = {
    title: 'Adidas running shoes - men',
    price: 35388,
  }

  let product2 = {
    title: 'Adidas running shoes - women',
    price: 41872,
  }

  beforeEach(() => {
    cart = new Cart()
  })

  describe('getTotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance of Cart', () => {
      expect(cart.getTotal()).toEqual(0)
    })

    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      }

      cart.add(item)

      expect(cart.getTotal()).toEqual(70776)
    })

    it('should ensure no more than one product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product,
        quantity: 1,
      })

      expect(cart.getTotal()).toEqual(35388)
    })

    it('should update total when a product gets included and then removed', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 1,
      })

      cart.remove(product)

      expect(cart.getTotal()).toEqual(41872)
    })
  })

  describe('summary()', () => {
    it('should return an object with the total and the list of items when summary() is called', () => {
      cart.add({
        product,
        quantity: 5,
      })

      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.summary()).toMatchSnapshot()
      expect(cart.getTotal()).toBeGreaterThan(0)
    })
  })

  describe('checkout()', () => {
    it('should return an object with the total and the list of items when checkout() is called', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.checkout()).toMatchSnapshot()
    })

    it('should reset the cart when checkout() is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      })

      cart.checkout()

      expect(cart.getTotal()).toEqual(0)
    })
  })

  describe('special conditions', () => {
    it('should apply percentage discount quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal()).toEqual(74315)
    })

    it('should NOT apply percentage discount quantity bellow or equals minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 2,
      })

      expect(cart.getTotal()).toEqual(70776)
    })

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 4,
      })

      expect(cart.getTotal()).toEqual(70776)
    })

    it('should NOT apply quantity discount for even quantities when condition is not met', () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product: product2,
        condition,
        quantity: 1,
      })

      expect(cart.getTotal()).toEqual(41872)
    })

    it('should apply quantity discount for odd quantities', () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 7,
      })

      expect(cart.getTotal()).toEqual(141552)
    })
  })
})
