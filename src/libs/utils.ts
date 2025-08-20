import { formatInTimeZone } from 'date-fns-tz';
import { CDN_URL } from './config';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AMAZON_REGION })

export const getCurrentTime = () => {
    const now = new Date();
    const formattedTime = formatInTimeZone(now, 'Asia/Ulaanbaatar', 'yyyy-MM-dd\'T\'HH:mm:ss')
    console.log(formattedTime); // Example output: "2024-08-29T22:34:56"
    return formattedTime
}

export const get24HoursAgoTime = () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // subtract 24 hours
    const formattedTime = formatInTimeZone(oneDayAgo, 'Asia/Ulaanbaatar', "yyyy-MM-dd'T'HH:mm:ss");
    return formattedTime;
}

export const asset = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path.replace(/^\/+/, '') : path;
    return `${CDN_URL}/${normalizedPath}`;
}

/**
 * Function to hide specified fields from an object or array of objects.
 * @param data - The data to sanitize, which can be an object or an array of objects.
 * @param hiddenFields - The fields to hide from the data.
 * @returns A new object or array with the specified fields removed.
 */
export const hideFields = (data: any, hiddenFields: string[]=[]): any => {
    if (Array.isArray(data)) {
        // If data is an array, apply the hiding logic to each element
        return data.map((item) => hideObjectFields(item, hiddenFields));
    } else if (typeof data === 'object' && data !== null) {
        // If data is an object, apply the hiding logic directly
        return hideObjectFields(data, hiddenFields);
    } else {
        // If it's neither an array nor an object, just return the data unchanged
        return data;
    }
};

/**
 * Helper function to remove specified fields from an object.
 * @param obj - The object to sanitize.
 * @param hiddenFields - The fields to remove from the object.
 * @returns A new object with the specified fields removed.
 */
const hideObjectFields = (obj: any, hiddenFields: string[]): any => {
    const sanitizedObj = { ...obj }; // Clone the object to avoid mutating the original
    hiddenFields.forEach((field) => {
        delete sanitizedObj[field]; // Remove the specified fields
    });
    return sanitizedObj;
};

export async function getPresignedViewUrl(bucketName: string, objectKey: string, expiration: number = 300): Promise<string | null> {
    try {
        const normalizedPath = objectKey.startsWith('/') ? objectKey.replace(/^\/+/, '') : objectKey;
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: normalizedPath
        });

        // Generate a pre-signed URL for 'get_object' (GET method only)
        const url = await getSignedUrl(s3Client, command, { expiresIn: expiration });

        return url;
    } catch (error) {
        console.error("Error generating pre-signed URL", error);
        return null;
    }
}

export function getContentType(extension: string): "image" | "video" | "unknown" {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'];
  
    const ext = extension.toLowerCase();
  
    if (imageExtensions.includes(ext)) return "image";
    if (videoExtensions.includes(ext)) return "video";
    return "unknown";
}