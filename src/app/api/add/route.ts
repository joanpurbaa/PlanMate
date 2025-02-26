import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
	try {
		const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const formData = await request.formData();
		const image = formData.get("image") as File;
		const task = formData.get("task");

		if (!(image instanceof File)) {
			throw new Error("Uploaded image is not a valid file.");
		}

		const fileType = image?.type.split("/")[1].toLowerCase();
		const fileName = Math.random().toString().split(".")[1];
		const fullFileName = fileName + "." + fileType;

		const blob = await put(fullFileName, image, {
			access: "public",
		});

		revalidatePath("/");

		const imageResp = await fetch(blob.url).then((response) =>
			response.arrayBuffer()
		);

		const result = await model.generateContent([
			{
				inlineData: {
					data: Buffer.from(imageResp).toString("base64"),
					mimeType: "image/jpeg",
				},
			},
			`
        Saya ingin mencari waktu yang **luang** untuk melakukan kegiatan berikut:  
  **"${task}"**  
  
  Tolong analisis jadwal saya dan tentukan waktu kosong yang tersedia untuk kegiatan ini.  
  Jawaban harus dalam format HTML dengan ketentuan berikut:  
  
  1. **Struktur HTML yang wajib digunakan:**  
     - Gunakan <table> untuk menampilkan jadwal dengan **border dan padding** agar mudah dibaca.  
     - **Jangan gunakan tag lain selain <h1>, <p>, dan <table>.**  
  
  2. **Kelas CSS yang wajib digunakan:**  
     - <p> harus memiliki **class="text-xs sm:text-base"**  
     - <table> harus memiliki **class="my-5 border border-collapse w-full text-xs sm:text-base"**  
  
  3. **Format konten HTML:**  
     - **Tabel harus berisi rekomendasi waktu kosong**, dengan contoh struktur yang harus 100% mirip dengan ini:  
       
        <p className="font-semibold">
          Rekomendasi untuk kamu agar bisa ${task}!
        </p>
        <table className="my-5 border border-collapse w-full">
          <tr>
            <th className="border p-2 font-bold">Hari</th>
            <th className="border p-2 font-bold">Waktu Kosong</th>
          </tr>
          <tr>
            <td className="border p-2 font-normal">Senin</td>
            <td className="border p-2 font-normal">08:00 - 12:00</td>
          </tr>
          <tr>
            <td className="border p-2 font-normal">Selasa</td>
            <td className="border p-2 font-normal">06:00 - 07:00</td>
          </tr>
        </table>
        <p className="text-red-300 font-semibold italic">*maaf jika hasil kurang memuaskan karena ini adalah rekomendasi dari AI</p>
       
       <p class="text-xs sm:text-base">*Maaf, rekomendasi kurang memuaskan karena dirender dari AI.</p>
       
  
  4. **Tambahan:**  
     - **Gunakan <b> untuk menyorot bagian penting** seperti judul tabel dan jam yang direkomendasikan.  
     - **Semua teks harus rata kiri (left-aligned).**  
     - **Tambahkan sedikit jarak antar elemen (margin-top) agar lebih mudah dibaca.**  
  
  **Output hanya ada 3 struktur, pertama tag p berisikan kata 'Rekomendasi untuk kamu agar bisa...', kedua table, ketiga tag p berisi '*Maaf, rekomendasi kurang memuaskan karena dirender dari AI.', tanpa pengantar atau basa-basi.**  
  **OUtput harus masuk akal kedalam kemanusiaan.**
  Jika tidak ada waktu kosong, berikan saran konkret untuk mengatur ulang jadwal atau rekomendasi waktu alternatif.
  
  Tolong buat output yang langsung bisa ditampilkan di frontend dalam format HTML.
        `,
		]);

		del(blob.url);

		return NextResponse.json({ result: result.response.text() });
	} catch {
		return NextResponse.json({ status: 500 });
	}
}
