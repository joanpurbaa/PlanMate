"use client";
import { useFormik } from "formik";
import validationSchema from "@/lib/validation";
import { useState } from "react";

export default function Home() {
	const [image, setImage] = useState<File | null>();
	const [preview, setPreview] = useState("");
	const [imageError, setImageError] = useState(false);
	const [result, setResult] = useState();
	const [loading, setLoading] = useState(false);
	const formData = new FormData();

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			setImage(file);
			setPreview(URL.createObjectURL(file));
			setImageError(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			task: "",
		},
		validationSchema,
		onSubmit: (values) => {
			if (!image) {
				setImageError(true);
				return;
			}

			const fileExt = image.type.split("/")[1].toLowerCase();
			const acceptedExt = ["png", "jpg", "jpeg"];

			if (!acceptedExt.includes(fileExt)) {
				console.log("ditolak");
				return;
			}

			formData.append("image", image);
			formData.append("task", values.task);
			setLoading(true);

			fetch("/api/add", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					const cleanedResult = data.result.replace(/^```html\s+|```$/g, "");
					setResult(cleanedResult);
					setLoading(false);
				});
		},
	});

	return (
		<>
			<main className="grid grid-cols-12 text-white py-10 px-3 sm:px-5">
				<section className="col-span-12 flex flex-col items-center">
					<h1 className="text-2xl sm:text-3xl md:text-5xl font-black">
						Plan<span className="text-red-400">Mate</span>
					</h1>
					<p className="text-sm sm:text-lg md:text-3xl font-bold text-yellow-300">
						Atur jadwal tanpa ribet!
					</p>
				</section>
				<form
					onSubmit={formik.handleSubmit}
					encType="multipart/form-data"
					className="col-span-12 lg:col-start-4 lg:col-span-6 mt-10 text-xs sm:text-lg bg-zinc-700 border border-zinc-500 p-3 sm:p-5 rounded-xl">
					<ul className="space-y-10">
						<li className="space-y-2">
							<p className="font-medium">1. Masukkan jadwal/roster kamu!</p>
							{preview ? (
								<>
									<div className="flex items-center justify-center w-full h-[300px]">
										<label
											htmlFor="dropzone-file"
											className="h-[300px] flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-zinc-600 dark:bg-zinc-500 hover:bg-gray-100">
											<div className="w-full">
												<img
													className="w-full h-[300px] object-cover object-top p-5"
													src={preview}
													alt=""
												/>
											</div>
											<input
												onChange={handleFile}
												id="dropzone-file"
												type="file"
												className="hidden"
												accept="image/png, image/jpg, image/jpeg"
											/>
										</label>
									</div>
								</>
							) : (
								<>
									<div className="flex items-center justify-center w-full">
										<label
											htmlFor="dropzone-file"
											className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-zinc-600 dark:bg-zinc-500 hover:bg-gray-100">
											<div className="flex flex-col items-center justify-center pt-5 pb-6">
												<svg
													className="w-8 h-8 mb-4"
													aria-hidden="true"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 20 16">
													<path
														stroke="currentColor"
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
													/>
												</svg>
												<p className="mb-2 text-sm">
													<span className="font-semibold">Click to upload</span>
												</p>
												<p className="text-xs">PNG, JPG or JPEG</p>
											</div>
											<input
												onChange={handleFile}
												id="dropzone-file"
												type="file"
												className="hidden"
												accept="image/png, image/jpg, image/jpeg"
											/>
										</label>
									</div>
									{imageError && (
										<p className="text-red-400 font-medium italic">
											Masukkan jadwal/roster kamu!
										</p>
									)}
								</>
							)}
						</li>
						<li className="space-y-2">
							<p className="font-medium">
								2. Masukkan kegiatan yang mau kamu lakukan!
							</p>
							<div className="mb-6">
								<input
									type="text"
									id="task"
									name="task"
									onChange={formik.handleChange}
									value={formik.values.task}
									className="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-500 hover:bg-zinc-600  dark:placeholder-white dark:text-white outline-none"
									placeholder="Cth *memasak"
								/>
							</div>
							{formik.errors.task ? (
								<p className="text-red-400 font-medium italic">{formik.errors.task}</p>
							) : null}
						</li>
						<li>
							<button
								type="submit"
								className="w-full bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-500 font-bold py-2 rounded-md">
								Cari jadwal
							</button>
						</li>
						{result && (
							<li>
								<div
									dangerouslySetInnerHTML={{ __html: result }}
									className="text-xs sm:text-base"></div>
							</li>
						)}
					</ul>
				</form>
			</main>
			{loading && (
				<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
					<div role="status">
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			)}
		</>
	);
}
