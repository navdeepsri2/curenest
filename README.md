# 🏥 [Curenest] - Medical Store Web Application

## 📖 About the Project
[Curenest] is a secure, user-friendly web application designed to bridge the gap between local pharmacies and patients. It provides a seamless digital platform for users to browse health products, securely upload prescriptions for verification, and manage their healthcare needs from the comfort of their homes. 

The goal of this project is to make pharmacy access more convenient, transparent, and empathetic to patients who may be unwell or lack mobility, while providing pharmacy administrators with the tools they need to manage orders efficiently.

## ✨ Key Features

### For Patients (Users):
* **Secure Prescription Upload:** Users can safely upload images or PDFs of their medical prescriptions for pharmacist review.
* **Intuitive Product Catalog:** Browse Over-The-Counter (OTC) medicines, wellness products, and first-aid supplies with ease.
* **Smart Cart & Checkout:** A streamlined, accessible checkout process.
* **Order Tracking:** Real-time updates on prescription approval and delivery status.

### For Pharmacy Staff (Admins):
* **Prescription Verification Dashboard:** A secure portal to review, approve, or reject uploaded prescriptions before fulfillment.
* **Inventory Management:** Track stock levels and update product availability.
* **Order Management:** Process user orders and manage delivery routing.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, React Router, Tailwind CSS
* **Backend/API:** Flask (Python)
* **Database:** SQLite for app data and product listings, Firebase Firestore for prescription metadata
* **Authentication:** Clerk for user authentication
* **Storage:** Cloudinary for prescription/image uploads, with Firestore storing the upload references and metadata
* **Additional Libraries:** Firebase SDK, Framer Motion, Lenis, Lucide React

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* npm
  ```sh
  npm install npm@latest -g
