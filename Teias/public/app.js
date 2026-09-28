// Supabase Bilgilerin (Supabase panelinden alıp buraya ekleyeceksin)
const SUPABASE_URL = 'SENIN_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'SENIN_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const mediaInput = document.getElementById('mediaInput');
const messageContainer = document.getElementById('messageContainer');
const videoWarning = document.getElementById('videoWarning');

// 20 Saniye Video Kontrolü
mediaInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    videoElement.onloadedmetadata = function() {
      window.URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 20) {
        videoWarning.classList.remove('hidden');
        mediaInput.value = ''; // Seçimi sıfırla
      } else {
        videoWarning.classList.add('hidden');
      }
    }
    videoElement.src = URL.createObjectURL(file);
  } else {
    videoWarning.classList.add('hidden');
  }
});
