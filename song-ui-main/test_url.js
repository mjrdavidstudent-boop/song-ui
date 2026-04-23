const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/i);
  return match ? match[1] : null;
};
const getPlayableUrl = (url) => {
  const vid = getYoutubeVideoId(url);
  return vid ? \https://www.youtube.com/watch?v=\\ : url;
};
console.log(getPlayableUrl('https://youtu.be/ftjEcrrf7r0'));
console.log(getPlayableUrl('https://youtu.be/t0bPrt69rag'));
