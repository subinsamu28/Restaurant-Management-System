"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard, ShoppingBag, ChefHat, UtensilsCrossed, Armchair,
  CalendarClock, Package, Users, BarChart3, Heart, Settings, LogOut,
  Bell, Search, Plus, Edit, Check, X, Clock, DollarSign, AlertTriangle,
  CreditCard, Banknote, Receipt, ArrowUpRight, ArrowDownRight, Phone, Mail,
  Star, Flame, Volume2, Grid3X3, List, RefreshCw, PanelLeftClose, PanelLeft,
  CircleDot, Square, Circle, CheckCircle2, XCircle, Info, ShieldCheck, Lock,
  KeyRound, UserCog, Store, Globe, Target, TrendingDown, EyeOff, Eye,
  Wifi, WifiOff, MoreVertical, Trash2, Save, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function cn(...c){return c.filter(Boolean).join(" ")}
function fmt(n){return `€${Number(n||0).toFixed(2)}`}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function minsAgo(d){return Math.floor((Date.now()-new Date(d).getTime())/60000)}
function fmtTime(d){const m=minsAgo(d);return m<60?`${m}m`:`${Math.floor(m/60)}h ${m%60}m`}
function urgency(d){const m=minsAgo(d);return m<10?"text-emerald-400":m<20?"text-amber-400":"text-red-400"}

/* ═══════════════════════════════════════════════════════════════
   INITIAL SEED DATA
   ═══════════════════════════════════════════════════════════════ */
const seedCategories=[
  {id:"c1",name:"Antipasti",icon:"🥗"},{id:"c2",name:"Pasta",icon:"🍝"},
  {id:"c3",name:"Pizza",icon:"🍕"},{id:"c4",name:"Secondi",icon:"🥩"},
  {id:"c5",name:"Dolci",icon:"🍰"},{id:"c6",name:"Bevande",icon:"🍷"},
];
const seedMenu=[
  {id:"m1",name:"Bruschetta Classica",catId:"c1",price:8.9,cost:2.1,available:true,prepTime:8,calories:280,allergens:["gluten","dairy"],station:"salad"},
  {id:"m2",name:"Carpaccio di Manzo",catId:"c1",price:14.9,cost:5.2,available:true,prepTime:10,calories:220,allergens:[],station:"salad"},
  {id:"m3",name:"Caprese Salad",catId:"c1",price:10.5,cost:3.1,available:true,prepTime:5,calories:310,allergens:["dairy"],station:"salad"},
  {id:"m4",name:"Spaghetti Carbonara",catId:"c2",price:14.5,cost:3.2,available:true,prepTime:15,calories:520,allergens:["gluten","dairy","egg"],station:"pasta"},
  {id:"m5",name:"Penne Arrabbiata",catId:"c2",price:12.9,cost:2.5,available:true,prepTime:12,calories:440,allergens:["gluten"],station:"pasta"},
  {id:"m6",name:"Risotto ai Funghi",catId:"c2",price:16.9,cost:4.0,available:true,prepTime:20,calories:480,allergens:["dairy"],station:"pasta"},
  {id:"m7",name:"Lasagna Bolognese",catId:"c2",price:15.5,cost:3.8,available:false,prepTime:25,calories:620,allergens:["gluten","dairy"],station:"pasta"},
  {id:"m8",name:"Margherita",catId:"c3",price:11.9,cost:2.8,available:true,prepTime:12,calories:750,allergens:["gluten","dairy"],station:"pizza"},
  {id:"m9",name:"Diavola",catId:"c3",price:13.9,cost:3.4,available:true,prepTime:12,calories:820,allergens:["gluten","dairy"],station:"pizza"},
  {id:"m10",name:"Quattro Formaggi",catId:"c3",price:14.5,cost:4.2,available:true,prepTime:14,calories:900,allergens:["gluten","dairy"],station:"pizza"},
  {id:"m11",name:"Bistecca Fiorentina",catId:"c4",price:32.9,cost:12,available:true,prepTime:25,calories:650,allergens:[],station:"grill"},
  {id:"m12",name:"Branzino al Forno",catId:"c4",price:24.9,cost:8.5,available:true,prepTime:20,calories:380,allergens:["fish"],station:"grill"},
  {id:"m13",name:"Tiramisu",catId:"c5",price:8.9,cost:2,available:true,prepTime:5,calories:420,allergens:["gluten","dairy","egg"],station:"salad"},
  {id:"m14",name:"Panna Cotta",catId:"c5",price:7.9,cost:1.5,available:true,prepTime:3,calories:340,allergens:["dairy"],station:"salad"},
  {id:"m15",name:"Espresso",catId:"c6",price:2.9,cost:0.4,available:true,prepTime:2,calories:5,allergens:[],station:"bar"},
  {id:"m16",name:"Chianti (glass)",catId:"c6",price:8.5,cost:2.8,available:true,prepTime:1,calories:125,allergens:["sulfites"],station:"bar"},
  {id:"m17",name:"Aperol Spritz",catId:"c6",price:9.5,cost:2.5,available:true,prepTime:3,calories:180,allergens:["sulfites"],station:"bar"},
  {id:"m18",name:"Acqua Minerale",catId:"c6",price:3.5,cost:0.3,available:true,prepTime:1,calories:0,allergens:[],station:"bar"},
];
const seedTables=[
  {id:"t1",number:"1",capacity:2,section:"main"},{id:"t2",number:"2",capacity:4,section:"main"},
  {id:"t3",number:"3",capacity:4,section:"main"},{id:"t4",number:"4",capacity:6,section:"main"},
  {id:"t5",number:"5",capacity:2,section:"main"},{id:"t6",number:"6",capacity:4,section:"main"},
  {id:"t7",number:"7",capacity:8,section:"main"},{id:"t8",number:"P1",capacity:4,section:"patio"},
  {id:"t9",number:"P2",capacity:4,section:"patio"},{id:"t10",number:"B1",capacity:2,section:"bar"},
  {id:"t11",number:"B2",capacity:2,section:"bar"},{id:"t12",number:"VIP",capacity:10,section:"private"},
];
const seedInventory=[
  {id:"i1",name:"Spaghetti (dry)",qty:12.5,unit:"kg",cost:2.4,threshold:5,par:20,supplier:"De Cecco",category:"Pasta"},
  {id:"i2",name:"Penne (dry)",qty:8.2,unit:"kg",cost:2.2,threshold:5,par:15,supplier:"De Cecco",category:"Pasta"},
  {id:"i3",name:"Mozzarella",qty:4.8,unit:"kg",cost:12,threshold:3,par:8,supplier:"Latteria",category:"Dairy"},
  {id:"i4",name:"Parmigiano",qty:2.1,unit:"kg",cost:28,threshold:2,par:5,supplier:"Latteria",category:"Dairy"},
  {id:"i5",name:"Beef Tenderloin",qty:3.2,unit:"kg",cost:45,threshold:2,par:6,supplier:"Fleischer Huber",category:"Meat"},
  {id:"i6",name:"Olive Oil (EV)",qty:8.5,unit:"l",cost:14,threshold:5,par:15,supplier:"Ferraro",category:"Oils"},
  {id:"i7",name:"Fresh Basil",qty:0.3,unit:"kg",cost:18,threshold:0.5,par:1,supplier:"Local Farm",category:"Herbs"},
  {id:"i8",name:"Chianti Classico",qty:18,unit:"btl",cost:12,threshold:6,par:24,supplier:"Vinoteca",category:"Wine"},
  {id:"i9",name:"Aperol",qty:4,unit:"btl",cost:16,threshold:2,par:6,supplier:"Vinoteca",category:"Spirits"},
];
const seedStaff=[
  {id:"s1",name:"Marco Rossi",role:"owner",rate:0,avatar:"MR",active:true,email:"marco@bellacucina.de"},
  {id:"s2",name:"Anna Schmidt",role:"manager",rate:22,avatar:"AS",active:true,email:"anna@bellacucina.de"},
  {id:"s3",name:"Luigi Bianchi",role:"chef",rate:20,avatar:"LB",active:true,email:"luigi@bellacucina.de"},
  {id:"s4",name:"Sophie Weber",role:"waiter",rate:14,avatar:"SW",active:true,email:"sophie@bellacucina.de"},
  {id:"s5",name:"Felix Müller",role:"cashier",rate:13,avatar:"FM",active:true,email:"felix@bellacucina.de"},
  {id:"s6",name:"Emma Fischer",role:"host",rate:13,avatar:"EF",active:true,email:"emma@bellacucina.de"},
];
const seedCustomers=[
  {id:"cu1",name:"Hans Klein",email:"hans@klein.de",phone:"+49 176 1234567",visits:24,spent:1842.5,points:1840,tags:["VIP"],notes:"Prefers table 4"},
  {id:"cu2",name:"Dr. Julia Braun",email:"braun@email.de",phone:"+49 151 9876543",visits:12,spent:2156,points:2150,tags:["VIP","Business"],notes:"Corporate events"},
  {id:"cu3",name:"Maria Costa",email:"maria@costa.de",phone:"+49 172 8887654",visits:8,spent:562.3,points:560,tags:["Vegetarian"],notes:"Allergic to nuts"},
];
const seedReservations=[
  {id:"rv1",name:"Klein Family",phone:"+49 176 1234567",size:4,time:"18:30",date:"Today",tableId:"t4",status:"confirmed",notes:"Anniversary"},
  {id:"rv2",name:"Dr. Braun",phone:"+49 151 9876543",size:10,time:"19:00",date:"Today",tableId:"t12",status:"confirmed",notes:"Business dinner"},
  {id:"rv3",name:"Schneider",phone:"+49 170 5551234",size:2,time:"20:00",date:"Today",tableId:"t5",status:"confirmed",notes:""},
];

