const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase Bağlantısı (Kendi anahtarlarını buraya yazacaksın)
const supabase = createClient('SENIN_SUPABASE_URL', 'SENIN_SUPABASE_ANON_KEY');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Mesaj Gönderirken Ban ve Süre Kontrolü
app.post('/api/send-message', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Aktif ve süresi geçmemiş bir ban var mı kontrol et
  const { data: activeBans, error } = await supabase
    .from('bans')
    .select('*')
    .eq('ip_address', clientIp)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  if (activeBans && activeBans.length > 0) {
    return res.status(403).json({ 
      success: false, 
      message: 'Bu IP adresinden banlanmış durumdasın kanka!' 
    });
  }

  // Ban yoksa mesaj gönderme işlemleri devam eder...
  res.json({ success: true, message: 'Mesaj iletildi.' });
});

// 2. Admin için Ban Atma API'si (Süreli veya Kalıcı)
app.post('/api/ban-user', async (req, res) => {
  const { ip, durationMinutes, reason } = req.body; 
  // durationMinutes: null ise kalıcı, sayı ise (örn: 60 dk, 1440 dk) süreli

  let expiresAt = null;
  if (durationMinutes) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + parseInt(durationMinutes));
    expiresAt = date.toISOString();
  }

  const { error } = await supabase.from('bans').insert([
    { ip_address: ip, reason: reason || 'Kural ihlali', expires_at: expiresAt }
  ]);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Kullanıcı başarıyla banlandı.' });
});

// 3. Admin için Ban Kaldırma (Unban) API'si
app.post('/api/unban-user', async (req, res) => {
  const { banId } = req.body;

  const { error } = await supabase
    .from('bans')
    .delete()
    .eq('id', banId);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, message: 'Ban başarıyla kaldırıldı.' });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
