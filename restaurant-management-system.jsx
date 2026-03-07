import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  LayoutDashboard, ShoppingBag, ChefHat, UtensilsCrossed, Armchair,
  CalendarClock, Package, Users, BarChart3, Heart, Settings, LogOut,
  Sun, Moon, Bell, Search, Plus, Eye, Edit, Trash2, Check, X,
  Clock, DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  Filter, ChevronDown, ChevronRight, ChevronLeft, MoreVertical,
  CreditCard, Banknote, Smartphone, Gift, Receipt, Printer,
  ArrowUpRight, ArrowDownRight, Hash, MapPin, Phone, Mail,
  Star, Flame, Snowflake, Leaf, Wifi, WifiOff, Volume2, VolumeX,
  Grid3X3, List, RefreshCw, Download, Upload, Copy, Maximize2,
  Minimize2, PanelLeftClose, PanelLeft, CircleDot, Square,
  Circle, AlertCircle, Info, CheckCircle2, XCircle, Timer,
  Utensils, Coffee, Wine, Salad, Beef, Fish, Cake, Pizza,
  Soup, Sandwich, IceCream, Egg, Apple, Carrot, Milk,
  ShieldCheck, Lock, KeyRound, UserCog, Store, Palette, Globe,
  Zap, Activity, PieChart, LineChart, BarChart, Target
} from "lucide-react";
import {
  LineChart as ReLineChart, Line, AreaChart, Area, BarChart as ReBarChart, Bar,
  PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// THEME & DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  brand: { primary: "#F59E0B", secondary: "#D97706", accent: "#FBBF24" },
  status: {
    available: "#22C55E", occupied: "#EF4444", reserved: "#F59E0B",
    preparing: "#3B82F6", ready: "#10B981", new: "#8B5CF6",
    cleaning: "#6B7280", cancelled: "#DC2626", voided: "#991B1B"
  },
  chart: ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444", "#EC4899", "#06B6D4"]
};

// ═══════════════════════════════════════════════════════════════
// DEMO DATA - Realistic restaurant data
// ═══════════════════════════════════════════════════════════════
const DEMO_RESTAURANT = {
  id: "r1", name: "Bella Cucina", slug: "bella-cucina",
  address: "47 Maximilianstraße, Munich", phone: "+49 89 1234567",
  currency: "EUR", taxRate: 0.19, timezone: "Europe/Berlin"
};

const DEMO_STAFF = [
  { id: "s1", name: "Marco Rossi", role: "owner", pin: "1234", hourlyRate: 0, avatar: "MR", isActive: true, email: "marco@bellacucina.de" },
  { id: "s2", name: "Anna Schmidt", role: "manager", pin: "2345", hourlyRate: 22, avatar: "AS", isActive: true, email: "anna@bellacucina.de" },
  { id: "s3", name: "Luigi Bianchi", role: "chef", pin: "3456", hourlyRate: 20, avatar: "LB", isActive: true, email: "luigi@bellacucina.de" },
  { id: "s4", name: "Sophie Weber", role: "waiter", pin: "4567", hourlyRate: 14, avatar: "SW", isActive: true, email: "sophie@bellacucina.de" },
  { id: "s5", name: "Felix Müller", role: "cashier", pin: "5678", hourlyRate: 13, avatar: "FM", isActive: true, email: "felix@bellacucina.de" },
  { id: "s6", name: "Emma Fischer", role: "host", pin: "6789", hourlyRate: 13, avatar: "EF", isActive: true, email: "emma@bellacucina.de" },
  { id: "s7", name: "Luca Romano", role: "chef", pin: "7890", hourlyRate: 18, avatar: "LR", isActive: true, email: "luca@bellacucina.de" },
  { id: "s8", name: "Mia Hoffmann", role: "waiter", pin: "8901", hourlyRate: 14, avatar: "MH", isActive: false, email: "mia@bellacucina.de" },
];

const DEMO_CATEGORIES = [
  { id: "c1", name: "Antipasti", icon: "🥗", color: "#22C55E", itemCount: 6, sortOrder: 1 },
  { id: "c2", name: "Pasta", icon: "🍝", color: "#F59E0B", itemCount: 8, sortOrder: 2 },
  { id: "c3", name: "Pizza", icon: "🍕", color: "#EF4444", itemCount: 7, sortOrder: 3 },
  { id: "c4", name: "Secondi", icon: "🥩", color: "#8B5CF6", itemCount: 5, sortOrder: 4 },
  { id: "c5", name: "Dolci", icon: "🍰", color: "#EC4899", itemCount: 5, sortOrder: 5 },
  { id: "c6", name: "Bevande", icon: "🍷", color: "#06B6D4", itemCount: 10, sortOrder: 6 },
];

const DEMO_MENU = [
  { id: "m1", name: "Bruschetta Classica", category: "c1", price: 8.90, cost: 2.10, available: true, prepTime: 8, calories: 280, allergens: ["gluten","dairy"], station: "salad" },
  { id: "m2", name: "Carpaccio di Manzo", category: "c1", price: 14.90, cost: 5.20, available: true, prepTime: 10, calories: 220, allergens: [], station: "salad" },
  { id: "m3", name: "Caprese Salad", category: "c1", price: 10.50, cost: 3.10, available: true, prepTime: 5, calories: 310, allergens: ["dairy"], station: "salad" },
  { id: "m4", name: "Spaghetti Carbonara", category: "c2", price: 14.50, cost: 3.20, available: true, prepTime: 15, calories: 520, allergens: ["gluten","dairy","egg"], station: "pasta" },
  { id: "m5", name: "Penne all'Arrabbiata", category: "c2", price: 12.90, cost: 2.50, available: true, prepTime: 12, calories: 440, allergens: ["gluten"], station: "pasta" },
  { id: "m6", name: "Risotto ai Funghi", category: "c2", price: 16.90, cost: 4.00, available: true, prepTime: 20, calories: 480, allergens: ["dairy"], station: "pasta" },
  { id: "m7", name: "Lasagna Bolognese", category: "c2", price: 15.50, cost: 3.80, available: false, prepTime: 25, calories: 620, allergens: ["gluten","dairy","egg"], station: "pasta" },
  { id: "m8", name: "Margherita", category: "c3", price: 11.90, cost: 2.80, available: true, prepTime: 12, calories: 750, allergens: ["gluten","dairy"], station: "pizza" },
  { id: "m9", name: "Diavola", category: "c3", price: 13.90, cost: 3.40, available: true, prepTime: 12, calories: 820, allergens: ["gluten","dairy"], station: "pizza" },
  { id: "m10", name: "Quattro Formaggi", category: "c3", price: 14.50, cost: 4.20, available: true, prepTime: 14, calories: 900, allergens: ["gluten","dairy"], station: "pizza" },
  { id: "m11", name: "Bistecca Fiorentina", category: "c4", price: 32.90, cost: 12.00, available: true, prepTime: 25, calories: 650, allergens: [], station: "grill" },
  { id: "m12", name: "Branzino al Forno", category: "c4", price: 24.90, cost: 8.50, available: true, prepTime: 20, calories: 380, allergens: ["fish"], station: "grill" },
  { id: "m13", name: "Ossobuco alla Milanese", category: "c4", price: 28.50, cost: 9.80, available: true, prepTime: 30, calories: 580, allergens: ["gluten"], station: "grill" },
  { id: "m14", name: "Tiramisu", category: "c5", price: 8.90, cost: 2.00, available: true, prepTime: 5, calories: 420, allergens: ["gluten","dairy","egg"], station: "salad" },
  { id: "m15", name: "Panna Cotta", category: "c5", price: 7.90, cost: 1.50, available: true, prepTime: 3, calories: 340, allergens: ["dairy"], station: "salad" },
  { id: "m16", name: "Espresso", category: "c6", price: 2.90, cost: 0.40, available: true, prepTime: 2, calories: 5, allergens: [], station: "bar" },
  { id: "m17", name: "Chianti Classico (glass)", category: "c6", price: 8.50, cost: 2.80, available: true, prepTime: 1, calories: 125, allergens: ["sulfites"], station: "bar" },
  { id: "m18", name: "Aperol Spritz", category: "c6", price: 9.50, cost: 2.50, available: true, prepTime: 3, calories: 180, allergens: ["sulfites"], station: "bar" },
  { id: "m19", name: "Limoncello", category: "c6", price: 6.50, cost: 1.20, available: true, prepTime: 1, calories: 100, allergens: ["sulfites"], station: "bar" },
  { id: "m20", name: "Acqua Minerale", category: "c6", price: 3.50, cost: 0.30, available: true, prepTime: 1, calories: 0, allergens: [], station: "bar" },
];

