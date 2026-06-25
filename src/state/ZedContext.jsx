import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  bookings as seedBookings,
  demoUsers,
  employees as seedEmployees,
  menuItems as seedMenuItems,
  orders as seedOrders,
  restaurants as seedRestaurants,
  tables as seedTables
} from "../data/mockData.js";

const ZedContext = createContext(null);

const nextId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const sessionKey = "hellodaily.session";

const readStoredSession = () => {
  if (typeof window === "undefined") return { role: null, activeTableId: "" };

  try {
    const stored = JSON.parse(window.localStorage.getItem(sessionKey) || "{}");
    return {
      role: demoUsers[stored.role] ? stored.role : null,
      activeTableId: typeof stored.activeTableId === "string" ? stored.activeTableId : ""
    };
  } catch (_error) {
    return { role: null, activeTableId: "" };
  }
};

export function ZedProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [restaurants] = useState(seedRestaurants);
  const [tables, setTables] = useState(seedTables);
  const [bookings, setBookings] = useState(seedBookings);
  const [menuItems, setMenuItems] = useState(seedMenuItems);
  const [orders, setOrders] = useState(seedOrders);
  const [employees, setEmployees] = useState(seedEmployees);
  const [cart, setCart] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(seedRestaurants[0]?._id);

  const role = session.role;
  const currentUser = role ? demoUsers[role] : null;
  const activeTableId = session.activeTableId;
  const activeTable = tables.find((table) => table._id === activeTableId) || null;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!session.role && !session.activeTableId) {
      window.localStorage.removeItem(sessionKey);
      return;
    }

    window.localStorage.setItem(sessionKey, JSON.stringify(session));
  }, [session]);

  const login = (nextRole) => {
    if (!demoUsers[nextRole]) return false;
    setSession((current) => ({
      role: nextRole,
      activeTableId: nextRole === "customer" ? current.activeTableId : ""
    }));
    if (nextRole !== "customer") setCart([]);
    return true;
  };

  const logout = () => {
    setSession({ role: null, activeTableId: "" });
    setCart([]);
  };

  const setActiveTableFromQr = useCallback(
    (tableId) => {
      const table = tables.find((candidate) => candidate._id === tableId);
      if (!table) return null;

      setSession((current) => ({ ...current, activeTableId: table._id }));
      return table;
    },
    [tables]
  );

  const addToCart = (item) => {
    if (!item.availability) return;
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.menuItemId === item._id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.menuItemId === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [
        ...current,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        }
      ];
    });
  };

  const updateCartQuantity = (menuItemId, quantity) => {
    setCart((current) =>
      current
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const bookTable = ({ tableId, bookingDate, startTime, endTime, guests }) => {
    const booking = {
      _id: nextId("booking"),
      userId: currentUser?._id || "walkin_guest",
      tableId,
      bookingDate,
      startTime,
      endTime,
      guests,
      status: "confirmed"
    };
    setBookings((current) => [booking, ...current]);
    setTables((current) =>
      current.map((table) => (table._id === tableId ? { ...table, status: "booked" } : table))
    );
    return booking;
  };

  const updateTableStatus = (tableId, status) => {
    setTables((current) =>
      current.map((table) => (table._id === tableId ? { ...table, status } : table))
    );
  };

  const placeOrder = ({ tableId, paymentMethod }) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
      _id: nextId("order"),
      userId: currentUser?._id || "walkin_guest",
      tableId,
      items: cart.map(({ image: _image, ...item }) => item),
      totalAmount,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      paymentMethod,
      orderStatus: "placed",
      createdAt: new Date().toISOString()
    };
    setOrders((current) => [order, ...current]);
    setTables((current) =>
      current.map((table) => (table._id === tableId ? { ...table, status: "occupied" } : table))
    );
    setCart([]);
    return order;
  };

  const updateOrderStatus = (orderId, orderStatus) => {
    setOrders((current) =>
      current.map((order) => (order._id === orderId ? { ...order, orderStatus } : order))
    );
  };

  const markPaid = (orderId) => {
    setOrders((current) =>
      current.map((order) =>
        order._id === orderId ? { ...order, paymentStatus: "paid", paymentMethod: "upi" } : order
      )
    );
  };

  const toggleMenuAvailability = (menuItemId) => {
    setMenuItems((current) =>
      current.map((item) =>
        item._id === menuItemId ? { ...item, availability: !item.availability } : item
      )
    );
  };

  const saveMenuItem = (item) => {
    setMenuItems((current) => {
      if (item._id) {
        return current.map((candidate) => (candidate._id === item._id ? item : candidate));
      }
      return [{ ...item, _id: nextId("menu"), restaurantId: selectedRestaurantId }, ...current];
    });
  };

  const deleteMenuItem = (menuItemId) => {
    setMenuItems((current) => current.filter((item) => item._id !== menuItemId));
  };

  const saveEmployee = (employee) => {
    setEmployees((current) => {
      if (employee._id) {
        return current.map((candidate) => (candidate._id === employee._id ? employee : candidate));
      }
      return [
        {
          ...employee,
          _id: nextId("emp"),
          restaurantId: selectedRestaurantId,
          status: employee.status || "active"
        },
        ...current
      ];
    });
  };

  const analytics = useMemo(() => {
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
    const revenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const itemCounts = new Map();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts.set(item.name, (itemCounts.get(item.name) || 0) + item.quantity);
      });
    });

    return {
      revenue,
      orderCount: orders.length,
      averageOrderValue: paidOrders.length ? Math.round(revenue / paidOrders.length) : 0,
      availableTables: tables.filter((table) => table.status === "available").length,
      topItems: [...itemCounts.entries()]
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 4)
    };
  }, [orders, tables]);

  const value = {
    activeTable,
    activeTableId,
    analytics,
    bookings,
    bookTable,
    cart,
    clearCart,
    currentUser,
    deleteMenuItem,
    employees,
    login,
    logout,
    markPaid,
    menuItems,
    orders,
    placeOrder,
    restaurants,
    role,
    saveEmployee,
    saveMenuItem,
    selectedRestaurantId,
    setActiveTableFromQr,
    setSelectedRestaurantId,
    tables,
    toggleMenuAvailability,
    updateCartQuantity,
    updateOrderStatus,
    updateTableStatus,
    addToCart
  };

  return <ZedContext.Provider value={value}>{children}</ZedContext.Provider>;
}

export function useZed() {
  const context = useContext(ZedContext);
  if (!context) throw new Error("useZed must be used inside ZedProvider");
  return context;
}
