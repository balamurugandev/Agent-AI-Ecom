export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPrice(price: number, compareAtPrice?: number): string {
  return formatCurrency(price)
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

