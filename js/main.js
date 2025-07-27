// Supabase configuration
const SUPABASE_URL = 'https://ogldrsplcynunprlxhxq.supabase.co'; // <-- Replace with your actual URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbGRyc3BsY3ludW5wcmx4aHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODM3MDcsImV4cCI6MjA1NzM1OTcwN30.iu6rRQFvHhxYzmSEuwq4ImwedNxoJzqc9H0zFSTnRSc'; // <-- Replace with your actual anon key

// Initialize Supabase client
const supabase = window.supabase.createClient('https://ogldrsplcynunprlxhxq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbGRyc3BsY3ludW5wcmx4aHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODM3MDcsImV4cCI6MjA1NzM1OTcwN30.iu6rRQFvHhxYzmSEuwq4ImwedNxoJzqc9H0zFSTnRSc');

// Test Supabase connection
console.log('Testing Supabase connection...');
supabase.from('community_members').select('count').limit(1).then(({ data, error }) => {
    if (error) {
        console.error('Supabase connection error:', error);
    } else {
        console.log('Supabase connection successful');
    }
});

// Cities and provinces database
const citiesByCountry = {
    "United States": [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ],
    "Canada": [
        "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
        "Quebec", "Saskatchewan", "Yukon"
    ],
    "England": [
        "Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire", "Cheshire", "Cornwall", "Cumbria", "Derbyshire", "Devon",
        "Dorset", "Durham", "East Sussex", "Essex", "Gloucestershire", "Greater London", "Greater Manchester", "Hampshire", "Herefordshire", "Hertfordshire",
        "Isle of Wight", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Norfolk", "Northamptonshire", "Northumberland", "Nottinghamshire",
        "Oxfordshire", "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire",
        "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire"
    ],
    "Scotland": [
        "Aberdeen City", "Aberdeenshire", "Angus", "Argyll and Bute", "City of Edinburgh", "Clackmannanshire", "Dumfries and Galloway", "Dundee City", "East Ayrshire", "East Dunbartonshire",
        "East Lothian", "East Renfrewshire", "Falkirk", "Fife", "Glasgow City", "Highland", "Inverclyde", "Midlothian", "Moray", "Na h-Eileanan Siar",
        "North Ayrshire", "North Lanarkshire", "Orkney Islands", "Perth and Kinross", "Renfrewshire", "Scottish Borders", "Shetland Islands", "South Ayrshire", "South Lanarkshire", "Stirling",
        "West Dunbartonshire", "West Lothian"
    ],
    "Wales": [
        "Blaenau Gwent", "Bridgend", "Caerphilly", "Cardiff", "Carmarthenshire", "Ceredigion", "Conwy", "Denbighshire", "Flintshire", "Gwynedd",
        "Isle of Anglesey", "Merthyr Tydfil", "Monmouthshire", "Neath Port Talbot", "Newport", "Pembrokeshire", "Powys", "Rhondda Cynon Taf", "Swansea", "Torfaen",
        "Vale of Glamorgan", "Wrexham"
    ],
    "Northern Ireland": [
        "Antrim", "Armagh", "Down", "Fermanagh", "Londonderry", "Tyrone"
    ],
    "Germany": [
        "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia",
        "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
    ],
    "France": [
        "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine",
        "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
    ],
    "Netherlands": [
        "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "Noord-Brabant", "Noord-Holland", "Overijssel", "Utrecht", "Zeeland", "Zuid-Holland"
    ],
    "Belgium": [
        "Antwerp", "East Flanders", "Flemish Brabant", "Hainaut", "Liège", "Limburg", "Luxembourg", "Namur", "Walloon Brabant", "West Flanders"
    ],
    "Spain": [
        "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and León", "Castile-La Mancha", "Catalonia",
        "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencia"
    ],
    "Italy": [
        "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche",
        "Molise", "Piedmont", "Puglia", "Sardinia", "Sicily", "Tuscany", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"
    ],
    "Australia": [
        "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"
    ],
    "India": [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ],
    "Nigeria": [
        "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
        "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
        "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
        "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
    ],
    "Ghana": [
        "Ashanti", "Bono", "Central", "Eastern", "Greater Accra", "Northern", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North"
    ],
    "Kenya": [
        "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
        "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
        "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
        "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River",
        "Tharaka Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
    ],
    "South Africa": [
        "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
    ],
    "Morocco": [
        "Béni Mellal-Khénifra", "Casablanca-Settat", "Drâa-Tafilalet", "Fès-Meknès", "Guelmim-Oued Noun", "Laâyoune-Sakia El Hamra", "Marrakech-Safi", "Oriental", "Rabat-Salé-Kénitra", "Souss-Massa", "Tanger-Tétouan-Al Hoceïma"
    ],
    "Egypt": [
        "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", "Faiyum", "Gharbia",
        "Giza", "Ismailia", "Kafr El Sheikh", "Luxor", "Matruh", "Minya", "Monufia", "New Valley", "North Sinai", "Port Said",
        "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"
    ],
    "Ethiopia": [
        "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa", "Gambella", "Harari", "Oromia", "Somali", "Southern Nations, Nationalities, and Peoples' Region", "Tigray"
    ],
    "Somalia": [
        "Awdal", "Bakool", "Banaadir", "Bari", "Bay", "Galguduud", "Gedo", "Hiiraan", "Jubbada Dhexe", "Jubbada Hoose",
        "Mudug", "Nugaal", "Sanaag", "Shabeellaha Dhexe", "Shabeellaha Hoose", "Sool", "Togdheer", "Woqooyi Galbeed"
    ],
    "Sudan": [
        "Al Jazirah", "Al Qadarif", "Blue Nile", "Central Darfur", "East Darfur", "Gedaref", "Kassala", "Khartoum", "North Darfur", "North Kordofan",
        "Northern", "Red Sea", "River Nile", "Sennar", "South Darfur", "South Kordofan", "West Darfur", "West Kordofan", "White Nile"
    ],
    "South Sudan": [
        "Central Equatoria", "Eastern Equatoria", "Jonglei", "Lakes", "Northern Bahr el Ghazal", "Unity", "Upper Nile", "Warrap", "Western Bahr el Ghazal", "Western Equatoria"
    ],
    "Uganda": [
        "Abim", "Adjumani", "Agago", "Alebtong", "Amolatar", "Amudat", "Amuria", "Amuru", "Apac", "Arua",
        "Budaka", "Bududa", "Bugiri", "Bugweri", "Buhweju", "Buikwe", "Bukedea", "Bukomansimbi", "Bukwo", "Bulambuli",
        "Buliisa", "Bundibugyo", "Bunyangabu", "Bushenyi", "Busia", "Butaleja", "Butambala", "Butebo", "Buvuma", "Buyende",
        "Central Region", "Dokolo", "Eastern Region", "Gomba", "Gulu", "Hoima", "Ibanda", "Iganga", "Isingiro", "Jinja",
        "Kaabong", "Kabale", "Kabarole", "Kaberamaido", "Kagadi", "Kakumiro", "Kalangala", "Kaliro", "Kalungu", "Kampala",
        "Kamuli", "Kamwenge", "Kanungu", "Kapchorwa", "Kasese", "Katakwi", "Kayunga", "Kazo", "Kibale", "Kiboga",
        "Kibuku", "Kikuube", "Kiruhura", "Kiryandongo", "Kisoro", "Kitagwenda", "Kitgum", "Koboko", "Kole", "Kotido",
        "Kumi", "Kween", "Kyankwanzi", "Kyegegwa", "Kyenjojo", "Kyotera", "Lamwo", "Lira", "Luwero", "Lwengo",
        "Lyantonde", "Manafwa", "Maracha", "Masaka", "Masindi", "Mayuge", "Mbale", "Mbarara", "Mitooma", "Mityana",
        "Moroto", "Moyo", "Mpigi", "Mubende", "Mukono", "Nabilatuk", "Nakapiripirit", "Nakaseke", "Nakasongola", "Namayingo",
        "Namisindwa", "Namutumba", "Napak", "Nebbi", "Ngora", "Northern Region", "Ntoroko", "Ntungamo", "Nwoya", "Omoro",
        "Otuke", "Oyam", "Pader", "Pakwach", "Pallisa", "Rakai", "Rubanda", "Rubirizi", "Rukiga", "Rukungiri",
        "Rwampara", "Sembabule", "Serere", "Sheema", "Sironko", "Soroti", "Tororo", "Wakiso", "Western Region", "Yumbe",
        "Zombo"
    ],
    "Tanzania": [
        "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi",
        "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North", "Pemba South", "Pwani",
        "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Unguja North", "Unguja South"
    ],
    "Zimbabwe": [
        "Bulawayo", "Harare", "Manicaland", "Mashonaland Central", "Mashonaland East", "Mashonaland West", "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands"
    ],
    "Zambia": [
        "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern", "North-Western", "Southern", "Western"
    ],
    "Malawi": [
        "Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga", "Kasungu", "Likoma",
        "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje", "Mwanza", "Mzimba", "Neno", "Nkhata Bay", "Nkhotakota",
        "Nsanje", "Ntcheu", "Ntchisi", "Phalombe", "Rumphi", "Salima", "Thyolo", "Zomba"
    ],
    "Mozambique": [
        "Cabo Delgado", "Gaza", "Inhambane", "Manica", "Maputo", "Maputo City", "Nampula", "Niassa", "Sofala", "Tete", "Zambezia"
    ],
    "Angola": [
        "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
        "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire"
    ],
    "Cameroon": [
        "Adamawa", "Centre", "East", "Far North", "Littoral", "North", "North-West", "South", "South-West", "West"
    ],
    "Senegal": [
        "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda", "Louga", "Matam", "Saint-Louis",
        "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor"
    ],
    "Mali": [
        "Bamako", "Gao", "Kayes", "Kidal", "Koulikoro", "Mopti", "Ségou", "Sikasso", "Tombouctou"
    ],
    "Burkina Faso": [
        "Balé", "Bam", "Banwa", "Bazèga", "Bougouriba", "Boulgou", "Boulkiemdé", "Comoé", "Ganzourgou", "Gnagna",
        "Gourma", "Houet", "Ioba", "Kadiogo", "Kénédougou", "Komondjari", "Kompienga", "Kossi", "Koulpélogo", "Kouritenga",
        "Kourwéogo", "Léraba", "Loroum", "Mouhoun", "Nahouri", "Namentenga", "Nayala", "Noumbiel", "Oubritenga", "Oudalan",
        "Passoré", "Poni", "Sanguié", "Sanmatenga", "Séno", "Sissili", "Soum", "Sourou", "Tapoa", "Tuy",
        "Yagha", "Yatenga", "Ziro", "Zondoma", "Zoundwéogo"
    ],
    "Niger": [
        "Agadez", "Diffa", "Dosso", "Maradi", "Niamey", "Tahoua", "Tillabéri", "Zinder"
    ],
    "Chad": [
        "Bahr el Gazel", "Batha", "Borkou", "Chari-Baguirmi", "Ennedi-Est", "Ennedi-Ouest", "Guéra", "Hadjer-Lamis", "Kanem", "Lac",
        "Logone Occidental", "Logone Oriental", "Mandoul", "Mayo-Kebbi Est", "Mayo-Kebbi Ouest", "Moyen-Chari", "Ouaddaï", "Salamat", "Sila", "Tandjilé",
        "Tibesti", "Ville de N'Djamena", "Wadi Fira"
    ],
    "Singapore": [
        "Central Region", "East Region", "North Region", "North-East Region", "West Region"
    ],
    "South Korea": [
        "Busan", "Chungcheongbuk-do", "Chungcheongnam-do", "Daegu", "Daejeon", "Gangwon-do", "Gwangju", "Gyeonggi-do", "Gyeongsangbuk-do", "Gyeongsangnam-do",
        "Incheon", "Jeju-do", "Jeollabuk-do", "Jeollanam-do", "Sejong", "Seoul", "Ulsan"
    ],
    "Philippines": [
        "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan",
        "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur",
        "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental",
        "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga",
        "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate", "Metro Manila", "Misamis Occidental",
        "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan",
        "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon",
        "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte",
        "Zamboanga del Sur", "Zamboanga Sibugay"
    ],
    "Vietnam": [
        "An Giang", "Bà Rịa-Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
        "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
        "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hồ Chí Minh City",
        "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
        "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
        "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên-Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
        "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
    ],
    "Thailand": [
        "Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buri Ram", "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai",
        "Chiang Rai", "Chon Buri", "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Krung Thep Mahanakhon", "Lampang",
        "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham", "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima",
        "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phang Nga",
        "Phatthalung", "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phra Nakhon Si Ayutthaya", "Phrae", "Phuket", "Prachin Buri", "Prachuap Khiri Khan",
        "Ranong", "Ratchaburi", "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Saraburi",
        "Satun", "Si Sa Ket", "Sing Buri", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang",
        "Trat", "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
    ],
    "Malaysia": [
        "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis",
        "Pulau Pinang", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu"
    ],
    "Indonesia": [
        "Aceh", "Bali", "Bangka Belitung", "Banten", "Bengkulu", "Central Java", "Central Kalimantan", "Central Sulawesi", "East Java", "East Kalimantan",
        "East Nusa Tenggara", "Gorontalo", "Jakarta", "Jambi", "Lampung", "Maluku", "North Kalimantan", "North Maluku", "North Sulawesi", "North Sumatra",
        "Papua", "Riau", "Riau Islands", "Southeast Sulawesi", "South Kalimantan", "South Sulawesi", "South Sumatra", "West Java", "West Kalimantan", "West Nusa Tenggara",
        "West Papua", "West Sulawesi", "West Sumatra", "Yogyakarta"
    ],
    "Myanmar": [
        "Ayeyarwady", "Bago", "Chin", "Kachin", "Kayah", "Kayin", "Magway", "Mandalay", "Mon", "Naypyidaw",
        "Rakhine", "Sagaing", "Shan", "Tanintharyi", "Yangon"
    ],
    "Cambodia": [
        "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong",
        "Kratié", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh", "Preah Sihanouk", "Preah Vihear", "Prey Veng", "Pursat", "Ratanakiri",
        "Siem Reap", "Stung Treng", "Svay Rieng", "Takéo", "Tbong Khmum"
    ],
    "Laos": [
        "Attapu", "Bokeo", "Bolikhamxai", "Champasak", "Houaphan", "Khammouan", "Luang Namtha", "Luang Prabang", "Oudomxai", "Phongsali",
        "Salavan", "Savannakhet", "Vientiane", "Vientiane Prefecture", "Xaignabouli", "Xaisomboun", "Xekong", "Xiangkhouang"
    ],
    "Bangladesh": [
        "Barisal", "Chittagong", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"
    ],
    "Pakistan": [
        "Azad Kashmir", "Balochistan", "Federally Administered Tribal Areas", "Gilgit-Baltistan", "Islamabad Capital Territory", "Khyber Pakhtunkhwa", "Punjab", "Sindh"
    ],
    "Sri Lanka": [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ],
    "Nepal": [
        "Bagmati", "Bheri", "Dhawalagiri", "Gandaki", "Janakpur", "Karnali", "Koshi", "Lumbini", "Mahakali", "Mechi",
        "Narayani", "Rapti", "Sagarmatha", "Seti"
    ],
    "China": [
        "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei",
        "Heilongjiang", "Henan", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Ningxia",
        "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"
    ],
    "Japan": [
        "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma",
        "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa", "Kochi",
        "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata", "Oita",
        "Okayama", "Okinawa", "Osaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima",
        "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
    ],
    "Brazil": [
        "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão",
        "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte",
        "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
    ],
    "Mexico": [
        "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato",
        "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
        "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
    ],
    "Argentina": [
        "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa",
        "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
        "Santiago del Estero", "Tierra del Fuego", "Tucumán"
    ],
    "Chile": [
        "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Región Metropolitana de Santiago", "O'Higgins", "Maule", "Ñuble",
        "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
    ],
    "Peru": [
        "Amazonas", "Ancash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco",
        "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura",
        "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
    ],
    "Colombia": [
        "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca",
        "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta",
        "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"
    ],
    "Venezuela": [
        "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", "Delta Amacuro", "Falcón",
        "Guárico", "Lara", "Mérida", "Miranda", "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
        "Vargas", "Yaracuy", "Zulia"
    ],
    "Ecuador": [
        "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", "Esmeraldas", "Galápagos", "Guayas",
        "Imbabura", "Loja", "Los Ríos", "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena",
        "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"
    ],
    "Uruguay": [
        "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo",
        "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
    ],
    "Paraguay": [
        "Alto Paraguay", "Alto Paraná", "Amambay", "Boquerón", "Caaguazú", "Caazapá", "Canindeyú", "Central", "Concepción", "Cordillera",
        "Guairá", "Itapúa", "Misiones", "Ñeembucú", "Paraguarí", "Presidente Hayes", "San Pedro"
    ],
    "Bolivia": [
        "Chuquisaca", "Cochabamba", "El Beni", "La Paz", "Oruro", "Pando", "Potosí", "Santa Cruz", "Tarija"
    ],
    "Guyana": [
        "Barima-Waini", "Cuyuni-Mazaruni", "Demerara-Mahaica", "East Berbice-Corentyne", "Essequibo Islands-West Demerara", "Mahaica-Berbice", "Pomeroon-Supenaam", "Potaro-Siparuni", "Upper Demerara-Berbice", "Upper Takutu-Upper Essequibo"
    ],
    "Suriname": [
        "Brokopondo", "Commewijne", "Coronie", "Marowijne", "Nickerie", "Para", "Paramaribo", "Saramacca", "Sipaliwini", "Wanica"
    ],
    "French Guiana": [
        "Cayenne", "Saint-Laurent-du-Maroni", "Kourou", "Matoury", "Remire-Montjoly", "Macouria", "Apatou", "Maripasoula", "Mana", "Grand-Santi"
    ],
    "Jamaica": [
        "Clarendon", "Hanover", "Kingston", "Manchester", "Portland", "Saint Andrew", "Saint Ann", "Saint Catherine", "Saint Elizabeth", "Saint James",
        "Saint Mary", "Saint Thomas", "Trelawny", "Westmoreland"
    ],
    "Trinidad and Tobago": [
        "Arima", "Chaguaramas", "Diego Martin", "Mayaro", "Penal", "Point Fortin", "Port of Spain", "Princes Town", "Rio Claro", "San Fernando",
        "San Juan", "Sangre Grande", "Siparia", "Tobago", "Tunapuna", "Valencia"
    ],
    "Barbados": [
        "Christ Church", "Saint Andrew", "Saint George", "Saint James", "Saint John", "Saint Joseph", "Saint Lucy", "Saint Michael", "Saint Peter", "Saint Philip", "Saint Thomas"
    ],
    "Grenada": [
        "Carriacou and Petite Martinique", "Saint Andrew", "Saint David", "Saint George", "Saint John", "Saint Mark", "Saint Patrick"
    ],
    "Saint Lucia": [
        "Anse la Raye", "Canaries", "Castries", "Choiseul", "Dennery", "Gros Islet", "Laborie", "Micoud", "Soufrière", "Vieux Fort"
    ],
    "Saint Vincent and the Grenadines": [
        "Charlotte", "Grenadines", "Saint Andrew", "Saint David", "Saint George", "Saint Patrick"
    ],
    "Antigua and Barbuda": [
        "Barbuda", "Redonda", "Saint George", "Saint John", "Saint Mary", "Saint Paul", "Saint Peter", "Saint Philip"
    ],
    "Dominica": [
        "Saint Andrew", "Saint David", "Saint George", "Saint John", "Saint Joseph", "Saint Luke", "Saint Mark", "Saint Patrick", "Saint Paul", "Saint Peter"
    ],
    "Saint Kitts and Nevis": [
        "Christ Church Nichola Town", "Saint Anne Sandy Point", "Saint George Basseterre", "Saint George Gingerland", "Saint James Windward", "Saint John Capisterre", "Saint John Figtree", "Saint Mary Cayon", "Saint Paul Capisterre", "Saint Paul Charlestown", "Saint Peter Basseterre", "Saint Thomas Lowland", "Saint Thomas Middle Island", "Trinity Palmetto Point"
    ],
    "Haiti": [
        "Artibonite", "Centre", "Grand'Anse", "Nippes", "Nord", "Nord-Est", "Nord-Ouest", "Ouest", "Sud", "Sud-Est"
    ],
    "Dominican Republic": [
        "Azua", "Baoruco", "Barahona", "Dajabón", "Distrito Nacional", "Duarte", "Elías Piña", "El Seibo", "Espaillat", "Hato Mayor",
        "Hermanas Mirabal", "Independencia", "La Altagracia", "La Romana", "La Vega", "María Trinidad Sánchez", "Monseñor Nouel", "Monte Cristi", "Monte Plata", "Pedernales",
        "Peravia", "Puerto Plata", "Samaná", "San Cristóbal", "San José de Ocoa", "San Juan", "San Pedro de Macorís", "Sánchez Ramírez", "Santiago", "Santiago Rodríguez",
        "Santo Domingo", "Valverde"
    ],
    "Cuba": [
        "Artemisa", "Camagüey", "Ciego de Ávila", "Cienfuegos", "Granma", "Guantánamo", "Holguín", "Isla de la Juventud", "La Habana", "Las Tunas",
        "Matanzas", "Mayabeque", "Pinar del Río", "Sancti Spíritus", "Santiago de Cuba", "Villa Clara"
    ],
    "Puerto Rico": [
        "Adjuntas", "Aguada", "Aguadilla", "Aguas Buenas", "Aibonito", "Añasco", "Arecibo", "Arroyo", "Barceloneta", "Barranquitas",
        "Bayamón", "Cabo Rojo", "Caguas", "Camuy", "Canóvanas", "Carolina", "Cataño", "Cayey", "Ceiba", "Ciales",
        "Cidra", "Coamo", "Comerío", "Corozal", "Culebra", "Dorado", "Fajardo", "Florida", "Guánica", "Guayama",
        "Guayanilla", "Guaynabo", "Gurabo", "Hatillo", "Hormigueros", "Humacao", "Isabela", "Jayuya", "Juana Díaz", "Juncos",
        "Lajas", "Lares", "Las Marías", "Las Piedras", "Loíza", "Luquillo", "Manatí", "Maricao", "Maunabo", "Mayagüez",
        "Moca", "Morovis", "Naguabo", "Naranjito", "Orocovis", "Patillas", "Peñuelas", "Ponce", "Quebradillas", "Rincón",
        "Río Grande", "Sabana Grande", "Salinas", "San Germán", "San Juan", "San Lorenzo", "San Sebastián", "Santa Isabel", "Toa Alta", "Toa Baja",
        "Trujillo Alto", "Utuado", "Vega Alta", "Vega Baja", "Vieques", "Villalba", "Yabucoa", "Yauco"
    ]
};

