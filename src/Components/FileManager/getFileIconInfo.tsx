import { SvgIconProps } from "@mui/material/SvgIcon";
import {
  InsertDriveFile,
  Description,
  PictureAsPdf,
  LibraryMusic,
  VideoLibrary,
  CoffeeSharp,
  ArchiveSharp,
  CodeSharp,
  WidgetsSharp,
  TheatersSharp,
} from "@mui/icons-material";

interface FileIconInfo {
  icon: React.ReactElement<SvgIconProps>;
  color: string;
}

const getFileIconInfo = (fileType: string): FileIconInfo => {
  switch (fileType) {
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
    case "application/vnd.oasis.opendocument.text":
      return { icon: <CoffeeSharp />, color: "primary" };
    case "application/pdf":
      return { icon: <PictureAsPdf />, color: "error" };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.ms-excel":
    case "application/vnd.oasis.opendocument.spreadsheet":
    case "application/vnd.oasis.opendocument.presentation":
      return { icon: <CoffeeSharp />, color: "primary" };
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return { icon: <Description />, color: "secondary" };
    case "video/mp4":
    case "video/avi":
    case "video/webm":
      return { icon: <VideoLibrary />, color: "secondary" };
    case "audio/mpeg":
    case "audio/wav":
    case "audio/ogg":
      return { icon: <LibraryMusic />, color: "secondary" };
    case "application/zip":
    case "application/x-zip-compressed":
      return { icon: <ArchiveSharp />, color: "primary" };
    case "text/plain":
    case "text/html":
    case "application/json":
    case "application/x-javascript":
    case "text/javascript":
    case "application/xml":
    case "text/xml":
      return { icon: <CodeSharp />, color: "primary" };
    case "application/x-exe":
    case "application/x-msdos-program":
      return { icon: <WidgetsSharp />, color: "primary" };
    case "application/x-shockwave-flash":
      return { icon: <TheatersSharp />, color: "primary" };
    default:
      return { icon: <InsertDriveFile />, color: "action" };
  }
};

export default getFileIconInfo;
