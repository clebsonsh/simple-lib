import find from 'lodash/find'
import remove from 'lodash/remove'
import Dinero from 'dinero.js'

const Money = Dinero

Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

const calculatePercentageDiscount = (amount, item) => {
  if (item.quantity > item.condition.minimum) {
    return amount.percentage(item.condition.percentage)
  }

  return Money({ amount: 0 })
}

const calculateQuantityDiscount = (amount, item) => {
  const isEven = item.quantity % 2 === 0

  if (item.quantity > item.condition.quantity) {
    if (isEven) {
      return amount.percentage(50)
    }

    return amount.subtract(Money({ amount: item.product.price })).percentage(50)
  }
  return Money({ amount: 0 })
}

export default class Cart {
  items = []

  add(item) {
    const itemToFind = { product: item.product }

    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind)
    }

    this.items.push(item)
  }

  remove(product) {
    remove(this.items, { product })
  }

  getTotal() {
    return this.items
      .reduce((acc, item) => {
        const amount = Money({ amount: item.quantity * item.product.price })

        let discount = Money({ amount: 0 })

        if (item.condition?.percentage) {
          discount = calculatePercentageDiscount(amount, item)
        }

        if (item.condition?.quantity) {
          discount = calculateQuantityDiscount(amount, item)
        }

        return acc.add(amount).subtract(discount)
      }, Money({ amount: 0 }))
      .getAmount()
  }

  summary() {
    return {
      total: this.getTotal(),
      items: this.items,
    }
  }

  checkout() {
    const { total, items } = this.summary()
    this.items = []

    return { total, items }
  }
}
