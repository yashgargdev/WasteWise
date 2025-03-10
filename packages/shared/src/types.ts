import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  age: z.number().optional(),
  points: z.number().default(0),
  barcodeId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const WasteTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  pointsPerUnit: z.number(),
  weightInGrams: z.number(),
});

export const RecyclingSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  wasteTypeId: z.string(),
  quantity: z.number(),
  pointsEarned: z.number(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
export type WasteType = z.infer<typeof WasteTypeSchema>;
export type RecyclingSession = z.infer<typeof RecyclingSessionSchema>;

export const WASTE_TYPES = [
  {
    id: 'plastic-bottle',
    name: 'Plastic Bottle',
    pointsPerUnit: 20,
    weightInGrams: 20,
  },
  {
    id: 'plastic-wrap',
    name: 'Plastic Wrap',
    pointsPerUnit: 5,
    weightInGrams: 5,
  },
  {
    id: 'glass-bottle',
    name: 'Glass Bottle',
    pointsPerUnit: 30,
    weightInGrams: 200,
  },
  {
    id: 'cardboard',
    name: 'Cardboard',
    pointsPerUnit: 15,
    weightInGrams: 100,
  },
  {
    id: 'aluminum-can',
    name: 'Aluminum Can',
    pointsPerUnit: 25,
    weightInGrams: 15,
  },
] as const; 