export const getAccess = async () => {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    return true;
  } catch(err) {
    console.error("Granting Camera-access was unsuccessful!");
    return false;
  }
}