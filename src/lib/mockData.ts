// ── Mock Data for SmartERP Pro Cloud ──

export const mockProducts = [
  { id: 'P001', name: 'Paracetamol 500mg', category: 'Medicine', hsn: '30049099', price: 25, mrp: 30, stock: 450, minStock: 50, batch: 'B2026-01', expiry: '2027-06-15', gst: 12, barcode: '8901234567890', supplier: 'Sun Pharma', unit: 'Strip', warehouse: 'Main' },
  { id: 'P002', name: 'Amoxicillin 250mg', category: 'Medicine', hsn: '30041000', price: 85, mrp: 110, stock: 230, minStock: 30, batch: 'B2026-02', expiry: '2027-03-20', gst: 12, barcode: '8901234567891', supplier: 'Cipla Ltd', unit: 'Strip', warehouse: 'Main' },
  { id: 'P003', name: 'ORS Sachet', category: 'Medicine', hsn: '30049099', price: 12, mrp: 18, stock: 890, minStock: 100, batch: 'B2026-03', expiry: '2028-01-10', gst: 5, barcode: '8901234567892', supplier: 'Zydus', unit: 'Sachet', warehouse: 'Main' },
  { id: 'P004', name: 'Dettol Antiseptic 500ml', category: 'Healthcare', hsn: '34011100', price: 180, mrp: 220, stock: 120, minStock: 20, batch: 'B2026-04', expiry: '2028-06-01', gst: 18, barcode: '8901234567893', supplier: 'Reckitt', unit: 'Bottle', warehouse: 'Store B' },
  { id: 'P005', name: 'Vitamin D3 Tablets', category: 'Supplement', hsn: '21069099', price: 250, mrp: 320, stock: 18, minStock: 25, batch: 'B2026-05', expiry: '2027-09-30', gst: 18, barcode: '8901234567894', supplier: 'Abbott', unit: 'Bottle', warehouse: 'Main' },
  { id: 'P006', name: 'N95 Mask (Pack of 5)', category: 'Safety', hsn: '63079090', price: 150, mrp: 199, stock: 340, minStock: 50, batch: 'B2026-06', expiry: '2029-12-31', gst: 5, barcode: '8901234567895', supplier: 'Venus Safety', unit: 'Pack', warehouse: 'Store B' },
  { id: 'P007', name: 'Digital Thermometer', category: 'Device', hsn: '90251990', price: 180, mrp: 250, stock: 55, minStock: 10, batch: 'B2026-07', expiry: '2030-01-01', gst: 12, barcode: '8901234567896', supplier: 'Omron', unit: 'Piece', warehouse: 'Main' },
  { id: 'P008', name: 'Cetrizine 10mg', category: 'Medicine', hsn: '30049099', price: 15, mrp: 22, stock: 680, minStock: 80, batch: 'B2026-08', expiry: '2027-11-20', gst: 12, barcode: '8901234567897', supplier: 'Dr Reddy', unit: 'Strip', warehouse: 'Main' },
  { id: 'P009', name: 'Protein Powder 1kg', category: 'Supplement', hsn: '21069099', price: 1200, mrp: 1599, stock: 35, minStock: 10, batch: 'B2026-09', expiry: '2027-08-01', gst: 18, barcode: '8901234567898', supplier: 'MuscleBlaze', unit: 'Pack', warehouse: 'Store B' },
  { id: 'P010', name: 'Surgical Gloves (Box)', category: 'Safety', hsn: '40151200', price: 320, mrp: 450, stock: 5, minStock: 15, batch: 'B2026-10', expiry: '2028-05-15', gst: 12, barcode: '8901234567899', supplier: 'Supermax', unit: 'Box', warehouse: 'Main' },
  { id: 'P011', name: 'Azithromycin 500mg', category: 'Medicine', hsn: '30049099', price: 95, mrp: 130, stock: 190, minStock: 40, batch: 'B2026-11', expiry: '2027-04-18', gst: 12, barcode: '8901234567900', supplier: 'Alkem Labs', unit: 'Strip', warehouse: 'Main' },
  { id: 'P012', name: 'BP Monitor Digital', category: 'Device', hsn: '90181900', price: 1500, mrp: 2200, stock: 22, minStock: 5, batch: 'B2026-12', expiry: '2031-01-01', gst: 12, barcode: '8901234567901', supplier: 'Omron', unit: 'Piece', warehouse: 'Store B' },
];

