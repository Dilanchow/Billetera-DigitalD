'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, DollarSign, LogOut } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { getUserData, getTransactions, logout, getUserBalance } from '@/lib/api'

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  created_at: string;
  usuario_id: number;
  recipient_id?: number;
}

export default function DashboardPage() {
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const fetchData = async () => {
    try {
      const balanceData = await getUserBalance();
      setBalance(Number(balanceData) || 0); // Ensure balance is a number
      
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      setBalance(0); // Set balance to 0 on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up an interval to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const success = searchParams.get('success')
    const type = searchParams.get('type')
    const amount = searchParams.get('amount')

    if (success && type && amount) {
      toast({
        title: "Transacción Exitosa",
        description: `Se ha realizado un${type === 'deposit' ? ' depósito' : type === 'withdraw' ? ' retiro' : 'a transferencia'} de $${amount}`,
        duration: 5000,
      })
      
      // Refresh data after successful transaction
      fetchData();
      router.replace('/dashboard')
    }
  }, [searchParams, toast, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="text-green-500 mr-2" />;
      case 'withdraw':
        return <ArrowDownRight className="text-red-500 mr-2" />;
      case 'transfer':
        return <ArrowDownRight className="text-orange-500 mr-2" />;
      default:
        return <ArrowDownRight className="text-red-500 mr-2" />;
    }
  };

  const getTransactionDescription = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'deposit':
        return `Depósito: ${transaction.description}`;
      case 'withdraw':
        return `Retiro: ${transaction.description}`;
      case 'transfer':
        return `Transferencia: ${transaction.description}`;
      default:
        return transaction.description;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:pl-24">
      <Navigation />
      <main className="max-w-4xl mx-auto space-y-6 animate-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={16} />
            Cerrar Sesión
          </Button>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Saldo Actual</h2>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-primary">
              ${typeof balance === 'number' ? balance.toFixed(2) : '0.00'}
            </span>
            <DollarSign size={48} className="text-accent" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-lg shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Últimas Transacciones</h2>
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {getTransactionDescription(transaction)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(transaction.created_at)}
                      </span>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${typeof transaction.amount === 'number' ? transaction.amount.toFixed(2) : '0.00'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">No hay transacciones disponibles</p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <button 
            onClick={() => router.push('/deposit')} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Depositar
          </button>
          <button 
            onClick={() => router.push('/withdraw')} 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Retirar
          </button>
          <button 
            onClick={() => router.push('/pay-services')} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Pagar servicios
          </button>
          <button 
            onClick={() => router.push('/transactions')} 
            className="bg-muted hover:bg-muted/90 text-muted-foreground font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Transferir
          </button>
        </motion.div>
      </main>
    </div>
  )
}




