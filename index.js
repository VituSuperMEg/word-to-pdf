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
  const pdfPath = `${inputPath}.pdf`;

  const cmd = `
    soffice \
    --headless \
    --nologo \
    --nofirststartwizard \
    --norestore \
    -env:UserInstallation=file:///tmp/lo-profile \
    --convert-to pdf \
    "${inputPath}" \
    --outdir /tmp
  `;

  exec(cmd, { timeout: 30000 }, (error, stdout, stderr) => {
    if (error) {
      console.error("LibreOffice stderr:", stderr);
      return res.status(500).json({
        error: "Erro ao converter",
        details: stderr
      });
    }

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({
        error: "PDF não gerado"
      });
    }

    res.download(pdfPath, "arquivo.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(pdfPath);
    });
  });
});


app.get("/", (req, res) => {
  res.send("LibreOffice converter rodando");
});


if (!PORT) {
  console.error("PORT não definida");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});