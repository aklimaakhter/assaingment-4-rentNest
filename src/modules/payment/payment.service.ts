import { prisma } from "../../lib/prisma";
import Stripe from "stripe";
import config from "../../config";

const stripe = new Stripe(config.stripe_secret_key as string);


const createPaymentSessionIntoDB = async (tenantId: string, rentalRequestId: string) => {

  const rental = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalRequestId,
      tenantId: tenantId,
      status: "APPROVED",
    },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new Error("Approved rental request not found or unauthorized!");
  }


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rental.property.title,
            description: `Payment for rental property: ${rental.property.title}`,
          },
          unit_amount: Math.round(rental.property.price * 100), // Amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      rentalRequestId: rental.id,
    },
  });


  await prisma.payment.upsert({
    where: { rentalRequestId: rental.id },
    update: {
      transactionId: session.id,
      amount: rental.property.price,
      provider: "STRIPE",
      status: "PENDING",
    },
    create: {
      rentalRequestId: rental.id,
      transactionId: session.id,
      amount: rental.property.price,
      provider: "STRIPE",
      status: "PENDING",
    },
  });

  return { checkoutUrl: session.url };
};


const confirmPaymentInDB = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {

    const updatedPayment = await prisma.$transaction(async (tx) => {

      const payment = await tx.payment.update({
        where: { transactionId: sessionId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });


      await tx.rentalRequest.update({
        where: { id: payment.rentalRequestId },
        data: { status: "COMPLETED" },
      });

      return payment;
    });

    return updatedPayment;
  } else {
    throw new Error("Payment was not successful!");
  }
};


const getMyPaymentsFromDB = async (tenantId: string) => {
  return await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: tenantId,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


const getPaymentByIdFromDB = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment record not found!");
  }

  return payment;
};

export const paymentService = {
  createPaymentSessionIntoDB,
  confirmPaymentInDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};