const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const apartmentRoutes = require('./routes/apartments');
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check JWT from cookies for views
const checkJwtFromCookie = (req, res, next) => {
    const token = req.cookies?.token || '';
    if (token) {
        try {
            const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            console.error('Error verifying token:', error);
            // Clear invalid token
            res.clearCookie('token');
        }
    }
    next();
};

// Use JWT check middleware for all routes
app.use(checkJwtFromCookie);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);

// View Routes
app.get('/', (req, res) => {
    res.render('home', { user: req.user || null });
});

app.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('login', { user: req.user || null });
});

app.get('/register', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('register', { user: req.user || null });
});

// Admin routes with protection
app.get('/admin/dashboard', (req, res) => {
    // Check if user is authenticated and is an admin
    if (!req.user) {
        return res.redirect('/login');
    }
    
    if (req.user.role !== 'ADMIN') {
        return res.status(403).render('error', { 
            message: 'Access denied. Admin privileges required.',
            user: req.user || null
        });
    }
    
    res.render('admin/dashboard', { user: req.user || null });
});

app.get('/apartment/:id', async (req, res) => {
    try {
        const Apartment = require('./models/Apartment');
        const apartment = await Apartment.findById(req.params.id);
        
        if (!apartment) {
            return res.status(404).render('error', { 
                message: 'Apartment not found' 
            });
        }
        
        res.render('apartment-details', { apartment, user: req.user || null });
    } catch (error) {
        res.status(500).render('error', { 
            message: 'Error loading apartment details' 
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the app for serverless environments (if needed)
module.exports = app; 