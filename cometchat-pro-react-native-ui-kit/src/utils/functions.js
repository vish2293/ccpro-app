export const getExpirationDate = (jwtToken) => {
  if (!jwtToken || !jwtToken.length) {
    return null;
  }

  const jwt = JSON.parse(atob(jwtToken.split('.')[1]));
  console.log();
  // multiply by 1000 to convert seconds into milliseconds
  return (jwt && jwt.exp && jwt.exp * 1000) || null;
};

export const isExpired = (exp) => {
  if (!exp) {
    return false;
  }

  return Date.now() > exp;
};
