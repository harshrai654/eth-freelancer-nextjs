import fleekStorage from "@fleekhq/fleek-storage-js";
import formidable from "formidable";

const FLEEK_STORAGE_API_KEY = process.env.FLEEK_STORAGE_API_KEY;
const FLEEK_STORAGE_API_SECRET = process.env.FLEEK_STORAGE_API_SECRET;

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	const form = new formidable.IncomingForm();
	form.uploadDir = "./";
	form.keepExtensions = true;
	return form.parse(req, async (err, fields, files) => {
		const username = fields.username;
		const imageFile = files.imageFile;

		console.log(err);

		const uploadedFile = await fleekStorage.upload({
			apiKey: FLEEK_STORAGE_API_KEY,
			apiSecret: FLEEK_STORAGE_API_SECRET,
			key: username,
			ContentType: "image/png",
			data: imageFile,
			httpUploadProgressCallback: (event) => {
				console.log(
					`${fileKey} Image file upload : ${Math.round(
						(event.loaded / event.total) * 100
					)}% done`
				);
			},
		});

		console.log(uploadedFile);

		res.send({
			publicUrl: uploadedFile.publicUrl,
		});
	});
}
