import pool from './db.js'
import { createTransaction } from './transactions.js'

export async function payUtility(userId, amount, description) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await createTransaction(userId, 'withdraw', amount, description)

    await connection.commit()
    return { success: true, message: 'Pago de servicio realizado con éxito' }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function mobileRecharge(userId, amount, description) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await createTransaction(userId, 'withdraw', amount, description)

    await connection.commit()
    return { success: true, message: 'Recarga móvil realizada con éxito' }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}


