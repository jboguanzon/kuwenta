import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toAmountDatabaseUnit = (amount: number | null) => {
	if (!amount) return null;
	return amount * 100; // Convert to centi-units
};

export const toAmountDisplayUnit = (amount: number | null) => {
	if (!amount) return null;
	return amount / 100; // Convert to units
};