const DEMO_TABLES = [
  { id: "t1", number: "1", capacity: 2, status: "occupied", section: "main", x: 10, y: 15, shape: "square", guests: 2, server: "Sophie W.", elapsed: 45, orderId: "o1" },
  { id: "t2", number: "2", capacity: 4, status: "occupied", section: "main", x: 30, y: 15, shape: "square", guests: 3, server: "Sophie W.", elapsed: 22, orderId: "o2" },
  { id: "t3", number: "3", capacity: 4, status: "available", section: "main", x: 50, y: 15, shape: "square", guests: 0, server: null, elapsed: 0 },
  { id: "t4", number: "4", capacity: 6, status: "reserved", section: "main", x: 70, y: 15, shape: "rectangle", guests: 0, server: null, elapsed: 0 },
  { id: "t5", number: "5", capacity: 2, status: "available", section: "main", x: 10, y: 45, shape: "square", guests: 0, server: null, elapsed: 0 },
  { id: "t6", number: "6", capacity: 4, status: "cleaning", section: "main", x: 30, y: 45, shape: "square", guests: 0, server: null, elapsed: 0 },
  { id: "t7", number: "7", capacity: 8, status: "occupied", section: "main", x: 55, y: 45, shape: "rectangle", guests: 6, server: "Mia H.", elapsed: 67, orderId: "o3" },
  { id: "t8", number: "P1", capacity: 4, status: "available", section: "patio", x: 10, y: 75, shape: "circle", guests: 0, server: null, elapsed: 0 },
  { id: "t9", number: "P2", capacity: 4, status: "occupied", section: "patio", x: 30, y: 75, shape: "circle", guests: 4, server: "Sophie W.", elapsed: 15, orderId: "o4" },
  { id: "t10", number: "B1", capacity: 2, status: "occupied", section: "bar", x: 55, y: 75, shape: "circle", guests: 2, server: "Felix M.", elapsed: 38, orderId: "o5" },
  { id: "t11", number: "B2", capacity: 2, status: "available", section: "bar", x: 75, y: 75, shape: "circle", guests: 0, server: null, elapsed: 0 },
  { id: "t12", number: "VIP", capacity: 10, status: "reserved", section: "private", x: 85, y: 30, shape: "rectangle", guests: 0, server: null, elapsed: 0 },
];

const DEMO_ORDERS = [
  {
    id: "o1", number: 1047, tableId: "t1", tableNum: "1", waiter: "Sophie W.", type: "dine_in",
    status: "served", guests: 2, subtotal: 47.30, tax: 8.99, discount: 0, tip: 0, total: 56.29,
    createdAt: new Date(Date.now() - 45 * 60000), items: [
      { id: "oi1", name: "Bruschetta Classica", qty: 1, price: 8.90, status: "served", station: "salad", notes: "" },
      { id: "oi2", name: "Spaghetti Carbonara", qty: 1, price: 14.50, status: "served", station: "pasta", notes: "Extra pecorino" },
      { id: "oi3", name: "Risotto ai Funghi", qty: 1, price: 16.90, status: "served", station: "pasta", notes: "" },
      { id: "oi4", name: "Chianti Classico", qty: 2, price: 8.50, status: "served", station: "bar", notes: "" },
    ]
  },
  {
    id: "o2", number: 1048, tableId: "t2", tableNum: "2", waiter: "Sophie W.", type: "dine_in",
    status: "preparing", guests: 3, subtotal: 62.20, tax: 11.82, discount: 0, tip: 0, total: 74.02,
    createdAt: new Date(Date.now() - 22 * 60000), items: [
      { id: "oi5", name: "Carpaccio di Manzo", qty: 1, price: 14.90, status: "ready", station: "salad", notes: "" },
      { id: "oi6", name: "Caprese Salad", qty: 1, price: 10.50, status: "ready", station: "salad", notes: "No balsamic" },
      { id: "oi7", name: "Bistecca Fiorentina", qty: 1, price: 32.90, status: "preparing", station: "grill", notes: "Medium rare" },
      { id: "oi8", name: "Acqua Minerale", qty: 2, price: 3.50, status: "served", station: "bar", notes: "Sparkling" },
    ]
  },
  {
    id: "o3", number: 1049, tableId: "t7", tableNum: "7", waiter: "Mia H.", type: "dine_in",
    status: "preparing", guests: 6, subtotal: 142.80, tax: 27.13, discount: 0, tip: 0, total: 169.93,
    createdAt: new Date(Date.now() - 67 * 60000), priority: true, items: [
      { id: "oi9", name: "Bruschetta Classica", qty: 2, price: 8.90, status: "served", station: "salad", notes: "" },
      { id: "oi10", name: "Margherita", qty: 2, price: 11.90, status: "ready", station: "pizza", notes: "" },
      { id: "oi11", name: "Diavola", qty: 1, price: 13.90, status: "ready", station: "pizza", notes: "Extra spicy" },
      { id: "oi12", name: "Ossobuco alla Milanese", qty: 2, price: 28.50, status: "preparing", station: "grill", notes: "" },
      { id: "oi13", name: "Branzino al Forno", qty: 1, price: 24.90, status: "preparing", station: "grill", notes: "No lemon" },
      { id: "oi14", name: "Aperol Spritz", qty: 3, price: 9.50, status: "served", station: "bar", notes: "" },
    ]
  },
  {
    id: "o4", number: 1050, tableId: "t9", tableNum: "P2", waiter: "Sophie W.", type: "dine_in",
    status: "confirmed", guests: 4, subtotal: 58.70, tax: 11.15, discount: 0, tip: 0, total: 69.85,
    createdAt: new Date(Date.now() - 15 * 60000), items: [
      { id: "oi15", name: "Quattro Formaggi", qty: 2, price: 14.50, status: "pending", station: "pizza", notes: "" },
      { id: "oi16", name: "Penne all'Arrabbiata", qty: 2, price: 12.90, status: "pending", station: "pasta", notes: "One gluten free if possible" },
      { id: "oi17", name: "Acqua Minerale", qty: 2, price: 3.50, status: "pending", station: "bar", notes: "Still" },
    ]
  },
  {
    id: "o5", number: 1051, tableId: "t10", tableNum: "B1", waiter: "Felix M.", type: "dine_in",
    status: "served", guests: 2, subtotal: 36.30, tax: 6.90, discount: 0, tip: 5.00, total: 48.20,
    createdAt: new Date(Date.now() - 38 * 60000), items: [
      { id: "oi18", name: "Aperol Spritz", qty: 2, price: 9.50, status: "served", station: "bar", notes: "" },
      { id: "oi19", name: "Chianti Classico", qty: 1, price: 8.50, status: "served", station: "bar", notes: "" },
      { id: "oi20", name: "Tiramisu", qty: 1, price: 8.90, status: "served", station: "salad", notes: "" },
    ]
  },
  {
    id: "o6", number: 1046, tableId: null, tableNum: "—", waiter: "Felix M.", type: "takeout",
    status: "ready", guests: 1, subtotal: 26.80, tax: 5.09, discount: 0, tip: 0, total: 31.89,
    createdAt: new Date(Date.now() - 35 * 60000), customerName: "Hans K.", items: [
      { id: "oi21", name: "Margherita", qty: 1, price: 11.90, status: "ready", station: "pizza", notes: "" },
      { id: "oi22", name: "Penne all'Arrabbiata", qty: 1, price: 12.90, status: "ready", station: "pasta", notes: "" },
      { id: "oi23", name: "Espresso", qty: 1, price: 2.90, status: "ready", station: "bar", notes: "Double" },
    ]
  },
];

