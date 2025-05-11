const Datastore = require('nedb');
const path = require('path');

// Determine if we're in production (Render or Vercel) or development
const isProduction = process.env.NODE_ENV === 'production';

// Create database instances - use in-memory for production
const users = new Datastore({
    filename: isProduction ? null : path.join(__dirname, '../data/users.db'),
    autoload: true,
    inMemoryOnly: isProduction
});

const apartments = new Datastore({
    filename: isProduction ? null : path.join(__dirname, '../data/apartments.db'),
    autoload: true,
    inMemoryOnly: isProduction
});

// Create indexes
users.ensureIndex({ fieldName: 'email', unique: true });
apartments.ensureIndex({ fieldName: 'title' });

// Add sample data in production for demo purposes
if (isProduction) {
    // Sample user data (including an admin)
    const sampleUsers = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: '$2a$10$ItQN3EHHaVbDjQB.Dxc57OMQCCLbOBGR7gYh5S33PdVXpQYu4tGVW', // 'password123'
            role: 'ADMIN',
            createdAt: new Date()
        },
        {
            name: 'Regular User',
            email: 'user@example.com',
            password: '$2a$10$ItQN3EHHaVbDjQB.Dxc57OMQCCLbOBGR7gYh5S33PdVXpQYu4tGVW', // 'password123'
            role: 'USER',
            createdAt: new Date()
        }
    ];

    // Sample apartment data
    const sampleApartments = [
        {
            title: 'Modern Studio in Downtown',
            description: 'Beautiful modern studio apartment in the heart of downtown. Walking distance to restaurants and shops.',
            price: 1200,
            location: 'Downtown, New York',
            bedrooms: 0,
            bathrooms: 1,
            area: 500,
            type: 'studio',
            images: [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
            ],
            createdBy: 'admin',
            createdAt: new Date()
        },
        {
            title: 'Spacious 2BR with City View',
            description: 'Luxurious 2-bedroom apartment with amazing city views. Modern appliances and hardwood floors.',
            price: 2200,
            location: 'Midtown, Chicago',
            bedrooms: 2,
            bathrooms: 2,
            area: 1100,
            type: 'apartment',
            images: [
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
                'https://images.unsplash.com/photo-1501183638710-841dd1904471'
            ],
            createdBy: 'admin',
            createdAt: new Date()
        },
        {
            title: 'Cozy Room in Shared House',
            description: 'Private room in a shared house. Access to kitchen and living areas. Friendly roommates.',
            price: 750,
            location: 'Berkeley, California',
            bedrooms: 1,
            bathrooms: 1,
            area: 200,
            type: 'room',
            images: [
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
                'https://images.unsplash.com/photo-1513694203232-719a280e022f'
            ],
            createdBy: 'admin',
            createdAt: new Date()
        }
    ];

    // Insert sample data
    users.insert(sampleUsers, (err) => {
        if (err) console.error('Error inserting sample users:', err);
        else console.log('Sample users added to in-memory database');
    });

    apartments.insert(sampleApartments, (err) => {
        if (err) console.error('Error inserting sample apartments:', err);
        else console.log('Sample apartments added to in-memory database');
    });
}

module.exports = {
    users,
    apartments
}; 