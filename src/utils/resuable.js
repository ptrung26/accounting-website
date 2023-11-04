const convertDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date;
  } catch {
    return "";
  }
};

export default { convertDate };
