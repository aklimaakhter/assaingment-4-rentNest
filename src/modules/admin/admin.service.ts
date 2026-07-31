import { prisma } from "../../lib/prisma";
import { IUpdateUserStatusPayload } from "./admin.interface";


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