import find from 'lodash/find'
import remove from 'lodash/remove'
import Dinero from 'dinero.js'

const Money = Dinero

Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

const calculatePercentageDiscount = (amount, condition, item) => {
  if (item.quantity > condition.minimum) {
    return amount.percentage(condition.percentage)
  }

  return Money({ amount: 0 })
}

const calculateQuantityDiscount = (amount, condition, item) => {
  const isEven = item.quantity % 2 === 0

  if (item.quantity > condition.quantity) {
    if (isEven) {
      return amount.percentage(50)
    }

    return amount.subtract(Money({ amount: item.product.price })).percentage(50)
  }
  return Money({ amount: 0 })
}

const calculateDiscount = (amount, item) => {
  const list = Array.isArray(item.condition) ? item.condition : [item.condition]

  const [heigherDiscount] = list
    .map(cond => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, cond, item).getAmount()
      } else if (cond.quantity) {
        return calculateQuantityDiscount(amount, cond, item).getAmount()
      }
    })
    .sort((a, b) => b - a)

  return Money({ amount: heigherDiscount })
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

        if (item.condition) {
          discount = calculateDiscount(amount, item)
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
