import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currencies, setCurrencies]   = useState([])
  const [current, setCurrent]         = useState(() =>
    localStorage.getItem('currency') || 'EUR'
  )

  useEffect(() => {
    api.get('/currencies')
      .then(res => {
        const data = res.data || []
        setCurrencies(data)
        // Si la devise en localStorage n'existe plus en base, on revient à EUR
        if (data.length > 0 && !data.find(c => c.code === current)) {
          setCurrent('EUR')
          localStorage.setItem('currency', 'EUR')
        }
      })
      .catch(() => {})
  }, [])

  function selectCurrency(code) {
    setCurrent(code)
    localStorage.setItem('currency', code)
  }

  // Taux de la devise active
  const rate = currencies.find(c => c.code === current)?.rate_vs_eur || 1
  const symbol = currencies.find(c => c.code === current)?.symbol || '€'

  function format(priceEur) {
    const converted = priceEur * rate
    return `${converted.toFixed(2)} ${symbol}`
  }

  return (
    <CurrencyContext.Provider value={{ currencies, current, selectCurrency, rate, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
