import { prisma } from "../../lib/prisma";

const createCategoryIntoDB = async (payload: { name: string }) => {
    const result = await prisma.category.create({
        data: {
            name: payload.name,
        },
    });
    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany();
    return result;
};

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
};