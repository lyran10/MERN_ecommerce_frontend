import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import api from "../api"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from "recharts"

export default function AdminDashboard() {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#7fbfff"]
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState<number | "">("")

  const fetchAnalytics = (year: number, month: number | "") => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append("year", year.toString())
    if (month) params.append("month", month.toString())

    api.get(`/admin/analytics?${params.toString()}`)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch analytics:", err)
        setLoading(false)
      })
  }
  console.log(data)
  useEffect(() => {
    fetchAnalytics(year, month)
  }, [year, month])

  if (loading) return <p className="text-center py-10">Loading dashboard...</p>
  if (!data) return <p className="text-center py-10">No data available</p>

  return (
    <div className="container py-10 space-y-10">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-primary mb-6">
        Admin Analytics Dashboard 📊
      </motion.h1>

      {/* Year & Month selectors */}
      <div className="mb-6 flex items-center space-x-4">
        <div>
          <label className="mr-2 font-semibold">Year:</label>
          <select className="border p-2 rounded" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">Month:</label>
          <select className="border p-2 rounded" value={month} onChange={(e) => setMonth(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(0, m - 1).toLocaleString("default", { month: "long" })}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-6">
        <div className="card p-6 shadow">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">
            {data.ordersRevenueOverTime.reduce((sum: number, item: any) => sum + item.orders, 0)}
          </p>
        </div>
        <div className="card p-6 shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold">
            ₹{data.ordersRevenueOverTime.reduce((sum: number, item: any) => sum + item.revenue, 0)}
          </p>
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Orders & Revenue Over Selected Period</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.ordersRevenueOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.5}/>
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.5}/>
                <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="label" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null
              const ordersData = payload.find((p: any) => p.dataKey === "orders")
              const revenueData = payload.find((p: any) => p.dataKey === "revenue")
              return (
                <div style={{ background: "#fff", padding: 10, border: "1px solid #ccc" }}>
                  {ordersData && <div><strong>Orders:</strong> {ordersData.value}</div>}
                  {revenueData && <div><strong>Revenue:</strong> ₹{revenueData.value}</div>}
                </div>
              )
            }} />
            <Area type="monotone" dataKey="orders" stroke={COLORS[0]} fill="url(#colorOrders)" fillOpacity={1} dot={false} />
            <Area type="monotone" dataKey="revenue" stroke={COLORS[1]} fill="url(#colorRevenue)" fillOpacity={1} dot={false} />
            <Line type="monotone" dataKey="orders" stroke={COLORS[0]} dot />
            <Line type="monotone" dataKey="revenue" stroke={COLORS[1]} dot />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-6">
        <div className="card p-6 shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{data.totalProducts}</p>
        </div>
      </motion.div>

      {/* Products Added Timeline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Products Added Timeline</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data.productsAddedOverTime
              .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((p: any) => ({ title: p.title, date: new Date(p.date).getTime(), displayDate: p.date }))}
            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
          >
            <XAxis dataKey="title" type="category" interval={0} angle={-45} textAnchor="end" />
            <YAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} tickFormatter={(t) => new Date(t).toLocaleDateString()} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null
              const data = payload[0].payload
              return (
                <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
                  <div><strong>Product:</strong> {data.title}</div>
                  <div><strong>Added On:</strong> {new Date(data.date).toLocaleDateString()}</div>
                </div>
              )
            }} />
            <Area type="monotone" dataKey="date" stroke="#36cfc9" fill="#36cfc9" fillOpacity={0.3} />
            <Line type="monotone" dataKey="date" stroke="#36cfc9" dot={{ r: 4, fill: "#36cfc9" }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Wishlist */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-6">
        <div className="card p-6 shadow">
          <h2 className="text-lg font-semibold">Total Wishlist Products</h2>
          <p className="text-2xl font-bold">{data.wishlistData.length}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Wishlist Popularity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart layout="vertical" data={data.wishlistData.map((item: any) => ({ name: item.name, value: item.value }))}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip formatter={(value: any) => [`${value}`, "Wishlist Count"]} />
            <Bar dataKey="value" fill="#ff7f7f" barSize={30} radius={[10, 10, 10, 10]} />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Product Ratings */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Product Ratings</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.ratings.map((p: any) => {
            const total = p.totalReviews || 1
            return {
              ...p,
              "1-star": p.starCounts[1],
              "2-star": p.starCounts[2],
              "3-star": p.starCounts[3],
              "4-star": p.starCounts[4],
              "5-star": p.starCounts[5]
            }
          })} stackOffset="expand">
            <XAxis dataKey="title" />
            <YAxis tickFormatter={(value) => `${Math.round(value*100)}%`} />
            <Tooltip content={({ payload, active }) => {
              if (!active || !payload || !payload.length) return null
              const data = payload[0].payload
              return (
                <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc" }}>
                  <div><strong>{data.title}</strong></div>
                  <div>1★: {data.starCounts[1] || 0}</div>
                  <div>2★: {data.starCounts[2] || 0}</div>
                  <div>3★: {data.starCounts[3] || 0}</div>
                  <div>4★: {data.starCounts[4] || 0}</div>
                  <div>5★: {data.starCounts[5] || 0}</div>
                </div>
              )
            }} />
            <Bar dataKey="1-star" stackId="a" fill="#ff4d4f" />
            <Bar dataKey="2-star" stackId="a" fill="#ff7a45" />
            <Bar dataKey="3-star" stackId="a" fill="#ffc53d" />
            <Bar dataKey="4-star" stackId="a" fill="#73d13d" />
            <Bar dataKey="5-star" stackId="a" fill="#36cfc9" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Users Distribution */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Users Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart innerRadius="20%" outerRadius="90%" barSize={20} data={[
            { name: "Admins", value: data.users[0].value, fill: "#8884d8" },
            { name: "Normal Users", value: data.users[1].value, fill: "#82ca9d" }
          ]}>
            <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
