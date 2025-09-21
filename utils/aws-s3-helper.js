/* eslint-disable no-async-promise-executor */
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} = require('@aws-sdk/client-s3');

const awsS3folderList = {
	0: 'institutions', // for universities
	1: 'institutions', // for colleges
	2: 'staff',
	3: 'students',
	profile: 'profile',
};
module.exports = {
	createPutObjectPresignedUrlWithClient(profileTypeID, key) {
		const client = new S3Client({
			region: process.env.REGION,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
		});
		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET,
			Key: awsS3folderList[profileTypeID]
				? `${awsS3folderList[profileTypeID]}/${key}`
				: key,
			ContentType: 'image/jpeg',
		});
		return getSignedUrl(client, command, { expiresIn: 3600 });
	},
	createGetObjectPresignedUrlWithClient(profileTypeID, key, type) {
		return new Promise(async (resolve, reject) => {
			try {
				const client = new S3Client({
					region: process.env.REGION,
					credentials: {
						accessKeyId: process.env.S3_ACCESS_KEY,
						secretAccessKey: process.env.S3_SECRET_KEY,
					},
				});
				const command = new GetObjectCommand({
					Bucket: process.env.S3_BUCKET,
					Key: Object.keys(awsS3folderList).includes(profileTypeID)
						? `${awsS3folderList[profileTypeID]}/${key}`
						: key,
				});
				const url = await getSignedUrl(client, command);
				resolve({ url, type });
			} catch (e) {
				reject(e);
			}
		});
	},
};
