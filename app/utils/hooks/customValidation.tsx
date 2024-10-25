import { useAirtimePurchase } from "@/app/context/AirtimePurchaseContext";
import { ValidationResult } from "../validations";

/**
 * Custom hook for validating phone numbers in the airtime purchase flow
 * @returns Object containing validation function and current error
 */
export const usePhoneValidation = () => {
	const { phoneNumber, selectedProvider } = useAirtimePurchase();

	const validatePhone = (): ValidationResult => {
		// If no phone number provided
		if (!phoneNumber) {
			return { isValid: false, error: "Phone number is required" };
		}

		// Check length
		if (phoneNumber.length < 11) {
			return { isValid: false, error: "Phone number must be 11 digits" };
		}

		// Check if contains only numbers
		if (!/^\d+$/.test(phoneNumber)) {
			return { isValid: false, error: "Phone number can only contain numbers" };
		}

		// Check phone number format
		if (!/^[0-9]{11}$/.test(phoneNumber)) {
			return { isValid: false, error: "Invalid phone number format" };
		}

		// Check provider selection
		if (!selectedProvider) {
			return { isValid: false, error: "Please select a network provider" };
		}

		return { isValid: true, error: "" };
	};

	return {
		validate: validatePhone,
		error: validatePhone().error,
		isValid: validatePhone().isValid,
	};
};

/**
 * Custom hook for validating amounts in the airtime purchase flow
 * @returns Object containing validation function and current error
 */
export const useAmountValidation = () => {
	const { fiatAmount } = useAirtimePurchase();

	const validateAmount = (): ValidationResult => {
		// If no amount, consider it valid (as per original logic)
		if (!fiatAmount) {
			return { isValid: true, error: "" };
		}

		// Check minimum amount
		if (fiatAmount < 50) {
			return { isValid: false, error: "Minimum amount is ₦50" };
		}

		// Check maximum amount
		if (fiatAmount > 500000) {
			return { isValid: false, error: "Maximum amount is ₦500,000" };
		}

		return { isValid: true, error: "" };
	};

	return {
		validate: validateAmount,
		error: validateAmount().error,
		isValid: validateAmount().isValid,
	};
};

/**
 * Main hook for all airtime purchase validations
 * @returns Object containing all validation functions and current form validity
 */
export const useAirtimePurchaseValidation = () => {
	const phoneValidation = usePhoneValidation();
	const amountValidation = useAmountValidation();

	const isFormValid = phoneValidation.isValid && amountValidation.isValid;

	return {
		phoneValidation,
		amountValidation,
		isFormValid,
		errors: {
			phone: phoneValidation.error,
			amount: amountValidation.error,
		},
	};
};
