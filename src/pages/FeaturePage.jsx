import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const featureContent = {
  'licensed-pharmacy': {
    title: 'Licensed & Regulated Pharmacy',
    icon: '🏥',
    theme: '#e8f5f0',
    color: '#0a5c44',
    content: (
      <>
        <p>At CureNest, your health and safety are our utmost priorities. We are a fully certified and licensed pharmacy, strictly regulated by the <strong>Pharmacy Council of India (PCI)</strong>.</p>
        
        <h3>What this means for you:</h3>
        <ul>
          <li><strong>100% Genuine Medications:</strong> We source all our products directly from manufacturers or authorized distributors, eliminating the risk of counterfeit drugs.</li>
          <li><strong>Professional Oversight:</strong> Every prescription and order is carefully reviewed by our registered, in-house pharmacists before being dispensed.</li>
          <li><strong>Regulatory Compliance:</strong> We adhere strictly to the guidelines set by the Drugs and Cosmetics Act, ensuring best practices in storage, handling, and dispensing of medicines.</li>
          <li><strong>Traceability:</strong> Every batch we sell can be traced back to its origin, giving you complete peace of mind.</li>
        </ul>

        <p>When you choose CureNest, you are choosing a pharmacy that meets the highest national standards for healthcare delivery.</p>
      </>
    )
  },
  'gst-invoice': {
    title: '100% Transparent GST Invoicing',
    icon: '🧾',
    theme: '#f0fff4',
    color: '#2f9e44',
    content: (
      <>
        <p>Transparency is a core value at CureNest. We believe you have the right to know exactly what you are paying for, which is why we provide a <strong>detailed, official GST invoice</strong> with every single order.</p>
        
        <h3>Benefits of our billing system:</h3>
        <ul>
          <li><strong>Tax Compliance:</strong> Our invoices contain our official GSTIN and a clear breakdown of CGST, SGST, and IGST as applicable.</li>
          <li><strong>Reimbursements:</strong> If you have corporate health insurance or flexible spending accounts, our official invoices are fully valid for claims and reimbursements.</li>
          <li><strong>No Hidden Charges:</strong> What you see at checkout is exactly what is billed. We clearly separate the cost of medicines, delivery fees, and taxes.</li>
          <li><strong>Digital Records:</strong> Your invoices are securely stored in your account dashboard, allowing you to download them anytime you need for medical or financial record-keeping.</li>
        </ul>
      </>
    )
  },
  'quality-checked': {
    title: 'Rigorous Quality Checks',
    icon: '🔬',
    theme: '#f0f4ff',
    color: '#4c6ef5',
    content: (
      <>
        <p>We go above and beyond standard pharmacy practices to ensure that every medicine you receive is highly effective and perfectly safe. Our <strong>3-Step Quality Check Process</strong> guarantees excellence.</p>
        
        <h3>Our Quality Assurance Protocol:</h3>
        <ul>
          <li><strong>Expiry Date Verification:</strong> Our automated warehouse systems ensure that no near-expiry medicines are ever dispatched to you. We guarantee maximum shelf life.</li>
          <li><strong>Temperature Control (Cold Chain):</strong> Sensitive medications like insulin, vaccines, and certain eye drops are stored and transported in specialized cold-chain packaging (2°C to 8°C) to maintain their efficacy.</li>
          <li><strong>Physical Inspection:</strong> Before packing, our pharmacists physically inspect the packaging for any tampering, seal breakage, or damage.</li>
          <li><strong>Barcode Authentication:</strong> We scan manufacturer barcodes to cross-verify the batch number and authenticity against national databases.</li>
        </ul>
      </>
    )
  },
  'live-tracking': {
    title: 'Real-Time Order Tracking',
    icon: '📱',
    theme: '#fffbf0',
    color: '#f59f00',
    content: (
      <>
        <p>We know that when you order medicines, time is of the essence. That's why we've invested in a state-of-the-art logistics network that provides you with <strong>real-time, GPS-enabled live tracking</strong>.</p>
        
        <h3>How our tracking system works:</h3>
        <ul>
          <li><strong>Instant Updates:</strong> From the moment your prescription is verified to the moment the package reaches your door, you receive live status updates via SMS and email.</li>
          <li><strong>Live Map View:</strong> Once the delivery executive is dispatched, you can track their exact location on a live map within the CureNest app or website.</li>
          <li><strong>Accurate ETA:</strong> Our AI-driven routing engine calculates traffic and distance to give you a highly accurate Expected Time of Arrival (ETA).</li>
          <li><strong>Secure Handoff:</strong> For prescription medications, you will receive a secure OTP that must be shared with the delivery executive to ensure the package is handed only to you.</li>
        </ul>
      </>
    )
  }
};

export default function FeaturePage() {
  const { featureId } = useParams();
  const feature = featureContent[featureId];

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [featureId]);

  if (!feature) {
    return (
      <div className="pg-hd" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Feature not found</h2>
        <Link to="/" className="btn-g" style={{ marginTop: '20px', display: 'inline-block' }}>Go back Home</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="feat-hero" style={{ backgroundColor: feature.theme }}>
        <div className="feat-hero-content">
          <div className="feat-icon" style={{ color: feature.color }}>{feature.icon}</div>
          <h1>{feature.title}</h1>
          <div className="crumb" style={{ justifyContent: 'center', marginTop: '16px' }}>
            <Link to="/">Home</Link> / Why Choose Us / {feature.title}
          </div>
        </div>
      </div>

      <div className="feat-body">
        <div className="feat-article">
          {feature.content}
        </div>
        
        <div className="feat-cta">
          <h3>Experience the CureNest Difference</h3>
          <p>Join thousands of Indians who trust us with their health.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <Link to="/products" className="btn-g">Shop Medicines</Link>
            <Link to="/upload-prescription" className="btn-o">Upload Prescription</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
