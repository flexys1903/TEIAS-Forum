const express = require('path'); // ya da express
const expressApp = require('express');
const path = require('path');
const app = expressApp();
const PORT = process.env.PORT || 3000;

app.use(expressApp.json());
app.use(expressApp.static(path.join(__dirname, 'public')));

// Mesaj gönderilirken IP adresini yakalayıp kaydeden API rotası
app.post('/api/send-message', (req,-res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  // Burada Supabase'e IP adresiyle beraber mesajı kaydedebilirsin
  res.json({ success: true, ip: clientIp });
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
