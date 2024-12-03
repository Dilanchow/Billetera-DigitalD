'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TransactionsPage() {
  const [recipientPhone, setRecipientPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!recipientPhone || !amount) {
      setError('Por favor, complete todos los campos requeridos')
      return
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Por favor, ingrese un monto válido')
      return
    }

    // Aquí iría la lógica para procesar la transferencia
    console.log('Procesando transferencia:', { recipientPhone, amount, description })
    router.push('/dashboard')
  }

  return (
    <>
      <Card className="max-w-md mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Transferir Dinero</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Número de teléfono del destinatario</Label>
              <Input
                id="recipientPhone"
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Número de teléfono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Motivo de la transferencia"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
<Button type="submit" className="w-full bg-primary hover:bg-primary/90">Transferir</Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}





