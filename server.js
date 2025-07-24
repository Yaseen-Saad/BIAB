import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Initialize Stripe (use test key for development)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "https://images.pexels.com", "https://placehold.co", "data:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Serve static files
app.use(express.static('.'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/handmade-by-egypt';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .then(() => seedDatabase())
    .catch(err => console.error('MongoDB connection error:', err));

// Move seedDatabase call inside connection promise
// Database Models
const productSchema = new mongoose.Schema({
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
    description_en: { type: String, required: true },
    description_ar: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    artisan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan' },
    materials_en: { type: String, required: true },
    materials_ar: { type: String, required: true },
    care_en: { type: String, required: true },
    care_ar: { type: String, required: true },
    stock: { type: Number, default: 10 },
    featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const artisanSchema = new mongoose.Schema({
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
    bio_en: { type: String, required: true },
    bio_ar: { type: String, required: true },
    image_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const impactMetricsSchema = new mongoose.Schema({
    textiles_diverted_kg: { type: Number, default: 0 },
    women_trained: { type: Number, default: 0 },
    income_disbursed_egp: { type: Number, default: 0 },
    current_campaign_goal_egp: { type: Number, default: 50000 },
    current_campaign_raised_egp: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
    title_en: { type: String, required: true },
    title_ar: { type: String, required: true },
    content_en: { type: String, required: true },
    content_ar: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    image_url: { type: String, required: true }
});

const collectionPointSchema = new mongoose.Schema({
    name_en: { type: String, required: true },
    name_ar: { type: String, required: true },
    address_en: { type: String, required: true },
    address_ar: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    hours_en: { type: String, required: true },
    hours_ar: { type: String, required: true },
    contact_phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    customer_info: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true }
        }
    },
    total_amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    status: { type: String, default: 'pending' },
    timestamp: { type: Date, default: Date.now }
});

const donationSchema = new mongoose.Schema({
    donor_name: { type: String },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'EGP' },
    type: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' },
    payment_method: { type: String, default: 'stripe' },
    timestamp: { type: Date, default: Date.now }
});

const contactSubmissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const textileDonationInquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const volunteerApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    skills: { type: String },
    availability: { type: String },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    created_at: { type: Date, default: Date.now }
});

