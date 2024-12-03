import pool from './db.js'

export async function createTransaction(userId, type, amount, description, recipientId = null) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      'INSERT INTO transacciones (usuario_id, type, amount, description, recipient_id) VALUES (?, ?, ?, ?, ?)',
      [userId, type, amount, description, recipientId]
    )

    if (type === 'deposit') {
      await connection.query(
        'UPDATE usuarios SET saldo = saldo + ? WHERE id = ?',
        [amount, userId]
      )
    } else if (type === 'withdraw' || type === 'transfer') {
      const [userRow] = await connection.query(
        'SELECT saldo FROM usuarios WHERE id = ?',
        [userId]
      )
      
      if (userRow[0].saldo < amount) {
        throw new Error('Saldo insuficiente')
      }
      
      await connection.query(
        'UPDATE usuarios SET saldo = saldo - ? WHERE id = ?',
        [amount, userId]
      )

      if (type === 'transfer' && recipientId) {
        await connection.query(
          'UPDATE usuarios SET saldo = saldo + ? WHERE id = ?',
          [amount, recipientId]
        )
      }
    }

    await connection.commit()
    return result.insertId
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function getTransactions(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM transacciones WHERE usuario_id = ? OR recipient_id = ? ORDER BY created_at DESC',
    [userId, userId]
  )
  return rows
}

export async function getUserBalance(userId) {
  const [rows] = await pool.query(
    'SELECT saldo FROM usuarios WHERE id = ?',
    [userId]
  )
  return rows[0].saldo
}



