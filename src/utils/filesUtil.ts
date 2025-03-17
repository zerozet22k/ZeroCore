import { FileType } from "@/models/FileModel";
export const getFileFolderWithType = (
  rawFilePath?: string
): {
  folder: string;
  fileName: string;
  fileType: FileType;
  filePath: string;
  urlFriendlyFilePath: string;
} => {
  if (!rawFilePath) {
    return {
      folder: "",
      fileName: "",
      fileType: FileType.UNKNOWN,
      filePath: "",
      urlFriendlyFilePath: "",
    };
  }

  const normalizedPath = rawFilePath.replace(/\\/g, "/");
  const lastSlashIndex = normalizedPath.lastIndexOf("/");

  const folder =
    lastSlashIndex === -1
      ? ""
      : normalizedPath.substring(0, lastSlashIndex) || "/";
  const fileName =
    lastSlashIndex === -1
      ? normalizedPath
      : normalizedPath.substring(lastSlashIndex + 1);

  const fileType = detectFileType(fileName);

  const urlFriendlyFilePath = encodeURIComponent(normalizedPath);

  return {
    folder,
    fileName,
    fileType,
    filePath: normalizedPath,
    urlFriendlyFilePath,
  };
};

export const detectFileType = (fileName: string): FileType => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension) return FileType.UNKNOWN;

  const imageExtensions = ["png", "jpg", "jpeg", "webp", "svg", "ico", "gif"];
  const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"];
  const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac"];
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];
  const codeExtensions = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "java",
    "py",
    "cpp",
    "c",
    "cs",
    "rb",
    "php",
    "go",
  ];
  const spreadsheetExtensions = ["xls", "xlsx", "csv"];
  const presentationExtensions = ["ppt", "pptx"];
  const documentExtensions = ["pdf", "doc", "docx", "odt", "txt", "rtf"];

  if (imageExtensions.includes(extension)) return FileType.IMAGE;
  if (videoExtensions.includes(extension)) return FileType.VIDEO;
  if (audioExtensions.includes(extension)) return FileType.AUDIO;
  if (archiveExtensions.includes(extension)) return FileType.ARCHIVE;
  if (codeExtensions.includes(extension)) return FileType.CODE;
  if (spreadsheetExtensions.includes(extension)) return FileType.SPREADSHEET;
  if (presentationExtensions.includes(extension)) return FileType.PRESENTATION;
  if (documentExtensions.includes(extension)) return FileType.DOCUMENT;

  return FileType.UNKNOWN;
};

export const shortenFileName = (name: string, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  const extIndex = name.lastIndexOf(".");
  const ext = extIndex !== -1 ? name.slice(extIndex) : "";
  const baseName = extIndex !== -1 ? name.slice(0, extIndex) : name;
  return `${baseName.slice(0, maxLength - ext.length - 3)}...${ext}`;
};
