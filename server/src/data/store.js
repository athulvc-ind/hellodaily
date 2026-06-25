import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export const createId = (prefix) => `${prefix}_${nanoid(10)}`;

const password = bcrypt.hashSync("password123", 10);

export const db = {
  users: [
    {
      _id: "user_customer",
      name: "Aarav Menon",
      email: "customer@hellodaily.dev",
      phone: "+91 98765 10001",
      password,
      role: "customer",
      membership: "Gold",
      createdAt: new Date("2026-05-01").toISOString()
    },
    {
      _id: "user_staff",
      name: "Nisha Rao",
      email: "staff@hellodaily.dev",
      phone: "+91 98765 10002",
      password,
      role: "staff",
      createdAt: new Date("2026-05-02").toISOString()
    },
    {
      _id: "user_kitchen",
      name: "Kabir Sheikh",
      email: "kitchen@hellodaily.dev",
      phone: "+91 98765 10003",
      password,
      role: "kitchen",
      createdAt: new Date("2026-05-03").toISOString()
    },
    {
      _id: "user_admin",
      name: "Meera Iyer",
      email: "admin@hellodaily.dev",
      phone: "+91 98765 10004",
      password,
      role: "admin",
      createdAt: new Date("2026-05-04").toISOString()
    }
  ],
  restaurants: [
    {
      _id: "rest_verdant",
      restaurantName: "Verdant Table",
      address: "MG Road, Kochi, Kerala",
      ownerId: "user_admin",
      status: "active",
      openingHours: "10:00 AM - 11:00 PM"
    }
  ],
  tables: [
    {
      _id: "table_01",
      restaurantId: "rest_verdant",
      tableNumber: "T01",
      capacity: 2,
      zone: "Window",
      qrCode: "https://hellodaily.local/qr/table_01",
      status: "available"
    },
    {
      _id: "table_02",
      restaurantId: "rest_verdant",
      tableNumber: "T02",
      capacity: 4,
      zone: "Garden",
      qrCode: "https://hellodaily.local/qr/table_02",
      status: "booked"
    },
    {
      _id: "table_03",
      restaurantId: "rest_verdant",
      tableNumber: "T03",
      capacity: 6,
      zone: "Main Hall",
      qrCode: "https://hellodaily.local/qr/table_03",
      status: "occupied"
    },
    {
      _id: "table_04",
      restaurantId: "rest_verdant",
      tableNumber: "T04",
      capacity: 4,
      zone: "Patio",
      qrCode: "https://hellodaily.local/qr/table_04",
      status: "available"
    }
  ],
  bookings: [
    {
      _id: "booking_01",
      userId: "user_customer",
      tableId: "table_02",
      bookingDate: new Date().toISOString().slice(0, 10),
      startTime: "19:30",
      endTime: "21:00",
      guests: 4,
      status: "confirmed"
    }
  ],
  menuItems: [
    {
      _id: "menu_01",
      restaurantId: "rest_verdant",
      name: "Charred Paneer Skewers",
      description: "Smoky paneer, mint chutney, pickled onion, and lemon.",
      category: "Starters",
      price: 280,
      image:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
      availability: true,
      preparationTime: 12,
      rating: 4.8
    },
    {
      _id: "menu_02",
      restaurantId: "rest_verdant",
      name: "Malabar Coconut Curry",
      description: "Seasonal vegetables simmered with coconut, curry leaf, and red rice.",
      category: "Main Course",
      price: 420,
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
      availability: true,
      preparationTime: 18,
      rating: 4.7
    },
    {
      _id: "menu_03",
      restaurantId: "rest_verdant",
      name: "Pepper Ghee Roast",
      description: "Crisp roast, pepper masala, tempered ghee, and neer dosa.",
      category: "Main Course",
      price: 520,
      image:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
      availability: true,
      preparationTime: 20,
      rating: 4.9
    },
    {
      _id: "menu_04",
      restaurantId: "rest_verdant",
      name: "Saffron Payasam",
      description: "Slow-cooked vermicelli, jaggery, saffron, cashew, and cardamom.",
      category: "Desserts",
      price: 180,
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
      availability: true,
      preparationTime: 8,
      rating: 4.6
    },
    {
      _id: "menu_05",
      restaurantId: "rest_verdant",
      name: "Mango Basil Cooler",
      description: "Alphonso mango, basil seed, lime, and sparkling water.",
      category: "Beverages",
      price: 160,
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
      availability: true,
      preparationTime: 5,
      rating: 4.5
    }
  ],
  orders: [
    {
      _id: "order_01",
      userId: "user_customer",
      tableId: "table_03",
      items: [
        { menuItemId: "menu_01", name: "Charred Paneer Skewers", quantity: 2, price: 280 },
        { menuItemId: "menu_05", name: "Mango Basil Cooler", quantity: 2, price: 160 }
      ],
      totalAmount: 880,
      paymentStatus: "pending",
      orderStatus: "preparing",
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
    },
    {
      _id: "order_02",
      userId: "user_customer",
      tableId: "table_02",
      items: [{ menuItemId: "menu_02", name: "Malabar Coconut Curry", quantity: 1, price: 420 }],
      totalAmount: 420,
      paymentStatus: "paid",
      orderStatus: "ready",
      createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString()
    }
  ],
  employees: [
    {
      _id: "emp_01",
      restaurantId: "rest_verdant",
      name: "Nisha Rao",
      role: "staff",
      phone: "+91 98765 10002",
      email: "staff@hellodaily.dev",
      status: "on-shift"
    },
    {
      _id: "emp_02",
      restaurantId: "rest_verdant",
      name: "Kabir Sheikh",
      role: "kitchen",
      phone: "+91 98765 10003",
      email: "kitchen@hellodaily.dev",
      status: "on-shift"
    }
  ],
  payments: [
    {
      _id: "payment_01",
      orderId: "order_02",
      amount: 420,
      method: "upi",
      status: "paid",
      paidAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
    }
  ]
};

export function publicUser(user) {
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function findById(collection, id) {
  return db[collection].find((item) => item._id === id);
}

export function upsert(collection, item) {
  const index = db[collection].findIndex((current) => current._id === item._id);
  if (index === -1) {
    db[collection].push(item);
    return item;
  }
  db[collection][index] = { ...db[collection][index], ...item };
  return db[collection][index];
}

export function removeById(collection, id) {
  const index = db[collection].findIndex((item) => item._id === id);
  if (index === -1) return false;
  db[collection].splice(index, 1);
  return true;
}
