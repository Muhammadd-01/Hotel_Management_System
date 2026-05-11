// Invoices.jsx - Yeh page billing, tax aur printable invoices ke liye hai
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiDocumentText, HiPrinter, HiX, HiDownload } from 'react-icons/hi';
import { jsPDF } from 'jspdf';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]); // Invoices ki list
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Detailed view ke liye
  const [invoiceDetail, setInvoiceDetail] = useState(null); // Ek specific invoice ka data
  const [detailLoading, setDetailLoading] = useState(false);

  // ============ INVOICES KI SUMMARY LOAD KARNA ============
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get('/invoices');
        if (res.data.success) setInvoices(res.data.invoices);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchInvoices();
  }, []);

  // ============ EK SPECIFIC INVOICE KA DETAIL LANNA ============
  const viewInvoice = async (bookingId) => {
    setDetailLoading(true);
    try {
      const res = await API.get(`/invoices/${bookingId}`);
      if (res.data.success) {
        setInvoiceDetail(res.data.invoice);
        setSelectedInvoice(true);
      }
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  // ============ PDF DOWNLOAD KARNE KA FUNCTION ============
  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Primary color
    doc.text('LUXURYSTAY HOTEL INVOICE', margin, 30);
    
    doc.setDrawColor(0, 209, 255); // Accent color
    doc.setLineWidth(1);
    doc.line(margin, 35, 190, 35);
    
    // Details
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Text secondary
    doc.text(`Invoice Number: ${invoiceDetail.invoiceNumber}`, margin, 50);
    doc.text(`Guest Name: ${invoiceDetail.guestName}`, margin, 58);
    doc.text(`Room: ${invoiceDetail.room?.roomNumber} (${invoiceDetail.room?.type})`, margin, 66);
    doc.text(`Date: ${new Date(invoiceDetail.generatedAt).toLocaleDateString()}`, 140, 50);
    
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, 80, 170, 10, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin + 5, 87);
    doc.text('Amount', 150, 87);
    
    // Table Body
    doc.setFont('helvetica', 'normal');
    let y = 100;
    
    // Room Rent
    doc.text(`Room Rent (${invoiceDetail.nights} nights)`, margin + 5, y);
    doc.text(`Rs. ${invoiceDetail.roomCharges?.toLocaleString()}`, 150, y);
    y += 10;
    
    // Services
    invoiceDetail.services?.forEach(s => {
      doc.text(`${s.type}: ${s.description}`, margin + 5, y);
      doc.text(`Rs. ${s.amount?.toLocaleString()}`, 150, y);
      y += 10;
    });
    
    // Footer
    doc.line(margin, y, 190, y);
    y += 15;
    doc.text('Subtotal:', 120, y);
    doc.text(`Rs. ${invoiceDetail.subtotal?.toLocaleString()}`, 150, y);
    y += 10;
    doc.text(`Tax (${invoiceDetail.taxRate}%):`, 120, y);
    doc.text(`Rs. ${invoiceDetail.tax?.toLocaleString()}`, 150, y);
    y += 15;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 194, 168);
    doc.text('Grand Total:', 100, y);
    doc.text(`Rs. ${invoiceDetail.grandTotal?.toLocaleString()}`, 150, y);
    
    // Save the PDF
    doc.save(`${invoiceDetail.invoiceNumber}.pdf`);
  };

  // ============ INVOICE PRINT KARNE KA FUNCTION ============
  const printInvoice = () => {
    const printContent = document.getElementById('invoice-print');
    const win = window.open('', '', 'width=800,height=600');
    // Print ke liye CSS style define karna
    win.document.write(`<html><head><title>Invoice - ${invoiceDetail?.invoiceNumber}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; }
        h1 { color: #0A2A43; border-bottom: 2px solid #00C2A8; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
        .total { font-weight: bold; font-size: 1.2em; color: #0A2A43; }
      </style></head><body>${printContent.innerHTML}</body></html>`);
    win.document.close();
    win.print(); // Browser ka print dialog khol dena
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="invoices-page">
      <div className="page-header">
        <div><h1>Billing & Invoices</h1><p className="page-subtitle">Guests ke bill aur payments yahan se dekhein</p></div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Invoice #</th><th>Guest</th><th>Room</th><th>Stay Period</th><th>Total Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? invoices.map(inv => (
                <tr key={inv.bookingId}>
                  <td><strong>{inv.invoiceNumber}</strong></td>
                  <td>{inv.guestName}</td>
                  <td>Room {inv.roomNumber}</td>
                  <td>{new Date(inv.checkIn).toLocaleDateString()} - {new Date(inv.checkOut).toLocaleDateString()}</td>
                  <td>Rs. {inv.totalAmount?.toLocaleString()}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <button className="btn-sm btn-success" onClick={() => viewInvoice(inv.bookingId)}>
                      <HiDocumentText /> View Bill
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-state">Koi invoice nahi mili</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal (Popup) */}
      {selectedInvoice && invoiceDetail && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice Details</h2>
              <div style={{display:'flex',gap:'8px'}}>
                <button className="btn btn-secondary" onClick={downloadPDF}><HiDownload /> Download PDF</button>
                <button className="btn btn-primary" onClick={printInvoice}><HiPrinter /> Print</button>
                <button className="btn-close" onClick={() => setSelectedInvoice(null)}><HiX /></button>
              </div>
            </div>
            <div className="modal-form" id="invoice-print">
              <h1>🏨 HotelPro Invoice</h1>
              <div style={{display:'flex',justifyContent:'space-between',margin:'20px 0'}}>
                <div>
                  <p><strong>Invoice Number:</strong> {invoiceDetail.invoiceNumber}</p>
                  <p><strong>Guest Name:</strong> {invoiceDetail.guestName}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p><strong>Date:</strong> {new Date(invoiceDetail.generatedAt).toLocaleDateString()}</p>
                  <p><strong>Room:</strong> {invoiceDetail.room?.roomNumber} ({invoiceDetail.room?.type})</p>
                </div>
              </div>

              <table className="data-table">
                <thead><tr><th>Description</th><th style={{textAlign:'right'}}>Amount</th></tr></thead>
                <tbody>
                  <tr>
                    <td>Room Rent ({invoiceDetail.nights} nights @ Rs. {invoiceDetail.room?.price}/night)</td>
                    <td style={{textAlign:'right'}}>Rs. {invoiceDetail.roomCharges?.toLocaleString()}</td>
                  </tr>
                  {/* Extra services agar hain to dikhao */}
                  {invoiceDetail.services?.map((s, i) => (
                    <tr key={i}><td>{s.type}: {s.description}</td><td style={{textAlign:'right'}}>Rs. {s.amount?.toLocaleString()}</td></tr>
                  ))}
                  <tr style={{borderTop:'2px solid #ddd'}}>
                    <td><strong>Subtotal</strong></td>
                    <td style={{textAlign:'right'}}><strong>Rs. {invoiceDetail.subtotal?.toLocaleString()}</strong></td>
                  </tr>
                  <tr>
                    <td>Tax ({invoiceDetail.taxRate}%)</td>
                    <td style={{textAlign:'right'}}>Rs. {invoiceDetail.tax?.toLocaleString()}</td>
                  </tr>
                  <tr className="total" style={{background:'#f9f9f9'}}>
                    <td>Grand Total</td>
                    <td style={{textAlign:'right'}}>Rs. {invoiceDetail.grandTotal?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
