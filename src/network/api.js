export const API = {
    session: "/session",
    user: "/user",
    customers: "/customers",
    events: "/events",
    notPaidEvents: "/events/notPaid",
    customer: id => (`/customers/${id}`),
    event: id => (`/events/${id}`),
    records: "/records",
    record: id => (`/records/${id}`),
    statistic: "/records/stat",
    settings: "/settings"
}

function setPrefix(prefix, API) {
    for (const property in API) {
        if (API[property] instanceof Function) {
            const tmpFunc = API[property];
            API[property] = (...args) => prefix + tmpFunc(...args);

            continue;
        }
        API[property] = prefix + API[property]
    }
}

// setPrefix("http://localhost:8000/api", API)
setPrefix("/api", API)