export const mockCustomers = [
  { id: 'C001', name: 'Rahul Verma', phone: '9876543210', email: 'rahul@gmail.com', address: '123 MG Road, Delhi', gst: '07AABCU9603R1ZP', outstanding: 12500, totalPurchase: 85000, loyaltyPoints: 850, lastPurchase: '2026-05-18', type: 'Regular' },
  { id: 'C002', name: 'Priya Singh', phone: '9876543211', email: 'priya@gmail.com', address: '45 Park Street, Mumbai', gst: '', outstanding: 0, totalPurchase: 32000, loyaltyPoints: 320, lastPurchase: '2026-05-17', type: 'Walk-in' },
  { id: 'C003', name: 'Amit Patel', phone: '9876543212', email: 'amit@gmail.com', address: '78 Ashram Road, Ahmedabad', gst: '24AABCU9603R1ZP', outstanding: 45000, totalPurchase: 250000, loyaltyPoints: 2500, lastPurchase: '2026-05-19', type: 'B2B' },
  { id: 'C004', name: 'Sneha Reddy', phone: '9876543213', email: 'sneha@gmail.com', address: '12 Jubilee Hills, Hyderabad', gst: '', outstanding: 3200, totalPurchase: 18000, loyaltyPoints: 180, lastPurchase: '2026-05-15', type: 'Regular' },
  { id: 'C005', name: 'Rajesh Kumar', phone: '9876543214', email: 'rajesh@gmail.com', address: '90 Civil Lines, Jaipur', gst: '08AABCU9603R1ZP', outstanding: 78000, totalPurchase: 560000, loyaltyPoints: 5600, lastPurchase: '2026-05-19', type: 'B2B' },
  { id: 'C006', name: 'Meera Nair', phone: '9876543215', email: 'meera@gmail.com', address: '34 Marine Drive, Kochi', gst: '', outstanding: 0, totalPurchase: 9500, loyaltyPoints: 95, lastPurchase: '2026-05-10', type: 'Walk-in' },
];

export const mockSuppliers = [
  { id: 'S001', name: 'Sun Pharma Ltd', contact: 'Vikram Mehta', phone: '9800000001', email: 'vikram@sunpharma.com', gst: '27AABCS1429B1ZT', address: 'Mumbai, Maharashtra', outstanding: 125000, totalPurchase: 890000, rating: 4.5 },
  { id: 'S002', name: 'Cipla Ltd', contact: 'Anita Desai', phone: '9800000002', email: 'anita@cipla.com', gst: '27AABCC1234B1ZT', address: 'Mumbai, Maharashtra', outstanding: 45000, totalPurchase: 560000, rating: 4.8 },
  { id: 'S003', name: 'Zydus Lifesciences', contact: 'Hemant Joshi', phone: '9800000003', email: 'hemant@zydus.com', gst: '24AABCZ1234B1ZT', address: 'Ahmedabad, Gujarat', outstanding: 0, totalPurchase: 340000, rating: 4.2 },
  { id: 'S004', name: 'Abbott India', contact: 'Sanjay Gupta', phone: '9800000004', email: 'sanjay@abbott.com', gst: '27AABCA1234B1ZT', address: 'Mumbai, Maharashtra', outstanding: 78000, totalPurchase: 450000, rating: 4.6 },
  { id: 'S005', name: 'Dr Reddy Laboratories', contact: 'Lakshmi Rao', phone: '9800000005', email: 'lakshmi@drreddy.com', gst: '36AABCD1234B1ZT', address: 'Hyderabad, Telangana', outstanding: 22000, totalPurchase: 290000, rating: 4.3 },
];

export const mockEmployees = [
  { id: 'E001', name: 'Ravi Shankar', role: 'manager', email: 'ravi@smarterp.in', phone: '9700000001', salary: 35000, department: 'Sales', joinDate: '2024-03-15', status: 'active', attendance: 96, lastLogin: '2026-05-19 09:15' },
  { id: 'E002', name: 'Pooja Mishra', role: 'employee', email: 'pooja@smarterp.in', phone: '9700000002', salary: 22000, department: 'Billing', joinDate: '2024-06-20', status: 'active', attendance: 92, lastLogin: '2026-05-19 09:30' },
  { id: 'E003', name: 'Karan Dev', role: 'employee', email: 'karan@smarterp.in', phone: '9700000003', salary: 20000, department: 'Inventory', joinDate: '2025-01-10', status: 'active', attendance: 88, lastLogin: '2026-05-18 18:45' },
  { id: 'E004', name: 'Anjali Rao', role: 'manager', email: 'anjali@smarterp.in', phone: '9700000004', salary: 40000, department: 'Accounting', joinDate: '2023-11-01', status: 'active', attendance: 98, lastLogin: '2026-05-19 08:50' },
  { id: 'E005', name: 'Deepak Sharma', role: 'employee', email: 'deepak@smarterp.in', phone: '9700000005', salary: 18000, department: 'Delivery', joinDate: '2025-09-05', status: 'on_leave', attendance: 78, lastLogin: '2026-05-16 17:00' },
];

