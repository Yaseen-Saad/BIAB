// Simple data seeding for demo purposes
// This creates mock data directly in the JavaScript to demonstrate the animations

window.mockData = {
    impactMetrics: {
        textiles_diverted_kg: 2847,
        women_trained: 35,
        income_disbursed_egp: 125000,
        current_campaign_goal_egp: 75000,
        current_campaign_raised_egp: 32000
    },
    
    products: [
        {
            _id: '1',
            name_en: 'Handwoven Tote Bag',
            name_ar: 'حقيبة يد منسوجة يدوياً',
            description_en: 'Beautiful handwoven tote bag made from upcycled cotton fabrics.',
            description_ar: 'حقيبة يد جميلة منسوجة يدوياً من أقمشة القطن المعاد تدويرها.',
            price: 350,
            images: ['https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'],
            featured: true
        },
        {
            _id: '2',
            name_en: 'Embroidered Table Runner',
            name_ar: 'مفرش طاولة مطرز',
            description_en: 'Elegant table runner featuring intricate hand embroidery.',
            description_ar: 'مفرش طاولة أنيق يتميز بتطريز يدوي معقد.',
            price: 280,
            images: ['https://images.pexels.com/photos/6249509/pexels-photo-6249509.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'],
            featured: true
        },
        {
            _id: '3',
            name_en: 'Woven Wall Hanging',
            name_ar: 'معلقة جدارية منسوجة',
            description_en: 'Contemporary wall art piece created using traditional weaving techniques.',
            description_ar: 'قطعة فنية جدارية معاصرة مصنوعة باستخدام تقنيات النسيج التقليدية.',
            price: 450,
            images: ['https://images.pexels.com/photos/6984979/pexels-photo-6984979.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'],
            featured: true
        }
    ],
    
    artisans: [
        {
            _id: '1',
            name_en: 'Fatma Hassan',
            name_ar: 'فاطمة حسن',
            bio_en: 'A skilled artisan from rural Giza with 15 years of experience in textile crafts.',
            bio_ar: 'حرفية ماهرة من ريف الجيزة لديها 15 عامًا من الخبرة في الحرف النسيجية.',
            image_url: 'https://images.pexels.com/photos/8070577/pexels-photo-8070577.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
        },
        {
            _id: '2',
            name_en: 'Aisha Mohamed',
            name_ar: 'عائشة محمد',
            bio_en: 'A young entrepreneur from Aswan who creates beautiful home décor items.',
            bio_ar: 'رائدة أعمال شابة من أسوان تصنع قطع ديكور منزلي جميلة.',
            image_url: 'https://images.pexels.com/photos/8964999/pexels-photo-8964999.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
        },
        {
            _id: '3',
            name_en: 'Nadia Ahmed',
            name_ar: 'نادية أحمد',
            bio_en: 'A master craftswoman from Luxor known for her intricate beadwork.',
            bio_ar: 'حرفية ماهرة من الأقصر معروفة بأعمالها المعقدة في الخرز.',
            image_url: 'https://images.pexels.com/photos/8964906/pexels-photo-8964906.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'
        }
    ],
    
    blogPosts: [
        {
            _id: '1',
            title_en: 'Empowering Women Through Sustainable Crafts',
            title_ar: 'تمكين المرأة من خلال الحرف المستدامة',
            content_en: 'Our mission goes beyond creating beautiful products...',
            content_ar: 'مهمتنا تتجاوز صنع المنتجات الجميلة...',
            author: 'Sarah Ahmed',
            date: new Date('2024-01-15'),
            image_url: 'https://images.pexels.com/photos/8964906/pexels-photo-8964906.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
        },
        {
            _id: '2',
            title_en: 'The Art of Upcycling',
            title_ar: 'فن إعادة التدوير',
            content_en: 'In a world drowning in textile waste, we have found beauty...',
            content_ar: 'في عالم يغرق في نفايات المنسوجات، وجدنا الجمال...',
            author: 'Mohamed Hassan',
            date: new Date('2024-01-10'),
            image_url: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
        }
    ],
    
    collectionPoints: [
        {
            _id: '1',
            name_en: 'Downtown Cairo Collection Center',
            name_ar: 'مركز تجميع وسط القاهرة',
            address_en: '15 Tahrir Square, Downtown, Cairo',
            address_ar: '15 ميدان التحرير، وسط البلد، القاهرة',
            hours_en: 'Sunday - Thursday: 9 AM - 6 PM',
            hours_ar: 'الأحد - الخميس: 9 صباحاً - 6 مساءً',
            contact_phone: '+20 2 2345 6789'
        }
    ]
};

// Override API endpoints to use mock data
window.apiEndpoints = {
    getProducts: () => Promise.resolve(window.mockData.products),
    getProduct: (id) => Promise.resolve(window.mockData.products.find(p => p._id === id)),
    getFeaturedProducts: () => Promise.resolve(window.mockData.products.filter(p => p.featured)),
    getArtisans: () => Promise.resolve(window.mockData.artisans),
    getArtisan: (id) => Promise.resolve(window.mockData.artisans.find(a => a._id === id)),
    getImpactMetrics: () => Promise.resolve(window.mockData.impactMetrics),
    getBlogPosts: () => Promise.resolve(window.mockData.blogPosts),
    getBlogPost: (id) => Promise.resolve(window.mockData.blogPosts.find(b => b._id === id)),
    getCollectionPoints: () => Promise.resolve(window.mockData.collectionPoints),
    submitContact: (data) => Promise.resolve({ message: 'Contact form submitted successfully' }),
    submitTextileDonation: (data) => Promise.resolve({ message: 'Textile donation inquiry submitted successfully' }),
    submitVolunteer: (data) => Promise.resolve({ message: 'Volunteer application submitted successfully' }),
    submitDonation: (data) => Promise.resolve({ message: 'Donation processed successfully' }),
    submitOrder: (data) => Promise.resolve({ message: 'Order placed successfully' }),
    subscribeNewsletter: (email) => Promise.resolve({ message: 'Newsletter subscription successful' })
};
