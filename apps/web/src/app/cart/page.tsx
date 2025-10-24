"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Search,
  User,
  Star,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  type: "product" | "service";
  provider: string; // Customer or Freelancer
  rating: number;
  imageUrl: string;
  price: number;
  quantity: number;
  isInstant?: boolean; // For services
}

const dummyCartItems: CartItem[] = [
  {
    id: "p1",
    name: "Product 1",
    type: "product",
    provider: "Customer 1",
    rating: 4.5,
    imageUrl: "https://via.placeholder.com/80",
    price: 800.0,
    quantity: 1,
  },
  {
    id: "s1",
    name: "Service 1",
    type: "service",
    provider: "Freelancer 1",
    rating: 4.0,
    imageUrl: "https://via.placeholder.com/80",
    price: 3500.0,
    quantity: 1,
    isInstant: true,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(dummyCartItems);
  const [discountCode, setDiscountCode] = useState("");
  const [saveForLater, setSaveForLater] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceFee = 150.0; // Example fixed service fee
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto p-8 grid grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6">Cart</h1>

          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4 shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < Math.floor(item.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          size={16}
                          fill={
                            i < Math.floor(item.rating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                      <span className="ml-2">{item.provider}</span>
                    </div>
                    {item.type === "service" && item.isInstant && (
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Instant
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <p className="text-lg font-semibold">
                    ETB {(item.price * item.quantity).toFixed(2)}
                  </p>
                </Card>
              ))
            )}
          </div>

          {/* Discount Code */}
          <div className="flex items-center mt-6 space-x-2">
            <Input
              type="text"
              placeholder="Enter discount code"
              className="flex-1 border-gray-300 rounded-md p-2"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button className="bg-[#E0B44B] hover:bg-[#D0A43B] text-white font-semibold rounded-md px-6 py-2">
              Apply
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="save-for-later"
                checked={saveForLater}
                onCheckedChange={setSaveForLater}
              />
              <Label htmlFor="save-for-later">Save for later</Label>
            </div>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue shopping
            </Button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <Card className="col-span-1 p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>ETB {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>ETB {serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>ETB {total.toFixed(2)}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Payment</h3>
          <RadioGroup defaultValue="telebirr" className="space-y-2 mb-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="telebirr" id="telebirr" />
              <Label htmlFor="telebirr">Telebirr</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cbebirr" id="cbebirr" />
              <Label htmlFor="cbebirr">CBE Birr</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="amole" id="amole" />
              <Label htmlFor="amole">Amole</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cards" id="cards" />
              <Label htmlFor="cards">Cards</Label>
            </div>
          </RadioGroup>

          <Button className="w-full bg-[#E0B44B] hover:bg-[#D0A43B] text-white font-semibold rounded-md py-3">
            Proceed to payment
          </Button>
        </Card>
      </main>
    </div>
  );
}
