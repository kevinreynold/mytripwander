const store = {
  _url : 'http://103.253.25.103',
  _local_url: 'http://192.168.100.14',
  // service_url : 'http://103.253.25.103:5000',
  service_url : 'http://192.168.100.14:5000',
  // service_url : 'http://127.0.0.1:5000',
  offline: true,
  user_id: 2,
  user_name: 'Reynold Kevin',
  email: 'kevin@gmail.com',
  currency_id: 'IDR',
  currency_name: 'Indonesian Rupiah',
  currency_rate: 1,
  currency_symbol: '$',
  list_currency: [],
  device_token: "",
  //mytrip
  list_my_trip: [],
  plan_trip_mode: "plan", //plan || edit || past.
  trip_id: 0,
  trip_plan_data_original: {},
  trip_city_plan_data_original: [],
  flight_plan_original: [],
  //createplan
  trip_id: 0,
  list_city_all: [],
  list_dest_all : [],
  trip_plan_data: {}, //SIMPAN
  flight_plan: [], //SIMPAN
  flight_search_plan_mode: "booking", //booking, search, change
  flight_plan_index: 0,
  search_again_mode: false,
  trip_city_plan_data: [], //SIMPAN
  trip_city_plan_data_index: 0,
  hotel_search_plan_mode: "booking",
  hotel_plan_index: 0,
  hotel_search_again_mode: false,
  hotel_search_more_deal_mode: false,
  //perday
  list_attraction: [],
  list_food: [],
  list_search: [],
  place_mode: "",
  place_details: {},
  view_place_mode: false,
  can_add_place: true,
  coba_run_down: [],
  coba_modified_run_down: [],
  coba_hotel1: {},
  coba_hotel2: {},
  coba_airport: {},
  is_change_city: true,
  airport_mode: 'none', //arrival | go_back | none
  hotel_before_data: undefined,
  hotel_now_data: undefined,
  airport_arrival_data: undefined,
  airport_go_back_data: undefined,
  per_day_data: {
    start_hour: '08:00'
  },
  last_time: "",
  //flight
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
  hotel_amenities: [
    {
        id: "4",
        name: "TV",
        groupName: "Room"
    }, {
        id: "9",
        name: "Restaurant",
        groupName: "General"
    }, {
        id: "11",
        name: "Air conditioning",
        groupName: "Room"
    }, {
        id: "16",
        name: "Mini bar",
        groupName: "Room"
    }, {
        id: "23",
        name: "24hr room service",
        groupName: "Services"
    }, {
        id: "28",
        name: "Pets allowed",
        groupName: "General"
    }, {
        id: "30",
        name: "Wake up service",
        groupName: "Services"
    }, {
        id: "35",
        name: "Ironing board",
        groupName: "Room"
    }, {
        id: "47",
        name: "Faxing Facilities",
        groupName: "Services"
    }, {
        id: "54",
        name: "Free parking",
        groupName: "Parking"
    }, {
        id: "59",
        name: "Wheelchair accessible",
        groupName: "General"
    }, {
        id: "61",
        name: "Bathrobes",
        groupName: "Room"
    }, {
        id: "66",
        name: "Refrigerator",
        groupName: "Room"
    }, {
        id: "73",
        name: "Tennis courts",
        groupName: "Activities"
    }, {
        id: "78",
        name: "Doctor on call",
        groupName: "Services"
    }, {
        id: "80",
        name: "Playground",
        groupName: "Activities"
    }, {
        id: "85",
        name: "Sunbathing Terrace",
        groupName: "General"
    }, {
        id: "92",
        name: "Table tennis",
        groupName: "Activities"
    }, {
        id: "97",
        name: "Barbecue Area",
        groupName: "General"
    }, {
        id: "100",
        name: "Animation",
        groupName: "Activities"
    }, {
        id: "105",
        name: "Nightclub",
        groupName: "Activities"
    }, {
        id: "112",
        name: "Horse Riding",
        groupName: "Activities"
    }, {
        id: "117",
        name: "Ski room",
        groupName: "General"
    }, {
        id: "124",
        name: "Free local telephone calls",
        groupName: "Services"
    }, {
        id: "129",
        name: "Water Sports",
        groupName: "Activities"
    }, {
        id: "131",
        name: "Wi-Fi in public areas",
        groupName: "General"
    }, {
        id: "136",
        name: "English",
        groupName: "Staff languages"
    }, {
        id: "143",
        name: "Russian",
        groupName: "Staff languages"
    }, {
        id: "5",
        name: "Telephone",
        groupName: "Room"
    }, {
        id: "12",
        name: "Shops",
        groupName: "General"
    }, {
        id: "24",
        name: "Internet Access",
        groupName: "Internet"
    }, {
        id: "29",
        name: "Disabled facilities",
        groupName: "General"
    }, {
        id: "31",
        name: "Daily newspaper",
        groupName: "Room"
    }, {
        id: "36",
        name: "Garden",
        groupName: "General"
    }, {
        id: "43",
        name: "Reception",
        groupName: "General"
    }, {
        id: "48",
        name: "Massage",
        groupName: "Activities"
    }, {
        id: "50",
        name: "24h. Reception",
        groupName: "General"
    }, {
        id: "62",
        name: "Inhouse movies",
        groupName: "Room"
    }, {
        id: "67",
        name: "Crib available",
        groupName: "Room"
    }, {
        id: "74",
        name: "Medical Service",
        groupName: "Services"
    }, {
        id: "79",
        name: "Water sports (non-motorized)",
        groupName: "Activities"
    }, {
        id: "81",
        name: "Library",
        groupName: "General"
    }, {
        id: "86",
        name: "Heated pool",
        groupName: "Activities"
    }, {
        id: "93",
        name: "Casino",
        groupName: "Activities"
    }, {
        id: "98",
        name: "Games Room",
        groupName: "Activities"
    }, {
        id: "101",
        name: "Billiards",
        groupName: "Activities"
    }, {
        id: "106",
        name: "Welcome drink",
        groupName: "General"
    }, {
        id: "113",
        name: "Diving",
        groupName: "Activities"
    }, {
        id: "118",
        name: "Gift Shop",
        groupName: "General"
    }, {
        id: "120",
        name: "Wheel chair access",
        groupName: "General"
    }, {
        id: "125",
        name: "Handicapped Room",
        groupName: "Room"
    }, {
        id: "132",
        name: "Smoking room",
        groupName: "Hotel"
    }, {
        id: "137",
        name: "French",
        groupName: "Staff languages"
    }, {
        id: "144",
        name: "Cleaning",
        groupName: "Room"
    }, {
        id: "6",
        name: "Business center",
        groupName: "Services"
    }, {
        id: "13",
        name: "Laundry service",
        groupName: "Services"
    }, {
        id: "18",
        name: "Radio",
        groupName: "Room"
    }, {
        id: "20",
        name: "Meeting facilities",
        groupName: "General"
    }, {
        id: "25",
        name: "Room Service",
        groupName: "Services"
    }, {
        id: "32",
        name: "In-room safe",
        groupName: "Room"
    }, {
        id: "37",
        name: "Outdoor pool",
        groupName: "Activities"
    }, {
        id: "44",
        name: "Concierge",
        groupName: "Services"
    }, {
        id: "49",
        name: "Hotel\/airport transfer",
        groupName: "Services"
    }, {
        id: "51",
        name: "Voice mail",
        groupName: "Room"
    }, {
        id: "56",
        name: "Car parking",
        groupName: "Parking"
    }, {
        id: "63",
        name: "Babysitting",
        groupName: "Services"
    }, {
        id: "68",
        name: "Indoor pool",
        groupName: "Activities"
    }, {
        id: "70",
        name: "Golf course (on site)",
        groupName: "Activities"
    }, {
        id: "75",
        name: "Multilingual staff",
        groupName: "General"
    }, {
        id: "82",
        name: "Wellness",
        groupName: "Activities"
    }, {
        id: "87",
        name: "Kids pool",
        groupName: "Activities"
    }, {
        id: "94",
        name: "Beauty Salon",
        groupName: "Services"
    }, {
        id: "99",
        name: "Video\/DVD Player",
        groupName: "Room"
    }, {
        id: "102",
        name: "Private beach",
        groupName: "General"
    }, {
        id: "107",
        name: "LGBT friendly",
        groupName: "General"
    }, {
        id: "114",
        name: "Mini-Supermarket",
        groupName: "General"
    }, {
        id: "119",
        name: "Eco Friendly",
        groupName: "General"
    }, {
        id: "121",
        name: "Security Guard",
        groupName: "General"
    }, {
        id: "126",
        name: "Luggage Service",
        groupName: "Services"
    }, {
        id: "133",
        name: "Wi-Fi in room",
        groupName: "Room"
    }, {
        id: "138",
        name: "Deutsch",
        groupName: "Staff languages"
    }, {
        id: "140",
        name: "Arabic",
        groupName: "Staff languages"
    }, {
        id: "145",
        name: "Deposit",
        groupName: "Hotel"
    }, {
        id: "2",
        name: "Hairdryer",
        groupName: "Room"
    }, {
        id: "7",
        name: "Shower",
        groupName: "Room"
    }, {
        id: "14",
        name: "Bar",
        groupName: "General"
    }, {
        id: "19",
        name: "Desk",
        groupName: "Room"
    }, {
        id: "21",
        name: "Elevator",
        groupName: "General"
    }, {
        id: "26",
        name: "Bathtub",
        groupName: "Room"
    }, {
        id: "33",
        name: "Balcony\/terrace",
        groupName: "Room"
    }, {
        id: "38",
        name: "Swimming Pool",
        groupName: "Activities"
    }, {
        id: "40",
        name: "Gym \/ Fitness Centre",
        groupName: "Activities"
    }, {
        id: "45",
        name: "Tours",
        groupName: "Activities"
    }, {
        id: "52",
        name: "Lobby",
        groupName: "General"
    }, {
        id: "57",
        name: "Jacuzzi",
        groupName: "Activities"
    }, {
        id: "64",
        name: "Banquet Facilities",
        groupName: "General"
    }, {
        id: "69",
        name: "Currency Exchange",
        groupName: "Services"
    }, {
        id: "71",
        name: "Electronic room keys",
        groupName: "Room"
    }, {
        id: "76",
        name: "Parasols",
        groupName: "General"
    }, {
        id: "83",
        name: "Wi-Fi Available",
        groupName: "Internet"
    }, {
        id: "88",
        name: "Breakfast to go",
        groupName: "Services"
    }, {
        id: "95",
        name: "Steam Room",
        groupName: "General"
    }, {
        id: "103",
        name: "Squash courts",
        groupName: "Activities"
    }, {
        id: "108",
        name: "Water sports (motorized)",
        groupName: "Activities"
    }, {
        id: "110",
        name: "Slippers",
        groupName: "Room"
    }, {
        id: "115",
        name: "Mini Golf",
        groupName: "Activities"
    }, {
        id: "122",
        name: "Children care\/activities",
        groupName: "Activities"
    }, {
        id: "127",
        name: "Copying Services",
        groupName: "Services"
    }, {
        id: "134",
        name: "Daily Housekeeping",
        groupName: "Room"
    }, {
        id: "139",
        name: "Spanish",
        groupName: "Staff languages"
    }, {
        id: "141",
        name: "Italian",
        groupName: "Staff languages"
    }, {
        id: "146",
        name: "Private Bathroom",
        groupName: "Room"
    }, {
        id: "3",
        name: "Safe",
        groupName: "Room"
    }, {
        id: "8",
        name: "Non-smoking rooms",
        groupName: "Room"
    }, {
        id: "10",
        name: "Separate shower and tub",
        groupName: "Room"
    }, {
        id: "15",
        name: "Sauna",
        groupName: "Activities"
    }, {
        id: "22",
        name: "Bathroom",
        groupName: "Room"
    }, {
        id: "27",
        name: "Coffee\/tea maker",
        groupName: "Room"
    }, {
        id: "41",
        name: "Cafe",
        groupName: "General"
    }, {
        id: "46",
        name: "Conference Facilities",
        groupName: "General"
    }, {
        id: "53",
        name: "Kitchenette",
        groupName: "Room"
    }, {
        id: "58",
        name: "Bicycle rental",
        groupName: "Activities"
    }, {
        id: "60",
        name: "Microwave",
        groupName: "Room"
    }, {
        id: "65",
        name: "Spa",
        groupName: "Activities"
    }, {
        id: "72",
        name: "Solarium",
        groupName: "Activities"
    }, {
        id: "77",
        name: "Luggage room",
        groupName: "General"
    }, {
        id: "84",
        name: "Cloakroom",
        groupName: "General"
    }, {
        id: "89",
        name: "Launderette",
        groupName: "General"
    }, {
        id: "91",
        name: "Washing machine",
        groupName: "General"
    }, {
        id: "96",
        name: "Rent a car in the hotel",
        groupName: "Parking"
    }, {
        id: "104",
        name: "Secretary Service",
        groupName: "Services"
    }, {
        id: "109",
        name: "Garage",
        groupName: "Parking"
    }, {
        id: "111",
        name: "Valet service",
        groupName: "Parking"
    }, {
        id: "116",
        name: "Bowling",
        groupName: "Activities"
    }, {
        id: "123",
        name: "In-house movie",
        groupName: "General"
    }, {
        id: "128",
        name: "Porters",
        groupName: "Services"
    }, {
        id: "130",
        name: "Tour Desk",
        groupName: "General"
    }, {
        id: "135",
        name: "Connecting rooms",
        groupName: "Room"
    }, {
        id: "142",
        name: "Chinese",
        groupName: "Staff languages"
    }, {
        id: "147",
        name: "Shared Bathroom",
        groupName: "Room"
    }
  ],
  hotel_booking_data : [],
  original_hotel_city_search_result : [],
  hotel_city_search_result : [],
  hotel_details : [],
  list_room_deals : [],
  hotel_sort_by : "popularity",
  hotel_star_filter : [true, true, true, true, true, true],
  hotel_price_filter : {
    from: 0,
    to: 0
  },
  guest_rating_filter : {
    from: 0,
    to: 10
  },
};

export default store;
