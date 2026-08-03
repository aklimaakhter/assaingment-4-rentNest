import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload, IUpdateRentalStatusPayload } from "./rental.interface";


const createRentalRequestIntoDB = async (
  tenantId: string,
  payload: ICreateRentalPayload
) => {
 
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: payload.propertyId },
  });

  
  if (!property.isAvailable) {
    throw new Error("This property is currently not available for rent!");
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      status: RentalStatus.PENDING,
    },
    include: {
      property: true,
    },
  });

  return result;
};

const getMyRentalRequestsFromDB = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
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

const getRentalRequestByIdFromDB = async (id: string, userId: string) => {
  const result = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id },
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

 
  if (result.tenantId !== userId && result.property.landlordId !== userId) {
    throw new Error("Unauthorized access to this rental request!");
  }

  return result;
};

const getLandlordRentalRequestsFromDB = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: { id: true, name: true, email: true },
      },
      property: true,
    },
  });

  return result;
};

const updateRentalRequestStatusIntoDB = async (
  id: string,
  landlordId: string,
  payload: IUpdateRentalStatusPayload
) => {
  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id },
    include: { property: true },
  });

  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error("Unauthorized! You can only update requests for your own properties.");
  }

  const result = await prisma.rentalRequest.update({
    where: { id },
    data: {
      status: payload.status,
    },
  });

  return result;
};

export const rentalService = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getRentalRequestByIdFromDB,
  getLandlordRentalRequestsFromDB,
  updateRentalRequestStatusIntoDB,
};