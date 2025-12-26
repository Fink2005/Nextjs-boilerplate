'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const handleRevalidateTag = async (tagsName: string) => {
  await revalidateTag(
    tagsName,
    { expire: 0 }
  );
};

export const handleRevalidatePath = async (path: string) => {
  await revalidatePath(path);
};
