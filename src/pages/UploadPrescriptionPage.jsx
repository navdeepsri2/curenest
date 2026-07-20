import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function UploadPrescriptionPage() {
  const { user } = useStore();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedList, setUploadedList] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDoc = {
      filename: selectedFile.name,
      uploadedAt: new Date().toLocaleDateString('en-IN'),
      status: 'Pending',
      notes: notes,
    };

    setUploadedList([newDoc, ...uploadedList]);
    setIsUploaded(true);
    setSelectedFile(null);
    setNotes('');
  };

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / Upload Prescription
        </div>
        <h1>📋 Upload Prescription</h1>
        <p>Upload doctor's prescription — pharmacists verify and arrange delivery</p>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '34px 44px' }}>
        {/* Step Cards */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '32px' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: 'var(--r)', padding: '17px', textAlign: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '28px', marginBottom: '7px' }}>📸</div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>Upload</h4>
            <p style={{ fontSize: '12px', color: 'var(--slate)' }}>Photo or PDF</p>
          </div>

          <div style={{ flex: 1, background: 'white', borderRadius: 'var(--r)', padding: '17px', textAlign: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '28px', marginBottom: '7px' }}>🔍</div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>Verify</h4>
            <p style={{ fontSize: '12px', color: 'var(--slate)' }}>Pharmacist checks</p>
          </div>

          <div style={{ flex: 1, background: 'white', borderRadius: 'var(--r)', padding: '17px', textAlign: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '28px', marginBottom: '7px' }}>🚚</div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px' }}>Delivery</h4>
            <p style={{ fontSize: '12px', color: 'var(--slate)' }}>To your door</p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className="up-zone"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>📤</div>
          <h3>Click or drag & drop prescription</h3>
          <p style={{ marginTop: '5px' }}>JPG, PNG, PDF — Max 5MB</p>
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="f-prev">
            <span style={{ fontSize: '20px' }}>📄</span>
            <span style={{ flex: 1 }}>{selectedFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--coral)', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload Form */}
        {selectedFile && (
          <form onSubmit={handleUpload} style={{ marginTop: '16px' }}>
            <textarea
              placeholder="Notes for pharmacist (preferred brands, allergies...)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '11px 14px',
                border: '2px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '13.5px',
                outline: 'none',
              }}
            ></textarea>
            <button type="submit" className="btn-g" style={{ marginTop: '10px' }}>
              Upload Prescription
            </button>
          </form>
        )}

        {/* Uploaded History List */}
        {(isUploaded || uploadedList.length > 0) && (
          <div style={{ marginTop: '26px', background: 'white', borderRadius: 'var(--r)', padding: '20px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Your Uploaded Prescriptions</h3>
            {uploadedList.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '24px' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{doc.filename}</div>
                  <div style={{ fontSize: '12px', color: 'var(--fog)' }}>Uploaded {doc.uploadedAt}</div>
                </div>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 9px', borderRadius: '50px', fontSize: '12px', fontWeight: 700 }}>
                  ⏳ {doc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
