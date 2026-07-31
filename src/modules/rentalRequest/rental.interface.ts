import { RentalStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalPayload {
  propertyId: string;
}

export interface IUpdateRentalStatusPayload {
  status: RentalStatus;
}