export const mockInvoices = [
  { id: 'INV-2026-001', customer: 'Rahul Verma', date: '2026-05-19', amount: 3450, gst: 414, total: 3864, status: 'paid', items: 5, paymentMode: 'UPI' },
  { id: 'INV-2026-002', customer: 'Amit Patel', date: '2026-05-19', amount: 12800, gst: 1536, total: 14336, status: 'pending', items: 8, paymentMode: 'Credit' },
  { id: 'INV-2026-003', customer: 'Priya Singh', date: '2026-05-18', amount: 890, gst: 107, total: 997, status: 'paid', items: 3, paymentMode: 'Cash' },
  { id: 'INV-2026-004', customer: 'Sneha Reddy', date: '2026-05-18', amount: 5600, gst: 672, total: 6272, status: 'partial', items: 6, paymentMode: 'Card' },
  { id: 'INV-2026-005', customer: 'Rajesh Kumar', date: '2026-05-17', amount: 45000, gst: 5400, total: 50400, status: 'paid', items: 15, paymentMode: 'Bank Transfer' },
  { id: 'INV-2026-006', customer: 'Meera Nair', date: '2026-05-17', amount: 2100, gst: 252, total: 2352, status: 'paid', items: 4, paymentMode: 'UPI' },
  { id: 'INV-2026-007', customer: 'Rahul Verma', date: '2026-05-16', amount: 7800, gst: 936, total: 8736, status: 'overdue', items: 10, paymentMode: 'Credit' },
  { id: 'INV-2026-008', customer: 'Amit Patel', date: '2026-05-15', amount: 22000, gst: 2640, total: 24640, status: 'paid', items: 12, paymentMode: 'Bank Transfer' },
];

export const mockExpenses = [
  { id: 'EX001', date: '2026-05-19', category: 'Rent', description: 'Shop rent for May 2026', amount: 25000, paymentMode: 'Bank Transfer' },
  { id: 'EX002', date: '2026-05-18', category: 'Electricity', description: 'Electricity bill May', amount: 4500, paymentMode: 'UPI' },
  { id: 'EX003', date: '2026-05-17', category: 'Salary', description: 'Staff salary advance - Pooja', amount: 10000, paymentMode: 'Cash' },
  { id: 'EX004', date: '2026-05-15', category: 'Transport', description: 'Delivery vehicle fuel', amount: 3200, paymentMode: 'Cash' },
  { id: 'EX005', date: '2026-05-14', category: 'Maintenance', description: 'AC repair shop', amount: 2800, paymentMode: 'Cash' },
  { id: 'EX006', date: '2026-05-12', category: 'Packaging', description: 'Carry bags & packaging material', amount: 1500, paymentMode: 'UPI' },
];

export const mockSalesData = [
  { month: 'Jan', sales: 285000, purchases: 195000, profit: 90000, expenses: 45000 },
  { month: 'Feb', sales: 310000, purchases: 210000, profit: 100000, expenses: 48000 },
  { month: 'Mar', sales: 340000, purchases: 225000, profit: 115000, expenses: 42000 },
  { month: 'Apr', sales: 295000, purchases: 200000, profit: 95000, expenses: 52000 },
  { month: 'May', sales: 380000, purchases: 250000, profit: 130000, expenses: 46000 },
  { month: 'Jun', sales: 350000, purchases: 230000, profit: 120000, expenses: 50000 },
  { month: 'Jul', sales: 420000, purchases: 270000, profit: 150000, expenses: 48000 },
  { month: 'Aug', sales: 395000, purchases: 260000, profit: 135000, expenses: 55000 },
  { month: 'Sep', sales: 445000, purchases: 285000, profit: 160000, expenses: 47000 },
  { month: 'Oct', sales: 480000, purchases: 310000, profit: 170000, expenses: 51000 },
  { month: 'Nov', sales: 520000, purchases: 335000, profit: 185000, expenses: 53000 },
  { month: 'Dec', sales: 560000, purchases: 360000, profit: 200000, expenses: 58000 },
];

