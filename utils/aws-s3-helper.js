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
	banner: 'banner',
};
module.exports = {
	createPutObjectPresignedUrlWithClient(s3Bucket, profileTypeID, key) {
		const client = new S3Client({
			region: process.env.REGION,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
		});
		const command = new PutObjectCommand({
			Bucket: s3Bucket || process.env.S3_BUCKET,
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

	createR2PutObjectPresignedUrl(r2Bucket, profileTypeID, key) {
		const S3 = new S3Client({
			region: 'auto', // Required by SDK but not used by R2
			// Provide your Cloudflare account ID
			endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
			// Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
			credentials: {
				accessKeyId: process.env.R2_ACCESS_KEY_ID,
				secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
			},
		});
		return getSignedUrl(
			S3,
			new PutObjectCommand({
				Bucket: r2Bucket || process.env.R2_BUCKET,
				Key: awsS3folderList[profileTypeID]
					? `${awsS3folderList[profileTypeID]}/${key}`
					: key,
				ContentType: 'image/jpeg',
			}),
			{ expiresIn: 3600 },
		);
	},

	createR2GetObjectPresignedUrl(profileTypeID, key, type, r2Bucket) {
		return new Promise(async (resolve, reject) => {
			try {
				const S3 = new S3Client({
					region: 'auto', // Required by SDK but not used by R2
					endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
					credentials: {
						accessKeyId: process.env.R2_ACCESS_KEY_ID,
						secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
					},
				});
				const url = await getSignedUrl(
					S3,
					new GetObjectCommand({
						Bucket: r2Bucket || process.env.R2_BUCKET,
						Key: Object.keys(awsS3folderList).includes(
							profileTypeID,
						)
							? `${awsS3folderList[profileTypeID]}/${key}`
							: key,
					}),
				);
				resolve({ url, type });
			} catch (e) {
				reject(e);
			}
		});
	},
};
