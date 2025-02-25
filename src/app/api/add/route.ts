import { NextResponse } from "next/server";
import path from "path";
import { unlink, writeFile } from "fs/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function POST(request: Request) {
	// api
	const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
	const fileManager = new GoogleAIFileManager(`${process.env.GEMINI_API_KEY}`);
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	// image
	const formData = await request.formData();
	const image = formData.get("image");
	const task = formData.get("task");

	// input image process
	const buffer = Buffer.from(await image?.arrayBuffer());
	const fileType = image?.type.split("/")[1].toLowerCase();
	const fileName = Math.random().toString().split(".")[1];
	const fullFileName = fileName + "." + fileType;

	try {
		await writeFile(
			path.join(process.cwd(), `src/_temp/${fullFileName}`),
			buffer
		);

		const uploadResult = await fileManager.uploadFile(
			`src/_temp/${fullFileName}`,
			{
				mimeType: image.type,
				displayName: image.name,
			}
		);

		const result = await model.generateContent([
			`
      Saya ingin mencari waktu yang **luang** untuk melakukan kegiatan berikut:  
**"${task}"**  

Tolong analisis jadwal saya dan tentukan waktu kosong yang tersedia untuk kegiatan ini.  
Jawaban harus dalam format HTML dengan ketentuan berikut:  

1. **Struktur HTML yang wajib digunakan:**  
   - Gunakan <h1> untuk heading utama.  
   - Gunakan <table> untuk menampilkan jadwal dengan **border dan padding** agar mudah dibaca.  
   - **Jangan gunakan tag lain selain <h1>, <p>, dan <table>.**  

2. **Kelas CSS yang wajib digunakan:**  
   - <h1> harus memiliki **class="text-sm sm:text-xl"**  
   - <p> harus memiliki **class="text-xs sm:text-base"**  
   - <table> harus memiliki **class="border border-collapse w-full text-xs sm:text-base"**  

3. **Format konten HTML:**  
   - **Judul** dalam <h1> harus berbentuk:  
     
     <h1 class="text-sm sm:text-xl">Rekomendasi untuk kamu agar bisa ${task}</h1>
     
   - **Tabel harus berisi rekomendasi waktu kosong**, dengan struktur:  
     
     <table class="border border-collapse w-full text-xs sm:text-base">
       <tr>
         <th class="border p-2">Hari</th>
         <th class="border p-2">Waktu Kosong</th>
       </tr>
       <tr>
         <td class="border p-2">Senin</td>
         <td class="border p-2"><b>08:00 - 12:00</b></td>
       </tr>
       ...
     </table>
     
     <p class="text-xs sm:text-base">Maaf, rekomendasi kurang memuaskan karena dirender dari AI.</p>
     

4. **Tambahan:**  
   - **Gunakan <b> untuk menyorot bagian penting** seperti judul tabel dan jam yang direkomendasikan.  
   - **Semua teks harus rata kiri (left-aligned).**  
   - **Tambahkan sedikit jarak antar elemen (margin-top) agar lebih mudah dibaca.**  

**Output harus langsung ke poin utama, tanpa pengantar atau basa-basi.**  
**OUtput harus masuk akal kedalam kemanusiaan.**
Jika tidak ada waktu kosong, berikan saran konkret untuk mengatur ulang jadwal atau rekomendasi waktu alternatif.

Tolong buat output yang langsung bisa ditampilkan di frontend dalam format HTML.
      `,
			{
				fileData: {
					fileUri: uploadResult.file.uri,
					mimeType: uploadResult.file.mimeType,
				},
			},
		]);

		await unlink(`src/_temp/${fullFileName}`);

		return NextResponse.json({ result: result.response.text() });
	} catch (error) {
		return NextResponse.json({ status: 500 });
	}
}