export const mockDailySales = [
  { day: '13 May', amount: 28500 },
  { day: '14 May', amount: 32100 },
  { day: '15 May', amount: 19800 },
  { day: '16 May', amount: 41200 },
  { day: '17 May', amount: 35600 },
  { day: '18 May', amount: 27400 },
  { day: '19 May', amount: 38900 },
];

export const mockNotifications = [
  { id: 'N001', type: 'stock', title: 'Low Stock Alert', message: 'Surgical Gloves (Box) - Only 5 units left', time: '2 min ago', read: false },
  { id: 'N002', type: 'payment', title: 'Payment Received', message: '₹50,400 from Rajesh Kumar via Bank Transfer', time: '15 min ago', read: false },
  { id: 'N003', type: 'expiry', title: 'Expiry Warning', message: 'Amoxicillin 250mg batch B2026-02 expires in 10 months', time: '1 hr ago', read: true },
  { id: 'N004', type: 'order', title: 'New Order', message: 'Purchase order PO-2026-045 created for Sun Pharma', time: '2 hrs ago', read: true },
  { id: 'N005', type: 'system', title: 'Backup Complete', message: 'Cloud backup completed successfully at 3:00 AM', time: '5 hrs ago', read: true },
  { id: 'N006', type: 'stock', title: 'Low Stock Alert', message: 'Vitamin D3 Tablets - Only 18 units left (min: 25)', time: '6 hrs ago', read: true },
];

export const mockPurchaseOrders = [
  { id: 'PO-2026-041', supplier: 'Sun Pharma Ltd', date: '2026-05-19', amount: 125000, status: 'received', items: 12 },
  { id: 'PO-2026-042', supplier: 'Cipla Ltd', date: '2026-05-18', amount: 78000, status: 'shipped', items: 8 },
  { id: 'PO-2026-043', supplier: 'Abbott India', date: '2026-05-17', amount: 45000, status: 'pending', items: 5 },
  { id: 'PO-2026-044', supplier: 'Dr Reddy Labs', date: '2026-05-16', amount: 92000, status: 'received', items: 10 },
  { id: 'PO-2026-045', supplier: 'Zydus Lifesciences', date: '2026-05-15', amount: 34000, status: 'cancelled', items: 4 },
];

export const mockAuditLogs = [
  { id: 'A001', timestamp: '2026-05-19 10:30:15', user: 'Arjun Sharma', action: 'Created Invoice', details: 'INV-2026-001 for Rahul Verma - ₹3,864', ip: '192.168.1.100' },
  { id: 'A002', timestamp: '2026-05-19 10:15:30', user: 'Pooja Mishra', action: 'Updated Stock', details: 'Paracetamol 500mg: +200 units (Batch B2026-01)', ip: '192.168.1.101' },
  { id: 'A003', timestamp: '2026-05-19 09:45:00', user: 'Ravi Shankar', action: 'Approved PO', details: 'PO-2026-042 for Cipla Ltd - ₹78,000', ip: '192.168.1.102' },
  { id: 'A004', timestamp: '2026-05-19 09:30:00', user: 'Arjun Sharma', action: 'Login', details: 'Admin login from Chrome/Windows', ip: '192.168.1.100' },
  { id: 'A005', timestamp: '2026-05-18 18:30:00', user: 'Karan Dev', action: 'Stock Transfer', details: '50 units of N95 Mask from Main to Store B', ip: '192.168.1.103' },
];

export const planFeatures = {
  free: { maxProducts: 50, maxBills: 20, cloudBackup: false, aiReports: false, whatsapp: false, multiUser: false, multiBranch: false, api: false, mobileApp: false },
  basic: { maxProducts: 500, maxBills: -1, cloudBackup: false, aiReports: false, whatsapp: false, multiUser: false, multiBranch: false, api: false, mobileApp: false },
  pro: { maxProducts: -1, maxBills: -1, cloudBackup: true, aiReports: false, whatsapp: true, multiUser: true, multiBranch: false, api: false, mobileApp: true },
  enterprise: { maxProducts: -1, maxBills: -1, cloudBackup: true, aiReports: true, whatsapp: true, multiUser: true, multiBranch: true, api: true, mobileApp: true },
};