/* ═══════════════════════════════════════════════════════════════
   SMALL UI COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const badgeV={default:"bg-zinc-700/60 text-zinc-300",success:"bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",warning:"bg-amber-500/15 text-amber-400 border border-amber-500/20",danger:"bg-red-500/15 text-red-400 border border-red-500/20",info:"bg-blue-500/15 text-blue-400 border border-blue-500/20",purple:"bg-purple-500/15 text-purple-400 border border-purple-500/20",brand:"bg-amber-500/15 text-amber-400 border border-amber-500/20"};
function Badge({children,variant="default",className=""}){return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",badgeV[variant]||badgeV.default,className)}>{children}</span>}

const statusMap={pending:{l:"Pending",v:"warning",i:Clock},confirmed:{l:"Confirmed",v:"info",i:Check},preparing:{l:"Preparing",v:"purple",i:Flame},ready:{l:"Ready",v:"success",i:CheckCircle2},served:{l:"Served",v:"brand",i:UtensilsCrossed},completed:{l:"Completed",v:"success",i:Check},cancelled:{l:"Cancelled",v:"danger",i:X}};
function StatusBadge({status}){const s=statusMap[status]||statusMap.pending;const I=s.i;return <Badge variant={s.v}><I size={12}/>{s.l}</Badge>}

function KPI({title,value,change,label,icon:I,trend}){
  return(<div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 hover:border-zinc-700/80 transition-all">
    <div className="flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{title}</p><p className="text-2xl font-bold text-zinc-100 mt-1">{value}</p></div><div className="rounded-lg bg-amber-500/10 p-2.5"><I size={20} className="text-amber-400"/></div></div>
    {change&&<div className="mt-3 flex items-center gap-1.5">{trend==="up"?<ArrowUpRight size={14} className="text-emerald-400"/>:<ArrowDownRight size={14} className="text-red-400"/>}<span className={cn("text-xs font-semibold",trend==="up"?"text-emerald-400":"text-red-400")}>{change}</span><span className="text-xs text-zinc-500">{label}</span></div>}
  </div>)
}

function Modal({open,onClose,title,children,wide}){
  if(!open)return null;
  return(<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
    <div className={cn("w-full rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-y-auto max-h-[90vh]",wide?"max-w-2xl":"max-w-md")} onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4"><h3 className="text-lg font-semibold text-zinc-100">{title}</h3><button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"><X size={18}/></button></div>
      <div className="p-6">{children}</div>
    </div>
  </div>)
}

function Input({label,...props}){return(<div><label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label><input className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 placeholder:text-zinc-600" {...props}/></div>)}
function Select({label,children,...props}){return(<div><label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label><select className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-zinc-200 outline-none focus:border-amber-500/50" {...props}>{children}</select></div>)}
function Btn({children,variant="primary",className="",...props}){const v=variant==="primary"?"bg-amber-500 text-black hover:bg-amber-400 font-semibold":variant==="danger"?"bg-red-600 text-white hover:bg-red-500 font-semibold":"border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700";return <button className={cn("rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-40",v,className)} {...props}>{children}</button>}

function useToast(){const[t,setT]=useState([]);const add=useCallback((m,type="success")=>{const id=uid();setT(p=>[...p,{id,m,type}]);setTimeout(()=>setT(p=>p.filter(x=>x.id!==id)),3500)},[]);return{toasts:t,add}}
function Toasts({toasts}){return <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">{toasts.map(t=><div key={t.id} className={cn("animate-slide-up flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-sm",t.type==="success"&&"border border-emerald-500/30 bg-emerald-500/15 text-emerald-300",t.type==="error"&&"border border-red-500/30 bg-red-500/15 text-red-300",t.type==="info"&&"border border-blue-500/30 bg-blue-500/15 text-blue-300")}>{t.type==="success"?<CheckCircle2 size={16}/>:t.type==="error"?<XCircle size={16}/>:<Info size={16}/>}{t.m}</div>)}</div>}

/* ═══════════════════════════════════════════════════════════════
   AUTH SCREEN
   ═══════════════════════════════════════════════════════════════ */
