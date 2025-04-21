import React from 'react'

function CurrencyDisplay({ value }: { value: number | null | undefined }) {
  if (!value) return
  // Format as US dollars; adjust locale and currency as needed.
  const adjusted = value / 100
  const formattedValue = adjusted.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return <span>{formattedValue}</span>
}

export default CurrencyDisplay
