import moment from "moment";

export function priceCalculate(event, settingsDefaultPricePerHour) {
        if (event.price) {
            return event.price;
        }

        const defaultPricePerHour = event.customer.special_price_per_hour ? event.customer.special_price_per_hour :
                settingsDefaultPricePerHour;

        return defaultPricePerHour * moment.duration(moment(event.end_time).diff(moment(event.start_time))).asHours();
    }