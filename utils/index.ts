import querystring from "querystring";

export const extractToken = (cookie: string) => {
  // key=value; key=value => ["key=value", "key=value"]
  const cookieArray = cookie.split(/\s*;\s*/);
  const obj: { [key: string]: string } = {};
  cookieArray.forEach((data) => {
    // "key=value" => ["key": "value"]
    const pair = data.split(/\s*=\s*/);
    // ["key", "value"] => {"key": "value"}
    // value에 = 가 포함되어 있을 수도 있으므로 join("=")
    obj[pair[0]] = pair.splice(1).join("=");
  });
  return obj;
};

export const addComma = (value: string) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const extractCustomQuery = (query: {
  [key: string]: string | string[] | undefined;
}) => {
  const essentialQueries = [
    "value",
    "latitude",
    "longitude",
    "checkIn",
    "checkOut",
    "adults",
    "children",
    "infants",
  ];
  const newObj: { [key: string]: string | string[] | undefined } = {};
  const keys = Object.keys(query);
  const values = Object.values(query);

  keys.forEach((key, i) => {
    if (essentialQueries.includes(key)) {
      return;
    }
    if (!values[i] || values[i] === "0" || values[i]?.length === 0) {
      return;
    }
    newObj[key] = values[i];
  });

  const queryString = `${
    Object.keys(newObj).length > 0 ? "&" : ""
  }${querystring.stringify(newObj)}`;

  return queryString;
};