const DEMO_RESERVATIONS = [
  { id: "r1", name: "Klein Family", phone: "+49 176 1234567", email: "klein@email.de", partySize: 4, time: "18:30", date: "Today", table: "4", status: "confirmed", notes: "Anniversary dinner" },
  { id: "r2", name: "Dr. Braun", phone: "+49 151 9876543", email: "braun@email.de", partySize: 10, time: "19:00", date: "Today", table: "VIP", status: "confirmed", notes: "Business dinner, wine pairing" },
  { id: "r3", name: "Schneider", phone: "+49 170 5551234", email: "", partySize: 2, time: "20:00", date: "Today", table: "5", status: "confirmed", notes: "" },
  { id: "r4", name: "Maria Costa", phone: "+49 172 8887654", email: "maria@costa.de", partySize: 6, time: "19:30", date: "Tomorrow", table: "7", status: "confirmed", notes: "Vegetarian options needed" },
  { id: "r5", name: "Wolf", phone: "+49 162 3334567", email: "", partySize: 2, time: "12:30", date: "Tomorrow", table: "P1", status: "confirmed", notes: "Patio preferred" },
];

const DEMO_INVENTORY = [
  { id: "i1", name: "Spaghetti (dry)", qty: 12.5, unit: "kg", cost: 2.40, threshold: 5, par: 20, supplier: "De Cecco", category: "Pasta", lastRestock: "2 days ago" },
  { id: "i2", name: "Penne (dry)", qty: 8.2, unit: "kg", cost: 2.20, threshold: 5, par: 15, supplier: "De Cecco", category: "Pasta", lastRestock: "2 days ago" },
  { id: "i3", name: "San Marzano Tomatoes", qty: 24, unit: "piece", cost: 3.50, threshold: 10, par: 30, supplier: "Mutti", category: "Tinned", lastRestock: "1 week ago" },
  { id: "i4", name: "Mozzarella Fior di Latte", qty: 4.8, unit: "kg", cost: 12.00, threshold: 3, par: 8, supplier: "Latteria", category: "Dairy", lastRestock: "Yesterday" },
  { id: "i5", name: "Parmigiano Reggiano", qty: 2.1, unit: "kg", cost: 28.00, threshold: 2, par: 5, supplier: "Latteria", category: "Dairy", lastRestock: "3 days ago" },
  { id: "i6", name: "Beef Tenderloin", qty: 3.2, unit: "kg", cost: 45.00, threshold: 2, par: 6, supplier: "Fleischer Huber", category: "Meat", lastRestock: "Today" },
  { id: "i7", name: "Branzino (whole)", qty: 1.5, unit: "kg", cost: 22.00, threshold: 2, par: 4, supplier: "Fisch König", category: "Seafood", lastRestock: "Today" },
  { id: "i8", name: "Olive Oil (EV)", qty: 8.5, unit: "l", cost: 14.00, threshold: 5, par: 15, supplier: "Ferraro", category: "Oils", lastRestock: "1 week ago" },
  { id: "i9", name: "Arborio Rice", qty: 6.0, unit: "kg", cost: 4.80, threshold: 3, par: 10, supplier: "Riso Gallo", category: "Grains", lastRestock: "4 days ago" },
  { id: "i10", name: "Fresh Basil", qty: 0.3, unit: "kg", cost: 18.00, threshold: 0.5, par: 1, supplier: "Local Farm", category: "Herbs", lastRestock: "Today" },
  { id: "i11", name: "Chianti Classico", qty: 18, unit: "piece", cost: 12.00, threshold: 6, par: 24, supplier: "Vinoteca", category: "Wine", lastRestock: "3 days ago" },
  { id: "i12", name: "Aperol", qty: 4, unit: "piece", cost: 16.00, threshold: 2, par: 6, supplier: "Vinoteca", category: "Spirits", lastRestock: "1 week ago" },
];

const DEMO_CUSTOMERS = [
  { id: "cu1", name: "Hans Klein", email: "hans@klein.de", phone: "+49 176 1234567", visits: 24, totalSpent: 1842.50, points: 1840, tags: ["VIP","Regular"], notes: "Prefers table 4, red wine" },
  { id: "cu2", name: "Dr. Julia Braun", email: "braun@email.de", phone: "+49 151 9876543", visits: 12, totalSpent: 2156.00, points: 2150, tags: ["VIP","Business"], notes: "Corporate events, needs receipts" },
  { id: "cu3", name: "Maria Costa", email: "maria@costa.de", phone: "+49 172 8887654", visits: 8, totalSpent: 562.30, points: 560, tags: ["Vegetarian"], notes: "Allergic to nuts" },
  { id: "cu4", name: "Thomas Wolf", email: "", phone: "+49 162 3334567", visits: 5, totalSpent: 234.80, points: 230, tags: [], notes: "Always orders espresso" },
  { id: "cu5", name: "Sophie & Max Schneider", email: "schneider@email.de", phone: "+49 170 5551234", visits: 16, totalSpent: 1120.00, points: 1120, tags: ["Regular","Date Night"], notes: "Anniversary every March 15" },
];

const REVENUE_DATA = [
  { day: "Mon", revenue: 2840, orders: 42, tips: 380 },
  { day: "Tue", revenue: 2120, orders: 35, tips: 290 },
  { day: "Wed", revenue: 3150, orders: 48, tips: 420 },
  { day: "Thu", revenue: 3680, orders: 55, tips: 510 },
  { day: "Fri", revenue: 5240, orders: 78, tips: 720 },
  { day: "Sat", revenue: 6120, orders: 92, tips: 860 },
  { day: "Sun", revenue: 4580, orders: 68, tips: 620 },
];

const HOURLY_DATA = Array.from({ length: 14 }, (_, i) => ({
  hour: `${i + 10}:00`,
  orders: Math.floor(Math.random() * 15) + (i >= 1 && i <= 3 ? 8 : i >= 8 && i <= 10 ? 12 : 3),
  revenue: Math.floor(Math.random() * 800) + (i >= 1 && i <= 3 ? 400 : i >= 8 && i <= 10 ? 600 : 100),
}));

const ORDER_TYPE_DATA = [
  { name: "Dine-in", value: 68, color: "#F59E0B" },
  { name: "Takeout", value: 22, color: "#3B82F6" },
  { name: "Delivery", value: 10, color: "#10B981" },
];

const POPULAR_ITEMS_DATA = [
  { name: "Carbonara", orders: 145, revenue: 2102 },
  { name: "Margherita", orders: 132, revenue: 1571 },
  { name: "Bistecca", orders: 89, revenue: 2928 },
  { name: "Bruschetta", orders: 112, revenue: 997 },
  { name: "Risotto", orders: 98, revenue: 1656 },
  { name: "Tiramisu", orders: 108, revenue: 961 },
  { name: "Aperol Spritz", orders: 156, revenue: 1482 },
  { name: "Diavola", orders: 87, revenue: 1209 },
];

