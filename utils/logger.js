const info = (...reviews) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...reviews);
  }
};

const mistake = (...reviews) => {
  console.error(...reviews);
};

module.exports = { info, mistake };
