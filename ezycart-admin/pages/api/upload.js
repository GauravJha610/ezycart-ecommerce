import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs'
import mime from 'mime-types'
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handler(req, res) {

    await mongooseConnect();
    await isAdminRequest(req, res);

    const form = new multiparty.Form()
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            } else {
                resolve({ fields, files })
            }
        });
    });


    // create connection with S3
    const client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
    });


    // Add all images to S3 bucket named(audiophile-ecommerce)
    const links = [];
    for (const file of files.file) {
        const extension = file.originalFilename.split('.').pop()
        // console.log("Uploaded File details: ",{extension,file})

        const newFilename = Date.now() + '.' + extension        //to generate random file name
        // console.log(newFilename)
        client.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path)
        }));
        const link = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${newFilename}`
        links.push(link)
    }
    res.json({ links })
}

export const config = {
    api: { bodyParser: false }
}