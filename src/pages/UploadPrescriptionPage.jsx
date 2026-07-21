import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useStore } from '../context/StoreContext';

export default function UploadPrescriptionPage() {
  const { userId, isLoaded } = useAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedList, setUploadedList] = useState([]);

  // Fetch prescription history
  useEffect(() => {
    if (!isLoaded) return;
    if (userId) {
      const q = query(collection(db, 'prescriptions'), where('userId', '==', userId));
      const unsub = onSnapshot(q, (querySnapshot) => {
        const fetchedDocs = [];
        querySnapshot.forEach((doc) => {
          fetchedDocs.push({ id: doc.id, ...doc.data() });
        });
        // Sort descending
        fetchedDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUploadedList(fetchedDocs);
      });
      return () => unsub();
    }
  }, [userId, isLoaded]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Validate file size (max 5MB)
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        showToast('File too large. Max size is 5MB', 'error');
        return;
      }
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!userId) {
      showToast('You must be logged in to upload prescriptions', 'error');
      navigate('/login');
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      showToast('Cloudinary environment variables missing!', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `prescriptions/${userId}`); // Organize uploads by user

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const downloadURL = response.secure_url;
        
        // Save metadata to Firestore
        await addDoc(collection(db, 'prescriptions'), {
          userId: userId,
          filename: selectedFile.name,
          downloadURL: downloadURL,
          notes: notes,
          status: 'Pending Verification',
          createdAt: new Date().toISOString(),
          uploadedAt: new Date().toLocaleDateString('en-IN')
        });

        setIsUploading(false);
        setSelectedFile(null);
        setNotes('');
        showToast('Prescription uploaded successfully!');
      } else {
        console.error('Upload failed:', xhr.responseText);
        showToast('Upload failed. Try again later.', 'error');
        setIsUploading(false);
      }
    };

    xhr.onerror = () => {
      console.error('Upload failed due to network error.');
      showToast('Upload failed. Network error.', 'error');
      setIsUploading(false);
    };

    xhr.send(formData);
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
          style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isUploading}
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
              disabled={isUploading}
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
              disabled={isUploading}
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
            
            {isUploading && (
              <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '8px', overflow: 'hidden', marginTop: '12px' }}>
                <div style={{ height: '8px', backgroundColor: 'var(--primary)', width: `${uploadProgress}%`, transition: 'width 0.3s' }}></div>
              </div>
            )}
            
            <button type="submit" className="btn-g" disabled={isUploading} style={{ marginTop: '10px', opacity: isUploading ? 0.7 : 1 }}>
              {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Prescription'}
            </button>
          </form>
        )}

        {/* Uploaded History List */}
        {uploadedList.length > 0 && (
          <div style={{ marginTop: '26px', background: 'white', borderRadius: 'var(--r)', padding: '20px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Your Uploaded Prescriptions</h3>
            {uploadedList.map((doc) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '24px' }}>
                  {doc.filename.endsWith('.pdf') ? '📑' : '🖼️'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>
                    <a href={doc.downloadURL} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {doc.filename}
                    </a>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--fog)' }}>Uploaded {doc.uploadedAt}</div>
                  {doc.notes && <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '4px', fontStyle: 'italic' }}>Note: {doc.notes}</div>}
                </div>
                <span style={{ background: doc.status === 'Verified' ? '#dcfce7' : '#fef3c7', color: doc.status === 'Verified' ? '#166534' : '#92400e', padding: '4px 9px', borderRadius: '50px', fontSize: '12px', fontWeight: 700 }}>
                  {doc.status === 'Verified' ? '✅' : '⏳'} {doc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
