const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const region = process.env.REGION || 'ap-south-1'; // Adjust the region as needed

const getUploadedFileDetails = (s3EventRecord) => {
	const bucket = s3EventRecord.bucket.name;
	const key = decodeURIComponent(
		s3EventRecord.object.key.replace(/\+/g, ' '),
	);
	console.log(`Processing file: ${key} from bucket: ${bucket}`);

	// Parse folder structure instead of complex regex
	const parts = key.split('/');
	const app = parts[1];
	const rootFolder = parts[0];
	const institutionFolder = parts[2];
	const category = parts[3];
	const filename = parts[4];
	const extension = path.extname(filename).slice(1);

	// Institution ID and optional name
	let institutionID = institutionFolder;
	let institutionName = null;
	const nameStartIndex = institutionFolder.indexOf('(');
	if (nameStartIndex > -1) {
		institutionID = institutionFolder.substring(0, nameStartIndex).trim();
		institutionName = institutionFolder.substring(
			nameStartIndex + 1,
			institutionFolder.length - 1,
		);
	}

	return {
		bucket,
		key,
		rootFolder,
		app,
		institutionID,
		institutionName,
		category,
		filename,
		extension,
	};
};

const getFileFromS3 = async (bucket, key) => {
	const s3 = new S3Client({ region });
	const command = new GetObjectCommand({ Bucket: bucket, Key: key });
	const response = await s3.send(command);
	return response;
};

module.exports = {
	getUploadedFileDetails,
	getFileFromS3,
};