// ═══════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════

function cn(...classes) { return classes.filter(Boolean).join(" "); }
function fmt(n) { return `€${n.toFixed(2)}`; }
function elapsed(date) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}
function elapsedColor(date) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 10) return "text-emerald-400";
  if (mins < 15) return "text-amber-400";
  return "text-red-400";
}

// Badge component
function Badge({ children, variant = "default", className = "" }) {
  const v = {
    default: "bg-zinc-700/60 text-zinc-300",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/15 text-red-400 border border-red-500/20",
    info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    purple: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
    brand: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", v[variant] || v.default, className)}>{children}</span>;
}

// Status badge for orders
function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pending", variant: "warning", icon: Clock },
    confirmed: { label: "Confirmed", variant: "info", icon: Check },
    preparing: { label: "Preparing", variant: "purple", icon: Flame },
    ready: { label: "Ready", variant: "success", icon: CheckCircle2 },
    served: { label: "Served", variant: "brand", icon: UtensilsCrossed },
    completed: { label: "Completed", variant: "success", icon: Check },
    cancelled: { label: "Cancelled", variant: "danger", icon: X },
    voided: { label: "Voided", variant: "danger", icon: XCircle },
  };
  const s = map[status] || map.pending;
  const Icon = s.icon;
  return <Badge variant={s.variant}><Icon size={12} />{s.label}</Badge>;
}

