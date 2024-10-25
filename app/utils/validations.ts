// validation.ts

import { ProviderType } from "./utils";

export type ValidationResult = {
	isValid: boolean;
	error: string;
};

export type PhoneValidationConfig = {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	requireProvider?: boolean;
	customValidator?: (phoneNumber: string) => boolean;
};

export type AmountValidationConfig = {
	required?: boolean;
	min?: number;
	max?: number;
	currency?: string;
};

/**
 * Validates a phone number based on provided configuration
 * @param phoneNumber - The phone number to validate
 * @param provider - Optional provider object
 * @param config - Validation configuration options
 * @returns ValidationResult object with isValid status and error message
 */
export const validatePhone = (
	phoneNumber: string,
	provider?: ProviderType,
	config: PhoneValidationConfig = {}
): ValidationResult => {
	const {
		required = true,
		minLength = 11,
		maxLength = 11,
		requireProvider = true,
		customValidator,
	} = config;

	// If not required and empty, return valid
	if (!required && !phoneNumber) {
		return { isValid: true, error: "" };
	}

	// Required check
	if (required && !phoneNumber) {
		return { isValid: false, error: "Phone number is required" };
	}

	// Length check
	if (phoneNumber.length < minLength) {
		return {
			isValid: false,
			error: `Phone number must be at least ${minLength} digits`,
		};
	}

	if (phoneNumber.length > maxLength) {
		return {
			isValid: false,
			error: `Phone number cannot exceed ${maxLength} digits`,
		};
	}

	// Number format check
	if (!/^\d+$/.test(phoneNumber)) {
		return { isValid: false, error: "Phone number can only contain numbers" };
	}

	// Custom validator check
	if (customValidator && !customValidator(phoneNumber)) {
		return { isValid: false, error: "Invalid phone number format" };
	}

	// Provider check
	if (requireProvider && !provider) {
		return { isValid: false, error: "Please select a network provider" };
	}

	return { isValid: true, error: "" };
};

/**
 * Validates an amount based on provided configuration
 * @param amount - The amount to validate
 * @param config - Validation configuration options
 * @returns ValidationResult object with isValid status and error message
 */
export const validateAmount = (
	amount: number | string,
	config: AmountValidationConfig = {}
): ValidationResult => {
	const { required = false, min = 0, max = Infinity, currency = "₦" } = config;

	// Convert amount to number if string
	const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

	// If not required and empty/zero, return valid
	if (!required && (!amount || numAmount === 0)) {
		return { isValid: true, error: "" };
	}

	// Required check
	if (required && (!amount || numAmount === 0)) {
		return { isValid: false, error: "Amount is required" };
	}

	// NaN check
	if (isNaN(numAmount)) {
		return { isValid: false, error: "Please enter a valid amount" };
	}

	// Minimum check
	if (numAmount < min) {
		return {
			isValid: false,
			error: `Minimum amount is ${currency}${min.toLocaleString()}`,
		};
	}

	// Maximum check
	if (numAmount > max) {
		return {
			isValid: false,
			error: `Maximum amount is ${currency}${max.toLocaleString()}`,
		};
	}

	return { isValid: true, error: "" };
};

// Example usage with your specific validation rules:
export const validateAirtimePhone = (
	phoneNumber: string,
	provider?: ProviderType
): ValidationResult => {
	return validatePhone(phoneNumber, provider, {
		required: true,
		minLength: 11,
		maxLength: 11,
		requireProvider: true,
		customValidator: (phone) => {
			// Your existing validatePhoneNumber function logic here
			return /^[0-9]{11}$/.test(phone);
		},
	});
};

export const validateAirtimeAmount = (amount: number): ValidationResult => {
	return validateAmount(amount, {
		required: false,
		min: 50,
		max: 500000,
		currency: "₦",
	});
};
