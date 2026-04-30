import https from 'https';
const url = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFgaVIeRzS_6rv15p-gCqJJ5N4Pl3vHQbno53XcMfP8UoDZ_U-SUYJLcxtw9rvxUPMSuoXuZbUwneQHdzARpphIf4cX60tYZo0FUblYepaxabpgemVk5mx1Cx7TYDsSWElP1GzLmhVh-Lc=";
https.get(url, (res) => {
  console.log(res.headers.location);
});
