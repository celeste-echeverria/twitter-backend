import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { InternalServerErrorException } from './errors'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const BUCKET_NAME = 'twitter-backend-pictures-bucket'

const s3Params = {
    Bucket: BUCKET_NAME,
}

const s3C = new S3Client({
    region: 'us-east-2',
})

// get presigned URL pre-firmada for downloading (GET)
export const getPresignedGetURL = async (fileName: string): Promise<string> => {
    try {
        const command = new GetObjectCommand({
            Key: fileName,
            ...s3Params,
        })

        const url = await getSignedUrl(s3C, command, { expiresIn: 900 })
        //console.log('Pre-signed get URL generado: ', url)
        return url
    } catch (error) {
        console.error('Error al generar pre-signed URL:', error)
        throw new InternalServerErrorException('getPresignedGetURL')
    }
}

// get presigned URL pre-firmada for uploading (PUT)
export const getPresignedPutUrl = async (fileName: string): Promise<string> => {
    try {
        const command = new PutObjectCommand({
            Key: fileName,
            ContentType: 'image/jpeg',
            ...s3Params,
        })
        const url = await getSignedUrl(s3C, command, { expiresIn: 900 })
        // console.log('Pre-signed put URL generado: ', url);
        return url
    } catch (error) {
        console.error('Error al generar pre-signed URL:', error)
        throw new InternalServerErrorException('getPresignedPutUrl')
    }
}
