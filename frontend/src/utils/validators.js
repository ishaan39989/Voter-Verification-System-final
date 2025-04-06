export const validateVoterId = (voterId) => {
    const voterIdPattern = /^[A-Z0-9]{10}$/; // Example pattern for voter ID
    return voterIdPattern.test(voterId);
};

export const validateFacePhoto = (photo) => {
    // Check if the photo is a valid image file
    return photo && photo.type.startsWith('image/');
};

export const validateInput = (input) => {
    return input && input.trim() !== '';
};