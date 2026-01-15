class Validator {
    static validateExponat(data) {
        const errors = [];
        
        if (!data.name || typeof data.name !== 'string') {
            errors.push('Name is required and must be a string');
        }
        if (data.year === undefined || typeof data.year !== 'number') {
            errors.push('Year is required and must be a number');
        }
        if (typeof data.isOriginal !== 'boolean') {
            errors.push('isOriginal must be a boolean');
        }
        if (!data.createdAt || isNaN(Date.parse(data.createdAt))) {
            errors.push('createdAt must be a valid date string');
        }
        if (!Array.isArray(data.tags)) {
            errors.push('Tags must be an array');
        }

        return errors.length > 0 ? errors : null;
    }

    static validateExponatId(paramId) {
        try {
            const id = Number(paramId);
            return id;
        } catch (err) {
            console.log("Failed to validate id:", err)
            return null;
        }
    }

    static validateMedicine(data) {
        const errors = [];
        
        if (!data.name || typeof data.name !== 'string') {
            errors.push('Name is required and must be a string');
        }

        if (data.price === undefined || typeof data.price !== 'number') {
            errors.push('Price is required and must be a number');
        }
        
        if (typeof data.isPrescriptionRequired !== 'boolean') {
            errors.push('isPrescriptionRequired must be a boolean');
        }

        if (!Array.isArray(data.categories)) {
            errors.push('Categories must be an array');
        }

        return errors.length > 0 ? errors : null;
    }
    static validateBook(data) {
        const errors = [];
        
        if (!data.title || typeof data.title !== 'string') {
            errors.push('Title is required and must be a string');
        }

        if (!data.author || typeof data.author !== 'string') {
            errors.push('Author is required and must be a string');
        }
        
        if (data.year === undefined || typeof data.year !== 'number') {
            errors.push('Year is required and must be a number');
        }

        if (typeof data.isAvailable !== 'boolean') {
            errors.push('isAvailable must be a boolean');
        }

        if (!Array.isArray(data.genres)) {
            errors.push('Genres must be an array');
        }

        return errors.length > 0 ? errors : null;
}
static validatePoster(data) {
        const errors = [];
        
        if (!data.title || typeof data.title !== 'string') {
            errors.push('Title is required and must be a string');
        }
        
        if (data.releaseYear === undefined || typeof data.releaseYear !== 'number') {
            errors.push('ReleaseYear is required and must be a number');
        }

        if (typeof data.isPremiere !== 'boolean') {
            errors.push('isPremiere must be a boolean');
        }

        if (!Array.isArray(data.genres)) {
            errors.push('Genres must be an array');
        }

        return errors.length > 0 ? errors : null;
    }
}
module.exports = Validator;