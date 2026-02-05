// export const url = `http://10.10.20.9:3500`; // Hosain ahmed server
export const frontendUrl = `https://dashboard.sampli.io`; // Hosain ahmed server
// export const url = `https://rnj64vmh-3500.inc1.devtunnels.ms`; // Hosain ahmed server
// export const url = `http://45.55.251.203:5000`;
export const url = `https://api.sampli.io`;

export const convertDate = (date) => {
  const createdAt = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now - createdAt);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    return `${diffDays} days ago`;
  } else {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes > 0) {
        return `${diffMinutes} minutes ago`;
      } else {
        return "Just now";
      }
    }
  }
};
