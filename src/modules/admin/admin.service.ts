import { prisma } from "../../lib/prisma";
import { IUpdateUserStatusPayload } from "./admin.interface";

// 1. Get all users
const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

// 2. Update user status (ban/unban)
const updateUserStatusInDB = async (
  userId: string,
  payload: IUpdateUserStatusPayload
) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });
  return result;
};

// 3. Get all properties (Admin view)
const getAllPropertiesForAdminFromDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: {
        select: { id: true, name: true, email: true },
      },
      category: true,
    },
  });
  return result;
};

// 4. Get all rental requests (Admin view)
const getAllRentalsForAdminFromDB = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: { id: true, name: true, email: true },
      },
      property: {
        include: {
          landlord: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
  return result;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllPropertiesForAdminFromDB,
  getAllRentalsForAdminFromDB,
};