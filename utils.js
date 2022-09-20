import axios from "axios";

export default {
	uploadImage: (imageFile) =>
		axios
			.put("/api/uploadImage", imageFile, {
				headers: {
					"Content-Type": imageFile.type,
				},
			})
			.then((res) => res.data),
};
