const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const fs = require('fs');

// 1️⃣ Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Exporting the upload middleware to be used in Routes
exports.upload = multer({ storage }).array('photos', 10);

// 2️⃣ Add Photos to Group
exports.addPhotosToGroup = (req, res) => {
    const { groupId, uploadedBy } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ success: false, error: "No files uploaded." });
    }

    if (!groupId || !uploadedBy) {
        return res.status(400).json({ success: false, error: "Missing Group ID or User ID" });
    }

    let uploadedCount = 0;
    const errors = [];

    // Loop through files using traditional callbacks
    files.forEach((file) => {
        const localPath = `/uploads/${file.filename}`;

        const insertPhotoSql = 'INSERT INTO group_photos (photo_link, uploaded_by) VALUES (?, ?)';

        db.query(insertPhotoSql, [localPath, uploadedBy], (err, photoResult) => {
            if (err) {
                errors.push(err);
            } else {
                const photoId = photoResult.insertId;
                const mapSql = 'INSERT INTO group_photo_map (group_id, photo_id) VALUES (?, ?)';

                db.query(mapSql, [groupId, photoId], (err) => {
                    if (err) errors.push(err);
                });
            }

            uploadedCount++;
            // Once all files are processed, send the response
            if (uploadedCount === files.length) {
                if (errors.length > 0) {
                    return res.status(500).json({ success: false, error: "Some files failed to upload" });
                }
                res.json({ success: true, message: "All photos saved successfully" });
            }
        });
    });
};

// 3️⃣ Get Photos for a Group
exports.getGroupPhotos = (req, res) => {
    const { groupId } = req.params;

    const sql = `
        SELECT gp.photo_id, gp.photo_link, gp.uploaded_by, gp.uploaded_at,u.name AS uploaded_name
        FROM group_photos gp
        JOIN group_photo_map gpm ON gp.photo_id = gpm.photo_id
        JOIN users u ON gp.uploaded_by = u.id
        WHERE gpm.group_id = ?
        ORDER BY gp.uploaded_at DESC
    `;

    db.query(sql, [groupId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: "Failed to fetch group photos" });
        }

        // Map through results to add the full server URL
        const photos = results.map(photo => ({
            ...photo,
            url: `http://localhost:5000${photo.photo_link}`
        }));

        res.json({ success: true, photos: photos });
    });
};

exports.deletePhotosFromGroup = (req, res) => {
    const { photoIds } = req.body;

    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
        return res.status(400).json({ success: false, message: "No photo IDs provided" });
    }

    // 1️⃣ First, get the file paths so we can delete them from the disk
    const findPathsSql = "SELECT photo_link FROM group_photos WHERE photo_id IN (?)";

    db.query(findPathsSql, [photoIds], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });

        // 2️⃣ Delete physical files from the 'uploads' folder
        results.forEach(photo => {
            // Remove the leading slash if your path is "/uploads/file.jpg"
            const relativePath = photo.photo_link.startsWith('/') ? photo.photo_link.substring(1) : photo.photo_link;
            const fullPath = path.join(__dirname, '..', relativePath);

            fs.unlink(fullPath, (err) => {
                if (err) console.error("Disk deletion error:", err);
            });
        });

        // 3️⃣ Delete from mapping table (Foreign Key constraint safety)
        const deleteMapSql = "DELETE FROM group_photo_map WHERE photo_id IN (?)";
        db.query(deleteMapSql, [photoIds], (err) => {
            if (err) return res.status(500).json({ success: false, error: err });

            // 4️⃣ Finally, delete from group_photos table
            const deletePhotoSql = "DELETE FROM group_photos WHERE photo_id IN (?)";
            db.query(deletePhotoSql, [photoIds], (err) => {
                if (err) return res.status(500).json({ success: false, error: err });

                res.json({ success: true, message: "Photos deleted from database and disk" });
            });
        });
    });
};