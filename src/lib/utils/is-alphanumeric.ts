export const isAlphanumeric = (char: string) => {
	const code = char.charCodeAt(0);
	const isSmallLetter = code >= 97 && code <= 122;
	const isCapitalLetter = code >= 65 && code <= 90;
	const isDigit = code >= 48 && code <= 57;
	return isSmallLetter || isCapitalLetter || isDigit;
};
