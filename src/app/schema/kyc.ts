import { z } from 'zod';

export const KYCSchema = z.object({
  email: z
    .string()
    .min(1, 'Không được để trống email')
    .email('Email không hợp lệ'),
});

export type KYCFormData = z.infer<typeof KYCSchema>;
