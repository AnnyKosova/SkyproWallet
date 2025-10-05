export const convertDateToMMDDYYYY = (date) => {
    const [day, month, year] = date.split(".");
    // const format = new Date(`${month}-${day}-${year}`);
    return `${month}-${day}-${year}`;
}