function AuthScreen({onLogin}){
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const submit=()=>{
    if(!email.trim()||!pass.trim()){setErr("Please fill in all fields");return}
    setLoading(true);setErr("");setTimeout(()=>{setLoading(false);onLogin(email)},1000);
  };
  return(
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}/>
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[128px]"/>
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20"><UtensilsCrossed size={32} className="text-white"/></div>
          <h1 className="text-3xl font-bold text-zinc-100" style={{fontFamily:"Georgia,serif"}}>Bella Cucina</h1>
          <p className="mt-1 text-sm text-zinc-500">Restaurant Management System</p>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl">
          <h2 className="mb-6 text-xl font-semibold text-zinc-100">Sign in to your account</h2>
          {err&&<div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{err}</div>}
          <div className="space-y-4">
            <Input label="Email" type="email" placeholder="you@restaurant.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <Input label="Password" type="password" placeholder="Enter your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <Btn className="w-full mt-6" onClick={submit} disabled={loading}>{loading?<span className="inline-flex items-center gap-2"><RefreshCw size={14} className="animate-spin"/>Signing in...</span>:"Sign In"}</Btn>
          <p className="mt-4 text-center text-xs text-zinc-600">Demo: use any email &amp; password to sign in</p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-zinc-600">
          <span className="inline-flex items-center gap-1"><Lock size={10}/>256-bit SSL</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck size={10}/>RBAC Protected</span>
          <span className="inline-flex items-center gap-1"><KeyRound size={10}/>MFA Ready</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP — All state lives here, flows to every page
   ═══════════════════════════════════════════════════════════════ */
export default function RestaurantApp(){
  const[isAuth,setIsAuth]=useState(false);
  const[currentUser,setCurrentUser]=useState(null);
  const[page,setPage]=useState("dashboard");
  const[sidebarOpen,setSidebarOpen]=useState(true);
  const[tick,setTick]=useState(0);
  const toast=useToast();

  // ── Core state (shared across all pages) ──
  const[orders,setOrders]=useState([]);
  const[nextOrderNum,setNextOrderNum]=useState(1001);
  const[menu,setMenu]=useState(seedMenu);
  const[categories]=useState(seedCategories);
  const[tables,setTables]=useState(()=>seedTables.map(t=>({...t,status:"available",orderId:null,guests:0,server:null,seatedAt:null})));
  const[inventory,setInventory]=useState(seedInventory);
  const[staff]=useState(seedStaff);
  const[customers,setCustomers]=useState(seedCustomers);
  const[reservations,setReservations]=useState(seedReservations);

  // Live clock
  useEffect(()=>{const i=setInterval(()=>setTick(t=>t+1),15000);return()=>clearInterval(i)},[]);

  // ── Derived data ──
  const activeOrders=orders.filter(o=>!["completed","cancelled"].includes(o.status));
  const completedOrders=orders.filter(o=>o.status==="completed");
  const todayRevenue=completedOrders.reduce((s,o)=>s+o.total,0);
  const occupiedCount=tables.filter(t=>t.status==="occupied").length;

  // ── Core actions (used by multiple pages) ──
  const createOrder=(tableId,items,type="dine_in",customerName="")=>{
    const sub=items.reduce((s,i)=>s+i.price*i.qty,0);
    const tax=+(sub*0.19).toFixed(2);
    const order={id:uid(),number:nextOrderNum,tableId,tableNum:tableId?tables.find(t=>t.id===tableId)?.number:"—",type,customerName,status:"confirmed",items:items.map(i=>({id:uid(),menuItemId:i.id,name:i.name,qty:i.qty,price:i.price,status:"pending",station:i.station,notes:i.notes||""})),subtotal:+sub.toFixed(2),tax,tip:0,total:+(sub+tax).toFixed(2),guests:1,waiter:currentUser||"Staff",createdAt:new Date().toISOString(),completedAt:null};
    setOrders(p=>[order,...p]);
    setNextOrderNum(n=>n+1);
    if(tableId){setTables(p=>p.map(t=>t.id===tableId?{...t,status:"occupied",orderId:order.id,guests:order.guests,server:order.waiter,seatedAt:new Date().toISOString()}:t))}
    // Deduct inventory (simplified)
    setInventory(p=>p.map(inv=>{
      const used=items.reduce((s,i)=>s+(i.qty*0.1),0); // simplified deduction
      return inv.qty>0?{...inv,qty:Math.max(0,+(inv.qty-used*0.05).toFixed(3))}:inv;
    }));
    toast.add(`Order #${nextOrderNum} created!`);
    return order;
  };

  const updateOrderStatus=(orderId,newStatus)=>{
    setOrders(p=>p.map(o=>{
      if(o.id!==orderId)return o;
      const updated={...o,status:newStatus};
      if(newStatus==="completed"){updated.completedAt=new Date().toISOString()}
      return updated;
    }));
    if(newStatus==="completed"||newStatus==="cancelled"){
      const order=orders.find(o=>o.id===orderId);
      if(order?.tableId){setTables(p=>p.map(t=>t.id===order.tableId?{...t,status:"cleaning",orderId:null,guests:0,server:null}:t));
        setTimeout(()=>setTables(p=>p.map(t=>t.id===order.tableId&&t.status==="cleaning"?{...t,status:"available"}:t)),5000);
      }
    }
    toast.add(`Order status → ${newStatus}`);
  };

  const bumpItem=(orderId,itemId)=>{
    setOrders(p=>p.map(o=>{
      if(o.id!==orderId)return o;
      const items=o.items.map(i=>i.id===itemId?{...i,status:i.status==="pending"?"preparing":i.status==="preparing"?"ready":"served"}:i);
      const allReady=items.every(i=>["ready","served"].includes(i.status));
      const allServed=items.every(i=>i.status==="served");
      return{...o,items,status:allServed?"served":allReady?"ready":items.some(i=>i.status==="preparing")?"preparing":o.status};
    }));
  };

  const bumpAllItems=(orderId)=>{
    setOrders(p=>p.map(o=>{
      if(o.id!==orderId)return o;
      const items=o.items.map(i=>({...i,status:i.status==="pending"?"preparing":i.status==="preparing"?"ready":"served"}));
      const allReady=items.every(i=>["ready","served"].includes(i.status));
      return{...o,items,status:allReady?"ready":"preparing"};
    }));
    toast.add("All items bumped!");
  };

  const seatReservation=(resId)=>{
    const res=reservations.find(r=>r.id===resId);
    if(!res)return;
    setReservations(p=>p.map(r=>r.id===resId?{...r,status:"seated"}:r));
    if(res.tableId){setTables(p=>p.map(t=>t.id===res.tableId?{...t,status:"occupied",guests:res.size,server:"Host",seatedAt:new Date().toISOString()}:t))}
    toast.add(`${res.name} seated at table ${tables.find(t=>t.id===res.tableId)?.number||"?"}`);
  };

  if(!isAuth)return <AuthScreen onLogin={(email)=>{setIsAuth(true);setCurrentUser(email.split("@")[0])}}/>;

  // ═══════════════════════════════════════════════════════════
  // PAGE: DASHBOARD
  // ═══════════════════════════════════════════════════════════
  const Dashboard=()=>{
    const revData=[{day:"Mon",rev:2840},{day:"Tue",rev:2120},{day:"Wed",rev:3150},{day:"Thu",rev:3680},{day:"Fri",rev:5240},{day:"Sat",rev:6120},{day:"Sun",rev:todayRevenue||4580}];
    return(<div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1><p className="text-sm text-zinc-500">Welcome back, {currentUser}</p></div><Badge variant="success"><CircleDot size={8} className="animate-pulse"/>Live</Badge></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI title="Today's Revenue" value={fmt(todayRevenue)} change={completedOrders.length>0?"+"+completedOrders.length+" orders":null} label="completed" icon={DollarSign} trend="up"/>
        <KPI title="Active Orders" value={activeOrders.length} icon={ShoppingBag} trend="up"/>
        <KPI title="Tables" value={`${occupiedCount}/${tables.length}`} change={`${Math.round(occupiedCount/tables.length*100)}%`} label="occupancy" icon={Armchair} trend="up"/>
        <KPI title="Avg Ticket" value={completedOrders.length?fmt(todayRevenue/completedOrders.length):"€0.00"} icon={Receipt} trend="up"/>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={240}><AreaChart data={revData}><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/><XAxis dataKey="day" stroke="#52525b" fontSize={12}/><YAxis stroke="#52525b" fontSize={12} tickFormatter={v=>`€${v}`}/><Tooltip contentStyle={{background:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px",fontSize:"12px"}}/><Area type="monotone" dataKey="rev" stroke="#F59E0B" fill="url(#rg)" strokeWidth={2}/></AreaChart></ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Active Orders ({activeOrders.length})</h2>
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {activeOrders.length===0?<p className="text-sm text-zinc-500 text-center py-8">No active orders — create one from POS</p>:
            activeOrders.slice(0,8).map(o=>(
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-3 hover:bg-zinc-800/50 cursor-pointer transition-colors" onClick={()=>setPage("orders")}>
                <div><span className="text-sm font-bold text-zinc-200">#{o.number}</span><span className="ml-2 text-xs text-zinc-500">{o.tableNum!=="—"?`T${o.tableNum}`:o.type}</span>{o.items.some(i=>i.notes)&&<Flame size={11} className="inline ml-1 text-red-400"/>}<p className="text-xs text-zinc-500">{o.items.length} items · {fmt(o.total)}</p></div>
                <div className="text-right"><StatusBadge status={o.status}/><p className={cn("mt-1 text-xs font-mono",urgency(o.createdAt))}>{fmtTime(o.createdAt)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {inventory.filter(i=>i.qty<=i.threshold).length>0&&<div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4"><div className="flex items-center gap-2 mb-2"><AlertTriangle size={14} className="text-red-400"/><span className="text-sm font-semibold text-red-300">Low Stock</span></div><div className="flex flex-wrap gap-2">{inventory.filter(i=>i.qty<=i.threshold).map(i=><Badge key={i.id} variant="danger">{i.name}: {i.qty}{i.unit}</Badge>)}</div></div>}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-300">Upcoming Reservations</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reservations.filter(r=>r.status==="confirmed").slice(0,3).map(r=>(<div key={r.id} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-3"><div><p className="font-semibold text-zinc-200 text-sm">{r.name}</p><p className="text-xs text-zinc-500">{r.size} guests · {r.time} · T{tables.find(t=>t.id===r.tableId)?.number}</p>{r.notes&&<p className="text-xs text-amber-400/70 mt-0.5">{r.notes}</p>}</div><button onClick={()=>seatReservation(r.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">Seat</button></div>))}
          {reservations.filter(r=>r.status==="confirmed").length===0&&<p className="text-sm text-zinc-500 col-span-3 text-center py-4">No pending reservations</p>}
        </div>
      </div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: POS (creates real orders!)
  // ═══════════════════════════════════════════════════════════
  const POS=()=>{
    const[cat,setCat]=useState("c1");
    const[cart,setCart]=useState([]);
    const[selTable,setSelTable]=useState("");
    const[orderType,setOrderType]=useState("dine_in");
    const[custName,setCustName]=useState("");

    const addToCart=(item)=>{setCart(p=>{const ex=p.find(c=>c.id===item.id);return ex?p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c):[...p,{...item,qty:1,notes:""}]});toast.add(`${item.name} added`)};
    const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
    const tax=+(sub*0.19).toFixed(2);
    const total=+(sub+tax).toFixed(2);
    const available=menu.filter(m=>m.catId===cat&&m.available);
    const freeTables=tables.filter(t=>t.status==="available");

    const sendToKitchen=()=>{
      if(cart.length===0)return;
      if(orderType==="dine_in"&&!selTable){toast.add("Select a table first","error");return}
      createOrder(orderType==="dine_in"?selTable:null,cart,orderType,custName);
      setCart([]);setSelTable("");setCustName("");
    };

    return(<div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="flex flex-1 flex-col min-w-0">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 shrink-0">{categories.map(c=><button key={c.id} onClick={()=>setCat(c.id)} className={cn("shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition-all",cat===c.id?"bg-amber-500 text-black shadow-lg shadow-amber-500/20":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700")}>{c.icon} {c.name}</button>)}</div>
        <div className="grid flex-1 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-start pr-1">
          {available.map(item=><button key={item.id} onClick={()=>addToCart(item)} className="group rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 text-left hover:border-amber-500/30 hover:bg-zinc-800/70 active:scale-[0.97] transition-all"><h3 className="text-sm font-bold text-zinc-200 group-hover:text-amber-400">{item.name}</h3><p className="text-xs text-zinc-500 mt-0.5">{item.station} · {item.prepTime}m</p><span className="text-lg font-black text-amber-400 mt-1 block">{fmt(item.price)}</span></button>)}
          {available.length===0&&<p className="col-span-full text-center text-sm text-zinc-500 py-12">No available items in this category</p>}
        </div>
      </div>
      <div className="flex w-80 shrink-0 flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/70">
        <div className="border-b border-zinc-800 p-4 space-y-3">
          <div className="flex gap-2">{["dine_in","takeout"].map(t=><button key={t} onClick={()=>setOrderType(t)} className={cn("flex-1 rounded-lg py-2 text-xs font-semibold transition-colors capitalize",orderType===t?"bg-amber-500 text-black":"bg-zinc-800 text-zinc-400")}>{t.replace("_"," ")}</button>)}</div>
          {orderType==="dine_in"?<Select label="Table" value={selTable} onChange={e=>setSelTable(e.target.value)}><option value="">Select table...</option>{freeTables.map(t=><option key={t.id} value={t.id}>Table {t.number} ({t.capacity} seats)</option>)}</Select>
          :<Input label="Customer Name" placeholder="Name for order" value={custName} onChange={e=>setCustName(e.target.value)}/>}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length===0?<div className="flex flex-col items-center py-12 text-center"><ShoppingBag size={32} className="text-zinc-600 mb-2"/><p className="text-sm text-zinc-500">Tap items to add</p></div>:
          cart.map(item=><div key={item.id} className="flex items-center gap-2 rounded-lg bg-zinc-800/50 p-2.5">
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p><input className="mt-1 w-full rounded bg-zinc-700/50 px-2 py-0.5 text-[11px] text-zinc-400 outline-none placeholder:text-zinc-600" placeholder="Special notes..." value={item.notes} onChange={e=>setCart(p=>p.map(c=>c.id===item.id?{...c,notes:e.target.value}:c))}/></div>
            <div className="flex items-center gap-1"><button onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:Math.max(1,c.qty-1)}:c))} className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-600">−</button><span className="w-6 text-center text-sm font-bold text-zinc-200">{item.qty}</span><button onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c))} className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-600">+</button></div>
            <span className="w-14 text-right text-sm font-semibold text-zinc-200">{fmt(item.price*item.qty)}</span>
            <button onClick={()=>setCart(p=>p.filter(c=>c.id!==item.id))} className="text-zinc-600 hover:text-red-400"><X size={14}/></button>
          </div>)}
        </div>
        <div className="border-t border-zinc-800 p-4 space-y-3">
          <div className="space-y-1"><div className="flex justify-between text-sm text-zinc-400"><span>Subtotal</span><span>{fmt(sub)}</span></div><div className="flex justify-between text-sm text-zinc-400"><span>Tax 19%</span><span>{fmt(tax)}</span></div><div className="flex justify-between text-lg font-bold text-zinc-100 border-t border-zinc-700 pt-2"><span>Total</span><span>{fmt(total)}</span></div></div>
          <Btn className="w-full" onClick={sendToKitchen} disabled={cart.length===0}>Send to Kitchen ({cart.length} items)</Btn>
          <div className="grid grid-cols-2 gap-2"><Btn variant="secondary" className="text-xs py-2"><CreditCard size={13} className="inline mr-1"/>Card</Btn><Btn variant="secondary" className="text-xs py-2"><Banknote size={13} className="inline mr-1"/>Cash</Btn></div>
        </div>
      </div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: KITCHEN DISPLAY
  // ═══════════════════════════════════════════════════════════
  const Kitchen=()=>{
    const[station,setStation]=useState("all");
    const kitchenOrders=orders.filter(o=>["confirmed","preparing","ready"].includes(o.status)).map(o=>({...o,items:station==="all"?o.items.filter(i=>i.status!=="served"):o.items.filter(i=>i.station===station&&i.status!=="served")})).filter(o=>o.items.length>0);
    return(<div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-zinc-100">Kitchen Display</h1><Badge variant="success"><CircleDot size={8} className="animate-pulse"/>Live</Badge></div>
      <div className="flex gap-2">{["all","grill","pasta","pizza","salad","bar"].map(s=><button key={s} onClick={()=>setStation(s)} className={cn("rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",station===s?"bg-amber-500 text-black":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700")}>{s}</button>)}</div>
      {kitchenOrders.length===0?<div className="flex flex-col items-center py-20"><ChefHat size={48} className="text-zinc-600 mb-3"/><p className="text-xl font-semibold text-zinc-300">Kitchen is clear</p><p className="text-sm text-zinc-500 mt-1">New orders from POS will appear here instantly</p></div>:
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{kitchenOrders.map(order=>{
        const mins=minsAgo(order.createdAt);const bg=mins>20?"border-red-500/40 bg-red-500/5":mins>12?"border-amber-500/40 bg-amber-500/5":"border-zinc-800/80 bg-zinc-900/70";
        return(<div key={order.id} className={cn("rounded-xl border p-4",bg)}>
          <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className="text-lg font-black text-zinc-100">#{order.number}</span></div><div className="text-right"><Badge>{order.tableNum!=="—"?`T${order.tableNum}`:order.type}</Badge><p className={cn("text-xs font-mono font-bold mt-0.5",mins>20?"text-red-400":mins>12?"text-amber-400":"text-emerald-400")}>{mins}m</p></div></div>
          <p className="text-xs text-zinc-500 mb-2">{order.waiter}</p>
          <div className="space-y-1.5">{order.items.map(item=>(
            <div key={item.id} className={cn("flex items-center justify-between rounded-md px-2.5 py-2 text-sm",item.status==="ready"?"bg-emerald-500/10":item.status==="preparing"?"bg-blue-500/10":"bg-zinc-800/50")}>
              <div className="flex-1"><span className={cn("font-medium",item.status==="ready"?"text-emerald-400 line-through":"text-zinc-200")}>{item.qty}× {item.name}</span>{item.notes&&<p className="text-[11px] font-semibold text-red-400">{item.notes}</p>}</div>
              <button onClick={()=>{bumpItem(order.id,item.id);toast.add(`${item.name} → ${item.status==="pending"?"preparing":item.status==="preparing"?"ready":"served"}`)}} className={cn("rounded-md px-3 py-1 text-xs font-bold transition-all",item.status==="ready"?"bg-emerald-500/20 text-emerald-400":"bg-zinc-700 text-zinc-300 hover:bg-amber-500 hover:text-black")}>{item.status==="pending"?"FIRE":item.status==="preparing"?"READY":"✓"}</button>
            </div>
          ))}</div>
          <button onClick={()=>bumpAllItems(order.id)} className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold uppercase text-white hover:bg-emerald-500">Bump All</button>
        </div>);
      })}</div>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: ORDERS
  // ═══════════════════════════════════════════════════════════
  const Orders=()=>{
    const[filter,setFilter]=useState("all");
    const[sel,setSel]=useState(null);
    const filtered=filter==="all"?orders:orders.filter(o=>o.status===filter);
    const nextStatus={confirmed:"preparing",preparing:"ready",ready:"served",served:"completed"};
    return(<div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-zinc-100">Orders</h1><p className="text-sm text-zinc-500">{orders.length} total</p></div><Btn onClick={()=>setPage("pos")}><Plus size={16} className="inline mr-1"/>New Order</Btn></div>
      <div className="flex flex-wrap gap-2">{["all","confirmed","preparing","ready","served","completed","cancelled"].map(f=><button key={f} onClick={()=>setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",filter===f?"bg-amber-500/15 text-amber-400 border border-amber-500/30":"bg-zinc-800/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800")}>{f==="all"?`All (${orders.length})`:f}</button>)}</div>
      {filtered.length===0?<div className="text-center py-16"><ShoppingBag size={40} className="mx-auto text-zinc-600 mb-3"/><p className="text-zinc-400">No orders yet — create one from the POS</p></div>:
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-800 bg-zinc-900/80"><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Order</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Table</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Items</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Status</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Total</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Time</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-zinc-500">Actions</th></tr></thead>
        <tbody className="divide-y divide-zinc-800/60">{filtered.map(o=><tr key={o.id} className="bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors"><td className="px-4 py-3"><span className="font-bold text-zinc-200">#{o.number}</span>{o.type!=="dine_in"&&<Badge variant="info" className="ml-2 text-[10px]">{o.type}</Badge>}</td><td className="px-4 py-3 text-zinc-400">{o.tableNum}</td><td className="px-4 py-3 text-zinc-400">{o.items.length}</td><td className="px-4 py-3"><StatusBadge status={o.status}/></td><td className="px-4 py-3 font-semibold text-zinc-200">{fmt(o.total)}</td><td className={cn("px-4 py-3 font-mono text-xs",urgency(o.createdAt))}>{fmtTime(o.createdAt)}</td>
          <td className="px-4 py-3 text-right flex gap-1.5 justify-end">{nextStatus[o.status]&&<button onClick={()=>updateOrderStatus(o.id,nextStatus[o.status])} className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-black hover:bg-amber-400">{nextStatus[o.status]==="completed"?"Complete":"→ "+nextStatus[o.status]}</button>}{!["completed","cancelled"].includes(o.status)&&<button onClick={()=>updateOrderStatus(o.id,"cancelled")} className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"><X size={12}/></button>}</td></tr>)}</tbody></table></div>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: MENU
  // ═══════════════════════════════════════════════════════════
  const Menu=()=>{
    const[cat,setCat]=useState("all");
    const[modal,setModal]=useState(null);// null or item object (empty for new)
    const items=cat==="all"?menu:menu.filter(m=>m.catId===cat);
    const saveItem=(item)=>{if(item.id){setMenu(p=>p.map(m=>m.id===item.id?item:m));toast.add(`${item.name} updated`)}else{setMenu(p=>[{...item,id:uid()},...p]);toast.add(`${item.name} added`)}setModal(null)};
    const deleteItem=(id)=>{setMenu(p=>p.filter(m=>m.id!==id));toast.add("Item deleted","info")};
    return(<div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-zinc-100">Menu</h1><p className="text-sm text-zinc-500">{menu.length} items</p></div><Btn onClick={()=>setModal({id:null,name:"",catId:"c1",price:0,cost:0,available:true,prepTime:15,calories:0,allergens:[],station:"salad"})}><Plus size={16} className="inline mr-1"/>Add Item</Btn></div>
      <div className="flex gap-2 overflow-x-auto pb-1"><button onClick={()=>setCat("all")} className={cn("shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium",cat==="all"?"bg-amber-500/15 text-amber-400 border border-amber-500/30":"bg-zinc-800/60 text-zinc-400 border border-zinc-800")}>All</button>{categories.map(c=><button key={c.id} onClick={()=>setCat(c.id)} className={cn("shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium",cat===c.id?"bg-amber-500/15 text-amber-400 border border-amber-500/30":"bg-zinc-800/60 text-zinc-400 border border-zinc-800")}>{c.icon} {c.name}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map(item=>{const c=categories.find(x=>x.id===item.catId);const margin=item.cost?Math.round((1-item.cost/item.price)*100):null;return(
        <div key={item.id} className={cn("group rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 hover:border-zinc-700 transition-all",!item.available&&"opacity-50")}>
          <div className="flex items-center justify-between mb-2"><Badge variant={item.available?"success":"danger"}>{item.available?"Available":"86'd"}</Badge><span className="text-lg">{c?.icon}</span></div>
          <h3 className="text-sm font-bold text-zinc-200">{item.name}</h3>
          <div className="mt-1.5 flex items-baseline gap-2"><span className="text-xl font-black text-amber-400">{fmt(item.price)}</span>{item.cost>0&&<span className="text-xs text-zinc-500">Cost {fmt(item.cost)}</span>}</div>
          {margin&&<div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-zinc-800"><div className="h-full rounded-full bg-emerald-500" style={{width:`${margin}%`}}/></div><span className="text-xs text-zinc-500">{margin}%</span></div>}
          <div className="mt-2 flex flex-wrap gap-1"><Badge className="text-[10px]"><Clock size={10}/>{item.prepTime}m</Badge><Badge className="text-[10px]">{item.station}</Badge></div>
          {item.allergens?.length>0&&<div className="mt-1.5 flex flex-wrap gap-1">{item.allergens.map(a=><Badge key={a} variant="warning" className="text-[10px]">{a}</Badge>)}</div>}
          <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>setModal({...item})} className="flex-1 rounded-md bg-zinc-800 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700"><Edit size={12} className="inline mr-1"/>Edit</button><button onClick={()=>setMenu(p=>p.map(m=>m.id===item.id?{...m,available:!m.available}:m))} className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700">{item.available?<EyeOff size={12}/>:<Eye size={12}/>}</button><button onClick={()=>deleteItem(item.id)} className="rounded-md bg-zinc-800 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/20"><Trash2 size={12}/></button></div>
        </div>)})}</div>

      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.id?"Edit Menu Item":"Add Menu Item"} wide>
        {modal&&<MenuForm item={modal} categories={categories} onSave={saveItem} onCancel={()=>setModal(null)}/>}
      </Modal>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: TABLES
  // ═══════════════════════════════════════════════════════════
  const Tables=()=>{
    const[sec,setSec]=useState("all");
    const shown=sec==="all"?tables:tables.filter(t=>t.section===sec);
    const sections=[...new Set(tables.map(t=>t.section))];
    const sdot={available:"bg-emerald-500",occupied:"bg-red-500",reserved:"bg-amber-500",cleaning:"bg-zinc-500"};
    const sbg={available:"border-emerald-500/50 bg-emerald-500/10",occupied:"border-red-500/50 bg-red-500/10",reserved:"border-amber-500/50 bg-amber-500/10",cleaning:"border-zinc-500/50 bg-zinc-500/10"};
    return(<div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Tables</h1>
      <div className="flex flex-wrap items-center gap-3">{Object.keys(sdot).map(s=><span key={s} className="inline-flex items-center gap-1.5 text-xs text-zinc-400 capitalize"><span className={cn("h-2.5 w-2.5 rounded-full",sdot[s])}/>{s}</span>)}<div className="mx-2 h-4 w-px bg-zinc-700"/>{["all",...sections].map(s=><button key={s} onClick={()=>setSec(s)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize",sec===s?"bg-amber-500/15 text-amber-400":"text-zinc-500 hover:text-zinc-300")}>{s}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">{shown.map(t=>{
        const tOrder=orders.find(o=>o.id===t.orderId);
        return(<div key={t.id} className={cn("rounded-xl border p-4 transition-all hover:scale-[1.02]",sbg[t.status]||sbg.available)}>
          <div className="flex items-center justify-between"><span className="text-lg font-black text-zinc-200">T{t.number}</span><span className={cn("h-2.5 w-2.5 rounded-full",sdot[t.status]||sdot.available)}/></div>
          <p className="text-xs text-zinc-500 mt-1"><Users size={11} className="inline mr-1"/>{t.status==="occupied"?`${t.guests}/${t.capacity}`:t.capacity} seats · {t.section}</p>
          {t.status==="occupied"&&<div className="mt-2"><p className="text-xs text-zinc-400">{t.server}</p>{t.seatedAt&&<p className={cn("text-xs font-mono",urgency(t.seatedAt))}>{fmtTime(t.seatedAt)}</p>}{tOrder&&<p className="text-xs text-zinc-500 mt-0.5">Order #{tOrder.number} · {fmt(tOrder.total)}</p>}</div>}
          {t.status==="cleaning"&&<p className="text-xs text-zinc-500 mt-2">Auto-clears soon...</p>}
          {t.status==="available"&&<button onClick={()=>{setPage("pos")}} className="mt-2 w-full rounded-md bg-zinc-800 py-1.5 text-xs text-zinc-300 hover:bg-amber-500 hover:text-black">Seat Guests</button>}
        </div>)
      })}</div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: INVENTORY
  // ═══════════════════════════════════════════════════════════
  const Inventory=()=>{
    const[editId,setEditId]=useState(null);
    const[editQty,setEditQty]=useState("");
    const startEdit=(item)=>{setEditId(item.id);setEditQty(String(item.qty))};
    const saveEdit=()=>{setInventory(p=>p.map(i=>i.id===editId?{...i,qty:+editQty}:i));setEditId(null);toast.add("Stock updated")};
    return(<div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-zinc-100">Inventory</h1><p className="text-sm text-zinc-500">{inventory.filter(i=>i.qty<=i.threshold).length} low stock alerts</p></div></div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80"><table className="w-full text-sm"><thead><tr className="border-b border-zinc-800 bg-zinc-900/80"><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Item</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Category</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Quantity</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Status</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Cost</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Supplier</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-zinc-500">Actions</th></tr></thead>
        <tbody className="divide-y divide-zinc-800/60">{inventory.map(item=>{const low=item.qty<=item.threshold;const pct=Math.min(100,(item.qty/item.par)*100);return(
          <tr key={item.id} className={cn("bg-zinc-900/40 hover:bg-zinc-800/40",low&&"bg-red-500/5")}><td className="px-4 py-3 font-medium text-zinc-200">{item.name}</td><td className="px-4 py-3"><Badge>{item.category}</Badge></td>
            <td className="px-4 py-3">{editId===item.id?<div className="flex items-center gap-2"><input className="w-20 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-sm text-zinc-200" value={editQty} onChange={e=>setEditQty(e.target.value)} autoFocus/><button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300"><Check size={14}/></button><button onClick={()=>setEditId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={14}/></button></div>:<div className="flex items-center gap-2"><span className={cn("font-semibold",low?"text-red-400":"text-zinc-200")}>{item.qty} {item.unit}</span><div className="h-1.5 w-16 rounded-full bg-zinc-800"><div className={cn("h-full rounded-full",low?"bg-red-500":pct>60?"bg-emerald-500":"bg-amber-500")} style={{width:`${pct}%`}}/></div></div>}</td>
            <td className="px-4 py-3">{low?<Badge variant="danger"><AlertTriangle size={10}/>Low</Badge>:<Badge variant="success"><Check size={10}/>OK</Badge>}</td>
            <td className="px-4 py-3 text-zinc-400">{fmt(item.cost)}/{item.unit}</td><td className="px-4 py-3 text-zinc-400">{item.supplier}</td>
            <td className="px-4 py-3 text-right"><button onClick={()=>startEdit(item)} className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"><Edit size={12} className="inline mr-1"/>Adjust</button></td></tr>)})}</tbody></table></div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: RESERVATIONS
  // ═══════════════════════════════════════════════════════════
  const Reservations=()=>{
    const[modal,setModal]=useState(false);
    const[form,setForm]=useState({name:"",phone:"",size:2,time:"19:00",tableId:"",notes:""});
    const addRes=()=>{if(!form.name.trim()){toast.add("Name is required","error");return}
      setReservations(p=>[{id:uid(),name:form.name,phone:form.phone,size:form.size,time:form.time,date:"Today",tableId:form.tableId,status:"confirmed",notes:form.notes},...p]);
      if(form.tableId){setTables(p=>p.map(t=>t.id===form.tableId?{...t,status:"reserved"}:t))}
      toast.add(`Reservation for ${form.name} confirmed`);setModal(false);setForm({name:"",phone:"",size:2,time:"19:00",tableId:"",notes:""})};
    return(<div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-zinc-100">Reservations</h1><p className="text-sm text-zinc-500">{reservations.filter(r=>r.status==="confirmed").length} pending</p></div><Btn onClick={()=>setModal(true)}><Plus size={16} className="inline mr-1"/>New Reservation</Btn></div>
      <div className="space-y-3">{reservations.map(r=>(
        <div key={r.id} className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-4"><div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-amber-500/10"><span className="text-lg font-black text-amber-400">{r.time.split(":")[0]}</span><span className="text-[10px] text-amber-400/70">:{r.time.split(":")[1]}</span></div>
            <div><p className="font-semibold text-zinc-200">{r.name}</p><div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5"><span><Users size={11} className="inline mr-0.5"/>{r.size}</span>{r.tableId&&<span><Armchair size={11} className="inline mr-0.5"/>T{tables.find(t=>t.id===r.tableId)?.number}</span>}{r.phone&&<span><Phone size={11} className="inline mr-0.5"/>{r.phone}</span>}</div>{r.notes&&<p className="text-xs text-amber-400/70 mt-0.5">{r.notes}</p>}</div></div>
          <div className="flex items-center gap-2"><Badge variant={r.status==="confirmed"?"success":r.status==="seated"?"info":"default"}>{r.status}</Badge>
            {r.status==="confirmed"&&<button onClick={()=>seatReservation(r.id)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">Seat</button>}
            {r.status==="confirmed"&&<button onClick={()=>{setReservations(p=>p.map(x=>x.id===r.id?{...x,status:"cancelled"}:x));if(r.tableId)setTables(p=>p.map(t=>t.id===r.tableId&&t.status==="reserved"?{...t,status:"available"}:t));toast.add(`${r.name} cancelled`)}} className="rounded-lg bg-zinc-800 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/20"><X size={12}/></button>}
          </div></div>))}</div>
      <Modal open={modal} onClose={()=>setModal(false)} title="New Reservation">
        <div className="space-y-4">
          <Input label="Guest Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Name"/>
          <Input label="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+49..."/>
          <div className="grid grid-cols-2 gap-4"><Input label="Party Size" type="number" value={form.size} onChange={e=>setForm(f=>({...f,size:+e.target.value}))}/><Input label="Time" type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></div>
          <Select label="Table" value={form.tableId} onChange={e=>setForm(f=>({...f,tableId:e.target.value}))}><option value="">Auto-assign</option>{tables.filter(t=>t.status==="available").map(t=><option key={t.id} value={t.id}>Table {t.number} ({t.capacity} seats)</option>)}</Select>
          <Input label="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Special requests..."/>
          <Btn className="w-full" onClick={addRes}>Confirm Reservation</Btn>
        </div>
      </Modal>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: STAFF
  // ═══════════════════════════════════════════════════════════
  const Staff=()=>{
    const rc={owner:"brand",manager:"info",chef:"purple",waiter:"success",cashier:"warning",host:"default"};
    return(<div className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-zinc-100">Staff</h1><p className="text-sm text-zinc-500">{staff.filter(s=>s.active).length} active</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{staff.map(s=>(
        <div key={s.id} className={cn("rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5 hover:border-zinc-700 transition-all",!s.active&&"opacity-50")}>
          <div className="flex items-center gap-3 mb-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-sm font-bold text-amber-400">{s.avatar}</div><div><p className="font-semibold text-zinc-200">{s.name}</p><Badge variant={rc[s.role]} className="capitalize">{s.role}</Badge></div></div>
          <div className="space-y-1 text-xs text-zinc-500"><p><Mail size={11} className="inline mr-1"/>{s.email}</p>{s.rate>0&&<p><DollarSign size={11} className="inline mr-1"/>€{s.rate}/hr</p>}<p>{s.active?<Wifi size={11} className="inline mr-1 text-emerald-400"/>:<WifiOff size={11} className="inline mr-1"/>}{s.active?"Active":"Inactive"}</p></div>
        </div>))}</div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: ANALYTICS
  // ═══════════════════════════════════════════════════════════
  const Analytics=()=>{
    const itemStats={};orders.filter(o=>o.status==="completed").forEach(o=>o.items.forEach(i=>{if(!itemStats[i.name])itemStats[i.name]={name:i.name,orders:0,revenue:0};itemStats[i.name].orders+=i.qty;itemStats[i.name].revenue+=i.price*i.qty}));
    const topItems=Object.values(itemStats).sort((a,b)=>b.revenue-a.revenue).slice(0,6);
    const typeData=[{name:"Dine-in",value:orders.filter(o=>o.type==="dine_in").length||1,color:"#F59E0B"},{name:"Takeout",value:orders.filter(o=>o.type==="takeout").length||1,color:"#3B82F6"}];
    return(<div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Analytics</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI title="Revenue" value={fmt(todayRevenue)} icon={DollarSign} trend="up"/>
        <KPI title="Orders" value={orders.length} icon={ShoppingBag} trend="up"/>
        <KPI title="Avg Ticket" value={completedOrders.length?fmt(todayRevenue/completedOrders.length):"—"} icon={Target} trend="up"/>
        <KPI title="Completion Rate" value={orders.length?Math.round(completedOrders.length/orders.length*100)+"%":"—"} icon={CheckCircle2} trend="up"/>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5"><h2 className="mb-4 text-sm font-semibold text-zinc-300">Top Items by Revenue</h2>
          {topItems.length?<ResponsiveContainer width="100%" height={220}><ReBarChart data={topItems} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/><XAxis type="number" stroke="#52525b" fontSize={11} tickFormatter={v=>`€${v}`}/><YAxis type="category" dataKey="name" stroke="#52525b" fontSize={11} width={100}/><Tooltip contentStyle={{background:"#18181b",border:"1px solid #3f3f46",borderRadius:"8px",fontSize:"12px"}}/><Bar dataKey="revenue" fill="#F59E0B" radius={[0,4,4,0]}/></ReBarChart></ResponsiveContainer>:<p className="text-sm text-zinc-500 text-center py-12">Complete some orders to see analytics</p>}
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5"><h2 className="mb-4 text-sm font-semibold text-zinc-300">Order Types</h2>
          <div className="flex items-center gap-6"><ResponsiveContainer width="50%" height={180}><RePieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">{typeData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie></RePieChart></ResponsiveContainer>
          <div className="space-y-2">{typeData.map(d=><div key={d.name} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{background:d.color}}/><span className="text-xs text-zinc-400">{d.name}</span><span className="text-xs font-bold text-zinc-200">{d.value}</span></div>)}</div></div>
        </div>
      </div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: CUSTOMERS
  // ═══════════════════════════════════════════════════════════
  const Customers=()=>{
    const[modal,setModal]=useState(false);
    const[form,setForm]=useState({name:"",email:"",phone:"",notes:""});
    const addCust=()=>{if(!form.name.trim()){toast.add("Name required","error");return}setCustomers(p=>[{id:uid(),name:form.name,email:form.email,phone:form.phone,visits:0,spent:0,points:0,tags:[],notes:form.notes},...p]);toast.add(`${form.name} added`);setModal(false);setForm({name:"",email:"",phone:"",notes:""})};
    return(<div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-zinc-100">Customers</h1><Btn onClick={()=>setModal(true)}><Plus size={16} className="inline mr-1"/>Add Customer</Btn></div>
      <div className="space-y-3">{customers.map(c=>(
        <div key={c.id} className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-4 hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-sm font-bold text-amber-400">{c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
            <div><div className="flex items-center gap-2"><p className="font-semibold text-zinc-200">{c.name}</p>{c.tags?.map(t=><Badge key={t} variant={t==="VIP"?"brand":"default"} className="text-[10px]">{t}</Badge>)}</div><div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">{c.email&&<span><Mail size={11} className="inline mr-0.5"/>{c.email}</span>}{c.phone&&<span><Phone size={11} className="inline mr-0.5"/>{c.phone}</span>}</div>{c.notes&&<p className="text-xs text-zinc-400 mt-0.5">{c.notes}</p>}</div></div>
          <div className="text-right"><p className="text-sm font-bold text-zinc-200">{fmt(c.spent)}</p><p className="text-xs text-zinc-500">{c.visits} visits</p>{c.points>0&&<Badge variant="brand" className="text-[10px]"><Star size={10}/>{c.points}pts</Badge>}</div></div>))}</div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Customer">
        <div className="space-y-4"><Input label="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/><Input label="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/><Input label="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/><Input label="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/><Btn className="w-full" onClick={addCust}>Add Customer</Btn></div>
      </Modal>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE: SETTINGS
  // ═══════════════════════════════════════════════════════════
  const SettingsPage=()=>(
    <div className="space-y-6"><h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5"><div className="mb-4 flex items-center gap-2"><Store size={18} className="text-amber-400"/><h2 className="text-sm font-semibold text-zinc-300">Restaurant</h2></div><div className="space-y-3">{[["Name","Bella Cucina"],["Address","47 Maximilianstraße, Munich"],["Phone","+49 89 1234567"],["Currency","EUR"],["Tax Rate","19%"],["Timezone","Europe/Berlin"]].map(([l,v])=><div key={l} className="flex justify-between"><span className="text-sm text-zinc-500">{l}</span><span className="text-sm font-medium text-zinc-200">{v}</span></div>)}</div><Btn className="w-full mt-4" onClick={()=>toast.add("Settings saved!")}>Save</Btn></div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5"><div className="mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-amber-400"/><h2 className="text-sm font-semibold text-zinc-300">Security</h2></div><div className="space-y-3">{[["Two-Factor Auth","Required for Owner & Manager"],["Row Level Security","Tenant isolation"],["Rate Limiting","5 attempts / 15min"],["CSP Headers","Nonce-based policy"],["Audit Logging","Immutable trails"]].map(([l,d])=><div key={l} className="flex items-center justify-between rounded-lg bg-zinc-800/40 p-3"><div><p className="text-sm font-medium text-zinc-200">{l}</p><p className="text-xs text-zinc-500">{d}</p></div><Badge variant="success"><Lock size={10}/>On</Badge></div>)}</div></div>
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/70 p-5"><div className="mb-4 flex items-center gap-2"><UserCog size={18} className="text-amber-400"/><h2 className="text-sm font-semibold text-zinc-300">Permissions</h2></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-zinc-800"><th className="px-3 py-2 text-left text-zinc-500">Permission</th>{["Owner","Manager","Chef","Waiter","Cashier","Host"].map(r=><th key={r} className="px-3 py-2 text-center text-zinc-500">{r}</th>)}</tr></thead><tbody>{[["Settings",[1,0,0,0,0,0]],["Staff",[1,1,0,0,0,0]],["Menu",[1,1,1,0,0,0]],["Orders",[1,1,0,1,1,0]],["Payments",[1,1,0,0,1,0]],["Reports",[1,1,0,0,0,0]],["Tables",[1,1,0,1,0,1]],["Inventory",[1,1,1,0,0,0]]].map(([p,r])=><tr key={p} className="border-b border-zinc-800/40"><td className="px-3 py-2 text-zinc-400">{p}</td>{r.map((v,i)=><td key={i} className="px-3 py-2 text-center">{v?<Check size={14} className="mx-auto text-emerald-400"/>:<X size={14} className="mx-auto text-zinc-700"/>}</td>)}</tr>)}</tbody></table></div></div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // NAVIGATION & LAYOUT
  // ═══════════════════════════════════════════════════════════
  const nav=[
    {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
    {id:"orders",label:"Orders",icon:ShoppingBag,badge:activeOrders.length||null},
    {id:"kitchen",label:"Kitchen",icon:ChefHat,badge:orders.filter(o=>["confirmed","preparing"].includes(o.status)).length||null},
    {id:"pos",label:"POS",icon:CreditCard},
    {id:"menu",label:"Menu",icon:UtensilsCrossed},
    {id:"tables",label:"Tables",icon:Armchair},
    {id:"reservations",label:"Reservations",icon:CalendarClock,badge:reservations.filter(r=>r.status==="confirmed").length||null},
    {id:"inventory",label:"Inventory",icon:Package,badge:inventory.filter(i=>i.qty<=i.threshold).length||null},
    {id:"staff",label:"Staff",icon:Users},
    {id:"analytics",label:"Analytics",icon:BarChart3},
    {id:"customers",label:"Customers",icon:Heart},
    {id:"settings",label:"Settings",icon:Settings},
  ];

  const pages={dashboard:Dashboard,orders:Orders,kitchen:Kitchen,pos:POS,menu:Menu,tables:Tables,reservations:Reservations,inventory:Inventory,staff:Staff,analytics:Analytics,customers:Customers,settings:SettingsPage};
  const Page=pages[page]||Dashboard;

  return(
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={cn("flex flex-col border-r border-zinc-800/80 bg-zinc-950 transition-all duration-300 shrink-0",sidebarOpen?"w-60":"w-16")}>
        <div className="flex h-16 items-center gap-3 border-b border-zinc-800/80 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/15"><UtensilsCrossed size={18} className="text-white"/></div>
          {sidebarOpen&&<div><p className="text-sm font-bold truncate" style={{fontFamily:"Georgia,serif"}}>Bella Cucina</p><p className="text-[10px] text-zinc-500">RMS</p></div>}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">{nav.map(n=>{const I=n.icon;const a=page===n.id;return(
          <button key={n.id} onClick={()=>setPage(n.id)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",a?"bg-amber-500/10 text-amber-400":"text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300",!sidebarOpen&&"justify-center px-0")}>
            <I size={18}/>{sidebarOpen&&<><span className="flex-1 text-left">{n.label}</span>{n.badge&&<span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold text-amber-400">{n.badge}</span>}</>}
          </button>)})}</nav>
        <div className="border-t border-zinc-800/80 p-3"><button onClick={()=>setSidebarOpen(!sidebarOpen)} className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-400">{sidebarOpen?<PanelLeftClose size={16}/>:<PanelLeft size={16}/>}{sidebarOpen&&"Collapse"}</button></div>
      </aside>
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5"><Search size={14} className="text-zinc-500"/><span className="text-xs text-zinc-500">Search... ⌘K</span></div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono">{new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</span>
            <button className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-800"><Bell size={18}/>{activeOrders.length>0&&<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse"/>}</button>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[10px] font-bold text-white">{(currentUser||"U")[0].toUpperCase()}</div><div className="hidden sm:block"><p className="text-xs font-medium text-zinc-300">{currentUser}</p><p className="text-[10px] text-zinc-500">Owner</p></div></div>
            <button onClick={()=>{setIsAuth(false);setOrders([]);setTables(seedTables.map(t=>({...t,status:"available",orderId:null,guests:0,server:null,seatedAt:null})))}} className="rounded-lg p-2 text-zinc-600 hover:text-red-400"><LogOut size={16}/></button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Page/></main>
      </div>
      <Toasts toasts={toast.toasts}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MENU ITEM FORM (used by Menu page modal)
   ═══════════════════════════════════════════════════════════════ */
function MenuForm({item:init,categories,onSave,onCancel}){
  const[f,setF]=useState({...init});
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  return(<div className="space-y-4">
    <Input label="Name" value={f.name} onChange={e=>u("name",e.target.value)} placeholder="Item name"/>
    <div className="grid grid-cols-2 gap-4">
      <Select label="Category" value={f.catId} onChange={e=>u("catId",e.target.value)}>{categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</Select>
      <Select label="Station" value={f.station} onChange={e=>u("station",e.target.value)}>{["grill","pasta","pizza","salad","bar"].map(s=><option key={s} value={s}>{s}</option>)}</Select>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Input label="Price (€)" type="number" step="0.1" value={f.price} onChange={e=>u("price",+e.target.value)}/>
      <Input label="Cost (€)" type="number" step="0.1" value={f.cost} onChange={e=>u("cost",+e.target.value)}/>
      <Input label="Prep (min)" type="number" value={f.prepTime} onChange={e=>u("prepTime",+e.target.value)}/>
    </div>
    <Input label="Calories" type="number" value={f.calories} onChange={e=>u("calories",+e.target.value)}/>
    <Input label="Allergens (comma-separated)" value={(f.allergens||[]).join(", ")} onChange={e=>u("allergens",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))}/>
    <div className="flex items-center gap-3"><input type="checkbox" checked={f.available} onChange={e=>u("available",e.target.checked)} className="rounded"/><span className="text-sm text-zinc-300">Available</span></div>
    <div className="flex gap-3"><Btn className="flex-1" onClick={()=>{if(!f.name.trim())return;onSave(f)}}><Save size={14} className="inline mr-1"/>{f.id?"Update":"Add"} Item</Btn><Btn variant="secondary" onClick={onCancel}>Cancel</Btn></div>
  </div>);
}
