import { prisma } from "../../lib/prisma";


const createPropertyIntoDB = async (landlordId: string, payload: any) => {
  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId, 
    },
  });
  return result;
};

// Get All Properties 
const getAllPropertiesFromDB = async (query: Record<string, any>) => {
  const { location, minPrice, maxPrice, categoryId } = query;

  const whereConditions: any = {
    isAvailable: true, 
  };


  if (location) {
    whereConditions.location = { contains: location, mode: "insensitive" };
  }

  
  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  
  if (minPrice || maxPrice) {
    whereConditions.price = {};
    if (minPrice) whereConditions.price.gte = Number(minPrice);
    if (maxPrice) whereConditions.price.lte = Number(maxPrice);
  }

  const result = await prisma.property.findMany({
    where: whereConditions,
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};

// Get Single Property by ID 
const getPropertyByIdFromDB = async (id: string) => {
  const result = await prisma.property.findUniqueOrThrow({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  return result;
};

// Update Property (Landlord)
const updatePropertyInDB = async (id: string, landlordId: string, payload: any) => {
  
  const property = await prisma.property.findUniqueOrThrow({ where: { id } });
  
  if (property.landlordId !== landlordId) {
    throw new Error("Unauthorized! You can only edit your own properties.");
  }

 
  const result = await prisma.property.update({
    where: { id },
    data: payload,
  });

  return result;
};

// Delete Property (Landlord)
const deletePropertyFromDB = async (id: string, landlordId: string) => {

  const property = await prisma.property.findUniqueOrThrow({ where: { id } });
  
  if (property.landlordId !== landlordId) {
    throw new Error("Unauthorized! You can only delete your own properties.");
  }

 
  await prisma.property.delete({
    where: { id },
  });

  
};

export const propertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
  updatePropertyInDB,
  deletePropertyFromDB,
};