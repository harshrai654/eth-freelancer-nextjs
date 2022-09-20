import axios from "axios";

export default {
	uploadImage: (imageFile, username) => {
		let formData = new FormData();
		formData.set("imageFile", imageFile);
		formData.set("username", username);
		console.log(imageFile, username, formData);
		return axios
			.put("/api/uploadImage", formData, {
				headers: {
					"Content-Type": imageFile.type,
				},
			})
			.then((res) => res.data.publicUrl);
	},
};
