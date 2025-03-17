import { FileType } from "@/models/FileModel";
import {
  VideoCameraOutlined,
  FileZipOutlined,
  AudioOutlined,
  CodeOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileOutlined,
} from "@ant-design/icons";
const FileThumbnail = ({ file }: { file: any }) => {
  const baseStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "150px",
    borderRadius: "8px",
    fontSize: "24px",
  };

  if (file.type === FileType.IMAGE) {
    return (
      <img
        alt={file.name}
        src={file.publicUrl}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
  } else if (file.type === FileType.VIDEO) {
    return (
      <div style={baseStyle}>
        <VideoCameraOutlined style={{ fontSize: "48px" }} />
      </div>
    );
  } else if (file.type === FileType.CODE) {
    return (
      <div style={baseStyle}>
        <CodeOutlined style={{ fontSize: "48px" }} />
      </div>
    );
  } else {
    return (
      <div style={baseStyle}>
        <FileOutlined style={{ fontSize: "48px" }} />
      </div>
    );
  }
};

export default FileThumbnail;
