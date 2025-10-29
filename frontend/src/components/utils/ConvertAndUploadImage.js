import axios from 'axios';
/**
 * @param {File} file El objeto archivo de la entrada <input type="file" />
 * @returns {Promise<string>} La cadena Base64 (ej: data:image/jpeg;base64,....)
 */
export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fullBase64 = reader.result;
            
            const base64Data = fullBase64.split(',')[1];
            
            resolve(base64Data);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export const UploadImage = async (base64Image, srv_key) => {
    const payload = {
        image: base64Image,
    }
    const encodedBody = new URLSearchParams(payload).toString();
    try {
        const query = await axios.post('https://api.imgur.com/3/image', 
            encodedBody,
             {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Client-ID ${srv_key}`
            }
        });
        const data = await query.data;
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}