// Form validation functions
const validators = {
    required: (value) => ({
        isValid: value.trim() !== '',
        message: 'This field is required'
    }),
    email: (value) => ({
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    }),
    birthDate: (value) => {
        const date = new Date(value);
        const today = new Date();
        return {
            isValid: date < today,
            message: 'Birth date must be in the past'
        };
    },
    migrationYear: (value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return {
            isValid: year >= 1900 && year <= currentYear,
            message: `Year must be between 1900 and ${currentYear}`
        };
    },
    country: (value) => ({
        isValid: value !== '',
        message: 'Please select a country'
    })
};

function validateField(field, rules) {
    const value = field.value;
    let errors = [];
    rules.forEach(rule => {
        const validation = validators[rule](value);
        if (!validation.isValid) {
            errors.push(validation.message);
        }
    });
    return errors;
}

function showErrors(field, errors) {
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
    if (errors.length > 0) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors[0];
        field.parentElement.appendChild(errorDiv);
    }
    return errors.length === 0;
}

function validateForm(formData) {
    const errors = {};
    errors.firstName = validateField(formData.firstName, ['required']);
    errors.lastName = validateField(formData.lastName, ['required']);
    errors.email = validateField(formData.email, ['required', 'email']);
    errors.dob = validateField(formData.dob, ['required', 'birthDate']);
    errors.countryOfBirth = validateField(formData.countryOfBirth, ['required', 'country']);
    errors.generation = validateField(formData.generation, ['required']);
    errors.origin = validateField(formData.origin, ['required', 'country']);
    errors.residence = validateField(formData.residence, ['required', 'country']);
    if (formData.generation.value === '1st' || formData.generation.value === '1.5') {
        errors.migrationYear = validateField(formData.migrationYear, ['required', 'migrationYear']);
    }
    if (formData.hasMigrationHistory) {
        formData.migrationHistory.forEach((entry, index) => {
            errors[`fromCountry${index}`] = validateField(entry.fromCountry, ['required', 'country']);
            errors[`toCountry${index}`] = validateField(entry.toCountry, ['required', 'country']);
            errors[`migrationYear${index}`] = validateField(entry.migrationYear, ['required', 'migrationYear']);
        });
    }
    return Object.values(errors).every(isValid => isValid);
}

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Reset form state on page load
    function resetFormState() {
        // Reset migration history checkbox
        const hasMigrationHistory = document.getElementById('has-migration-history');
        if (hasMigrationHistory) {
            hasMigrationHistory.checked = false;
        }
        
        // Hide migration history container
        const migrationHistoryContainer = document.getElementById('migration-history-container');
        if (migrationHistoryContainer) {
            migrationHistoryContainer.style.display = 'none';
        }
        
        // Hide migration date row
        const migrationDateRow = document.getElementById('migration-date-row');
        if (migrationDateRow) {
            migrationDateRow.style.display = 'none';
        }
        
        // Reset tooltip state
        const tooltip = document.getElementById('gen-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    // Call reset function on page load
    resetFormState();
    
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        const tabBtn = tab.querySelector('.tab-btn');
        
        tabBtn.addEventListener('click', function() {
            // Check if this tab is already active
            const isActive = tab.classList.contains('active');
            
            // Close all tabs first
            tabs.forEach(t => {
                t.classList.remove('active');
            });
            
            // If the clicked tab wasn't active, make it active
            if (!isActive) {
                tab.classList.add('active');
            }
        });
    });

    // Generation info tooltip - hover and click functionality
    const infoIcon = document.getElementById('gen-info');
    const tooltip = document.getElementById('gen-tooltip');
    let tooltipVisible = false;
    
    infoIcon.addEventListener('mouseenter', function() {
        if (!tooltipVisible) {
            tooltip.style.display = 'block';
        }
    });
    
    infoIcon.addEventListener('mouseleave', function() {
        if (!tooltipVisible) {
            tooltip.style.display = 'none';
        }
    });
    
    infoIcon.addEventListener('click', function() {
        tooltipVisible = !tooltipVisible;
        tooltip.style.display = tooltipVisible ? 'block' : 'none';
    });
    
    // Close tooltip when clicking elsewhere on the page
    document.addEventListener('click', function(e) {
        if (tooltipVisible && e.target !== infoIcon && !tooltip.contains(e.target)) {
            tooltipVisible = false;
            tooltip.style.display = 'none';
        }
    });

    // Populate country dropdowns
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
        "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
        "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
        "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
        "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
        "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
        "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
        "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Northern Ireland", "Norway", "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
        "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
        "Saudi Arabia", "Scotland", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
        "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
        "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
        "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
        "Venezuela", "Vietnam", "Wales", "Yemen", "Zambia", "Zimbabwe"
    ];
    
    // Function to populate a country dropdown
    function populateCountryDropdown(selectElement) {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            selectElement.appendChild(option);
        });
    }
    
    // Function to populate city/province dropdown based on selected country
    function populateCityDropdown(citySelectElement, selectedCountry) {
        // Clear existing options except the first two (placeholder and "I don't know")
        while (citySelectElement.children.length > 2) {
            citySelectElement.removeChild(citySelectElement.lastChild);
        }
        
        // If country has cities/provinces in our database, populate them
        if (citiesByCountry[selectedCountry]) {
            citiesByCountry[selectedCountry].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelectElement.appendChild(option);
            });
        }
    }
    
    // Function to handle country selection and update corresponding city dropdown
    function handleCountrySelection(countrySelect, citySelectId) {
        const selectedCountry = countrySelect.value;
        const citySelect = document.getElementById(citySelectId);
        
        if (citySelect) {
            populateCityDropdown(citySelect, selectedCountry);
        }
    }
    
    // Populate all country dropdowns
    const countrySelects = [
        document.getElementById('country-of-birth'),
        document.getElementById('origin'),
        document.getElementById('residence'),
        document.getElementById('from-country-0'),
        document.getElementById('to-country-0')
    ];
    
    countrySelects.forEach(select => {
        if (select) {
            populateCountryDropdown(select);
            
            // Add event listener for dynamic city/province updates
            select.addEventListener('change', function() {
                // Determine which city dropdown to update based on the country select ID
                let citySelectId = '';
                if (this.id === 'origin') {
                    citySelectId = 'origin-city';
                } else if (this.id === 'residence') {
                    citySelectId = 'residence-city';
                } else if (this.id.startsWith('from-country-')) {
                    const index = this.id.split('-')[2];
                    citySelectId = `from-city-${index}`;
                } else if (this.id.startsWith('to-country-')) {
                    const index = this.id.split('-')[2];
                    citySelectId = `to-city-${index}`;
                }
                
                if (citySelectId) {
                    handleCountrySelection(this, citySelectId);
                }
            });
        }
    });

    // Show/hide migration date fields based on generation selection
    const generationSelect = document.getElementById('generation');
    const migrationDateRow = document.getElementById('migration-date-row');
    const migrationYear = document.getElementById('migration-year');
    
    generationSelect.addEventListener('change', function() {
        const selectedGeneration = this.value;
        
        if (selectedGeneration === '1st' || selectedGeneration === '1.5') {
            migrationDateRow.style.display = 'flex';
            migrationYear.setAttribute('required', 'required');
        } else {
            migrationDateRow.style.display = 'none';
            migrationYear.removeAttribute('required');
        }
    });
    
    // Show/hide migration history section based on checkbox
    const hasMigrationHistory = document.getElementById('has-migration-history');
    const migrationHistoryContainer = document.getElementById('migration-history-container');
    
    hasMigrationHistory.addEventListener('change', function() {
        migrationHistoryContainer.style.display = this.checked ? 'block' : 'none';
        
        // Toggle required attribute on first migration entry fields
        const requiredFields = migrationHistoryContainer.querySelectorAll('.from-country, .to-country, .migration-year');
        requiredFields.forEach(field => {
            if (this.checked) {
                field.setAttribute('required', 'required');
            } else {
                field.removeAttribute('required');
            }
        });
    });
    
    // Add another migration entry
    let migrationCount = 1; // Start at 1 because we already have entry 0
    const addMigrationBtn = document.getElementById('add-migration');
    
    addMigrationBtn.addEventListener('click', function() {
        const migrationEntry = document.createElement('div');
        migrationEntry.className = 'migration-entry';
        migrationEntry.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label for="from-country-${migrationCount}">Lived in Country*</label>
                    <select id="from-country-${migrationCount}" class="from-country" required>
                        <option value="">Select country</option>
                        <!-- Countries will be populated by JavaScript -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="from-city-${migrationCount}">City/Province</label>
                    <select id="from-city-${migrationCount}" class="from-city">
                        <option value="">Select city/province</option>
                        <option value="unknown">I don't know</option>
                        <!-- Cities will be populated by JavaScript -->
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="to-country-${migrationCount}">Moved To Country*</label>
                    <select id="to-country-${migrationCount}" class="to-country" required>
                        <option value="">Select country</option>
                        <!-- Countries will be populated by JavaScript -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="to-city-${migrationCount}">City/Province</label>
                    <select id="to-city-${migrationCount}" class="to-city">
                        <option value="">Select city/province</option>
                        <option value="unknown">I don't know</option>
                        <!-- Cities will be populated by JavaScript -->
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="migration-month-${migrationCount}">Month of migration</label>
                    <select id="migration-month-${migrationCount}" class="migration-month">
                        <option value="">Select month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="migration-year-${migrationCount}">Year of migration*</label>
                    <input type="number" id="migration-year-${migrationCount}" class="migration-year" min="1900" max="2025" placeholder="YYYY" required>
                </div>
                <div class="form-group">
                    <label for="migration-notes-${migrationCount}">Notes</label>
                    <textarea id="migration-notes-${migrationCount}" class="migration-notes" placeholder="Any additional information about this migration"></textarea>
                </div>
            </div>
            <div class="form-row">
                <button type="button" class="btn btn-outline remove-migration">Remove This Migration</button>
            </div>
            <hr class="migration-divider">
        `;
        
        // Insert before the "Add Another Migration" button
        addMigrationBtn.parentNode.parentNode.insertBefore(migrationEntry, addMigrationBtn.parentNode);
        
        // Populate country dropdowns in the new entry
        populateCountryDropdown(document.getElementById(`from-country-${migrationCount}`));
        populateCountryDropdown(document.getElementById(`to-country-${migrationCount}`));
        
        // Add event listeners for dynamic city/province updates in the new entry
        const fromCountrySelect = document.getElementById(`from-country-${migrationCount}`);
        const toCountrySelect = document.getElementById(`to-country-${migrationCount}`);
        
        fromCountrySelect.addEventListener('change', function() {
            handleCountrySelection(this, `from-city-${migrationCount}`);
        });
        
        toCountrySelect.addEventListener('change', function() {
            handleCountrySelection(this, `to-city-${migrationCount}`);
        });
        
        // Add event listener to remove button
        const removeBtn = migrationEntry.querySelector('.remove-migration');
        removeBtn.addEventListener('click', function() {
            migrationEntry.remove();
        });
        
        migrationCount++;
    });
    
    // Event delegation for remove migration buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-migration')) {
            const migrationEntry = e.target.closest('.migration-entry');
            if (migrationEntry) {
                migrationEntry.remove();
            }
        }
    });

    // Form submission
    const form = document.getElementById('join-form');
    
    // Add real-time validation
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            const rules = [];
            
            // Add required validation for required fields
            if (this.hasAttribute('required')) {
                rules.push('required');
            }
            
            // Add specific validations based on field type
            if (this.type === 'email') {
                rules.push('email');
            } else if (this.id === 'dob') {
                rules.push('birthDate');
            } else if (this.classList.contains('migration-year')) {
                rules.push('migrationYear');
            } else if (this.classList.contains('from-country') || 
                      this.classList.contains('to-country') ||
                      this.id === 'country-of-birth' ||
                      this.id === 'origin' ||
                      this.id === 'residence') {
                rules.push('country');
            }
            
            if (rules.length > 0) {
                const errors = validateField(this, rules);
                showErrors(this, errors);
            }
        });
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Form submission started...');
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('first-name'),
            lastName: document.getElementById('last-name'),
            email: document.getElementById('email'),
            dob: document.getElementById('dob'),
            countryOfBirth: document.getElementById('country-of-birth'),
            generation: document.getElementById('generation'),
            origin: document.getElementById('origin'),
            residence: document.getElementById('residence'),
            migrationYear: document.getElementById('migration-year'),
            hasMigrationHistory: document.getElementById('has-migration-history').checked
        };

        // Always define migrationHistory as an array
        formData.migrationHistory = [];
        if (formData.hasMigrationHistory) {
            const migrationEntries = document.querySelectorAll('.migration-entry');
            migrationEntries.forEach((entry, index) => {
                formData.migrationHistory.push({
                    fromCountry: document.getElementById(`from-country-${index}`),
                    toCountry: document.getElementById(`to-country-${index}`),
                    migrationYear: document.getElementById(`migration-year-${index}`)
                });
            });
        }

        console.log('Form data collected:', formData);

        // Validate form
        if (!validateForm(formData)) {
            console.log('Form validation failed');
            alert('Please correct the errors in the form before submitting.');
            return;
        }

        console.log('Form validation passed');

        // Prepare data for Supabase - mapping form fields to correct database columns
        const memberData = {
            first_name: formData.firstName.value,
            last_name: formData.lastName.value,
            middle_name: document.getElementById('middle-name').value || null,
            email: formData.email.value,
            date_of_birth: formData.dob.value,
            country_of_birth: formData.countryOfBirth.value,
            city_province_of_birth: null, // This field exists in DB but not in form
            generation: formData.generation.value,
            country_of_origin: formData.origin.value,
            city_province_of_origin: document.getElementById('origin-city').value || null,
            country_of_residence: formData.residence.value,
            city_province_of_residence: document.getElementById('residence-city').value || null,
            migration_month: null,
            migration_year: null,
            unknown_city_origin: document.getElementById('origin-city').value === 'unknown',
            unknown_city_residence: document.getElementById('residence-city').value === 'unknown'
        };
        
        // Add migration date if applicable for 1st/1.5 gen
        if (memberData.generation === '1st' || memberData.generation === '1.5') {
            memberData.migration_month = document.getElementById('migration-month').value || null;
            memberData.migration_year = document.getElementById('migration-year').value;
        }
        
        console.log('Member data prepared:', memberData);
        console.log('Member data keys:', Object.keys(memberData));
        
        try {
            console.log('Attempting to insert into Supabase...');
            
            // Insert the main user record
            const { data: userData, error: userError } = await supabase
                .from('community_members')
                .insert([memberData])
                .select('id');
                
            if (userError) {
                console.error('Supabase user insert error:', userError);
                throw userError;
            }
            
            console.log('User data inserted successfully:', userData);
            
            // Collect and insert migration history if checkbox is checked
            if (formData.hasMigrationHistory) {
                console.log('Processing migration history...');
                const migrationHistory = [];
                const migrationEntries = document.querySelectorAll('.migration-entry');
                
                console.log('Found migration entries:', migrationEntries.length);
                
                migrationEntries.forEach((entry, index) => {
                    const migrationEntry = {
                        member_id: userData[0].id,
                        from_country: document.getElementById(`from-country-${index}`).value,
                        from_city_province: document.getElementById(`from-city-${index}`).value || null,
                        to_country: document.getElementById(`to-country-${index}`).value,
                        to_city_province: document.getElementById(`to-city-${index}`).value || null,
                        migration_month: document.getElementById(`migration-month-${index}`).value || null,
                        migration_year: document.getElementById(`migration-year-${index}`).value,
                        notes: document.getElementById(`migration-notes-${index}`).value || null
                    };
                    
                    console.log(`Migration entry ${index}:`, migrationEntry);
                    migrationHistory.push(migrationEntry);
                });
                
                console.log('Migration history prepared:', migrationHistory);
                
                if (migrationHistory.length > 0) {
                    const { error: migrationError } = await supabase
                        .from('migration_history')
                        .insert(migrationHistory);
                        
                    if (migrationError) {
                        console.error('Supabase migration insert error:', migrationError);
                        throw migrationError;
                    }
                    
                    console.log('Migration history inserted successfully');
                }
            }
            
            // Show success message
            console.log('Form submission completed successfully');
            alert('Thank you for joining the Noriysi community! Your information has been submitted.');
            form.reset();
            
            // Reset form state
            migrationDateRow.style.display = 'none';
            migrationHistoryContainer.style.display = 'none';
            
            // Remove all migration entries except the first one
            const migrationEntries = document.querySelectorAll('.migration-entry');
            for (let i = 1; i < migrationEntries.length; i++) {
                migrationEntries[i].remove();
            }
            
            // Reset tooltip state
            tooltipVisible = false;
            tooltip.style.display = 'none';
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your information. Please try again. Error: ' + error.message);
        }
    });

    // --- Story Carousel Logic ---
    const stories = [
        {
            name: "Vanessa ",
            origin: "Nigeria",
            residence: "England",
            text: "My brothers and I were supposed to be travelling to England for a holiday (or so we thought) until I overheard my mum on the phone two days before our trip confirming that we wouldn't be returning to Nigeria as we would be moving there permanently. I only had enough time to tell ONE FRIEND that I wouldn't be coming back to school  which was ridiculous because it was in the middle of the school term. Less than 48 hours later, my brothers and I found ourselves living in a new country and we've lived here ever since."
        },
        {
            name: "Brandon",
            origin: "Nigeria",
            residence: "Belgium",
            text: "On the 10th of march, I, my sister and my mom landed in Amsterdam. My dad and his friend waiting to pick us up. My dad's friend asked my mom \"do you smoke?\", with a confused look on her face she replies no. He said well you are about to become a smoker. As we stepped outside the airport, we indeed started smoking. I remember the scent in air, the chill and our breath becoming visible for the first time."
        },
        {
            name: "Fatima B.",
            origin: "Morocco",
            residence: "France",
            text: "My parents told me stories of their journey across the Mediterranean..."
        }
    ];

    const openBtn = document.getElementById('open-carousel');
    const modal = document.getElementById('story-carousel-modal');
    const closeBtn = document.getElementById('close-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const cardStack = document.querySelector('.carousel-card-stack');
    let currentIndex = 0;
    let animating = false;

    function renderCard(index, direction = null) {
        if (!cardStack) return;
        cardStack.innerHTML = '';
        const story = stories[index];
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.innerHTML = `
            <div class="carousel-story-text">${story.text}</div>
            <div class="carousel-story-meta">
                <span class="carousel-story-name">${story.name}</span> |
                <span class="carousel-story-origin">${story.origin}</span> → <span class="carousel-story-residence">${story.residence}</span>
            </div>
        `;
        if (direction) {
            card.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
        }
        cardStack.appendChild(card);
    }

    function animateCard(direction) {
        if (animating) return;
        animating = true;
        const oldCard = cardStack.querySelector('.carousel-card');
        if (!oldCard) return;
        oldCard.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
        setTimeout(() => {
            currentIndex = (currentIndex + (direction === 'next' ? 1 : -1) + stories.length) % stories.length;
            renderCard(currentIndex, direction);
            animating = false;
        }, 400);
    }

    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
        renderCard(currentIndex);
    });
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    document.querySelector('.carousel-overlay').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    prevBtn.addEventListener('click', function() {
        if (!animating) animateCard('prev');
    });
    nextBtn.addEventListener('click', function() {
        if (!animating) animateCard('next');
    });
    // Optional: close on Escape
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex' && e.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});