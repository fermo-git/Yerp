// Subida y validación de imágenes de galería.
// Estrategia defensa-en-profundidad:
//   1) Multer memoryStorage con límite de tamaño y nº de archivos.
//   2) fileFilter descarta por MIME (primera pasada).
//   3) detectImage valida los MAGIC BYTES reales del buffer (autoridad).
//   4) sharp verifica que la imagen decodifique y cumpla 16:9 + tamaño mínimo.
//   5) Se re-decodifica con sharp (strip de metadatos/EXIF) y se guarda con
//      nombre UUID (sin nombre del usuario → evita path traversal).
import multer from "multer";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads");
const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED = {
  "image/jpeg": { ext: "jpg", format: "jpeg", signature: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }] },
  "image/png": {
    ext: "png",
    format: "png",
    signature: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }],
  },
  "image/webp": {
    ext: "webp",
    format: "webp",
    signature: [
      { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
      { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
    ],
  },
};

const RATIO_TARGET = 16 / 9;
const RATIO_TOLERANCE = 0.01; // ±1%
const MIN_WIDTH = 1280;
const MIN_HEIGHT = 720;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  },
});

function bytesEqual(buf, offset, bytes) {
  if (buf.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buf[offset + i] !== bytes[i]) return false;
  }
  return true;
}

function detectImage(buffer) {
  for (const [mime, spec] of Object.entries(ALLOWED)) {
    const ok = spec.signature.every((s) => bytesEqual(buffer, s.offset, s.bytes));
    if (ok) return { mime, ext: spec.ext, format: spec.format };
  }
  return null;
}

class ImageValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/**
 * Valida y guarda una imagen de galería.
 * @returns {Promise<{ url: string, width: number, height: number }>}
 */
export async function validateAndSaveImage(file) {
  if (!file || !file.buffer || !file.buffer.length) {
    throw new ImageValidationError("Archivo vacío", "INVALID_IMAGE");
  }
  const detected = detectImage(file.buffer);
  if (!detected) {
    throw new ImageValidationError("Tipo de imagen no permitido", "INVALID_IMAGE_TYPE");
  }

  let meta;
  try {
    meta = await sharp(file.buffer).metadata();
  } catch {
    throw new ImageValidationError("Imagen corrupta o no decodificable", "INVALID_IMAGE");
  }
  if (!meta.width || !meta.height) {
    throw new ImageValidationError("No se pudieron leer las dimensiones", "INVALID_IMAGE");
  }
  if (meta.width < MIN_WIDTH || meta.height < MIN_HEIGHT) {
    throw new ImageValidationError(
      `Mínimo ${MIN_WIDTH}×${MIN_HEIGHT} (recibido ${meta.width}×${meta.height})`,
      "IMAGE_TOO_SMALL"
    );
  }
  const ratio = meta.width / meta.height;
  if (Math.abs(ratio - RATIO_TARGET) > RATIO_TOLERANCE) {
    throw new ImageValidationError("La imagen debe tener relación de aspecto 16:9", "WRONG_ASPECT_RATIO");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${detected.ext}`;
  const dest = path.join(UPLOAD_DIR, filename);
  await sharp(file.buffer)
    .rotate()
    .toFormat(detected.format, { quality: 85 })
    .toFile(dest);

  return { url: `${PUBLIC_BASE_URL}/uploads/${filename}`, width: meta.width, height: meta.height };
}

export const MENU_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const MENU_ALLOWED = {
  ...ALLOWED,
  "application/pdf": {
    ext: "pdf",
    format: "pdf",
    signature: [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }],
  },
};

export const menuUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MENU_MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (MENU_ALLOWED[file.mimetype]) return cb(null, true);
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  },
});

function detectMenu(buffer) {
  for (const [mime, spec] of Object.entries(MENU_ALLOWED)) {
    const ok = spec.signature.every((s) => bytesEqual(buffer, s.offset, s.bytes));
    if (ok) return { mime, ext: spec.ext, format: spec.format };
  }
  return null;
}

export async function validateAndSaveMenu(file) {
  if (!file || !file.buffer || !file.buffer.length) {
    throw new ImageValidationError("Archivo vacío", "INVALID_FILE");
  }
  const detected = detectMenu(file.buffer);
  if (!detected) {
    throw new ImageValidationError("El menú debe ser una imagen (JPG/PNG/WebP) o un PDF", "INVALID_FILE_TYPE");
  }
  if (detected.format !== "pdf") {
    try {
      await sharp(file.buffer).metadata();
    } catch {
      throw new ImageValidationError("Imagen no decodificable", "INVALID_FILE");
    }
  }
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${detected.ext}`;
  const dest = path.join(UPLOAD_DIR, filename);
  if (detected.format === "pdf") {
    await writeFile(dest, file.buffer);
  } else {
    await sharp(file.buffer).rotate().toFormat(detected.format, { quality: 85 }).toFile(dest);
  }
  return { url: `${PUBLIC_BASE_URL}/uploads/${filename}`, type: detected.mime };
}

export { ImageValidationError };