import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/src/pages/admin-dashboard.html'));
});

export default router; 