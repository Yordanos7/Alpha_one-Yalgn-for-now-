"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import Link from "next/link"; // Import Link for navigation
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Star,
  MessageSquare,
  Plus,
  X, // For closing the modal
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  description: string;
  seller: string;
  shippingDetails: string;
  thumbnailUrls: string[];
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Stereo Earbuds",
    price: 129.99,
    rating: 4.5,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Lite de llore la noie dancellly he raotnper iot anis mepferont, Neolaluta udo la tor amd lolurs ait their diheris iverbeem. Ob praite male beloagr and ineet conaenites.",
    seller: "Seller A",
    shippingDetails: "Shipping Detills",
    thumbnailUrls: [
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
    ],
  },
  {
    id: "2",
    name: "Compact Drone",
    price: 299.99,
    rating: 4.0,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Lite de llore la noie dancellly he raotnper iot anis mepferont, Neolaluta udo la tor amd lolurs ait their diheris iverbeem. Ob praite male beloagr and ineet conaenites.",
    seller: "Seller B",
    shippingDetails: "Shipping Detills",
    thumbnailUrls: [
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
    ],
  },
  {
    id: "3",
    name: "Noise-Cancelling Headphones",
    price: 199.99,
    rating: 4.8,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Lite de llore la noie dancellly he raotnper iot anis mepferont, Neolaluta udo la tor amd lolurs ait their diheris iverbeem. Ob praite male beloagr and ineet conaenites.",
    seller: "Seller C",
    shippingDetails: "Shipping Detills",
    thumbnailUrls: [
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
    ],
  },
  {
    id: "4",
    name: "Stiarg Unn",
    price: 99.99,
    rating: 3.5,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Lite de llore la noie dancellly he raotnper iot anis mepferont, Neolaluta udo la tor amd lolurs ait their diheris iverbeem. Ob praite male beloagr and ineet conaenites.",
    seller: "Seller D",
    shippingDetails: "Shipping Detills",
    thumbnailUrls: [
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
    ],
  },
  {
    id: "5",
    name: "Noise-Cha Baphones",
    price: 79.99,
    rating: 4.2,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Lite de llore la noie dancellly he raotnper iot anis mepferont, Neolaluta udo la tor amd lolurs ait their diheris iverbeem. Ob praite male beloagr and ineet conaenites.",
    seller: "Seller E",
    shippingDetails: "Shipping Detills",
    thumbnailUrls: [
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
    ],
  },
  {
    id: "6",
    name: "Smart Projector",
    price: 349.99,
    rating: 4.7,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Lite de llore la noie dancellly he raotnper iot anis mepferont, Neolaluta udo la tor amd lolurs ait their diheris iverbeem. Ob praite male beloagr and ineet conaenites.",
    seller: "Seller F",
    shippingDetails: "Shipping Detills",
    thumbnailUrls: [
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
      "https://via.placeholder.com/50",
    ],
  },
];

const ProductCard = ({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) => (
  <Card
    className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-[#3A3A3A] transition-colors"
    onClick={onClick}
  >
    <img
      src={product.imageUrl}
      alt={product.name}
      className="w-32 h-32 object-cover mb-4 rounded-lg"
    />
    <p className="text-lg font-semibold text-center mb-1">{product.name}</p>
    <div className="flex items-center mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={
            i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-500"
          }
          size={16}
          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
        />
      ))}
      <span className="text-sm text-gray-400 ml-2">({product.rating})</span>
    </div>
    <p className="text-md font-bold text-green-500 mb-4">
      ${product.price.toFixed(2)} USD
    </p>
    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-6 py-2">
      Buy Now
    </Button>
  </Card>
);

export default function MarketplacePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="flex min-h-screen bg-[#202020] text-white">
      <Sidebar currentPage="marketplace" />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#202020] flex flex-col">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="Yalegn Marketplace"
              className="h-8 mr-2"
            />
            <span className="text-xl font-bold text-gray-200">
              Yalegn Marketplace
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-4 py-2">
              Products
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4 mb-8 bg-[#2C2C2C] p-3 rounded-lg">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-lg bg-[#3A3A3A] border-none text-white focus:ring-0 focus:outline-none w-full"
            />
          </div>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Category <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Price Range <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Shipping Location <ChevronDown className="ml-1" size={16} />
          </Button>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white flex items-center"
          >
            Estimated Delivery <ChevronDown className="ml-1" size={16} />
          </Button>
          <Link href="/freelancers">
            <Button className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300 font-semibold rounded-lg px-4 py-2 flex items-center">
              <ShoppingCart className="mr-2" size={16} />
              Freelancers
            </Button>
          </Link>
        </div>

        {/* Content area for product grid and featured freelancers */}
        <div className="flex flex-1 space-x-8">
          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {/* Featured Freelancers Sidebar */}
          <Card className="w-72 bg-[#2C2C2C] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Featured Freelancers</h3>
            <div className="space-y-4">
              {/* Freelancer Card 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah J</p>
                    <p className="text-sm text-gray-400">Graphic Designer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Freelancer Card 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah J</p>
                    <p className="text-sm text-gray-400">Graphic Designer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
              {/* Freelancer Card 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">David Chen</p>
                    <p className="text-sm text-gray-400">Web Developer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-yellow-500" size={16} />
                  <Star className="text-gray-400" size={16} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="bg-[#2C2C2C] text-white p-6 rounded-lg max-w-2xl">
          {selectedProduct && (
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-64 h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex space-x-2">
                  {selectedProduct.thumbnailUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-green-500"
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-xl font-semibold text-green-500 mb-2">
                  ${selectedProduct.price.toFixed(2)} USD
                </p>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.floor(selectedProduct.rating)
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }
                      size={16}
                      fill={
                        i < Math.floor(selectedProduct.rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">
                    ({selectedProduct.rating})
                  </span>
                </div>

                <Tabs defaultValue="description" className="w-full mb-6">
                  <TabsList className="bg-[#3A3A3A] rounded-md p-1">
                    <TabsTrigger
                      value="description"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-sm px-4 py-2"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="specifications"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-sm px-4 py-2"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-sm px-4 py-2"
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="description"
                    className="mt-4 text-gray-300"
                  >
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="mb-4">{selectedProduct.description}</p>
                    <h3 className="font-semibold mb-2">Seller Information</h3>
                    <p className="mb-4">{selectedProduct.seller}</p>
                    <h3 className="font-semibold mb-2">Shipping Details</h3>
                    <p>{selectedProduct.shippingDetails}</p>
                  </TabsContent>
                  <TabsContent
                    value="specifications"
                    className="mt-4 text-gray-300"
                  >
                    <p>Specifications content goes here.</p>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-4 text-gray-300">
                    <p>Reviews content goes here.</p>
                  </TabsContent>
                </Tabs>

                <div className="flex space-x-4">
                  <Button className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-gray-300 font-semibold rounded-md px-6 py-2 flex items-center">
                    <MessageSquare className="mr-2" size={16} />
                    Message Seller
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md px-6 py-2 flex items-center">
                    <Plus className="mr-2" size={16} />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