// KPI Card
function KPICard({ title, value, change, changeLabel, icon: Icon, trend, className = "" }) {
  const isUp = trend === "up";
  return (
    <div className={cn("rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 backdrop-blur-sm transition-all hover:border-zinc-700/80 hover:bg-zinc-900/90", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-zinc-100">{value}</p>
        </div>
        <div className="rounded-lg bg-amber-500/10 p-2.5">
          <Icon size={20} className="text-amber-400" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {isUp ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
          <span className={cn("text-xs font-semibold", isUp ? "text-emerald-400" : "text-red-400")}>{change}</span>
          <span className="text-xs text-zinc-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

// Empty State
function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-zinc-800/60 p-4"><Icon size={32} className="text-zinc-500" /></div>
      <p className="text-lg font-semibold text-zinc-300">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

// Toast notification system
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id}
          className={cn(
            "animate-slide-up flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-sm",
            t.type === "success" && "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
            t.type === "error" && "border border-red-500/30 bg-red-500/15 text-red-300",
            t.type === "info" && "border border-blue-500/30 bg-blue-500/15 text-blue-300",
          )}>
          {t.type === "success" && <CheckCircle2 size={16} />}
          {t.type === "error" && <XCircle size={16} />}
          {t.type === "info" && <Info size={16} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// Confirmation dialog
function ConfirmDialog({ open, title, message, onConfirm, onCancel, variant = "danger" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div className="mx-4 w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center gap-3">
          <div className={cn("rounded-full p-2", variant === "danger" ? "bg-red-500/10" : "bg-amber-500/10")}>
            <AlertTriangle size={20} className={variant === "danger" ? "text-red-400" : "text-amber-400"} />
          </div>
          <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        </div>
        <p className="mb-6 text-sm text-zinc-400">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors">Cancel</button>
          <button onClick={onConfirm} className={cn("rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors", variant === "danger" ? "bg-red-600 hover:bg-red-500" : "bg-amber-600 hover:bg-amber-500")}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTH SCREEN
// ═══════════════════════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("marco@bellacucina.de");
  const [pass, setPass] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[128px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <UtensilsCrossed size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100" style={{ fontFamily: "'Georgia', serif" }}>Bella Cucina</h1>
          <p className="mt-1 text-sm text-zinc-500">Restaurant Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-zinc-100">{isSignUp ? "Create account" : "Welcome back"}</h2>

          {isSignUp && (
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Restaurant Name</label>
              <input className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20" placeholder="Your Restaurant" />
            </div>
          )}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20" />
          </div>
          <div className="mb-6">
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20" />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 hover:brightness-110 disabled:opacity-50">
            {loading ? <span className="inline-flex items-center gap-2"><RefreshCw size={14} className="animate-spin" />Authenticating...</span> : (isSignUp ? "Create Account" : "Sign In")}
          </button>

          {!isSignUp && (
            <button className="mt-3 w-full rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
              <span className="inline-flex items-center gap-2"><Globe size={14} />Sign in with Google</span>
            </button>
          )}

          <div className="mt-6 flex items-center justify-between text-xs">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-amber-400 hover:text-amber-300 transition-colors">
              {isSignUp ? "Already have an account?" : "Create new restaurant"}
            </button>
            {!isSignUp && <button className="text-zinc-500 hover:text-zinc-400 transition-colors">Forgot password?</button>}
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-zinc-600">
          <span className="inline-flex items-center gap-1"><Lock size={10} />256-bit SSL</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck size={10} />RBAC Protected</span>
          <span className="inline-flex items-center gap-1"><KeyRound size={10} />MFA Ready</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
function DashboardPage() {
  const todayRevenue = DEMO_ORDERS.reduce((s, o) => s + o.total, 0);
  const activeOrders = DEMO_ORDERS.filter(o => !["completed","cancelled","voided"].includes(o.status)).length;
  const tablesOccupied = DEMO_TABLES.filter(t => t.status === "occupied").length;
  const avgTicket = todayRevenue / DEMO_ORDERS.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500">Real-time overview of Bella Cucina</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success"><CircleDot size={8} className="animate-pulse" /> Live</Badge>
          <span className="text-xs text-zinc-500">{new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard title="Today's Revenue" value={fmt(todayRevenue)} change="+12.5%" changeLabel="vs yesterday" icon={DollarSign} trend="up" />
        <KPICard title="Active Orders" value={activeOrders} change="+3" changeLabel="from last hour" icon={ShoppingBag} trend="up" />
        <KPICard title="Tables Occupied" value={`${tablesOccupied}/${DEMO_TABLES.length}`} change={`${Math.round(tablesOccupied/DEMO_TABLES.length*100)}%`} changeLabel="occupancy" icon={Armchair} trend="up" />
        <KPICard title="Avg Ticket" value={fmt(avgTicket)} change="+€4.20" changeLabel="vs last week" icon={Receipt} trend="up" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Weekly Revenue</h2>
            <Badge variant="brand">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#52525b" fontSize={12} />
              <YAxis stroke="#52525b" fontSize={12} tickFormatter={v => `€${v}`} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Active Orders</h2>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
            {DEMO_ORDERS.filter(o => !["completed","cancelled"].includes(o.status)).map(order => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-3 transition-colors hover:bg-zinc-800/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-200">#{order.number}</span>
                    <span className="text-xs text-zinc-500">T{order.tableNum}</span>
                    {order.priority && <Flame size={12} className="text-red-400" />}
                  </div>
                  <p className="text-xs text-zinc-500">{order.items.length} items · {fmt(order.total)}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className={cn("mt-1 text-xs font-mono", elapsedColor(order.createdAt))}>{elapsed(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Items */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Popular Items (This Week)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <ReBarChart data={POPULAR_ITEMS_DATA.slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" stroke="#52525b" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#52525b" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="orders" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Type Breakdown */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Order Type Breakdown</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <RePieChart>
                <Pie data={ORDER_TYPE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {ORDER_TYPE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {ORDER_TYPE_DATA.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-zinc-400">{d.name}</span>
                  <span className="text-xs font-bold text-zinc-200">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-300">Upcoming Reservations</h2>
          <Badge>{DEMO_RESERVATIONS.filter(r => r.date === "Today").length} today</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_RESERVATIONS.slice(0, 3).map(res => (
            <div key={res.id} className="rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-200">{res.name}</span>
                <Badge variant="info">{res.time}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1"><Users size={11} />{res.partySize}</span>
                <span className="inline-flex items-center gap-1"><Armchair size={11} />T{res.table}</span>
              </div>
              {res.notes && <p className="mt-1.5 text-xs text-amber-400/70">{res.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {DEMO_INVENTORY.filter(i => i.qty <= i.threshold).length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-sm font-semibold text-red-300">Low Stock Alerts</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_INVENTORY.filter(i => i.qty <= i.threshold).map(item => (
              <Badge key={item.id} variant="danger">{item.name}: {item.qty} {item.unit} remaining</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ORDERS PAGE
// ═══════════════════════════════════════════════════════════════
function OrdersPage({ toast }) {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = filter === "all" ? DEMO_ORDERS : DEMO_ORDERS.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Orders</h1>
          <p className="text-sm text-zinc-500">{DEMO_ORDERS.length} total orders today</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-400">
          <Plus size={16} />New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all","pending","confirmed","preparing","ready","served","completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize",
              filter === f ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-zinc-800/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800")}>
            {f === "all" ? `All (${DEMO_ORDERS.length})` : f}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Table</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Server</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Items</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Time</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.map(order => (
              <tr key={order.id} className="bg-zinc-900/40 transition-colors hover:bg-zinc-800/40 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-200">#{order.number}</span>
                    {order.priority && <Flame size={13} className="text-red-400" />}
                    {order.type !== "dine_in" && <Badge variant="info" className="text-[10px]">{order.type.replace("_"," ")}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-400">{order.tableNum}</td>
                <td className="px-4 py-3 text-zinc-400">{order.waiter}</td>
                <td className="px-4 py-3 text-zinc-400">{order.items.length}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3 font-semibold text-zinc-200">{fmt(order.total)}</td>
                <td className={cn("px-4 py-3 font-mono text-xs", elapsedColor(order.createdAt))}>{elapsed(order.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Slide-over */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="h-full w-full max-w-lg overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-6" onClick={e => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Order #{selectedOrder.number}</h2>
                <p className="text-sm text-zinc-500">Table {selectedOrder.tableNum} · {selectedOrder.waiter} · {selectedOrder.guests} guests</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"><X size={20} /></button>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <StatusBadge status={selectedOrder.status} />
              <span className={cn("text-xs font-mono", elapsedColor(selectedOrder.createdAt))}>{elapsed(selectedOrder.createdAt)} elapsed</span>
            </div>

            <div className="mb-6 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Items</h3>
              {selectedOrder.items.map(item => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-200">{item.qty}× {item.name}</span>
                      <Badge className="text-[10px]">{item.station}</Badge>
                    </div>
                    {item.notes && <p className="mt-0.5 text-xs text-amber-400/80">Note: {item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <span className="text-sm font-semibold text-zinc-300">{fmt(item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-4">
              <div className="flex justify-between text-sm text-zinc-400"><span>Subtotal</span><span>{fmt(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between text-sm text-zinc-400"><span>Tax (19%)</span><span>{fmt(selectedOrder.tax)}</span></div>
              {selectedOrder.tip > 0 && <div className="flex justify-between text-sm text-zinc-400"><span>Tip</span><span>{fmt(selectedOrder.tip)}</span></div>}
              <div className="flex justify-between border-t border-zinc-700 pt-2 text-base font-bold text-zinc-100"><span>Total</span><span>{fmt(selectedOrder.total)}</span></div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => { toast.add(`Order #${selectedOrder.number} status updated`); setSelectedOrder(null); }}
                className="flex-1 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-colors">Advance Status</button>
              <button className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors">
                <Printer size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// KITCHEN DISPLAY SYSTEM
// ═══════════════════════════════════════════════════════════════
function KitchenPage({ toast }) {
  const [station, setStation] = useState("all");
  const kitchenOrders = DEMO_ORDERS.filter(o => ["confirmed","preparing","ready"].includes(o.status));

  const filteredOrders = kitchenOrders.map(order => ({
    ...order,
    items: station === "all" ? order.items.filter(i => i.status !== "served") : order.items.filter(i => i.station === station && i.status !== "served")
  })).filter(o => o.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-zinc-100">Kitchen Display</h1>
          <Badge variant="success"><CircleDot size={8} className="animate-pulse" /> Live</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-zinc-500" />
          <span className="text-xs text-zinc-500">Sound On</span>
        </div>
      </div>

      {/* Station Filters */}
      <div className="flex gap-2">
        {["all","grill","pasta","pizza","salad","bar"].map(s => (
          <button key={s} onClick={() => setStation(s)}
            className={cn("rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              station === s ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700")}>
            {s}
          </button>
        ))}
      </div>

      {/* Ticket Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredOrders.map(order => {
          const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
          const urgencyBg = mins > 15 ? "border-red-500/40 bg-red-500/5" : mins > 10 ? "border-amber-500/40 bg-amber-500/5" : "border-zinc-800/80 bg-zinc-900/70";
          return (
            <div key={order.id} className={cn("rounded-xl border p-4 transition-all hover:scale-[1.01]", urgencyBg)}>
              {/* Ticket Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-zinc-100">#{order.number}</span>
                  {order.priority && <Flame size={14} className="text-red-400 animate-pulse" />}
                </div>
                <div className="text-right">
                  <Badge variant={order.type === "dine_in" ? "default" : "info"}>{order.type === "dine_in" ? `T${order.tableNum}` : "Takeout"}</Badge>
                  <p className={cn("mt-0.5 text-xs font-mono font-bold", mins > 15 ? "text-red-400" : mins > 10 ? "text-amber-400" : "text-emerald-400")}>{mins}:{String(Math.floor((Date.now() / 1000) % 60)).padStart(2, "0")}</p>
                </div>
              </div>

              <p className="mb-2 text-xs text-zinc-500">{order.waiter} · {order.guests} guests</p>

              {/* Items */}
              <div className="space-y-1.5">
                {order.items.map(item => (
                  <div key={item.id}
                    className={cn("flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      item.status === "ready" ? "bg-emerald-500/10 line-through opacity-50" : item.status === "preparing" ? "bg-blue-500/10" : "bg-zinc-800/50")}>
                    <div className="flex-1">
                      <span className={cn("font-medium", item.status === "ready" ? "text-emerald-400" : "text-zinc-200")}>{item.qty}× {item.name}</span>
                      {item.notes && <p className="text-[11px] font-semibold text-red-400">{item.notes}</p>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toast.add(`${item.name} bumped!`); }}
                      className={cn("rounded-md px-2 py-1 text-xs font-semibold transition-all",
                        item.status === "ready" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-300 hover:bg-amber-500 hover:text-black")}>
                      {item.status === "ready" ? "✓" : "BUMP"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Bump All */}
              <button onClick={() => toast.add(`Order #${order.number} all bumped!`, "success")}
                className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-emerald-500">
                Bump All Ready
              </button>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && <EmptyState icon={ChefHat} title="Kitchen is clear!" desc="No active tickets for this station" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU PAGE
// ═══════════════════════════════════════════════════════════════
function MenuPage({ toast }) {
  const [selectedCat, setSelectedCat] = useState("all");
  const [view, setView] = useState("grid");
  const items = selectedCat === "all" ? DEMO_MENU : DEMO_MENU.filter(m => m.category === selectedCat);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Menu Management</h1>
          <p className="text-sm text-zinc-500">{DEMO_MENU.length} items across {DEMO_CATEGORIES.length} categories</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(view === "grid" ? "list" : "grid")} className="rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 hover:text-zinc-200">
            {view === "grid" ? <List size={16} /> : <Grid3X3 size={16} />}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400">
            <Plus size={16} />Add Item
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <button onClick={() => setSelectedCat("all")}
          className={cn("shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition-all",
            selectedCat === "all" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-zinc-800/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800")}>
          All Items ({DEMO_MENU.length})
        </button>
        {DEMO_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
            className={cn("shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition-all",
              selectedCat === cat.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-zinc-800/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800")}>
            {cat.icon} {cat.name} ({cat.itemCount})
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className={cn(view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-2")}>
        {items.map(item => {
          const cat = DEMO_CATEGORIES.find(c => c.id === item.category);
          const margin = item.cost ? Math.round((1 - item.cost / item.price) * 100) : null;
          return view === "grid" ? (
            <div key={item.id} className={cn("group rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 transition-all hover:border-zinc-700",
              !item.available && "opacity-50")}>
              <div className="mb-3 flex items-center justify-between">
                <Badge variant={item.available ? "success" : "danger"}>{item.available ? "Available" : "86'd"}</Badge>
                <span className="text-lg">{cat?.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-200">{item.name}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-black text-amber-400">{fmt(item.price)}</span>
                {item.cost && <span className="text-xs text-zinc-500">Cost: {fmt(item.cost)}</span>}
              </div>
              {margin && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${margin}%` }} /></div>
                  <span className="text-xs text-zinc-500">{margin}% margin</span>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge className="text-[10px]"><Clock size={10} /> {item.prepTime}m</Badge>
                {item.calories && <Badge className="text-[10px]">{item.calories}cal</Badge>}
                <Badge className="text-[10px]">{item.station}</Badge>
              </div>
              {item.allergens.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.allergens.map(a => <Badge key={a} variant="warning" className="text-[10px]">{a}</Badge>)}
                </div>
              )}
              <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 rounded-md bg-zinc-800 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"><Edit size={12} className="inline mr-1" />Edit</button>
                <button onClick={() => toast.add(`${item.name} availability toggled`)}
                  className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700">
                  {item.available ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              </div>
            </div>
          ) : (
            <div key={item.id} className={cn("flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-3 transition-colors hover:bg-zinc-800/40",
              !item.available && "opacity-50")}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{cat?.icon}</span>
                <div>
                  <span className="font-medium text-zinc-200">{item.name}</span>
                  <div className="flex gap-2 mt-0.5">
                    <Badge className="text-[10px]">{item.station}</Badge>
                    <Badge className="text-[10px]"><Clock size={10} /> {item.prepTime}m</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={item.available ? "ready" : "cancelled"} />
                <span className="text-lg font-bold text-amber-400">{fmt(item.price)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Stub for EyeOff since it's not in our imports
function EyeOff(props) { return <Eye {...props} />; }

// ═══════════════════════════════════════════════════════════════
// TABLES / FLOOR PLAN PAGE
// ═══════════════════════════════════════════════════════════════
function TablesPage({ toast }) {
  const [section, setSection] = useState("all");
  const tables = section === "all" ? DEMO_TABLES : DEMO_TABLES.filter(t => t.section === section);
  const sections = [...new Set(DEMO_TABLES.map(t => t.section))];

  const statusColor = (s) => ({
    available: "border-emerald-500/50 bg-emerald-500/10",
    occupied: "border-red-500/50 bg-red-500/10",
    reserved: "border-amber-500/50 bg-amber-500/10",
    cleaning: "border-zinc-500/50 bg-zinc-500/10",
    blocked: "border-zinc-600/50 bg-zinc-600/10",
  }[s]);

  const statusDot = (s) => ({
    available: "bg-emerald-500", occupied: "bg-red-500", reserved: "bg-amber-500",
    cleaning: "bg-zinc-500", blocked: "bg-zinc-600",
  }[s]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Table Management</h1>
          <p className="text-sm text-zinc-500">{DEMO_TABLES.filter(t => t.status === "occupied").length} occupied · {DEMO_TABLES.filter(t => t.status === "available").length} available · {DEMO_TABLES.filter(t => t.status === "reserved").length} reserved</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {["available","occupied","reserved","cleaning","blocked"].map(s => (
          <span key={s} className="inline-flex items-center gap-1.5 text-xs text-zinc-400 capitalize">
            <span className={cn("h-2.5 w-2.5 rounded-full", statusDot(s))} />{s}
          </span>
        ))}
        <div className="mx-2 h-4 w-px bg-zinc-700" />
        {["all", ...sections].map(s => (
          <button key={s} onClick={() => setSection(s)}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              section === s ? "bg-amber-500/15 text-amber-400" : "text-zinc-500 hover:text-zinc-300")}>
            {s}
          </button>
        ))}
      </div>

      {/* Floor Plan Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {tables.map(table => (
          <button key={table.id}
            onClick={() => toast.add(`Table ${table.number}: ${table.status}`, "info")}
            className={cn("group relative rounded-xl border p-4 text-left transition-all hover:scale-[1.03]", statusColor(table.status))}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {table.shape === "circle" ? <Circle size={14} className="text-zinc-500" /> : <Square size={14} className="text-zinc-500" />}
                <span className="text-lg font-black text-zinc-200">T{table.number}</span>
              </div>
              <span className={cn("h-2.5 w-2.5 rounded-full", statusDot(table.status))} />
            </div>

            <div className="mt-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1"><Users size={11} />{table.status === "occupied" ? `${table.guests}/${table.capacity}` : `0/${table.capacity}`}</span>
              <span className="ml-2 capitalize">{table.section}</span>
            </div>

            {table.status === "occupied" && (
              <div className="mt-2">
                <p className="text-xs text-zinc-400">{table.server}</p>
                <p className={cn("text-xs font-mono font-bold", table.elapsed > 60 ? "text-red-400" : table.elapsed > 30 ? "text-amber-400" : "text-emerald-400")}>
                  {table.elapsed}m elapsed
                </p>
              </div>
            )}
            {table.status === "reserved" && <p className="mt-2 text-xs text-amber-400">Reserved tonight</p>}
            {table.status === "cleaning" && <p className="mt-2 text-xs text-zinc-500">Cleaning in progress...</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// POS INTERFACE
// ═══════════════════════════════════════════════════════════════
function POSPage({ toast }) {
  const [selectedCat, setSelectedCat] = useState("c1");
  const [cart, setCart] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;
  const menuItems = DEMO_MENU.filter(m => m.category === selectedCat && m.available);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left: Menu */}
      <div className="flex flex-1 flex-col">
        {/* Category tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {DEMO_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
              className={cn("shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                selectedCat === cat.id ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700")}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className="grid flex-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start pr-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { addToCart(item); toast.add(`Added ${item.name}`, "success"); }}
              className="group rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 text-left transition-all hover:border-amber-500/30 hover:bg-zinc-800/70 active:scale-[0.97]">
              <h3 className="text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">{item.name}</h3>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-lg font-black text-amber-400">{fmt(item.price)}</span>
                <Badge className="text-[10px]"><Clock size={10} /> {item.prepTime}m</Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="flex w-80 flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/70">
        {/* Table selector */}
        <div className="border-b border-zinc-800 p-4">
          <label className="mb-1 block text-xs font-medium text-zinc-500">Table</label>
          <select value={selectedTable || ""} onChange={e => setSelectedTable(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200">
            <option value="">Select table...</option>
            {DEMO_TABLES.filter(t => t.status === "available").map(t => (
              <option key={t.id} value={t.id}>Table {t.number} ({t.capacity} seats)</option>
            ))}
          </select>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag size={32} className="text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">Cart is empty</p>
              <p className="text-xs text-zinc-600">Tap items to add</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                <p className="text-xs text-zinc-500">{fmt(item.price)} each</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => updateQty(item.id, -1)} className="rounded-md bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-600">−</button>
                <span className="w-6 text-center text-sm font-bold text-zinc-200">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="rounded-md bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-600">+</button>
              </div>
              <span className="w-16 text-right text-sm font-semibold text-zinc-200">{fmt(item.price * item.qty)}</span>
              <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
            </div>
          ))}
        </div>

        {/* Totals & Actions */}
        <div className="border-t border-zinc-800 p-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm text-zinc-400"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-sm text-zinc-400"><span>Tax (19%)</span><span>{fmt(tax)}</span></div>
            <div className="flex justify-between text-lg font-bold text-zinc-100 border-t border-zinc-700 pt-2"><span>Total</span><span>{fmt(total)}</span></div>
          </div>

          <button disabled={cart.length === 0}
            onClick={() => { toast.add("Order sent to kitchen!", "success"); setCart([]); }}
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 disabled:opacity-40 disabled:shadow-none">
            Send to Kitchen ({cart.length} items)
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-lg border border-zinc-700 bg-zinc-800 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors">
              <CreditCard size={13} className="inline mr-1" />Pay Card
            </button>
            <button className="rounded-lg border border-zinc-700 bg-zinc-800 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors">
              <Banknote size={13} className="inline mr-1" />Pay Cash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INVENTORY PAGE
// ═══════════════════════════════════════════════════════════════
function InventoryPage({ toast }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Inventory</h1>
          <p className="text-sm text-zinc-500">{DEMO_INVENTORY.length} items tracked · {DEMO_INVENTORY.filter(i => i.qty <= i.threshold).length} low stock</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400">
          <Plus size={16} />Add Item
        </button>
      </div>

      {/* Low Stock Alert Bar */}
      {DEMO_INVENTORY.filter(i => i.qty <= i.threshold).length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-sm font-semibold text-red-300">Low Stock Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_INVENTORY.filter(i => i.qty <= i.threshold).map(item => (
              <Badge key={item.id} variant="danger">{item.name}: {item.qty}{item.unit}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Cost/Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Last Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {DEMO_INVENTORY.map(item => {
              const pct = Math.min(100, (item.qty / item.par) * 100);
              const isLow = item.qty <= item.threshold;
              return (
                <tr key={item.id} className={cn("bg-zinc-900/40 transition-colors hover:bg-zinc-800/40", isLow && "bg-red-500/5")}>
                  <td className="px-4 py-3 font-medium text-zinc-200">{item.name}</td>
                  <td className="px-4 py-3"><Badge>{item.category}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("font-semibold", isLow ? "text-red-400" : "text-zinc-200")}>{item.qty} {item.unit}</span>
                      <div className="h-1.5 w-16 rounded-full bg-zinc-800">
                        <div className={cn("h-full rounded-full", isLow ? "bg-red-500" : pct > 60 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isLow ? <Badge variant="danger"><AlertTriangle size={10} /> Low</Badge> : <Badge variant="success"><Check size={10} /> OK</Badge>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{fmt(item.cost)}/{item.unit}</td>
                  <td className="px-4 py-3 text-zinc-400">{item.supplier}</td>
                  <td className="px-4 py-3 text-zinc-500">{item.lastRestock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAFF PAGE
// ═══════════════════════════════════════════════════════════════
function StaffPage() {
  const roleColor = (r) => ({ owner: "brand", manager: "info", chef: "purple", waiter: "success", cashier: "warning", host: "default" }[r]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Staff</h1>
          <p className="text-sm text-zinc-500">{DEMO_STAFF.filter(s => s.isActive).length} active members</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"><Plus size={16} />Add Staff</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DEMO_STAFF.map(staff => (
          <div key={staff.id} className={cn("rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 transition-all hover:border-zinc-700", !staff.isActive && "opacity-50")}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-sm font-bold text-amber-400">
                {staff.avatar}
              </div>
              <div>
                <p className="font-semibold text-zinc-200">{staff.name}</p>
                <Badge variant={roleColor(staff.role)} className="capitalize">{staff.role}</Badge>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-zinc-500">
              <p className="inline-flex items-center gap-1.5"><Mail size={11} />{staff.email}</p>
              {staff.hourlyRate > 0 && <p className="inline-flex items-center gap-1.5"><DollarSign size={11} />€{staff.hourlyRate}/hr</p>}
              <p className="inline-flex items-center gap-1.5">{staff.isActive ? <Wifi size={11} className="text-emerald-400" /> : <WifiOff size={11} />}{staff.isActive ? "Active" : "Inactive"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ═══════════════════════════════════════════════════════════════
function AnalyticsPage() {
  const [period, setPeriod] = useState("week");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
          <p className="text-sm text-zinc-500">Sales, performance & insights</p>
        </div>
        <div className="flex gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          {["today","week","month"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn("rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                period === p ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-zinc-200")}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard title="Total Revenue" value="€27,730" change="+18.2%" changeLabel="vs last week" icon={DollarSign} trend="up" />
        <KPICard title="Total Orders" value="418" change="+12%" changeLabel="vs last week" icon={ShoppingBag} trend="up" />
        <KPICard title="Avg Order Value" value="€66.34" change="+€4.20" changeLabel="vs last week" icon={Target} trend="up" />
        <KPICard title="Food Cost %" value="31.2%" change="-1.8%" changeLabel="vs last week" icon={TrendingDown} trend="up" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Revenue & Tips Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ReBarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#52525b" fontSize={12} />
              <YAxis stroke="#52525b" fontSize={12} tickFormatter={v => `€${v}`} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tips" fill="#10B981" name="Tips" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Distribution */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Hourly Order Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={HOURLY_DATA}>
              <defs>
                <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="hour" stroke="#52525b" fontSize={11} />
              <YAxis stroke="#52525b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="orders" stroke="#3B82F6" fill="url(#hourlyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Items by Revenue */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Top Items by Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <ReBarChart data={POPULAR_ITEMS_DATA.sort((a, b) => b.revenue - a.revenue).slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis type="number" stroke="#52525b" fontSize={11} tickFormatter={v => `€${v}`} />
              <YAxis type="category" dataKey="name" stroke="#52525b" fontSize={11} width={80} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Server Performance */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Server Performance</h2>
          <div className="space-y-3">
            {[
              { name: "Sophie Weber", orders: 42, revenue: 2840, tips: 380, avg: 67.62 },
              { name: "Mia Hoffmann", orders: 38, revenue: 2520, tips: 340, avg: 66.32 },
              { name: "Felix Müller", orders: 28, revenue: 1680, tips: 210, avg: 60.00 },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-zinc-800/40 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-400">#{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">{s.name}</p>
                  <p className="text-xs text-zinc-500">{s.orders} orders · Avg {fmt(s.avg)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-200">{fmt(s.revenue)}</p>
                  <p className="text-xs text-emerald-400">+{fmt(s.tips)} tips</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RESERVATIONS PAGE
// ═══════════════════════════════════════════════════════════════
function ReservationsPage({ toast }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Reservations</h1>
          <p className="text-sm text-zinc-500">{DEMO_RESERVATIONS.filter(r => r.date === "Today").length} today · {DEMO_RESERVATIONS.filter(r => r.date === "Tomorrow").length} tomorrow</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"><Plus size={16} />New Reservation</button>
      </div>

      <div className="space-y-3">
        {["Today", "Tomorrow"].map(day => (
          <div key={day}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">{day}</h2>
            <div className="space-y-2">
              {DEMO_RESERVATIONS.filter(r => r.date === day).map(res => (
                <div key={res.id} className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 transition-all hover:border-zinc-700">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-amber-500/10">
                      <span className="text-lg font-black text-amber-400">{res.time.split(":")[0]}</span>
                      <span className="text-[10px] text-amber-400/70">:{res.time.split(":")[1]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200">{res.name}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1"><Users size={11} />{res.partySize} guests</span>
                        <span className="inline-flex items-center gap-1"><Armchair size={11} />Table {res.table}</span>
                        {res.phone && <span className="inline-flex items-center gap-1"><Phone size={11} />{res.phone}</span>}
                      </div>
                      {res.notes && <p className="mt-1 text-xs text-amber-400/70">{res.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Confirmed</Badge>
                    <button onClick={() => toast.add(`${res.name} seated!`, "success")}
                      className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-emerald-600 hover:text-white transition-colors">Seat</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CUSTOMERS PAGE
// ═══════════════════════════════════════════════════════════════
function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Customers</h1>
          <p className="text-sm text-zinc-500">{DEMO_CUSTOMERS.length} customer profiles</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400"><Plus size={16} />Add Customer</button>
      </div>

      <div className="space-y-3">
        {DEMO_CUSTOMERS.map(cust => (
          <div key={cust.id} className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 transition-all hover:border-zinc-700">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-sm font-bold text-amber-400">
                {cust.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-zinc-200">{cust.name}</p>
                  {cust.tags.map(t => <Badge key={t} variant={t === "VIP" ? "brand" : "default"} className="text-[10px]">{t}</Badge>)}
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-500">
                  {cust.email && <span className="inline-flex items-center gap-1"><Mail size={11} />{cust.email}</span>}
                  {cust.phone && <span className="inline-flex items-center gap-1"><Phone size={11} />{cust.phone}</span>}
                </div>
                {cust.notes && <p className="mt-1 text-xs text-zinc-400">{cust.notes}</p>}
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-bold text-zinc-200">{fmt(cust.totalSpent)}</p>
              <p className="text-xs text-zinc-500">{cust.visits} visits</p>
              <Badge variant="brand" className="text-[10px]"><Star size={10} /> {cust.points} pts</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════
function SettingsPage({ toast }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Restaurant Info */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Store size={18} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-zinc-300">Restaurant Details</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Name", value: DEMO_RESTAURANT.name },
              { label: "Address", value: DEMO_RESTAURANT.address },
              { label: "Phone", value: DEMO_RESTAURANT.phone },
              { label: "Currency", value: DEMO_RESTAURANT.currency },
              { label: "Tax Rate", value: `${(DEMO_RESTAURANT.taxRate * 100).toFixed(0)}%` },
              { label: "Timezone", value: DEMO_RESTAURANT.timezone },
            ].map(field => (
              <div key={field.label} className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{field.label}</span>
                <span className="text-sm font-medium text-zinc-200">{field.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => toast.add("Settings saved!")} className="mt-4 w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors">Save Changes</button>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-zinc-300">Security</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Two-Factor Auth (TOTP)", status: true, desc: "Required for Owner & Manager" },
              { label: "Row Level Security", status: true, desc: "Tenant data isolation" },
              { label: "Rate Limiting", status: true, desc: "5 login attempts / 15min" },
              { label: "CSP Headers", status: true, desc: "Nonce-based Content Security Policy" },
              { label: "HSTS", status: true, desc: "Strict Transport Security" },
              { label: "Audit Logging", status: true, desc: "Immutable action trails" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-zinc-800/40 p-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <Badge variant="success"><Lock size={10} /> Enabled</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <UserCog size={18} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-zinc-300">Role Permissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-3 py-2 text-left text-zinc-500">Permission</th>
                  {["Owner","Manager","Chef","Waiter","Cashier","Host"].map(r => (
                    <th key={r} className="px-3 py-2 text-center text-zinc-500">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {[
                  { perm: "Restaurant Settings", roles: [1,0,0,0,0,0] },
                  { perm: "Manage Staff", roles: [1,1,0,0,0,0] },
                  { perm: "Manage Menu", roles: [1,1,1,0,0,0] },
                  { perm: "Create Orders", roles: [1,1,0,1,1,0] },
                  { perm: "View All Orders", roles: [1,1,1,0,0,0] },
                  { perm: "Void Orders", roles: [1,1,0,0,0,0] },
                  { perm: "Process Payments", roles: [1,1,0,0,1,0] },
                  { perm: "View Reports", roles: [1,1,0,0,0,0] },
                  { perm: "Manage Tables", roles: [1,1,0,1,0,1] },
                  { perm: "Manage Reservations", roles: [1,1,0,0,0,1] },
                  { perm: "Manage Inventory", roles: [1,1,1,0,0,0] },
                ].map(row => (
                  <tr key={row.perm}>
                    <td className="px-3 py-2 text-zinc-400">{row.perm}</td>
                    {row.roles.map((v, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        {v ? <Check size={14} className="mx-auto text-emerald-400" /> : <X size={14} className="mx-auto text-zinc-700" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APPLICATION LAYOUT
// ═══════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag, badge: 5 },
  { id: "kitchen", label: "Kitchen", icon: ChefHat, badge: 3 },
  { id: "pos", label: "POS", icon: CreditCard },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "tables", label: "Tables", icon: Armchair },
  { id: "reservations", label: "Reservations", icon: CalendarClock, badge: 2 },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "staff", label: "Staff", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "customers", label: "Customers", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function RestaurantApp() {
  const [isAuth, setIsAuth] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [time, setTime] = useState(new Date());
  const toast = useToast();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  if (!isAuth) return <AuthScreen onLogin={() => setIsAuth(true)} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage />;
      case "orders": return <OrdersPage toast={toast} />;
      case "kitchen": return <KitchenPage toast={toast} />;
      case "pos": return <POSPage toast={toast} />;
      case "menu": return <MenuPage toast={toast} />;
      case "tables": return <TablesPage toast={toast} />;
      case "reservations": return <ReservationsPage toast={toast} />;
      case "inventory": return <InventoryPage toast={toast} />;
      case "staff": return <StaffPage />;
      case "analytics": return <AnalyticsPage />;
      case "customers": return <CustomersPage />;
      case "settings": return <SettingsPage toast={toast} />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col border-r border-zinc-800/80 bg-zinc-950 transition-all duration-300 shrink-0",
        sidebarOpen ? "w-60" : "w-16"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-800/80 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/15">
            <UtensilsCrossed size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-100 truncate" style={{ fontFamily: "'Georgia', serif" }}>Bella Cucina</p>
              <p className="text-[10px] text-zinc-500">Restaurant Management</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active ? "bg-amber-500/10 text-amber-400" : "text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300",
                  !sidebarOpen && "justify-center px-0"
                )}>
                <Icon size={18} className={cn(active && "text-amber-400")} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold text-amber-400">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-zinc-800/80 p-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-400 transition-colors">
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
              <Search size={14} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Search... ⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono">
              {time.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </span>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors">
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            {/* Theme Toggle */}
            <button onClick={() => setDarkMode(!darkMode)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[10px] font-bold text-white">MR</div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-zinc-300">Marco Rossi</p>
                <p className="text-[10px] text-zinc-500">Owner</p>
              </div>
            </div>

            <button onClick={() => setIsAuth(false)} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-800 hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} />

      {/* Global Styles */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }
        
        /* Selection */
        ::selection { background: rgba(245, 158, 11, 0.3); }
      `}</style>
    </div>
  );
}
