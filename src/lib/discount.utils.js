import Dinero from 'dinero.js'

const Money = Dinero

Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

const calculatePercentageDiscount = (
  amount,
  { minimum, percentage },
  { quantity },
) => {
  if (quantity > minimum) {
    return amount.percentage(percentage)
  }

  return Money({ amount: 0 })
}

const calculateQuantityDiscount = (
  amount,
  condition,
  { quantity, product },
) => {
  const isEven = quantity % 2 === 0

  if (quantity > condition.quantity) {
    if (isEven) {
      return amount.percentage(50)
    }

    return amount.subtract(Money({ amount: product.price })).percentage(50)
  }
  return Money({ amount: 0 })
}

export const calculateDiscount = (amount, item) => {
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
