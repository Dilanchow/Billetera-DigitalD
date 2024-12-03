import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from './db.js'

export async function register(req, res) {
  const { nombre, telefono, email, password } = req.body

  try {
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE telefono = ? OR email = ?', [telefono, email])

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, telefono, email, password) VALUES (?, ?, ?, ?)',
      [nombre, telefono, email, hashedPassword]
    )

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId })
  } catch (error) {
    console.error('Error en el registro:', error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

export async function login(req, res) {
  const { telefono, password } = req.body

  try {
    const [users] = await pool.query('SELECT * FROM usuarios WHERE telefono = ?', [telefono])

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    res.json({ success: true, user: { id: user.id, nombre: user.nombre, email: user.email } })
  } catch (error) {
    console.error('Error en el login:', error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

export async function logout(req, res) {
  res.clearCookie('token')
  res.json({ message: 'Sesión cerrada exitosamente' })
}

export async function getUserData(req, res) {
  try {
    const [user] = await pool.query('SELECT id, nombre, email, telefono, saldo FROM usuarios WHERE id = ?', [req.user.userId])

    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user[0])
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

export function authenticateToken(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' })
    }

    req.user = user
    next()
  })
}








