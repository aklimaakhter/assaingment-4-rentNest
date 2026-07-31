import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";
import { PaymentProvider, PaymentStatus, RentalStatus, UserRole, UserStatus } from "../generated/prisma/enums";


async function main() {
 
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.property.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

 
  const [landlord1, landlord2, tenant1, tenant2, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Spider Man",
        email: "spider.man@gmail.com",
        password,
        role: UserRole.LANDLORD,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Super Man",
        email: "super.man@gmail.com",
        password,
        role: UserRole.LANDLORD,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Bat Man",
        email: "bat.man@gmail.com",
        password,
        role: UserRole.TENANT,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Iron Man",
        email: "iron.man@gmail.com",
        password,
        role: UserRole.TENANT,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    }),
  ]);

  console.log("Created 5 users");

  
  const categoriesToCreate = [
    { name: "Apartment" },
    { name: "Family House" },
    { name: "Studio Flat" },
  ];

  const categories = [];
  for (const catData of categoriesToCreate) {
    const category = await prisma.category.create({ data: catData });
    categories.push(category);
  }

  console.log(`Created ${categories.length} categories`);

 
  const propertiesToCreate = [
    {
      title: "Luxury Apartment in Gulshan",
      description: "3 BHK Fully furnished luxury apartment",
      price: 45000,
      location: "Gulshan-2, Dhaka",
      categoryId: categories[0].id,
      landlordId: landlord1.id,
    },
    {
      title: "Cozy Studio Flat in Dhanmondi",
      description: "1 BHK Compact flat suitable for students",
      price: 18000,
      location: "Dhanmondi 27, Dhaka",
      categoryId: categories[2].id,
      landlordId: landlord2.id,
    },
    {
      title: "Spacious Duplex House in Uttara",
      description: "4 BHK Duplex house with private garage",
      price: 65000,
      location: "Sector 11, Uttara, Dhaka",
      categoryId: categories[1].id,
      landlordId: landlord1.id,
    },
  ];

  const properties = [];
  for (const propertyData of propertiesToCreate) {
    const property = await prisma.property.create({ data: propertyData });
    properties.push(property);
  }

  console.log(`Created ${properties.length} properties`);


  const requestsToCreate = [
    {
      property: properties[0],
      tenantId: tenant1.id,
      rentalStatus: RentalStatus.APPROVED,
      paymentStatus: PaymentStatus.PAID,
      provider: PaymentProvider.SSLCOMMERZ,
    },
    {
      property: properties[1],
      tenantId: tenant2.id,
      rentalStatus: RentalStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      provider: PaymentProvider.STRIPE,
    },
    {
      property: properties[2],
      tenantId: tenant1.id,
      rentalStatus: RentalStatus.REJECTED,
      paymentStatus: PaymentStatus.FAILED,
      provider: PaymentProvider.STRIPE,
    },
  ];

  for (const r of requestsToCreate) {
    if (r.property) {
      const rentalRequest = await prisma.rentalRequest.create({
        data: {
          propertyId: r.property.id,
          tenantId: r.tenantId,
          status: r.rentalStatus,
        },
      });

      if (r.paymentStatus !== PaymentStatus.PENDING) {
        await prisma.payment.create({
          data: {
            rentalRequestId: rentalRequest.id,
            amount: r.property.price,
            provider: r.provider,
            status: r.paymentStatus,
            transactionId: randomUUID(),
            paidAt: r.paymentStatus === PaymentStatus.PAID ? new Date() : null,
          },
        });
      }
    }
  }

  console.log(`Created ${requestsToCreate.length} rental requests`);
  console.log("Seed finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Error during seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });