const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Kazan Dairesi Şifre Kontrolü (Render Environment Variables üzerinden okunur)
app.post('/api/login/kazan-dairesi', (req, res) => {
    const { password } = req.body;
    const kazanPass = process.env.KAZAN_DAIRESI_PASS || "190303"; // Render'da tanımlanmazsa varsayılan

    if (password === kazanPass) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Hatalı şifre!" });
    }
});

app.get('/api/config', (req, res) => {
    res.json({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY
    });
});

app.listen(PORT, () => {
    console.log(`TEİAŞ Sunucusu ${PORT} portunda çalışıyor.`);
});
