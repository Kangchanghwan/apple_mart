const imgApi = (path) => {
  const localhost = "http://localhost:8080/api/image?path=";
  const linuxhost = "https://applemt.click/api/image?path=";
  return linuxhost + path;
};

export default imgApi;
