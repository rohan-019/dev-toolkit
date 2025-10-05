const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const videoInput = document.getElementById("videoInput");
const videoPreview = document.getElementById("preview");
const gifPreview = document.getElementById("gifPreview");
const convertBtn = document.getElementById("convertBtn");
const statusText = document.getElementById("status");
const downloadBtn = document.getElementById("downloadBtn");

let videoFile;

videoInput.addEventListener("change", (event) => {
  videoFile = event.target.files[0];
  if (videoFile) {
    const url = URL.createObjectURL(videoFile);
    videoPreview.src = url;
  }
});

convertBtn.addEventListener("click", async () => {
  if (!videoFile) {
    alert("Please upload a video first!");
    return;
  }

  try {
    statusText.textContent = "⏳ Loading FFmpeg (takes a few seconds)...";
    convertBtn.disabled = true;

    await ffmpeg.load();
    statusText.textContent = "⚙️ Converting video to GIF...";

    // Write the uploaded file to FFmpeg’s virtual file system
    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

    // Run FFmpeg conversion
    await ffmpeg.run(
      "-i", "input.mp4",
      "-t", "3", // convert first 3 seconds
      "-vf", "fps=10,scale=320:-1:flags=lanczos",
      "output.gif"
    );

    // Read the output and show it
    const data = ffmpeg.FS("readFile", "output.gif");
    const gifBlob = new Blob([data.buffer], { type: "image/gif" });
    const gifUrl = URL.createObjectURL(gifBlob);

    gifPreview.src = gifUrl;
    gifPreview.style.display = "block";

    downloadBtn.href = gifUrl;
    downloadBtn.style.display = "inline-block";

    statusText.textContent = "✅ GIF created successfully!";
  } catch (err) {
    console.error("Error:", err);
    statusText.textContent = "❌ Conversion failed. Open console for details.";
  } finally {
    convertBtn.disabled = false;
  }
});
