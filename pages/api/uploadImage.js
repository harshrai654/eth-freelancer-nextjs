import fleekStorage from "@fleekhq/fleek-storage-js";

const FLEEK_STORAGE_API_KEY = process.env.FLEEK_STORAGE_API_KEY;
const FLEEK_STORAGE_API_SECRET = process.env.FLEEK_STORAGE_API_SECRET;

export default async function handler(req, res) {
	const fileKey = req.body;
	const data = req.body;

	const uploadedFile = await fleekStorage.upload({
		apiKey: FLEEK_STORAGE_API_KEY,
		apiSecret: FLEEK_STORAGE_API_SECRET,
		key: fileKey,
		ContentType: "image/png",
		data,
		httpUploadProgressCallback: (event) => {
			console.log(
				`${fileKey} Image file upload : ${Math.round(
					(event.loaded / event.total) * 100
				)}% done`
			);
		},
	});
}
