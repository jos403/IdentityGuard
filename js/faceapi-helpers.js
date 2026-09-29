/* ================= FACE-API.JS SETUP (GRATIS, CLIENT-SIDE) =================
   File ini hanya di-include di halaman yang butuh deteksi wajah:
   login.html, register.html, layanan.html — supaya halaman lain
   (home/riwayat/obat/profil) tetap ringan & cepat dibuka. */
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
let modelsReady = false;

(async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    modelsReady = true;
    showToast('Model AI deteksi wajah siap digunakan', 'ok');
  } catch (e) {
    showToast('Gagal memuat model AI. Jalankan lewat local server, bukan dibuka langsung.', 'err');
    console.error(e);
  }
})();

function isBlurry(canvas){
  const ctx = canvas.getContext('2d');
  const {width,height} = canvas;
  const data = ctx.getImageData(0,0,width,height).data;
  const gray = new Float32Array(width*height);
  for(let i=0;i<width*height;i++){
    gray[i] = 0.299*data[i*4] + 0.587*data[i*4+1] + 0.114*data[i*4+2];
  }
  let sum=0,sumSq=0,count=0;
  for(let y=1;y<height-1;y++){
    for(let x=1;x<width-1;x++){
      const idx=y*width+x;
      const lap = gray[idx-1]+gray[idx+1]+gray[idx-width]+gray[idx+width]-4*gray[idx];
      sum+=lap; sumSq+=lap*lap; count++;
    }
  }
  const mean=sum/count, variance=sumSq/count-mean*mean;
  return variance < 80; // ambang batas empiris
}

async function getDescriptorFromInput(input){
  const det = await faceapi.detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();
  return det ? det.descriptor : null;
}

/* ================= MODAL KAMERA GENERIK =================
   Dipakai untuk: selfie registrasi, verifikasi wajah login,
   dan verifikasi wajah saat pengajuan layanan (on-the-spot). */
let modalStream = null;

function openCaptureModal(title, onCaptured){
  document.getElementById('cameraModalTitle').textContent = title;
  const modal = document.getElementById('cameraModal');
  modal.classList.remove('hidden');

  navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
    modalStream = stream;
    document.getElementById('cameraVideo').srcObject = stream;
  }).catch(()=> showToast('Tidak bisa mengakses kamera. Periksa izin browser.', 'err'));

  const btn = document.getElementById('cameraCaptureBtn');
  btn.onclick = () => {
    const video = document.getElementById('cameraVideo');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0);
    closeCameraModal();
    onCaptured(canvas);
  };
}

function closeCameraModal(){
  if(modalStream){ modalStream.getTracks().forEach(t=>t.stop()); modalStream = null; }
  document.getElementById('cameraModal').classList.add('hidden');
}
