import React from 'react';
import { NavBar } from "@/components/NavBar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, Eye, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'pending';
  total: number;
  items: number;
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORDER-12345',
      date: '2023-10-15',
      status: 'delivered',
      total: 8399.44, // Converted from 149.99 USD to PHP (approx 56:1)
      items: 2
    },
    {
      id: '2',
      orderNumber: 'ORDER-12346',
      date: '2023-11-02',
      status: 'pending',
      total: 4479.44, // Converted from 79.99 USD to PHP
      items: 1
    },
    {
      id: '3',
      orderNumber: 'ORDER-12347',
      date: '2023-11-20',
      status: 'pending',
      total: 16799.44, // Converted from 299.99 USD to PHP
      items: 3
    }
  ];

  const handleGoBack = () => {
    navigate('/dashboard/buyer');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="page-container">
      <NavBar userType="buyer" />
      <main className="flex-1 bg-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">My Orders</h1>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Track and Manage Your Orders</CardTitle>
              <CardDescription>
                View the status and details of all your purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <OrdersList orders={orders} getStatusColor={getStatusColor} setSelectedOrder={setSelectedOrder} setDialogOpen={setDialogOpen} />
                </TabsContent>

                <TabsContent value="pending" className="mt-0">
                  <OrdersList 
                    orders={orders.filter(order => order.status === 'pending')} 
                    getStatusColor={getStatusColor} 
                    setSelectedOrder={setSelectedOrder}
                    setDialogOpen={setDialogOpen}
                  />
                </TabsContent>

                <TabsContent value="delivered" className="mt-0">
                  <OrdersList 
                    orders={orders.filter(order => order.status === 'delivered')} 
                    getStatusColor={getStatusColor} 
                    setSelectedOrder={setSelectedOrder}
                    setDialogOpen={setDialogOpen}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Sellmate. All rights reserved.
      </footer>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              <div><strong>Order Number:</strong> {selectedOrder.orderNumber}</div>
              <div><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</div>
              <div><strong>Status:</strong> {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</div>
              <div><strong>Amount:</strong> ₱{selectedOrder.total.toFixed(2)}</div>
              <div><strong>Items:</strong> {selectedOrder.items}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OrdersList = ({ 
  orders, 
  getStatusColor,
  setSelectedOrder,
  setDialogOpen
}: { 
  orders: Order[],
  getStatusColor: (status: Order['status']) => string,
  setSelectedOrder: (order: Order) => void,
  setDialogOpen: (open: boolean) => void
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow">
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-bold">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            
            <div className="text-center">
              <p className="font-medium">₱{order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{order.items} item{order.items !== 1 ? 's' : ''}</p>
            </div>
            
            <div className="text-right">
              <Button variant="outline" size="sm" onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrdersPage;
