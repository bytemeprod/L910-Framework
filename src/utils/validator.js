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
}
module.exports = Validator;