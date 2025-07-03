import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  AppBar,
  Toolbar,
  IconButton,
  Skeleton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SvgIconComponent } from "@mui/icons-material";

interface ResourceListProps<T> {
  title: string; // Title for the header
  Icon: SvgIconComponent; // Icon for the header
  resources?: T[]; // Generic list of HL7 FHIR resources
  onClick: (resource: T) => void; // Handler for item click
  getDisplay: (resource: T) => {
    leftTitle: string;
    leftSubtitle: string;
    rightText: string;
  }; // Function to extract display strings
  onAddClick?: () => void; // Optional handler for the "Add" button
}

export default function ResourceList<T>({
  title,
  Icon,
  resources,
  onClick,
  getDisplay,
  onAddClick,
}: ResourceListProps<T>) {
  const loading = resources === undefined;
  const isEmpty = resources && resources.length === 0;

  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Icon sx={{ position: "absolute", left: 16 }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {title}
          </Typography>
          {onAddClick && (
            <IconButton
              color="inherit"
              onClick={onAddClick}
              sx={{ position: "absolute", right: 16 }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* List of Resources */}
      <CardContent sx={{ flex: 1, overflowY: "auto" }}>
        <List>
          {loading ? (
            Array.from(new Array(5)).map((_, index) => (
              <ListItem key={index} disablePadding divider>
                <ListItemButton>
                  <ListItemText
                    primary={<Skeleton variant="text" width="60%" />}
                    secondary={<Skeleton variant="text" width="40%" />}
                  />
                  <Skeleton variant="text" width="20%" />
                </ListItemButton>
              </ListItem>
            ))
          ) : isEmpty ? (
            <Box sx={{ textAlign: "center", padding: 2 }}>
              <Typography variant="body1" color="textSecondary">
                No resources available.
              </Typography>
            </Box>
          ) : (
            resources.map((resource, index) => {
              const { leftTitle, leftSubtitle, rightText } =
                getDisplay(resource);

              return (
                <ListItem
                  key={index}
                  disablePadding
                  divider={index < resources.length - 1}
                >
                  <ListItemButton onClick={() => onClick(resource)}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          align="center"
                        >
                          {leftTitle}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          align="center"
                        >
                          {leftSubtitle}
                        </Typography>
                      }
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      {rightText}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>
      </CardContent>
    </Card>
  );
}
