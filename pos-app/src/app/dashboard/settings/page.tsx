'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  CreditCard,
  Receipt,
  Bell,
  Shield,
  Crown,
  Save,
  Globe,
  Clock,
  Smartphone,
  Banknote,
  ChevronRight,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Eye,
  EyeOff,
  Calendar,
  Monitor,
  RefreshCw,
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'store', label: 'Store', icon: Store },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'tax', label: 'Tax', icon: Receipt },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'subscription', label: 'Subscription', icon: Crown },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '48px', height: '26px', borderRadius: '13px', border: 'none',
        background: enabled ? '#2563EB' : '#D1D5DB', cursor: 'pointer',
        position: 'relative', transition: 'background 0.25s', flexShrink: 0,
      }}>
      <span style={{
        position: 'absolute', top: '3px',
        left: enabled ? '25px' : '3px',
        width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        display: 'block',
      }} />
    </button>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
      {(title || description) && (
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D1117' }}>{title}</h3>
          {description && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9CA3AF' }}>{description}</p>}
        </div>
      )}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        onFocus={e => (e.target.style.borderColor = '#2563EB')}
        onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
      />
    </div>
  );
}

function ToggleRow({ label, description, enabled, onToggle }: { label: string; description?: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F9FAFB' }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#0D1117' }}>{label}</p>
        {description && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>{description}</p>}
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

const loginHistory = [
  { device: 'Chrome on Windows', location: 'Nairobi, Kenya', time: 'Today, 09:14 AM', current: true },
  { device: 'Mobile App (Android)', location: 'Nairobi, Kenya', time: 'Yesterday, 06:45 PM', current: false },
  { device: 'Chrome on Windows', location: 'Nairobi, Kenya', time: 'Jul 16, 2026, 10:22 AM', current: false },
  { device: 'Firefox on MacOS', location: 'Mombasa, Kenya', time: 'Jul 14, 2026, 03:10 PM', current: false },
];

