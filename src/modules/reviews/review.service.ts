import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReviewIntoDB = async (
  tenantId: string,
  payload: ICreateReviewPayload
) => {
  
  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: RentalStatus.COMPLETED,
    },
  });

  if (!completedRental) {
    throw new Error(
      "You can only leave a review after completing a rental for this property!"
    );
  }

  
  const result = await prisma.review.create({
    data: {
      tenantId,
      propertyId: payload.propertyId,
      rating: payload.rating,
      comment: payload.comment,
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

export const reviewService = {
  createReviewIntoDB,
};