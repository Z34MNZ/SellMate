import React from 'react';
import { NavBar } from "@/components/NavBar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ArrowLeft, Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'active' | 'sold';
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    price: '',
    category: '',
    status: 'active',
    description: '',
  });

  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Headphones',
      price: 299.99,
      category: 'Electronics',
      status: 'active',
    },
    {
      id: '2',
      name: 'Smartphone XL',
      price: 899.99,
      category: 'Electronics',
      status: 'active',
    },
    {
      id: '3',
      name: 'Designer T-shirt',
      price: 49.99,
      category: 'Clothing',
      status: 'sold',
    },
    {
      id: '4',
      name: 'Running Shoes',
      price: 129.99,
      category: 'Clothing',
      status: 'sold',
    }
  ];

  const handleGoBack = () => {
    navigate('/dashboard/seller');
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'sold': return <Badge className="bg-blue-100 text-blue-800">Sold</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would add logic to save the product to Firestore or backend
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', category: '', status: 'active', description: '' });
  };

  return (
    <div className="page-container">
      <NavBar userType="seller" />
      <main className="flex-1 bg-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleGoBack} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Button>
              <h1 className="text-3xl font-bold">My Products</h1>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Your Product Catalog</CardTitle>
                <CardDescription>
                  Add, edit, and organize your product listings
                </CardDescription>
              </div>
              <Button variant="default" onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="sold">Sold</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <ProductsList products={products} getStatusBadge={getStatusBadge} />
                </TabsContent>

                <TabsContent value="active" className="mt-0">
                  <ProductsList 
                    products={products.filter(product => product.status === 'active')} 
                    getStatusBadge={getStatusBadge} 
                  />
                </TabsContent>

                <TabsContent value="sold" className="mt-0">
                  <ProductsList 
                    products={products.filter(product => product.status === 'sold')} 
                    getStatusBadge={getStatusBadge} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Add Product Modal */}
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
              {/* Gradient bar at the top */}
              <div style={{ height: '8px', width: '100%', background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)' }} />
              <div className="flex flex-col items-center px-8 py-8">
                {/* Gradient Icon */}
                <div className="rounded-full mb-4 flex items-center justify-center" style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)' }}>
                  <Briefcase size={28} color="#fff" />
                </div>
                {/* Heading */}
                <div className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Add New Product</div>
                <div className="text-gray-500 mb-6 text-center">Fill in the details below to add a new product to your store.</div>
                <form onSubmit={handleAddProduct} className="space-y-5 w-full">
                  <div>
                    <label className="block text-base font-semibold mb-1 text-gray-800">Product Name</label>
                    <Input
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="rounded-xl border-2 border-transparent focus:border-blue-500 focus:ring-0 text-base px-4 py-3 bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold mb-1 text-gray-800">Description</label>
                    <textarea
                      placeholder="Description"
                      value={newProduct.description || ''}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                      className="rounded-xl border-2 border-transparent focus:border-blue-500 focus:ring-0 text-base px-4 py-3 bg-gray-50 w-full min-h-[80px] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold mb-1 text-gray-800">Price</label>
                    <Input
                      placeholder="Price"
                      type="number"
                      min="0"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                      className="rounded-xl border-2 border-transparent focus:border-blue-500 focus:ring-0 text-base px-4 py-3 bg-gray-50 shadow-sm"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 border-0 shadow-none">
                      Add Product
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} MultiPortal. All rights reserved.
      </footer>
    </div>
  );
};

const ProductsList = ({ 
  products, 
  getStatusBadge 
}: { 
  products: Product[],
  getStatusBadge: (status: Product['status']) => React.ReactNode
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-sm text-gray-500">
            <th className="text-left py-3 px-4">Product</th>
            <th className="text-left py-3 px-4">Category</th>
            <th className="text-left py-3 px-4">Price</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{product.name}</td>
              <td className="py-3 px-4 text-gray-600">{product.category}</td>
              <td className="py-3 px-4">₱{product.price.toFixed(2)}</td>
              <td className="py-3 px-4">{getStatusBadge(product.status)}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
