import { Order } from '@/types';

interface OrderConfirmationEmailProps {
  order: Order;
  customerName: string;
}

// This can be rendered server-side with React Email or similar
export default function OrderConfirmationEmail({
  order,
  customerName,
}: OrderConfirmationEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Order Confirmation - ModernShop</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', background: '#f5f0ff' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: '#f5f0ff', padding: '40px 20px' }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                {/* Header */}
                <tr>
                  <td style={{ background: '#7000ff', padding: '40px', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: '28px' }}>✓</span>
                    </div>
                    <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>
                      Order Confirmed!
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: 0 }}>
                      Hi {customerName}, we&apos;ve received your order.
                    </p>
                  </td>
                </tr>

                {/* Order Meta */}
                <tr>
                  <td style={{ padding: '24px 32px 0' }}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td>
                          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9b8cc4', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>ORDER ID</p>
                          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a0533', margin: 0 }}>#{order.id}</p>
                        </td>
                        <td align="right">
                          <p style={{ fontSize: '11px', fontWeight: 700, color: '#9b8cc4', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>ORDER DATE</p>
                          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a0533', margin: 0 }}>{order.date}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td style={{ padding: '20px 32px 0' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid #f0eeff', margin: 0 }} />
                  </td>
                </tr>

                {/* Items */}
                <tr>
                  <td style={{ padding: '20px 32px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a0533', margin: '0 0 16px' }}>Order Items</h2>
                    {order.items.map((item) => (
                      <table key={item.id} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '12px' }}>
                        <tr>
                          <td style={{ width: '40px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#f0e8ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#7000ff', fontSize: '18px' }}>📦</span>
                            </div>
                          </td>
                          <td style={{ paddingLeft: '12px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a0533', margin: '0 0 2px' }}>{item.name}</p>
                            <p style={{ fontSize: '12px', color: '#9b8cc4', margin: 0 }}>Qty: {item.quantity}</p>
                          </td>
                          <td align="right">
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a0533', margin: 0 }}>
                              ${item.price.toFixed(2)}
                            </p>
                          </td>
                        </tr>
                      </table>
                    ))}
                  </td>
                </tr>

                {/* Totals */}
                <tr>
                  <td style={{ padding: '0 32px 16px' }}>
                    <div style={{ background: '#fdfaff', borderRadius: '12px', padding: '16px', border: '1px solid #f0eeff' }}>
                      <table width="100%" cellPadding={0} cellSpacing={0}>
                        <tr>
                          <td style={{ fontSize: '13px', color: '#7a6898', paddingBottom: '6px' }}>Subtotal</td>
                          <td align="right" style={{ fontSize: '13px', color: '#7a6898', paddingBottom: '6px' }}>${order.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: '13px', color: '#7a6898', paddingBottom: '6px' }}>Shipping</td>
                          <td align="right" style={{ fontSize: '13px', color: '#00b894', fontWeight: 600, paddingBottom: '6px' }}>FREE</td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: '13px', color: '#7a6898', paddingBottom: '12px' }}>Tax (8%)</td>
                          <td align="right" style={{ fontSize: '13px', color: '#7a6898', paddingBottom: '12px' }}>${order.tax.toFixed(2)}</td>
                        </tr>
                        <tr style={{ borderTop: '1px solid #e8e0ff' }}>
                          <td style={{ fontSize: '16px', fontWeight: 700, color: '#1a0533', paddingTop: '12px' }}>Total</td>
                          <td align="right" style={{ fontSize: '18px', fontWeight: 800, color: '#7000ff', paddingTop: '12px' }}>${order.total.toFixed(2)}</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>

                {/* CTA */}
                <tr>
                  <td style={{ padding: '0 32px 32px', textAlign: 'center' }}>
                    <a href={`https://modernshop.app/receipts`} style={{
                      display: 'inline-block',
                      background: '#7000ff',
                      color: 'white',
                      padding: '12px 32px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '15px',
                    }}>
                      View Your Receipt
                    </a>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ background: '#fdfaff', padding: '20px 32px', borderTop: '1px solid #f0eeff', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#9b8cc4', margin: 0 }}>
                      © 2024 ModernShop. All rights reserved. |{' '}
                      <a href="#" style={{ color: '#7000ff', textDecoration: 'none' }}>Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}

// Helper to generate HTML string for sending via email service
export function renderOrderConfirmationEmail(order: Order, customerName: string): string {
  // In production, use react-dom/server renderToStaticMarkup
  // or React Email's render utility
  return `<!-- Order Confirmation Email for ${customerName} - Order #${order.id} -->`;
}
