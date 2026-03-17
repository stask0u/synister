'use client'

import Cookies from 'js-cookie'
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import Navbar from "@/comps/Navbar";

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface Variant {
    size: string
    stock: number
}

interface Product {
    _id: string
    name: string
    slug: string
    description?: string
    images?: string[]
    price: number
    category: string
    subcategory?: string
    variants: Variant[]
    isActive: boolean
}

interface OrderItem {
    product_id: { _id: string; name: string; price: number } | null
    quantity: number
    price: number
}

interface Order {
    _id: string
    user_id: { _id: string; name: string; email: string } | null
    items: OrderItem[]
    totalAmount: number
    paymentStatus: string
    shippingStatus?: string
    createdAt: string
}

type Tab = 'dashboard' | 'products' | 'orders'

const SUBCATEGORIES: Record<string, string[]> = {
    clothing: ['hoodies', 't-shirts', 'tank tops', 'pants', 'jackets'],
    shoes: ['sneakers', 'boots', 'sandals'],
    necklaces: ['chains', 'pendants', 'chokers'],
    bracelets: ['chain', 'beaded', 'cuff'],
    accessories: ['rings', 'earrings', 'belts'],
}

function getAuthHeaders() {
    const token = Cookies.get('token')
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

function Dashboard({ orders }: { orders: Order[] }) {
    const paid = orders.filter(o => o.paymentStatus === 'paid')
    const revenue = paid.reduce((s, o) => s + o.totalAmount, 0)
    const pending = orders.filter(o => o.paymentStatus === 'pending').length

    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}
    paid.forEach(o =>
        o.items.forEach(item => {
            const id = item.product_id?._id ?? 'unknown'
            const name = item.product_id?.name ?? 'Deleted product'
            if (!productSales[id]) productSales[id] = { name, qty: 0, revenue: 0 }
            productSales[id].qty += item.quantity
            productSales[id].revenue += item.price * item.quantity
        })
    )
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

    const byStatus: Record<string, number> = {}
    orders.forEach(o => { byStatus[o.paymentStatus] = (byStatus[o.paymentStatus] ?? 0) + 1 })

    return (
        <div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
                {[
                    { label: 'Total revenue', value: `€${revenue.toFixed(2)}` },
                    { label: 'Paid orders', value: paid.length },
                    { label: 'Pending orders', value: pending },
                    { label: 'All orders', value: orders.length },
                ].map(card => (
                    <div key={card.label} style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '1rem' }}>
                        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 6px' }}>{card.label}</p>
                        <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{card.value}</p>
                    </div>
                ))}
            </div>
            <p style={{ fontWeight: 500, marginBottom: 12 }}>Top products by revenue</p>
            {topProducts.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>No paid orders yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                    <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                        {['Product', 'Units sold', 'Revenue'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{h}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {topProducts.map(p => (
                        <tr key={p.name} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                            <td style={{ padding: '8px 8px' }}>{p.name}</td>
                            <td style={{ padding: '8px 8px' }}>{p.qty}</td>
                            <td style={{ padding: '8px 8px' }}>€{p.revenue.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Orders by status */}
            <p style={{ fontWeight: 500, margin: '28px 0 12px' }}>Orders by payment status</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {Object.entries(byStatus).map(([status, count]) => (
                    <div key={status} style={{ background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)', padding: '10px 16px', fontSize: 14 }}>
                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                        <span style={{ fontWeight: 500, marginLeft: 8 }}>{count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const emptyProduct = {
    name: '', description: '', price: '', category: '', subcategory: '',
    images: '', variants: [{ size: '', stock: '' }], isActive: true,
}

function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [form, setForm] = useState<typeof emptyProduct>(emptyProduct)
    const [editId, setEditId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    async function load() {
        try {
            const res = await fetch(`https://synister-backend.onrender.com/products`, { headers: getAuthHeaders() })
            const data = await res.json()
            setProducts(Array.isArray(data) ? data : [])
        } catch { setError('Failed to load products') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    function openAdd() {
        setForm(emptyProduct)
        setEditId(null)
        setShowForm(true)
    }

    function openEdit(p: Product) {
        setForm({
            name: p.name,
            description: p.description ?? '',
            price: String(p.price),
            category: p.category,
            subcategory: p.subcategory ?? '',
            images: (p.images ?? []).join(', '),
            variants: p.variants.length > 0
                ? p.variants.map(v => ({ size: v.size, stock: String(v.stock) }))
                : [{ size: '', stock: '' }],
            isActive: p.isActive,
        })
        setEditId(p._id)
        setShowForm(true)
    }

    async function handleSave() {
        setSaving(true)
        setError('')
        const body = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            category: form.category,
            subcategory: form.subcategory || undefined,
            images: form.images.split(',').map(s => s.trim()).filter(Boolean),
            variants: form.variants
                .filter(v => v.size)
                .map(v => ({ size: v.size, stock: parseInt(v.stock) || 0 })),
            isActive: form.isActive,
        }
        try {
            const url = editId ? `https://synister-backend.onrender.com/products/${editId}` : `https://synister-backend.onrender.com/products`
            const method = editId ? 'PUT' : 'POST'
            const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(body) })
            if (!res.ok) {
                const d = await res.json()
                setError(d.message ?? 'Error saving product')
            } else {
                setShowForm(false)
                load()
            }
        } catch { setError('Network error') }
        finally { setSaving(false) }
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`https://synister-backend.onrender.com/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() })
            setDeleteConfirm(null)
            load()
        } catch { setError('Failed to delete') }
    }

    async function toggleActive(p: Product) {
        await fetch(`https://synister-backend.onrender.com/products/${p._id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isActive: !p.isActive }),
        })
        load()
    }

    if (loading) return <p style={{ color: 'var(--color-text-secondary)' }}>Loading products…</p>

    return (
        <div>
            {error && <p style={{ color: 'var(--color-text-danger)', marginBottom: 12 }}>{error}</p>}

            {!showForm && (
                <>
                    <button onClick={openAdd} style={{ marginBottom: 20, padding: '8px 16px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', fontWeight: 500 }}>
                        + Add product
                    </button>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, tableLayout: 'fixed' }}>
                        <colgroup>
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '28%' }} />
                        </colgroup>
                        <thead>
                        <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                            {['Name', 'Category', 'Price', 'Active', 'Actions'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(p => (
                            <tr key={p._id} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                                <td style={{ padding: '8px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                                <td style={{ padding: '8px 8px', textTransform: 'capitalize' }}>{p.subcategory ?? p.category}</td>
                                <td style={{ padding: '8px 8px' }}>€{p.price.toFixed(2)}</td>
                                <td style={{ padding: '8px 8px' }}>
                                    <button onClick={() => toggleActive(p)} style={{ padding: '2px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', fontSize: 12, color: p.isActive ? 'var(--color-text-success)' : 'var(--color-text-secondary)' }}>
                                        {p.isActive ? 'Yes' : 'No'}
                                    </button>
                                </td>
                                <td style={{ padding: '8px 8px', display: 'flex', gap: 8 }}>
                                    <button onClick={() => openEdit(p)} style={{ padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>Edit</button>
                                    {deleteConfirm === p._id ? (
                                        <>
                                            <button onClick={() => handleDelete(p._id)} style={{ padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-danger)', color: 'var(--color-text-danger)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>Confirm</button>
                                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                                        </>
                                    ) : (
                                        <button onClick={() => setDeleteConfirm(p._id)} style={{ padding: '4px 10px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-danger)', color: 'var(--color-text-danger)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {showForm && (
                <div style={{ maxWidth: 520 }}>
                    <p style={{ fontWeight: 500, marginBottom: 20 }}>{editId ? 'Edit product' : 'New product'}</p>

                    {[
                        { label: 'Name', key: 'name', type: 'text' },
                        { label: 'Price (€)', key: 'price', type: 'number' },
                        { label: 'Description', key: 'description', type: 'text' },
                        { label: 'Images (comma-separated URLs)', key: 'images', type: 'text' },
                    ].map(f => (
                        <div key={f.key} style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{f.label}</label>
                            <input
                                type={f.type}
                                value={(form as never)[f.key]}
                                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Category</label>
                        <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }))} style={{ width: '100%' }}>
                            <option value="">Select category</option>
                            {Object.keys(SUBCATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {form.category && SUBCATEGORIES[form.category] && (
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Subcategory</label>
                            <select value={form.subcategory} onChange={e => setForm(prev => ({ ...prev, subcategory: e.target.value }))} style={{ width: '100%' }}>
                                <option value="">None</option>
                                {SUBCATEGORIES[form.category].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}

                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Active</label>
                        <input type="checkbox" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Variants (size + stock)</label>
                        {form.variants.map((v, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                <input placeholder="Size (e.g. M)" value={v.size} onChange={e => setForm(prev => { const vs = [...prev.variants]; vs[i] = { ...vs[i], size: e.target.value }; return { ...prev, variants: vs } })} style={{ flex: 1 }} />
                                <input placeholder="Stock" type="number" value={v.stock} onChange={e => setForm(prev => { const vs = [...prev.variants]; vs[i] = { ...vs[i], stock: e.target.value }; return { ...prev, variants: vs } })} style={{ width: 80 }} />
                                <button onClick={() => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, j) => j !== i) }))} style={{ padding: '4px 8px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>×</button>
                            </div>
                        ))}
                        <button onClick={() => setForm(prev => ({ ...prev, variants: [...prev.variants, { size: '', stock: '' }] }))} style={{ fontSize: 13, padding: '4px 10px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', background: 'transparent', cursor: 'pointer' }}>+ Add variant</button>
                    </div>

                    {error && <p style={{ color: 'var(--color-text-danger)', marginBottom: 12 }}>{error}</p>}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', fontWeight: 500 }}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => { setShowForm(false); setError('') }} style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']
const SHIPPING_STATUSES = ['not_shipped', 'processing', 'shipped', 'delivered', 'returned']

function Orders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [expanded, setExpanded] = useState<string | null>(null)
    const [updating, setUpdating] = useState<string | null>(null)

    async function load() {
        try {
            const res = await fetch(`https://synister-backend.onrender.com/orders`, { headers: getAuthHeaders() })
            const data = await res.json()
            setOrders(Array.isArray(data) ? data : [])
        } catch { setError('Failed to load orders') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    async function updateStatus(id: string, field: 'paymentStatus' | 'shippingStatus', value: string) {
        setUpdating(id)
        try {
            await fetch(`https://synister-backend.onrender.com/orders/${id}/status`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ [field]: value }),
            })
            setOrders(prev => prev.map(o => o._id === id ? { ...o, [field]: value } : o))
        } catch { setError('Failed to update') }
        finally { setUpdating(null) }
    }

    if (loading) return <p style={{ color: 'var(--color-text-secondary)' }}>Loading orders…</p>

    return (
        <div>
            {error && <p style={{ color: 'var(--color-text-danger)', marginBottom: 12 }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '10%' }} />
                </colgroup>
                <thead>
                <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                    {['Customer', 'Date', 'Total', 'Payment', 'Shipping', 'Items'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {orders.map(o => (
                    <>
                        <tr key={o._id} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                            <td style={{ padding: '8px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.user_id?.name ?? '—'}</span>
                                <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.user_id?.email ?? ''}</span>
                            </td>
                            <td style={{ padding: '8px 8px', fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '8px 8px' }}>€{o.totalAmount.toFixed(2)}</td>
                            <td style={{ padding: '8px 8px' }}>
                                <select
                                    value={o.paymentStatus}
                                    disabled={updating === o._id}
                                    onChange={e => updateStatus(o._id, 'paymentStatus', e.target.value)}
                                    style={{ fontSize: 13, padding: '2px 4px', width: '100%' }}
                                >
                                    {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </td>
                            <td style={{ padding: '8px 8px' }}>
                                <select
                                    value={o.shippingStatus ?? 'not_shipped'}
                                    disabled={updating === o._id}
                                    onChange={e => updateStatus(o._id, 'shippingStatus', e.target.value)}
                                    style={{ fontSize: 13, padding: '2px 4px', width: '100%' }}
                                >
                                    {SHIPPING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </td>
                            <td style={{ padding: '8px 8px' }}>
                                <button
                                    onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                                    style={{ padding: '3px 8px', borderRadius: 'var(--border-radius-md)', border: '0.5px solid var(--color-border-secondary)', background: 'transparent', cursor: 'pointer', fontSize: 12 }}
                                >
                                    {expanded === o._id ? 'Hide' : `${o.items.length}`}
                                </button>
                            </td>
                        </tr>
                        {expanded === o._id && (
                            <tr key={`${o._id}-expanded`} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                                <td colSpan={6} style={{ padding: '8px 16px', background: 'var(--color-background-secondary)' }}>
                                    {o.items.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '3px 0' }}>
                                            <span>{item.product_id?.name ?? 'Deleted product'} × {item.quantity}</span>
                                            <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        )}
                    </>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default function AdminPanel() {
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<Tab>('dashboard')
    const [orders, setOrders] = useState<Order[]>([])
    const router = useRouter()

    useEffect(() => {
        const raw = Cookies.get('user')
        if (raw) {
            const parsed: User = JSON.parse(raw)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(parsed)
            if (parsed.role !== 'admin') {
                router.push('/')
                return
            }
        } else {
            router.push('/')
            return
        }
        setLoading(false)
    }, [router])

    useEffect(() => {
        if (!loading) {
            fetch(`https://synister-backend.onrender.com/orders`, { headers: getAuthHeaders() })
                .then(r => r.json())
                .then(d => setOrders(Array.isArray(d) ? d : []))
                .catch(() => {})
        }
    }, [loading])

    if (loading) return <p style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Loading…</p>

    const tabs: { key: Tab; label: string }[] = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'products', label: 'Products' },
        { key: 'orders', label: 'Orders' },
    ]

    return (
        <>
            <Navbar/>
            <div style={{maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem'}}>
                {/* Header */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28}}>
                    <p style={{fontWeight: 500, fontSize: 18, margin: 0}}>Admin panel</p>
                    <p style={{fontSize: 14, color: 'var(--color-text-secondary)', margin: 0}}>{user?.name}</p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 0,
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                    marginBottom: 28
                }}>
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                padding: '8px 20px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: tab === t.key ? '2px solid var(--color-text-primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                fontWeight: tab === t.key ? 500 : 400,
                                color: tab === t.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                fontSize: 14,
                                marginBottom: -1,
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'dashboard' && <Dashboard orders={orders}/>}
                {tab === 'products' && <Products/>}
                {tab === 'orders' && <Orders/>}
            </div>
        </>
    )
}