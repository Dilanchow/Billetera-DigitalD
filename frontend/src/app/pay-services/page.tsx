'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PayServicesPage() {
  const [serviceType, setServiceType] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      // Aquí iría la lógica real de pago
      // Simulamos un delay para la demostración
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirigir al dashboard con los parámetros para la notificación
      router.push(`/dashboard?success=true&type=withdraw&amount=${amount}`)
    } catch (error) {
      console.error('Error al realizar el pago:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Pago de Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="service-type" className="block text-sm font-medium text-foreground mb-1">
                Tipo de Servicio
              </label>
              <Select onValueChange={(value) => setServiceType(value)}>
                <SelectTrigger id="service-type" className="w-full">
                  <SelectValue placeholder="Seleccione el tipo de servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTILITY_PAYMENT">Pago de Servicios Públicos</SelectItem>
                  <SelectItem value="MOBILE_RECHARGE">Recarga de Celular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {serviceType && (
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
                  Monto
                </label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ingrese el monto a pagar"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
            )}
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !serviceType || !amount}
              >
                {loading ? 'Procesando...' : 'Pagar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}










