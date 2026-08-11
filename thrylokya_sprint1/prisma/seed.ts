import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.returnRequest.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Passwords
  const userPasswordHash = bcrypt.hashSync('password123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  // Users
  const user = await prisma.user.create({
    data: {
      name: 'Rahul Kumar',
      email: 'rahul.kumar@email.com',
      password: userPasswordHash,
      role: 'USER',
      mobile: '9876543210',
      dob: '1992-05-14',
      gender: 'Male',
      addresses: {
        create: [
          {
            label: 'Home Address',
            street: '123 Green Park Colony, Sector 4',
            city: 'Bengaluru',
            state: 'Karnataka',
            zipCode: '560001',
            isDefault: true,
          },
        ],
      },
      paymentMethods: {
        create: [
          {
            type: 'Credit Card',
            last4: '4242',
            provider: 'HDFC Visa',
            expiryDate: '12/28',
            isDefault: true,
          },
        ],
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Wakefit Admin',
      email: 'admin@wakefit.com',
      password: adminPasswordHash,
      role: 'ADMIN',
      mobile: '9999988888',
      dob: '1988-01-01',
      gender: 'Other',
    },
  });

  console.log('Created Users:', { customer: user.email, admin: admin.email });

  // Products matching screenshots
  const products = await Promise.all([
    prisma.product.create({
      data: {
        id: 'prod-sofa',
        name: 'Ortho Comfort 3-Seater Sofa',
        description: 'Premium ergonomic fabric 3-seater sofa designed for back support and luxurious living.',
        price: 34999,
        originalPrice: 45000,
        discountPercent: 22,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        category: 'Sofa',
        rating: 5.0,
        reviewCount: 1284,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod-bed',
        name: 'Horizon King Bed Frame',
        description: 'Solid teak finish wooden king bed frame with durable headboard construction.',
        price: 28999,
        originalPrice: 36000,
        discountPercent: 19,
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        category: 'Bed',
        rating: 4.0,
        reviewCount: 876,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod-chair',
        name: 'Sleek Ergonomic Study Chair',
        description: 'High-back mesh ergonomic executive chair with adjustable lumbar support.',
        price: 12999,
        originalPrice: 18000,
        discountPercent: 28,
        imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d120a?auto=format&fit=crop&w=800&q=80',
        category: 'Chair',
        rating: 5.0,
        reviewCount: 2341,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod-table',
        name: 'Nordic Coffee Table',
        description: 'Minimalist natural oak wood coffee table with solid wooden legs.',
        price: 8999,
        originalPrice: 12000,
        discountPercent: 25,
        imageUrl: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
        category: 'Table',
        rating: 4.0,
        reviewCount: 523,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod-wardrobe',
        name: 'Smart Storage Wardrobe',
        description: '3-Door spacious engineered wood wardrobe with mirror and modern lock.',
        price: 42999,
        originalPrice: 55000,
        discountPercent: 22,
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
        category: 'Wardrobe',
        rating: 4.0,
        reviewCount: 344,
        inStock: false,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod-mattress',
        name: 'Dual Comfort Memory Foam Mattress',
        description: '7-Zone orthopedic reversible memory foam mattress for deep sleeping comfort.',
        price: 19999,
        originalPrice: 26000,
        discountPercent: 23,
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
        category: 'Mattress',
        rating: 5.0,
        reviewCount: 4512,
        inStock: true,
      },
    }),
  ]);

  console.log(`Created ${products.length} products.`);

  // Orders for Rahul Kumar matching stats & lists
  const ord9981 = await prisma.order.create({
    data: {
      id: 'ORD-9981',
      userId: user.id,
      status: 'PLACED',
      totalPrice: 36749,
      createdAt: new Date('2026-07-17T10:00:00Z'),
      estDeliveryDate: new Date('2026-07-22T10:00:00Z'),
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            color: 'Grey',
            price: 34999,
          },
        ],
      },
    },
  });

  const ord9134 = await prisma.order.create({
    data: {
      id: 'ORD-9134',
      userId: user.id,
      status: 'PROCESSING',
      totalPrice: 21479,
      createdAt: new Date('2026-07-15T14:30:00Z'),
      estDeliveryDate: new Date('2026-07-20T10:00:00Z'),
      orderItems: {
        create: [
          {
            productId: products[5].id,
            quantity: 1,
            color: 'White',
            price: 19999,
          },
        ],
      },
    },
  });

  const ord8821 = await prisma.order.create({
    data: {
      id: 'ORD-8821',
      userId: user.id,
      status: 'SHIPPED',
      totalPrice: 34999,
      createdAt: new Date('2024-11-10T09:00:00Z'),
      estDeliveryDate: new Date('2024-11-15T09:00:00Z'),
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            color: 'Grey',
            price: 34999,
          },
        ],
      },
    },
  });

  const ord6789 = await prisma.order.create({
    data: {
      id: 'ORD-6789',
      userId: user.id,
      status: 'OUT_FOR_DELIVERY',
      totalPrice: 12999,
      createdAt: new Date('2024-11-01T11:00:00Z'),
      estDeliveryDate: new Date('2024-11-05T11:00:00Z'),
      orderItems: {
        create: [
          {
            productId: products[2].id,
            quantity: 1,
            color: 'Black',
            price: 12999,
          },
        ],
      },
    },
  });

  const ord5512 = await prisma.order.create({
    data: {
      id: 'ORD-5512',
      userId: user.id,
      status: 'DELIVERED',
      totalPrice: 28999,
      createdAt: new Date('2024-10-25T10:00:00Z'),
      estDeliveryDate: new Date('2024-11-01T10:00:00Z'),
      orderItems: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            color: 'Teak',
            price: 28999,
          },
        ],
      },
    },
  });

  const ord7456 = await prisma.order.create({
    data: {
      id: 'ORD-7456',
      userId: user.id,
      status: 'DELIVERED',
      totalPrice: 8999,
      createdAt: new Date('2024-10-20T10:00:00Z'),
      estDeliveryDate: new Date('2024-10-28T10:00:00Z'),
      orderItems: {
        create: [
          {
            productId: products[3].id,
            quantity: 1,
            color: 'Oak',
            price: 8999,
          },
        ],
      },
    },
  });

  console.log('Created Orders.');

  // Return Requests matching Page 7 screenshot exactly
  await prisma.returnRequest.create({
    data: {
      id: 'RET-2024-001',
      userId: user.id,
      orderId: ord8821.id,
      status: 'APPROVED',
      reason: 'Color mismatch from online listing',
      pickupDate: new Date('2024-11-20T00:00:00Z'),
      timeSlot: 'Morning (9:00 AM - 12:00 PM)',
      refundMethod: 'Original Payment Method',
      createdAt: new Date('2024-11-16T10:00:00Z'),
    },
  });

  await prisma.returnRequest.create({
    data: {
      id: 'RET-2024-002',
      userId: user.id,
      orderId: ord9134.id,
      status: 'PENDING',
      reason: 'Received damaged product',
      pickupDate: new Date('2024-11-16T00:00:00Z'),
      timeSlot: 'Afternoon (12:00 PM - 4:00 PM)',
      refundMethod: 'Wakefit Wallet Credit',
      createdAt: new Date('2024-11-11T12:00:00Z'),
    },
  });

  await prisma.returnRequest.create({
    data: {
      id: 'RET-2024-004',
      userId: user.id,
      orderId: ord6789.id,
      status: 'REJECTED',
      reason: 'Change of mind',
      pickupDate: new Date('2024-11-11T00:00:00Z'),
      timeSlot: 'Evening (4:00 PM - 8:00 PM)',
      refundMethod: 'Original Payment Method',
      createdAt: new Date('2024-11-06T15:00:00Z'),
    },
  });

  await prisma.returnRequest.create({
    data: {
      id: 'RET-2024-005',
      userId: user.id,
      orderId: ord5512.id,
      status: 'PENDING',
      reason: 'Assembly parts missing',
      pickupDate: new Date('2024-11-07T00:00:00Z'),
      timeSlot: 'Morning (9:00 AM - 12:00 PM)',
      refundMethod: 'Bank Transfer / NEFT',
      createdAt: new Date('2024-11-02T08:30:00Z'),
    },
  });

  await prisma.returnRequest.create({
    data: {
      id: 'RET-2024-003',
      userId: user.id,
      orderId: ord7456.id,
      status: 'COMPLETED',
      reason: 'Wrong product delivered',
      pickupDate: new Date('2024-11-03T00:00:00Z'),
      timeSlot: 'Afternoon (12:00 PM - 4:00 PM)',
      refundMethod: 'Original Payment Method',
      createdAt: new Date('2024-10-29T11:00:00Z'),
    },
  });

  console.log('Created Return Requests.');
  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
