const store = {
  service_url : 'http://127.0.0.1:5000',
  flight_booking_data : [],
  flight_search_result : [],
  original_flight_search_result : [],
  flight_details : [],
  flight_ticket_url : undefined,
  //filter_flight_data
  sort_by: "price",
  price_filter: {
    from: 0,
    to: 0
  },
  outbond_departure: {
    from : 0,
    to: 48
  },
  outbond_arrival: {
    from : 0,
    to: 48
  },
  return_departure: {
    from : 0,
    to: 48
  },
  return_arrival: {
    from : 0,
    to: 48
  },
  //hotel
  hotel_booking_data : [],
  original_hotel_city_search_result : [],
  hotel_city_search_result : [],
  original_hotel_hotel_search_result : [],
  hotel_hotel_search_result : [],
  hotel_details : [],
  hotel_sort_by: "popularity",
  hotel_star_filter: [true, true, true, true, true, true],
  hotel_price_filter: {
    from: 0,
    to: 0
  },
  guest_rating_filter: {
    from: 0,
    to: 10
  },
};

export default store;
