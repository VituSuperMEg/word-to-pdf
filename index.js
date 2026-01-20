import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
const PORT = process.env.PORT || 3000;

const app = express();
const upload = multer({ dest: "/tmp" });

app.post("/convert", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Arquivo não enviado" });
  }

  const inputPath = req.file.path;
  const outputDir = "/tmp";

  exec(
    `soffice --headless --convert-to pdf ${inputPath} --outdir ${outputDir}`,
    (error) => {
      if (error) {
        return res.status(500).json({ error: "Erro ao converter" });
      }

      const pdfPath = inputPath.replace(path.extname(input.file), ".pdf");

      res.download(pdfPath, "arquivo.pdf", () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(pdfPath);
      });
    }
  );
});

app.get("/", (req, res) => {
  res.send("LibreOffice converter rodando");
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta 3000");
});
