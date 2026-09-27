import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const get404 = (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "html", "404.html");

  res.status(404).sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({
        status: "fail",
        message: `No se encontró ${req.originalUrl}`
      });
    }
  });
};
