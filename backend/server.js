import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { register, login, logout, getUserData, authenticateToken } from './auth.js'
import { testConnection } from './db.js'
import { createTransaction, getTransactions, getUserBalance } from './transactions.js'
import { payUtility, mobileRecharge } from './services.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Test database connection on startup
testConnection()

// Auth routes
app.post('/api/auth/register', register)
app.post('/api/auth/login', login)
app.post('/api/auth/logout', logout)
app.get('/api/auth/user', authenticateToken, getUserData)

// Transaction routes
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { type, amount, description, recipientId } = req.body
    const transactionId = await createTransaction(req.user.userId, type, amount, description, recipientId)
    const newBalance = await getUserBalance(req.user.userId)
    res.json({ success: true, transactionId, newBalance })
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ error: error.message || 'Error al crear la transacción' })
  }
})

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await getTransactions(req.user.userId)
    res.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Error al obtener las transacciones' })
  }
})

// Service routes
app.post('/api/services/utility-payment', authenticateToken, async (req, res) => {
  try {
    const { amount, description } = req.body
    const result = await payUtility(req.user.userId, amount, description)
    res.json(result)
  } catch (error) {
    console.error('Error in utility payment:', error)
    res.status(500).json({ error: 'Error al procesar el pago de servicio' })
  }
})

app.post('/api/services/mobile-recharge', authenticateToken, async (req, res) => {
  try {
    const { amount, description } = req.body
    const result = await mobileRecharge(req.user.userId, amount, description)
    res.json(result)
  } catch (error) {
    console.error('Error in mobile recharge:', error)
    res.status(500).json({ error: 'Error al procesar la recarga móvil' })
  }
})

app.get('/api/balance', authenticateToken, async (req, res) => {
  try {
    const balance = await getUserBalance(req.user.userId)
    res.json({ balance })
  } catch (error) {
    console.error('Error fetching balance:', error)
    res.status(500).json({ error: 'Error al obtener el saldo' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})










