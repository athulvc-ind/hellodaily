export const demoUsers = {
  customer: {
    _id: "user_customer",
    name: "Aarav Menon",
    email: "customer@hellodaily.dev",
    role: "customer",
    phone: "+91 98765 10001",
    membership: "Gold"
  },
  staff: {
    _id: "user_staff",
    name: "Nisha Rao",
    email: "staff@hellodaily.dev",
    role: "staff",
    phone: "+91 98765 10002"
  },
  kitchen: {
    _id: "user_kitchen",
    name: "Kabir Sheikh",
    email: "kitchen@hellodaily.dev",
    role: "kitchen",
    phone: "+91 98765 10003"
  },
  admin: {
    _id: "user_admin",
    name: "Meera Iyer",
    email: "admin@hellodaily.dev",
    role: "admin",
    phone: "+91 98765 10004"
  }
};

export const restaurants = [
  {
    _id: "rest_verdant",
    restaurantName: "Verdant Table",
    address: "MG Road, Kochi, Kerala",
    ownerId: "user_admin",
    status: "active",
    openingHours: "10:00 AM - 11:00 PM",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
  }
];

export const tables = [
  {
    _id: "table_01",
    restaurantId: "rest_verdant",
    tableNumber: "T01",
    capacity: 2,
    zone: "Window",
    qrCode: "/scan/table_01",
    status: "available"
  },
  {
    _id: "table_02",
    restaurantId: "rest_verdant",
    tableNumber: "T02",
    capacity: 4,
    zone: "Garden",
    qrCode: "/scan/table_02",
    status: "booked"
  },
  {
    _id: "table_03",
    restaurantId: "rest_verdant",
    tableNumber: "T03",
    capacity: 6,
    zone: "Main Hall",
    qrCode: "/scan/table_03",
    status: "occupied"
  },
  {
    _id: "table_04",
    restaurantId: "rest_verdant",
    tableNumber: "T04",
    capacity: 4,
    zone: "Patio",
    qrCode: "/scan/table_04",
    status: "available"
  },
  {
    _id: "table_05",
    restaurantId: "rest_verdant",
    tableNumber: "T05",
    capacity: 8,
    zone: "Family",
    qrCode: "/scan/table_05",
    status: "maintenance"
  }
];

export const bookings = [
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
];

export const menuItems = [
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
  },
  {
    _id: "menu_06",
    restaurantId: "rest_verdant",
    name: "Coastal Prawn Fry",
    description: "Crisp prawns, curry leaf dust, raw mango, and smoked chilli.",
    category: "Starters",
    price: 560,
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80",
    availability: false,
    preparationTime: 14,
    rating: 4.4
  }
];

export const orders = [
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
  },
  {
    _id: "order_03",
    userId: "walkin_guest",
    tableId: "table_01",
    items: [
      { menuItemId: "menu_03", name: "Pepper Ghee Roast", quantity: 1, price: 520 },
      { menuItemId: "menu_04", name: "Saffron Payasam", quantity: 2, price: 180 }
    ],
    totalAmount: 880,
    paymentStatus: "paid",
    orderStatus: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString()
  }
];

export const employees = [
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
  },
  {
    _id: "emp_03",
    restaurantId: "rest_verdant",
    name: "Rhea Paul",
    role: "manager",
    phone: "+91 98765 10005",
    email: "rhea@hellodaily.dev",
    status: "active"
  }
];