const billingHistory = [
  { date: 'Jul 1, 2026', amount: 'KES 5,000', plan: 'Professional', status: 'Paid' },
  { date: 'Jun 1, 2026', amount: 'KES 5,000', plan: 'Professional', status: 'Paid' },
  { date: 'May 1, 2026', amount: 'KES 5,000', plan: 'Professional', status: 'Paid' },
  { date: 'Apr 1, 2026', amount: 'KES 2,500', plan: 'Starter', status: 'Paid' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // General
  const [businessName, setBusinessName] = useState('HaxOne Supermart');
  const [email, setEmail] = useState('admin@haxone.co.ke');
  const [phone, setPhone] = useState('+254 712 000 001');
  const [address, setAddress] = useState('Tom Mboya Street, Nairobi CBD');
  const [country, setCountry] = useState('Kenya');
  const [currency, setCurrency] = useState('KES');

  // Store
  const [openTime, setOpenTime] = useState('07:00');
  const [closeTime, setCloseTime] = useState('21:00');
  const [receiptFooter, setReceiptFooter] = useState('Asante kwa ununuzi! | Thank you for shopping with us!');
  const [loyaltyPoints, setLoyaltyPoints] = useState(true);
  const [autoDiscounts, setAutoDiscounts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(false);

  // Payments
  const [mpesaEnabled, setMpesaEnabled] = useState(true);
  const [mpesaPaybill, setMpesaPaybill] = useState('174379');
  const [cashEnabled, setCashEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(false);

  // Tax
  const [vatRate, setVatRate] = useState('16');
  const [kraPin, setKraPin] = useState('A001234567B');
  const [taxInclusive, setTaxInclusive] = useState(true);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [dailyReport, setDailyReport] = useState(true);

  // Security
  const [twoFA, setTwoFA] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('haxone_settings');
        if (stored) {
          const s = JSON.parse(stored);
          setBusinessName(s.businessName ?? 'HaxOne Supermart');
          setEmail(s.email ?? 'admin@haxone.co.ke');
          setPhone(s.phone ?? '+254 712 000 001');
          setAddress(s.address ?? 'Tom Mboya Street, Nairobi CBD');
          setCountry(s.country ?? 'Kenya');
          setCurrency(s.currency ?? 'KES');
          
          setOpenTime(s.openTime ?? '07:00');
          setCloseTime(s.closeTime ?? '21:00');
          setReceiptFooter(s.receiptFooter ?? 'Asante kwa ununuzi! | Thank you for shopping with us!');
          setLoyaltyPoints(s.loyaltyPoints ?? true);
          setAutoDiscounts(s.autoDiscounts ?? true);
          setLowStockAlerts(s.lowStockAlerts ?? true);
          setEmailReceipts(s.emailReceipts ?? false);

          setMpesaEnabled(s.mpesaEnabled ?? true);
          setMpesaPaybill(s.mpesaPaybill ?? '174379');
          setCashEnabled(s.cashEnabled ?? true);
          setCardEnabled(s.cardEnabled ?? false);

          setVatRate(s.vatRate ?? '16');
          setKraPin(s.kraPin ?? 'A001234567B');
          setTaxInclusive(s.taxInclusive ?? true);

          setEmailAlerts(s.emailAlerts ?? true);
          setSmsAlerts(s.smsAlerts ?? false);
          setLowStockThreshold(s.lowStockThreshold ?? '10');
          setDailyReport(s.dailyReport ?? true);
          setTwoFA(s.twoFA ?? false);
        }
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('haxone_settings', JSON.stringify({
          businessName, email, phone, address, country, currency,
          openTime, closeTime, receiptFooter, loyaltyPoints, autoDiscounts, lowStockAlerts, emailReceipts,
          mpesaEnabled, mpesaPaybill, cashEnabled, cardEnabled,
          vatRate, kraPin, taxInclusive,
          emailAlerts, smsAlerts, lowStockThreshold, dailyReport,
          twoFA
        }));
      } catch (e) {}
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ background: '#F3F4F6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '24px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0D1117', margin: 0 }}>Settings</h1>
            <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>Configure your POS platform preferences</p>
          </div>
          <button onClick={handleSave} style={{
            background: saved ? '#16A34A' : '#2563EB', color: '#fff', border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.3s',
            boxShadow: saved ? '0 2px 8px rgba(22,163,74,0.3)' : '0 2px 8px rgba(37,99,235,0.3)',
          }}>
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? '#2563EB' : '#6B7280',
              borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
              display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
              transition: 'all 0.15s', marginBottom: '-1px',
            }}>
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: '860px' }}>

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <SectionCard title="Business Information" description="Update your store's basic information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <InputField label="Business Name" value={businessName} onChange={setBusinessName} placeholder="HaxOne Supermart" />
              <InputField label="Business Email" value={email} onChange={setEmail} type="email" placeholder="admin@haxone.co.ke" />
              <InputField label="Phone Number" value={phone} onChange={setPhone} placeholder="+254 7XX XXX XXX" />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', cursor: 'pointer' }}>
                  <option>Kenya</option>
                  <option>Uganda</option>
                  <option>Tanzania</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <InputField label="Business Address" value={address} onChange={setAddress} placeholder="Street, City, County" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', cursor: 'pointer' }}>
                  <option value="KES">KES – Kenyan Shilling</option>
                  <option value="USD">USD – US Dollar</option>
                  <option value="UGX">UGX – Ugandan Shilling</option>
                </select>
              </div>
            </div>
          </SectionCard>
        )}

        {/* STORE TAB */}
        {activeTab === 'store' && (
          <>
            <SectionCard title="Store Hours" description="Set your operating hours">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} /> Opening Time</label>
                  <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} /> Closing Time</label>
                  <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Receipt Footer Message</label>
                <textarea value={receiptFooter} onChange={e => setReceiptFooter(e.target.value)}
                  style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>
            </SectionCard>
            <SectionCard title="Store Features" description="Enable or disable store functionality">
              <ToggleRow label="Loyalty Points" description="Reward customers with points on every purchase" enabled={loyaltyPoints} onToggle={() => setLoyaltyPoints(p => !p)} />
              <ToggleRow label="Automatic Discounts" description="Apply rules-based discounts automatically" enabled={autoDiscounts} onToggle={() => setAutoDiscounts(p => !p)} />
              <ToggleRow label="Low Stock Alerts" description="Get notified when products run low" enabled={lowStockAlerts} onToggle={() => setLowStockAlerts(p => !p)} />
              <ToggleRow label="Email Receipts" description="Send digital receipts to customer email" enabled={emailReceipts} onToggle={() => setEmailReceipts(p => !p)} />
            </SectionCard>
          </>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <>
            {/* M-Pesa */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px', overflow: 'hidden', border: mpesaEnabled ? '2px solid #16A34A' : '2px solid #E5E7EB' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={20} color="#16A34A" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D1117' }}>M-Pesa</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Safaricom mobile money integration</p>
                  </div>
                </div>
                <Toggle enabled={mpesaEnabled} onToggle={() => setMpesaEnabled(p => !p)} />
              </div>
              {mpesaEnabled && (
                <div style={{ padding: '20px 24px' }}>
                  <InputField label="Paybill Number" value={mpesaPaybill} onChange={setMpesaPaybill} placeholder="e.g. 174379" />
                  <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <CheckCircle size={15} color="#16A34A" />
                    <p style={{ margin: 0, fontSize: '13px', color: '#16A34A', fontWeight: 500 }}>M-Pesa is connected and active</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cash */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px', overflow: 'hidden', border: cashEnabled ? '2px solid #2563EB' : '2px solid #E5E7EB' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Banknote size={20} color="#2563EB" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D1117' }}>Cash</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Accept cash payments at POS</p>
                  </div>
                </div>
                <Toggle enabled={cashEnabled} onToggle={() => setCashEnabled(p => !p)} />
              </div>
            </div>

            {/* Card/Stripe */}
            <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px', overflow: 'hidden', border: cardEnabled ? '2px solid #7C3AED' : '2px solid #E5E7EB' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} color="#7C3AED" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D1117' }}>Card / Stripe</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Visa, Mastercard via Stripe gateway</p>
                  </div>
                </div>
                <Toggle enabled={cardEnabled} onToggle={() => setCardEnabled(p => !p)} />
              </div>
            </div>
          </>
        )}

        {/* TAX TAB */}
        {activeTab === 'tax' && (
          <SectionCard title="Tax Configuration" description="Configure KRA and VAT settings for Kenya">
            <InputField label="VAT Rate (%)" value={vatRate} onChange={setVatRate} placeholder="16" />
            <InputField label="KRA PIN" value={kraPin} onChange={setKraPin} placeholder="A001234567B" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #F3F4F6', marginTop: '8px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#0D1117' }}>Tax-Inclusive Pricing</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>Product prices already include VAT</p>
              </div>
              <Toggle enabled={taxInclusive} onToggle={() => setTaxInclusive(p => !p)} />
            </div>
            <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '16px', border: '1px solid #FDE68A' }}>
              <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#92400E', lineHeight: '1.6' }}>
                Ensure your KRA PIN is correctly entered for compliant ETR receipts. All transactions are logged for KRA reporting.
              </p>
            </div>
          </SectionCard>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <SectionCard title="Notification Preferences" description="Control how you receive alerts and reports">
            <ToggleRow label="Email Alerts" description="Receive important alerts via email" enabled={emailAlerts} onToggle={() => setEmailAlerts(p => !p)} />
            <ToggleRow label="SMS Alerts" description="Get SMS notifications for critical events" enabled={smsAlerts} onToggle={() => setSmsAlerts(p => !p)} />
            <ToggleRow label="Daily Sales Report" description="Receive a daily report email every morning" enabled={dailyReport} onToggle={() => setDailyReport(p => !p)} />
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Low Stock Alert Threshold (units)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(e.target.value)}
                  style={{ width: '120px', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA' }}
                />
                <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Alert when stock drops below this number</p>
              </div>
            </div>
          </SectionCard>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <>
            <SectionCard title="Change Password" description="Update your account password">
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Current Password</label>
                <input type={showPass ? 'text' : 'password'} value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••"
                  style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '10px', padding: '10px 40px 10px 12px', fontSize: '14px', color: '#0D1117', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
                <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '12px', top: '34px', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
                </button>
              </div>
              <InputField label="New Password" value={newPass} onChange={setNewPass} type="password" placeholder="Min. 8 characters" />
              <InputField label="Confirm New Password" value={confirmPass} onChange={setConfirmPass} type="password" placeholder="Re-enter new password" />
              <button style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={14} /> Update Password
              </button>
            </SectionCard>

            <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
              <ToggleRow label="Enable 2FA" description="Use an authenticator app for login verification" enabled={twoFA} onToggle={() => setTwoFA(p => !p)} />
            </SectionCard>

            <SectionCard title="Login History" description="Recent sign-in activity on your account">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {loginHistory.map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < loginHistory.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: log.current ? '#EFF6FF' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Monitor size={16} color={log.current ? '#2563EB' : '#9CA3AF'} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0D1117' }}>{log.device} {log.current && <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, marginLeft: '6px' }}>Current</span>}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>{log.location} · {log.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === 'subscription' && (
          <>
            <div style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #2563EB 100%)', borderRadius: '20px', padding: '28px', marginBottom: '20px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ position: 'absolute', bottom: '-60px', right: '60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Crown size={22} color="#FCD34D" fill="#FCD34D" />
                    <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>Current Plan</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800 }}>Professional</h2>
                  <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: '14px' }}>KES 5,000 / month · Renews Aug 1, 2026</p>
                </div>
                <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', padding: '10px 20px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                  Upgrade Plan
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
                {[
                  { label: 'Branches', value: '4 of 10' },
                  { label: 'Staff Accounts', value: '14 of 50' },
                  { label: 'Monthly Sales', value: 'KES 1.2M' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px' }}>
                    <p style={{ margin: 0, fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '16px', fontWeight: 700 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <SectionCard title="Plan Features" description="What's included in your Professional plan">
              {[
                'Up to 10 branches', '50 staff accounts', 'Advanced analytics & AI insights',
                'M-Pesa & card payments', 'ETR/KRA compliance', 'Priority support (24/7)',
                'Custom receipts & branding', 'Inventory management', 'Multi-branch reporting',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 8 ? '1px solid #F9FAFB' : 'none' }}>
                  <CheckCircle size={16} color="#16A34A" fill="#DCFCE7" />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{f}</span>
                </div>
              ))}
            </SectionCard>

            <SectionCard title="Billing History" description="Your recent payment history">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    {['Date', 'Plan', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '8px 0', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F3F4F6' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < billingHistory.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                      <td style={{ padding: '12px 0', color: '#374151' }}>{row.date}</td>
                      <td style={{ padding: '12px 0', color: '#374151' }}>{row.plan}</td>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: '#0D1117' }}>{row.amount}</td>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{ background: '#F0FDF4', color: '#16A34A', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionCard>
          </>
        )}
      </div>
    </div>
  );
}
