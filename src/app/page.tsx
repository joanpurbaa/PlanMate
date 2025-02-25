"use client";
import { useFormik } from "formik";
import validationSchema from "@/lib/validation";
import { useState } from "react";

export default function Home() {
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState("");
	const [imageError, setImageError] = useState(false);
	const [result, setResult] = useState();
	const formData = new FormData();

	const handleFile = (e) => {
		setImage(e.target.files[0]);
		setPreview(URL.createObjectURL(e.target.files[0]));
		setImageError(false);
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

			let fileExt = image.type.split("/")[1].toLowerCase();
			let acceptedExt = ["png", "jpg", "jpeg"];

			if (!acceptedExt.includes(fileExt)) {
				console.log("ditolak");
				return;
			}

			formData.append("image", image);
			formData.append("task", values.task);

			fetch("/api/add", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
          const cleanedResult = data.result.replace(/^```html\s+|```$/g, "");
					setResult(cleanedResult);
				});
		},
	});

	return (
		<>
			<main className="grid grid-cols-12 text-white py-10 px-5">
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
					className="col-span-12 lg:col-start-4 lg:col-span-6 mt-10 text-xs sm:text-lg bg-zinc-700 border border-zinc-500 p-5 rounded-xl">
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
								<div dangerouslySetInnerHTML={{ __html: result }}></div>
							</li>
						)}
					</ul>
				</form>
			</main>
		</>
	);
}
