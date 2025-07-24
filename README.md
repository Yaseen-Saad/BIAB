# Handmade by Egypt - E-commerce & Impact Platform

A modern, bilingual (Arabic/English) e-commerce platform built for "Handmade by Egypt" - a non-profit organization empowering rural Egyptian women through sustainable textile upcycling and artisanal crafts.

## 🌟 Features

### Core Functionality
- **Bilingual Support**: Complete RTL Arabic and LTR English support with seamless language switching
- **E-commerce**: Product catalog, shopping cart, secure checkout process
- **Impact Tracking**: Real-time metrics showing social and environmental impact
- **Donation System**: Financial and textile donation capabilities
- **Volunteer Management**: Online application system for volunteers
- **Blog/Stories**: Content management for impact stories and updates
- **Artisan Profiles**: Showcase of individual artisan stories and work

### Technical Features
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Backend**: Node.js with Express.js and MongoDB Atlas
- **Database**: MongoDB with comprehensive schemas
- **Payments**: Stripe integration with Egyptian payment gateway support
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Performance**: Optimized loading, caching, and image handling
- **Security**: JWT authentication, input validation, rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Stripe account (for payments)

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd handmade-by-egypt
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your credentials:
   - MongoDB Atlas connection string
   - Stripe API keys
   - JWT secret
   - Other configuration values

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Main site: http://localhost:3000
   - The database will be automatically seeded with sample data on first run

## 🗄️ Database Schema

### Collections
- **products**: Product catalog with bilingual content
- **artisans**: Artisan profiles and stories
- **impact_metrics**: Social and environmental impact data
- **blog_posts**: Blog articles and impact stories
- **collection_points**: Textile donation locations
- **orders**: E-commerce order management
- **donations**: Financial donation records
- **contact_submissions**: Contact form submissions
- **textile_donations_inquiries**: Textile donation inquiries
- **volunteer_applications**: Volunteer applications
- **users**: Admin user management

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/artisans` - Get all artisans
- `GET /api/impact` - Get impact metrics
- `GET /api/blog` - Get blog posts
- `GET /api/collection-points` - Get textile collection points

### Form Submission Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/textile-donation` - Submit textile donation inquiry
- `POST /api/volunteer` - Submit volunteer application
- `POST /api/donate` - Process financial donation
- `POST /api/checkout` - Process order
- `POST /api/newsletter` - Newsletter subscription

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/donations` - Get all donations

## 🎨 Design System

### Colors
- **Primary**: #B85C38 (Warm Clay/Terracotta)
- **Secondary**: #7A8B7A (Muted Sage Green)
- **Background**: #F8F6F4 (Light Off-White/Cream)
- **Text**: #333333 (Deep Charcoal Grey)
- **Accent**: #E7DDCB (Soft Sand)

### Typography
- **English Headings**: Montserrat (700, 600)
- **English Body**: Open Sans (400, 300, 600)
- **Arabic Headings**: Cairo (700, 600)
- **Arabic Body**: Tajawal (400, 300, 600)

### Spacing System
- Base unit: 8px
- Consistent vertical rhythm: 20px
- Section padding: 100px (desktop), 60px (mobile)

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Hamburger navigation menu
- Touch-optimized interactions
- Optimized form layouts
- Responsive grid systems

## 🌍 Internationalization

### Language Support
- **English (EN)**: Left-to-right layout
- **Arabic (AR)**: Right-to-left layout with proper text direction

### Implementation
- Dynamic content loading from database
- CSS-based RTL transformation
- Localized number and date formatting
- Language-specific font loading

## 🔒 Security Features

- **Input Validation**: Server-side validation for all user inputs
- **Rate Limiting**: API endpoint protection
- **Authentication**: JWT-based admin authentication
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers implementation
- **Password Hashing**: bcrypt for secure password storage

## 📊 Sample Data

The application includes comprehensive sample data:
- 6 sample products with bilingual descriptions
- 3 artisan profiles
- Impact metrics and campaign progress
- 3 blog posts with rich content
- 5 collection points across Egypt
- Admin user account (username: admin, password: admin123)

## 🚀 Deployment

### Environment Variables for Production
Ensure these are set in your production environment:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong secret for JWT tokens
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NODE_ENV=production`

### Performance Optimizations
- Image lazy loading
- API response caching
- Minified assets
- Optimized database queries
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for "Handmade by Egypt" non-profit organization.

## 🆘 Support

For technical support or questions about the platform, please contact the development team or refer to the inline code documentation.

---

**Built with ❤️ for empowering Egyptian artisans and promoting sustainable practices.**