export function getBackendHost() {
  // Function getBackendHost() dia manggil URL api kita dari .env
  return (
    process.env.REACT_APP_BACKEND_HOST?.replace(/\/$/, "") ||
    window.location.origin
  );
}

// Kenapa harus bikin file ini?Emg gbsa dari env ke file yang tadi?
// Bisa bisa ajaa cuman biar rapi aja
// bg aku pusing bg banyak file
// menangis
// ututuuu, kamu harus belajar clean code