// Create models
const Product = mongoose.model('Product', productSchema);
const Artisan = mongoose.model('Artisan', artisanSchema);
const ImpactMetrics = mongoose.model('ImpactMetrics', impactMetricsSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const CollectionPoint = mongoose.model('CollectionPoint', collectionPointSchema);
const Order = mongoose.model('Order', orderSchema);
const Donation = mongoose.model('Donation', donationSchema);
const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
const TextileDonationInquiry = mongoose.model('TextileDonationInquiry', textileDonationInquirySchema);
const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
const User = mongoose.model('User', userSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Seed initial data
async function seedDatabase() {
    try {
        // Check if data already exists
        const productCount = await Product.countDocuments();
        if (productCount > 0) {
            console.log('Database already seeded');
            return;
        }

        console.log('Seeding database with initial data...');

        // Create artisans
        const artisans = await Artisan.insertMany([
            {
                name_en: 'Fatma Hassan',
                name_ar: 'فاطمة حسن',
                bio_en: 'A skilled artisan from rural Giza with 15 years of experience in textile crafts. Fatma specializes in traditional Egyptian embroidery and sustainable upcycling techniques.',
                bio_ar: 'حرفية ماهرة من ريف الجيزة لديها 15 عامًا من الخبرة في الحرف النسيجية. تتخصص فاطمة في التطريز المصري التقليدي وتقنيات إعادة التدوير المستدامة.',
                image_url: 'https://images.pexels.com/photos/8070577/pexels-photo-8070577.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
            },
            {
                name_en: 'Aisha Mohamed',
                name_ar: 'عائشة محمد',
                bio_en: 'A young entrepreneur from Aswan who transformed her passion for weaving into a sustainable livelihood. Aisha creates beautiful home décor items from discarded fabrics.',
                bio_ar: 'رائدة أعمال شابة من أسوان حولت شغفها بالنسيج إلى مصدر رزق مستدام. تصنع عائشة قطع ديكور منزلي جميلة من الأقمشة المهملة.',
                image_url: 'https://images.pexels.com/photos/8964999/pexels-photo-8964999.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
            },
            {
                name_en: 'Nadia Ahmed',
                name_ar: 'نادية أحمد',
                bio_en: 'A master craftswoman from Luxor known for her intricate beadwork and textile artistry. Nadia mentors other women in the community and leads sustainability workshops.',
                bio_ar: 'حرفية ماهرة من الأقصر معروفة بأعمالها المعقدة في الخرز والفن النسيجي. تقوم نادية بتوجيه النساء الأخريات في المجتمع وتقود ورش عمل الاستدامة.',
                image_url: 'https://images.pexels.com/photos/8964906/pexels-photo-8964906.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
            }
        ]);

        // Create products
        await Product.insertMany([
            {
                name_en: 'Handwoven Tote Bag',
                name_ar: 'حقيبة يد منسوجة يدوياً',
                description_en: 'Beautiful handwoven tote bag made from upcycled cotton fabrics. Features traditional Egyptian patterns and sturdy construction. Perfect for daily use or as a statement piece.',
                description_ar: 'حقيبة يد جميلة منسوجة يدوياً من أقمشة القطن المعاد تدويرها. تتميز بالأنماط المصرية التقليدية والبناء المتين. مثالية للاستخدام اليومي أو كقطعة مميزة.',
                price: 350,
                category: 'Bags',
                images: [
                    'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
                    'https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
                ],
                artisan_id: artisans[0]._id,
                materials_en: '100% upcycled cotton, natural dyes',
                materials_ar: '100% قطن معاد التدوير، أصباغ طبيعية',
                care_en: 'Hand wash in cold water, air dry',
                care_ar: 'اغسل باليد بالماء البارد، جفف بالهواء',
                stock: 15,
                featured: true
            },
            {
                name_en: 'Embroidered Table Runner',
                name_ar: 'مفرش طاولة مطرز',
                description_en: 'Elegant table runner featuring intricate hand embroidery with traditional motifs. Made from repurposed linen and cotton blend fabrics.',
                description_ar: 'مفرش طاولة أنيق يتميز بتطريز يدوي معقد بزخارف تقليدية. مصنوع من أقمشة الكتان والقطن المعاد استخدامها.',
                price: 280,
                category: 'Home Décor',
                images: [
                    'https://images.pexels.com/photos/6249509/pexels-photo-6249509.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
                ],
                artisan_id: artisans[1]._id,
                materials_en: 'Upcycled linen-cotton blend, silk embroidery thread',
                materials_ar: 'خليط الكتان والقطن المعاد تدويره، خيط حرير للتطريز',
                care_en: 'Gentle machine wash, low heat dry',
                care_ar: 'غسيل آلة لطيف، تجفيف على حرارة منخفضة',
                stock: 8,
                featured: true
            },
            {
                name_en: 'Woven Wall Hanging',
                name_ar: 'معلقة جدارية منسوجة',
                description_en: 'Contemporary wall art piece created using traditional weaving techniques. Features geometric patterns in earthy tones using sustainable materials.',
                description_ar: 'قطعة فنية جدارية معاصرة مصنوعة باستخدام تقنيات النسيج التقليدية. تتميز بأنماط هندسية بألوان ترابية باستخدام مواد مستدامة.',
                price: 450,
                category: 'Art',
                images: [
                    'https://images.pexels.com/photos/6984979/pexels-photo-6984979.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
                ],
                artisan_id: artisans[2]._id,
                materials_en: 'Recycled wool, organic cotton, natural fiber cord',
                materials_ar: 'صوف معاد التدوير، قطن عضوي، حبل ألياف طبيعية',
                care_en: 'Dust regularly, spot clean only',
                care_ar: 'نظف من الغبار بانتظام، تنظيف موضعي فقط',
                stock: 5,
                featured: true
            },
            {
                name_en: 'Cushion Cover Set',
                name_ar: 'طقم أغطية وسائد',
                description_en: 'Set of 2 decorative cushion covers with traditional Egyptian patterns. Handcrafted from upcycled fabrics with zip closures.',
                description_ar: 'طقم من غطائين للوسائد الزخرفية بأنماط مصرية تقليدية. مصنوع يدوياً من أقمشة معاد تدويرها مع إغلاق بسحاب.',
                price: 220,
                category: 'Home Décor',
                images: [
                    'https://images.pexels.com/photos/6207706/pexels-photo-6207706.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
                ],
                artisan_id: artisans[0]._id,
                materials_en: 'Upcycled cotton canvas, polyester fill',
                materials_ar: 'قماش قطني معاد التدوير، حشو بوليستر',
                care_en: 'Machine wash cold, tumble dry low',
                care_ar: 'غسيل آلة بارد، تجفيف منخفض',
                stock: 20,
                featured: false
            },
            {
                name_en: 'Macrame Plant Hanger',
                name_ar: 'معلق نباتات مكرمية',
                description_en: 'Stylish macrame plant hanger made from natural cotton cord. Perfect for displaying your favorite plants while adding bohemian charm to any space.',
                description_ar: 'معلق نباتات مكرمية أنيق مصنوع من حبل القطن الطبيعي. مثالي لعرض نباتاتك المفضلة مع إضافة سحر البوهيمية لأي مساحة.',
                price: 180,
                category: 'Home Décor',
                images: [
                    'https://images.pexels.com/photos/6207695/pexels-photo-6207695.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
                ],
                artisan_id: artisans[1]._id,
                materials_en: '100% natural cotton cord, wooden ring',
                materials_ar: '100% حبل قطن طبيعي، حلقة خشبية',
                care_en: 'Spot clean with damp cloth, air dry',
                care_ar: 'تنظيف موضعي بقطعة قماش مبللة، تجفيف بالهواء',
                stock: 12,
                featured: false
            },
            {
                name_en: 'Handmade Jewelry Pouch',
                name_ar: 'حقيبة مجوهرات يدوية',
                description_en: 'Compact jewelry pouch with multiple compartments. Features delicate embroidery and soft lining to protect your precious items.',
                description_ar: 'حقيبة مجوهرات صغيرة بعدة أقسام. تتميز بتطريز رقيق وبطانة ناعمة لحماية قطعك الثمينة.',
                price: 150,
                category: 'Accessories',
                images: [
                    'https://images.pexels.com/photos/5632387/pexels-photo-5632387.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
                ],
                artisan_id: artisans[2]._id,
                materials_en: 'Upcycled silk, cotton lining, brass hardware',
                materials_ar: 'حرير معاد التدوير، بطانة قطنية، قطع معدنية نحاسية',
                care_en: 'Wipe clean with soft cloth',
                care_ar: 'امسح بقطعة قماش ناعمة',
                stock: 25,
                featured: true
            }
        ]);

        // Create impact metrics
        await ImpactMetrics.create({
            textiles_diverted_kg: 2847,
            women_trained: 35,
            income_disbursed_egp: 125000,
            current_campaign_goal_egp: 75000,
            current_campaign_raised_egp: 32000
        });

        // Create blog posts
        await BlogPost.insertMany([
            {
                title_en: 'Empowering Women Through Sustainable Crafts',
                title_ar: 'تمكين المرأة من خلال الحرف المستدامة',
                content_en: 'Our mission goes beyond creating beautiful products. We believe in the transformative power of providing economic opportunities to rural Egyptian women. Through our comprehensive training programs, we teach traditional crafts while incorporating modern sustainable practices. Each artisan who joins our program not only learns valuable skills but also becomes part of a supportive community that celebrates creativity and entrepreneurship. The impact ripples through entire families and communities, creating a cycle of empowerment that extends far beyond our workshops.',
                content_ar: 'مهمتنا تتجاوز صنع المنتجات الجميلة. نؤمن بالقوة التحويلية لتوفير الفرص الاقتصادية للمرأة الريفية المصرية. من خلال برامج التدريب الشاملة، نعلم الحرف التقليدية مع دمج الممارسات المستدامة الحديثة. كل حرفية تنضم لبرنامجنا لا تتعلم مهارات قيمة فحسب، بل تصبح جزءًا من مجتمع داعم يحتفل بالإبداع وريادة الأعمال. التأثير ينتشر عبر العائلات والمجتمعات بأكملها، مما يخلق دورة تمكين تمتد إلى ما هو أبعد من ورش العمل.',
                author: 'Sarah Ahmed',
                image_url: 'https://images.pexels.com/photos/8964906/pexels-photo-8964906.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
            },
            {
                title_en: 'The Art of Upcycling: Transforming Waste into Wonder',
                title_ar: 'فن إعادة التدوير: تحويل النفايات إلى عجائب',
                content_en: 'In a world drowning in textile waste, we have found beauty in discarded materials. Our upcycling process begins with carefully sorting donated fabrics, identifying their potential, and envisioning new life for each piece. Our artisans have developed innovative techniques that honor traditional Egyptian craftsmanship while addressing contemporary environmental challenges. Every product tells a story of transformation – from forgotten fabric to treasured handmade piece. This approach not only reduces waste but also creates unique, one-of-a-kind items that carry both cultural heritage and environmental consciousness.',
                content_ar: 'في عالم يغرق في نفايات المنسوجات، وجدنا الجمال في المواد المهملة. تبدأ عملية إعادة التدوير بفرز الأقمشة المتبرع بها بعناية، وتحديد إمكاناتها، وتصور حياة جديدة لكل قطعة. طورت حرفياتنا تقنيات مبتكرة تكرم الحرفية المصرية التقليدية بينما تواجه التحديات البيئية المعاصرة. كل منتج يحكي قصة تحول - من قماش منسي إلى قطعة يدوية ثمينة. هذا النهج لا يقلل من النفايات فحسب، بل يخلق أيضًا قطعًا فريدة تحمل التراث الثقافي والوعي البيئي.',
                author: 'Mohamed Hassan',
                image_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
            },
            {
                title_en: 'Building Sustainable Communities Through Craft',
                title_ar: 'بناء مجتمعات مستدامة من خلال الحرف',
                content_en: 'Sustainability is not just about environmental impact – it\'s about creating lasting change in communities. Our approach focuses on building local capacity, fostering entrepreneurship, and creating market access for rural artisans. We work closely with local cooperatives to establish fair trade practices and ensure that every artisan receives fair compensation for their work. The ripple effects are profound: children stay in school longer, families have better access to healthcare, and communities become more resilient. This is the true meaning of sustainable development – change that lasts and grows from within.',
                content_ar: 'الاستدامة ليست فقط عن التأثير البيئي - إنها عن خلق تغيير دائم في المجتمعات. يركز نهجنا على بناء القدرات المحلية، وتعزيز ريادة الأعمال، وخلق وصول للسوق للحرفيين الريفيين. نعمل بشكل وثيق مع التعاونيات المحلية لإنشاء ممارسات التجارة العادلة وضمان حصول كل حرفية على تعويض عادل لعملها. التأثيرات المتتالية عميقة: الأطفال يبقون في المدرسة لفترة أطول، والعائلات لديها وصول أفضل للرعاية الصحية، والمجتمعات تصبح أكثر مرونة. هذا هو المعنى الحقيقي للتنمية المستدامة - التغيير الذي يدوم وينمو من الداخل.',
                author: 'Layla Mahmoud',
                image_url: 'https://images.pexels.com/photos/6984979/pexels-photo-6984979.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
            }
        ]);

        // Create collection points
        await CollectionPoint.insertMany([
            {
                name_en: 'Downtown Cairo Collection Center',
                name_ar: 'مركز تجميع وسط القاهرة',
                address_en: '15 Tahrir Square, Downtown, Cairo',
                address_ar: '15 ميدان التحرير، وسط البلد، القاهرة',
                latitude: 30.0444,
                longitude: 31.2357,
                hours_en: 'Sunday - Thursday: 9 AM - 6 PM',
                hours_ar: 'الأحد - الخميس: 9 صباحاً - 6 مساءً',
                contact_phone: '+20 2 2345 6789'
            },
            {
                name_en: 'Zamalek Community Hub',
                name_ar: 'مركز مجتمع الزمالك',
                address_en: '8 Kasr El Nil Street, Zamalek, Cairo',
                address_ar: '8 شارع قصر النيل، الزمالك، القاهرة',
                latitude: 30.0618,
                longitude: 31.2194,
                hours_en: 'Daily: 10 AM - 8 PM',
                hours_ar: 'يومياً: 10 صباحاً - 8 مساءً',
                contact_phone: '+20 2 2876 5432'
            },
            {
                name_en: 'New Cairo Branch',
                name_ar: 'فرع القاهرة الجديدة',
                address_en: 'Cairo Festival City Mall, Level 2, New Cairo',
                address_ar: 'مول القاهرة فيستيفال سيتي، المستوى الثاني، القاهرة الجديدة',
                latitude: 30.0131,
                longitude: 31.4056,
                hours_en: 'Daily: 10 AM - 10 PM',
                hours_ar: 'يومياً: 10 صباحاً - 10 مساءً',
                contact_phone: '+20 2 2654 3210'
            },
            {
                name_en: 'Alexandria Coastal Center',
                name_ar: 'مركز الإسكندرية الساحلي',
                address_en: '45 Corniche Road, Alexandria',
                address_ar: '45 طريق الكورنيش، الإسكندرية',
                latitude: 31.2001,
                longitude: 29.9187,
                hours_en: 'Sunday - Thursday: 9 AM - 5 PM',
                hours_ar: 'الأحد - الخميس: 9 صباحاً - 5 مساءً',
                contact_phone: '+20 3 3456 7890'
            },
            {
                name_en: 'Giza Cultural Center',
                name_ar: 'المركز الثقافي بالجيزة',
                address_en: '12 Pyramids Road, Giza',
                address_ar: '12 طريق الأهرام، الجيزة',
                latitude: 30.0131,
                longitude: 31.2089,
                hours_en: 'Saturday - Wednesday: 8 AM - 4 PM',
                hours_ar: 'السبت - الأربعاء: 8 صباحاً - 4 مساءً',
                contact_phone: '+20 2 3567 8901'
            }
        ]);

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// API Routes

// Public endpoints
app.get('/api/products', async (req, res) => {
    try {
        const { featured, category } = req.query;
        let query = {};
        
        if (featured === 'true') {
            query.featured = true;
        }
        
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).populate('artisan_id');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('artisan_id');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/artisans', async (req, res) => {
    try {
        const artisans = await Artisan.find();
        res.json(artisans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/artisans/:id', async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id);
        if (!artisan) {
            return res.status(404).json({ message: 'Artisan not found' });
        }
        res.json(artisan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/impact', async (req, res) => {
    try {
        let metrics = await ImpactMetrics.findOne();
        if (!metrics) {
            metrics = await ImpactMetrics.create({
                textiles_diverted_kg: 0,
                women_trained: 0,
                income_disbursed_egp: 0,
                current_campaign_goal_egp: 50000,
                current_campaign_raised_egp: 0
            });
        }
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/blog', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/blog/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/collection-points', async (req, res) => {
    try {
        const points = await CollectionPoint.find();
        res.json(points);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Form submission endpoints
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        const submission = new ContactSubmission({
            name,
            email,
            message
        });
        
        await submission.save();
        res.json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/textile-donation', async (req, res) => {
    try {
        const { name, email, phone, company, message } = req.body;
        
        const inquiry = new TextileDonationInquiry({
            name,
            email,
            phone,
            company,
            message
        });
        
        await inquiry.save();
        res.json({ message: 'Textile donation inquiry submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/volunteer', async (req, res) => {
    try {
        const { name, email, phone, skills, availability, message } = req.body;
        
        const application = new VolunteerApplication({
            name,
            email,
            phone,
            skills,
            availability,
            message
        });
        
        await application.save();
        res.json({ message: 'Volunteer application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/donate', async (req, res) => {
    try {
        const { amount, donor_name, email, type } = req.body;
        
        // In a real implementation, you would process payment with Stripe here
        // For now, we'll just save the donation record
        
        const donation = new Donation({
            donor_name,
            email,
            amount,
            type,
            payment_method: 'stripe'
        });
        
        await donation.save();
        
        // Update campaign progress
        await ImpactMetrics.findOneAndUpdate(
            {},
            { $inc: { current_campaign_raised_egp: amount } },
            { upsert: true }
        );
        
        res.json({ message: 'Donation processed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/checkout', async (req, res) => {
    try {
        const { items, customer_info, total_amount, payment_method } = req.body;
        
        // In a real implementation, you would process payment here
        // For now, we'll just save the order
        
        const order = new Order({
            items,
            customer_info,
            total_amount,
            payment_method,
            status: 'completed'
        });
        
        await order.save();
        
        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }
        
        res.json({ message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        // In a real implementation, you would integrate with an email service
        // For now, we'll just acknowledge the subscription
        
        res.json({ message: 'Newsletter subscription successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected admin endpoints (examples)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find().populate('items.productId').sort({ timestamp: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/admin/donations', authenticateToken, async (req, res) => {
    try {
        const donations = await Donation.find().sort({ timestamp: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404s
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
});