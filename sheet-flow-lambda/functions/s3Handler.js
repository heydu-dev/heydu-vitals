module.exports.s3Handler = async (event) => {
	console.log('S3 Event:', JSON.stringify(event, null, 2));

	event.Records.forEach((record) => {
		const bucket = record.s3.bucket.name;
		const key = decodeURIComponent(
			record.s3.object.key.replace(/\+/g, ' '),
		);
		console.log(`File uploaded: ${key} in bucket: ${bucket}`);
		// Add your processing logic here
	});

	return {
		statusCode: 200,
		body: 'File processed successfully',
	};
};
