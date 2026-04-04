import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toAmountDatabaseUnit = (amount: number | null) => {
	if (amount === null) return null;
	return amount * 100; // Convert to centi-units
};

export const toAmountDisplayUnit = (amount: number | null) => {
	if (amount === null) return 0;
	return amount / 100; // Convert to units
};
