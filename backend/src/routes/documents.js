const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  chatWithDocument,
  getSummary,
  getEntities,
  getClassification,
  getAnalytics,
} = require("../controllers/documentController");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

const router = express.Router();

router.use(auth);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);
router.post("/:id/chat", chatWithDocument);
router.get("/:id/summary", getSummary);
router.get("/:id/entities", getEntities);
router.get("/:id/classify", getClassification);
router.get("/:id/analytics", getAnalytics);

module.exports = router;
