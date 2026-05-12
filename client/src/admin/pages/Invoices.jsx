// Invoices.jsx - Manages guest billing, tax calculations, and printable invoice generation
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiDocumentText, HiPrinter, HiX, HiDownload } from 'react-icons/hi';
import { jsPDF } from 'jspdf';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]); // List of generated invoices
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Toggle for detail view
  const [invoiceDetail, setInvoiceDetail] = useState(null); // Data for the specific selected invoice
  const [detailLoading, setDetailLoading] = useState(false);

  // ============ INVOICE SUMMARY ACQUISITION ============
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get('/invoices');
        if (res.data.success) setInvoices(res.data.invoices);
      } catch (err) { 
        console.error('Failed to retrieve invoices:', err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchInvoices();
  }, []);

  // ============ FETCH INDIVIDUAL INVOICE SPECIFICS ============
  const viewInvoice = async (bookingId) => {
    setDetailLoading(true);
    try {
      const res = await API.get(`/invoices/${bookingId}`);
      if (res.data.success) {
        setInvoiceDetail(res.data.invoice);
        setSelectedInvoice(true);
      }
    } catch (err) { 
      console.error('Failed to load invoice details:', err); 
    } finally { 
      setDetailLoading(false); 
    }
  };

  // ============ PDF DOCUMENT GENERATION ============
  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    
    // Header Configuration
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('LUXURYSTAY HOTEL INVOICE', margin, 30);
    
    doc.setDrawColor(0, 209, 255); // accent color
    doc.setLineWidth(1);
    doc.line(margin, 35, 190, 35);
    
    // Core Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Invoice ID: ${invoiceDetail.invoiceNumber}`, margin, 50);
    doc.text(`Guest: ${invoiceDetail.guestName}`, margin, 58);
    doc.text(`Room: ${invoiceDetail.room?.roomNumber} (${invoiceDetail.room?.type})`, margin, 66);
    doc.text(`Generated On: ${new Date(invoiceDetail.generatedAt).toLocaleDateString()}`, 140, 50);
    
    // Transaction Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, 80, 170, 10, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Description of Charges', margin + 5, 87);
    doc.text('Amount (Rs.)', 150, 87);
    
    // Transaction Table Body
    doc.setFont('helvetica', 'normal');
    let y = 100;
    
    // Base Room Charges
    doc.text(`Room Rent (${invoiceDetail.nights} nights)`, margin + 5, y);
    doc.text(`${invoiceDetail.roomCharges?.toLocaleString()}`, 150, y);
    y += 10;
    
    // Supplementary Services
    invoiceDetail.services?.forEach(s => {
      doc.text(`${s.type}: ${s.description}`, margin + 5, y);
      doc.text(`${s.amount?.toLocaleString()}`, 150, y);
      y += 10;
    });
    
    // Financial Totals Footer
    doc.line(margin, y, 190, y);
    y += 15;
    doc.text('Subtotal:', 120, y);
    doc.text(`${invoiceDetail.subtotal?.toLocaleString()}`, 150, y);
    y += 10;
    doc.text(`Tax (${invoiceDetail.taxRate}%):`, 120, y);
    doc.text(`${invoiceDetail.tax?.toLocaleString()}`, 150, y);
    y += 15;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 194, 168); // accent green
    doc.text('Grand Total:', 100, y);
    doc.text(`Rs. ${invoiceDetail.grandTotal?.toLocaleString()}`, 150, y);
    
    // Finalize and Download
    doc.save(`${invoiceDetail.invoiceNumber}_invoice.pdf`);
  };

  // ============ BROWSER PRINT UTILITY ============
  const printInvoice = () => {
    const printContent = document.getElementById('invoice-print');
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`<html><head><title>Invoice - ${invoiceDetail?.invoiceNumber}</title>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
        h1 { color: #0f172a; border-bottom: 2px solid #00d1ff; padding-bottom: 15px; margin-bottom: 30px; }
        .details-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8fafc; text-align: left; padding: 15px; border-bottom: 2px solid #e2e8f0; }
        td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .total-row { font-weight: bold; font-size: 1.25em; background: #f1f5f9; }
        .accent { color: #00c2a8; }
      </style></head><body>${printContent.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="invoices-page">
      <div className="page-header">
        <div><h1>💳 Billing & Invoices</h1><p className="page-subtitle">Oversee guest financial transactions and generate professional receipts</p></div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Invoice #</th><th>Primary Guest</th><th>Room</th><th>Stay Period</th><th>Revenue</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? invoices.map(inv => (
                <tr key={inv.bookingId}>
                  <td><strong>{inv.invoiceNumber}</strong></td>
                  <td>{inv.guestName}</td>
                  <td>Room {inv.roomNumber}</td>
                  <td>{new Date(inv.checkIn).toLocaleDateString()} — {new Date(inv.checkOut).toLocaleDateString()}</td>
                  <td><span className="badge-success-light">Rs. {inv.totalAmount?.toLocaleString()}</span></td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <button className="btn-sm btn-primary" onClick={() => viewInvoice(inv.bookingId)}>
                      <HiDocumentText /> View Detailed Bill
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-state">No transaction records found in the ledger.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Invoice Preview Modal */}
      {selectedInvoice && invoiceDetail && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice Overview</h2>
              <div style={{display:'flex',gap:'12px'}}>
                <button className="btn btn-secondary" onClick={downloadPDF}><HiDownload /> Export PDF</button>
                <button className="btn btn-primary" onClick={printInvoice}><HiPrinter /> Print Receipt</button>
                <button className="btn-close" onClick={() => setSelectedInvoice(null)}><HiX /></button>
              </div>
            </div>
            <div className="modal-form" id="invoice-print" style={{padding: '40px', background: '#fff', color: '#333', borderRadius: '12px'}}>
              <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>LuxuryStay International</h1>
              <p style={{color: '#666', marginBottom: '30px'}}>Premier Hospitality & Leisure Group</p>
              
              <div style={{display:'flex',justifyContent:'space-between', marginBottom:'40px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                <div>
                  <p style={{margin: '4px 0'}}><strong>Invoice Identification:</strong> {invoiceDetail.invoiceNumber}</p>
                  <p style={{margin: '4px 0'}}><strong>Guest Name:</strong> {invoiceDetail.guestName}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{margin: '4px 0'}}><strong>Date of Issue:</strong> {new Date(invoiceDetail.generatedAt).toLocaleDateString()}</p>
                  <p style={{margin: '4px 0'}}><strong>Room Assignment:</strong> {invoiceDetail.room?.roomNumber} ({invoiceDetail.room?.type})</p>
                </div>
              </div>

              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid #333'}}>
                    <th style={{textAlign: 'left', padding: '12px'}}>Description of Services</th>
                    <th style={{textAlign: 'right', padding: '12px'}}>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '12px'}}>Base Accommodation Fee ({invoiceDetail.nights} nights @ Rs. {invoiceDetail.room?.price}/night)</td>
                    <td style={{textAlign: 'right', padding: '12px'}}>{invoiceDetail.roomCharges?.toLocaleString()}</td>
                  </tr>
                  {/* Supplementary Service Enumeration */}
                  {invoiceDetail.services?.map((s, i) => (
                    <tr key={i}>
                      <td style={{padding: '12px'}}>{s.type}: {s.description}</td>
                      <td style={{textAlign: 'right', padding: '12px'}}>{s.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr style={{borderTop: '2px solid #eee', fontWeight: '600'}}>
                    <td style={{padding: '12px'}}>Subtotal</td>
                    <td style={{textAlign: 'right', padding: '12px'}}>{invoiceDetail.subtotal?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={{padding: '12px'}}>Applicable Sales Tax ({invoiceDetail.taxRate}%)</td>
                    <td style={{textAlign: 'right', padding: '12px'}}>{invoiceDetail.tax?.toLocaleString()}</td>
                  </tr>
                  <tr style={{background: '#f8fafc', fontWeight: 'bold', fontSize: '1.2rem'}}>
                    <td style={{padding: '20px', borderTop: '2px solid #00d1ff'}}>Grand Total Payable</td>
                    <td style={{textAlign: 'right', padding: '20px', color: '#00c2a8', borderTop: '2px solid #00d1ff'}}>Rs. {invoiceDetail.grandTotal?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{marginTop: '50px', textAlign: 'center', color: '#999', fontSize: '0.9rem'}}>
                <p>Thank you for choosing LuxuryStay. We look forward to welcoming you again.</p>
                <p>This is a computer-generated document and requires no physical signature.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
