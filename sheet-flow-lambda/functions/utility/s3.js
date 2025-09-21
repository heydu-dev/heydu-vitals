const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { LATEST_VERSION } = require('./excel');

const region = process.env.REGION || 'ap-south-1'; // Adjust the region as needed

function parseKey(key) {
	const re =
		/^(?:(?<bucket>[^/]+)\/)?excel-store\/(?<app>[^/]+)\/(?:(?<institutionID>[^/ (]+)(?: ?\((?<institutionName>[^/]+)\))?\/(?<category>[^/]+)\/)?(?:(?<version>v\d+)\/)?(?<filename>[^/]+)$/;

	const m = re.exec(key);
	if (!m) return null;
	const {
		bucket,
		app,
		institutionID,
		institutionName,
		category,
		version,
		filename,
	} = m.groups;

	const extension = path.extname(filename).slice(1);
	// If no category (app-level v1 style), derive it from the filename (minus extension)
	const derivedCategory =
		category.trim() ||
		filename
			.replace(/\.[^.]+$/, '')
			.trim()
			.toLowerCase();
	return {
		bucket,
		app: app.trim(),
		institutionID: institutionID.trim() || null,
		institutionName: institutionName.trim() || null,
		category: derivedCategory,
		filename: filename.trim(),
		extension,
		version: version || LATEST_VERSION[derivedCategory],
	};
}

const getUploadedFileDetails = (s3EventRecord) => {
	const bucket = s3EventRecord.bucket.name;
	const key = decodeURIComponent(
		s3EventRecord.object.key.replace(/\+/g, ' '),
	);
	console.log(`Processing file: ${key} from bucket: ${bucket}`);

	// Parse folder structure instead of complex regex
	// excel-store/heydu/abc123/students/v1/3166c9e3-34b9-4d92-acd3-de62e890154c.xlsx

	const {
		app,
		institutionID,
		institutionName,
		category,
		filename,
		extension,
		version,
	} = parseKey(key);

	const parts = key.split('/');

	const rootFolder = parts[0];

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
		version,
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
