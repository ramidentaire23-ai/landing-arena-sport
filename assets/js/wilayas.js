/**
 * Base de données des 58 Wilayas d'Algérie
 * Synchronisée à 100% avec l'API officielle Nord & Ouest Express (NOEST)
 * Source : https://app.noest-dz.com/api/public/fees & /api/public/desks
 */

const WILAYAS_DATA = [
  {
    "id": 1,
    "code": "01",
    "name_ar": "أدرار",
    "name_fr": "Adrar",
    "has_stopdesk": true,
    "desk_fee": 1000,
    "home_fee": 1500,
    "desks": [
      {
        "key": "01A",
        "code": "1A",
        "name": "Adrar",
        "address": "Centre-ville, à côté de l’ancien magasin Hadj Grifa, en face du centre commercial, quartier El Hattaba – Adrar",
        "commune": "Adrar"
      }
    ],
    "communes": [
      "أدرار (Adrar)",
      "تيميمون (Timimoun)",
      "رقان (Reggane)",
      "فنوغيل (Fenoughil)",
      "تمنطيط (Tamantit)",
      "زاوية كنتة (Zaouiat Kounta)"
    ]
  },
  {
    "id": 2,
    "code": "02",
    "name_ar": "الشلف",
    "name_fr": "Chlef",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "02A",
        "code": "2A",
        "name": "Chlef",
        "address": "Rue Lac des Forêts (À côté du CNRC)",
        "commune": "Chlef"
      },
      {
        "key": "02B",
        "code": "2B",
        "name": "Chlef «Tenes»",
        "address": "Rue de Cherchell en face l’école primaire les frères Menad Ténès",
        "commune": "Tenes"
      }
    ],
    "communes": [
      "الشلف (Chlef)",
      "تنس (Ténès)",
      "وادي الفضة (Oued Fodda)",
      "بوقادير (Boukadir)",
      "عين مران (Aïn Merane)",
      "أولاد فارس (Ouled Fares)"
    ]
  },
  {
    "id": 3,
    "code": "03",
    "name_ar": "الأغواط",
    "name_fr": "Laghouat",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 1000,
    "desks": [
      {
        "key": "03A",
        "code": "3A",
        "name": "Laghouat",
        "address": "Quartier El-Wiam – en face de l’Enfance assistée (à 100 m de l’ancien bureau)",
        "commune": "Laghouat"
      },
      {
        "key": "03B",
        "code": "3B",
        "name": "Laghouat «Aflou»",
        "address": "Rue Al-Gaada, à côté de la boulangerie Belkhair",
        "commune": "Aflou"
      }
    ],
    "communes": [
      "الأغواط (Laghouat)",
      "أفلو (Aflou)",
      "قصر الحيران (Ksar El Hirane)",
      "عين ماضي (Aïn Madhi)",
      "حاسي الرمل (Hassi R'Mel)"
    ]
  },
  {
    "id": 4,
    "code": "04",
    "name_ar": "أم البواقي",
    "name_fr": "Oum El Bouaghi",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "04A",
        "code": "4A",
        "name": "Oum El Bouaghi «Ain Mlila»",
        "address": "Cité El Hanaa, route du Lycée Messas",
        "commune": "Ainmlila"
      },
      {
        "key": "04B",
        "code": "4B",
        "name": "Oum El Bouaghi",
        "address": "Cité 176 logements LSP Batiment 13 – Oum El Bouaghi",
        "commune": "Oum El Bouaghi"
      },
      {
        "key": "04C",
        "code": "4C",
        "name": "Oum El Bouaghi «Aïn El Béïda»",
        "address": "Aïn Béïda en face C.N.A.S  a coté de Pharmacie Belambri",
        "commune": "Ain Beida"
      }
    ],
    "communes": [
      "أم البواقي (Oum El Bouaghi)",
      "عين البيضاء (Aïn Beïda)",
      "عين مليلة (Aïn M'lila)",
      "عين فكرون (Aïn Fakroun)",
      "مسكيانة (Meskiana)"
    ]
  },
  {
    "id": 5,
    "code": "05",
    "name_ar": "باتنة",
    "name_fr": "Batna",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "05A",
        "code": "5A",
        "name": "Batna",
        "address": "Cité meddour kchida en face les batiments 500",
        "commune": "Batna"
      },
      {
        "key": "05B",
        "code": "5B",
        "name": "Batna «Barika»",
        "address": "Quartier CHAABANI , en face notaire Bachir Farhani, a coté Algerie Telecom",
        "commune": "Barika"
      },
      {
        "key": "05C",
        "code": "5C",
        "name": "Batna",
        "address": "Cité 1200 logements oulmi en face la nouvelle poste et station pétro baraka",
        "commune": "Tazoult"
      }
    ],
    "communes": [
      "باتنة (Batna)",
      "بريكة (Barika)",
      "عين التوتة (Aïn Touta)",
      "مروانة (Merouana)",
      "تازولت (Tazoult)",
      "نقاوس (N'Gaous)"
    ]
  },
  {
    "id": 6,
    "code": "06",
    "name_ar": "بجاية",
    "name_fr": "Béjaïa",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "06A",
        "code": "6A",
        "name": "Bejaïa",
        "address": "rue des frères Tabet ,a 20 mètres de l'hôtel Golden H en face la nouvelle promotion nid d'abeille.",
        "commune": "Bejaia"
      },
      {
        "key": "06B",
        "code": "6B",
        "name": "Bejaïa «Akbou»",
        "address": "Rue hibouche – arafou En face de djurdjura cars et alliance assurance",
        "commune": "Akbou"
      },
      {
        "key": "06C",
        "code": "6C",
        "name": "Bejaïa «El-Kseur»",
        "address": "Rue hamaoui hamid commune El-Kseur, bejaia | Repère: local en face la sempac el-kseur",
        "commune": "El Kseur"
      }
    ],
    "communes": [
      "بجاية (Béjaïa)",
      "أقبو (Akbou)",
      "أميزور (Amizour)",
      "القصر (El Kseur)",
      "سيدي عيش (Sidi Aïch)",
      "أوقاس (Aokas)"
    ]
  },
  {
    "id": 7,
    "code": "07",
    "name_ar": "بسكرة",
    "name_fr": "Biskra",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 1000,
    "desks": [
      {
        "key": "07A",
        "code": "7A",
        "name": "Biskra",
        "address": "N° 05, cité elboustène,(Hai ELmodjahidine) en face du Centre de formation et de d'intervention rapide de la police",
        "commune": "Biskra"
      }
    ],
    "communes": [
      "بسكرة (Biskra)",
      "طولقة (Tolga)",
      "سيدي عقبة (Sidi Okba)",
      "أولاد جلال (Ouled Djellal)",
      "الزيبان (Ziban)"
    ]
  },
  {
    "id": 8,
    "code": "08",
    "name_ar": "بشار",
    "name_fr": "Béchar",
    "has_stopdesk": true,
    "desk_fee": 800,
    "home_fee": 1200,
    "desks": [
      {
        "key": "08A",
        "code": "8A",
        "name": "Béchar",
        "address": "Cité 622 Logement Al Badr N°02 - Bloc 52 (derière la radio EL SAOURA / En face la protection civile)",
        "commune": "Bechar"
      }
    ],
    "communes": [
      "بشار (Béchar)",
      "القنادسة (Kenadsa)",
      "بني عباس (Béni Abbès)",
      "العبادلة (Abadla)",
      "تاغيت (Taghit)"
    ]
  },
  {
    "id": 9,
    "code": "09",
    "name_ar": "البليدة",
    "name_fr": "Blida",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "09A",
        "code": "9A",
        "name": "Blida",
        "address": "El ramoule à côté de la nouvelle gare routière",
        "commune": "Blida"
      },
      {
        "key": "09B",
        "code": "9B",
        "name": "Blida « Boufarik »",
        "address": "La résidence Belkbir en face la salle des fetes Layalina ",
        "commune": "Boufarik"
      },
      {
        "key": "09C",
        "code": "9C",
        "name": "Blida « Mouzaia »",
        "address": "54 logements LPP, en face lycée Kacem Nait Kacem, Mouzaia",
        "commune": "Mouzaia"
      }
    ],
    "communes": [
      "البليدة (Blida)",
      "بوفاريك (Boufarik)",
      "أولاد يعيش (Ouled Yaïch)",
      "العفرون (El Affroun)",
      "موزاية (Mouzaïa)",
      "بوقرة (Bougara)",
      "الأربعاء (Larbaâ)"
    ]
  },
  {
    "id": 10,
    "code": "10",
    "name_ar": "البويرة",
    "name_fr": "Bouira",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "10A",
        "code": "10A",
        "name": "Bouira",
        "address": "Villa hamzaoui, ammar khodja , bouira",
        "commune": "Bouira"
      },
      {
        "key": "10B",
        "code": "10B",
        "name": "Bouira « Lakhdaria »",
        "address": "Route national n°05 projet 55 logts social participatif BT A -lakhdaria – bouira (monté tizi elbir à coté de dépôt de vente Semoule MAMA).",
        "commune": "Lakhdaria"
      },
      {
        "key": "10C",
        "code": "10C",
        "name": "Bouira",
        "address": "Cité bouhaihaia sour el Ghozlane",
        "commune": "Sour El Ghozlane"
      }
    ],
    "communes": [
      "البويرة (Bouira)",
      "الأخضرية (Lakhdaria)",
      "عين بسام (Aïn Bessem)",
      "سور الغزلان (Sour El Ghozlane)",
      "مشدا الله (M'Chedallah)"
    ]
  },
  {
    "id": 11,
    "code": "11",
    "name_ar": "تمنراست",
    "name_fr": "Tamanrasset",
    "has_stopdesk": true,
    "desk_fee": 1500,
    "home_fee": 2000,
    "desks": [
      {
        "key": "11A",
        "code": "11A",
        "name": "Tamanrasset",
        "address": "Quartier Moulay Omar, derrière le siège de la Daïra, à côté du parking de la Direction des Travaux Publics.",
        "commune": "Tamanghasset"
      }
    ],
    "communes": [
      "تمنراست (Tamanrasset)",
      "عين قزام (In Guezzam)",
      "عين صالح (In Salah)",
      "أباليسا (Abalessa)"
    ]
  },
  {
    "id": 12,
    "code": "12",
    "name_ar": "تبسة",
    "name_fr": "Tébessa",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "12A",
        "code": "12A",
        "name": "Tébessa",
        "address": "a cote du 2eme commissariat de police et du magasin de meubles REDEL, Tébessa",
        "commune": "Tebessa"
      },
      {
        "key": "12B",
        "code": "12B",
        "name": "Tebessa « El Ouenza »",
        "address": "cité EPLF a coté service des eaux ",
        "commune": "Ouenza"
      },
      {
        "key": "12C",
        "code": "12C",
        "name": "Tébessa « Bir El Ater »",
        "address": "Route nationale numéro 16 en face la station essence Naftal Bir el Ater",
        "commune": "Bir El Ater"
      }
    ],
    "communes": [
      "تبسة (Tébessa)",
      "الشريعة (Chéria)",
      "بئر العاتر (Bir El Ater)",
      "الونزة (Ouenza)",
      "العوينات (El Aouinet)"
    ]
  },
  {
    "id": 13,
    "code": "13",
    "name_ar": "تلمسان",
    "name_fr": "Tlemcen",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 900,
    "desks": [
      {
        "key": "13A",
        "code": "13A",
        "name": "Tlemcen",
        "address": "Les Dhalias 426 El kiffane, tlemcen",
        "commune": "Tlemcen"
      },
      {
        "key": "13B",
        "code": "13B",
        "name": "Tlemcen «Maghnia»",
        "address": "Ouled ben saber, À côté restaurant Rais ",
        "commune": "Maghnia"
      },
      {
        "key": "13C",
        "code": "13C",
        "name": "Tlemcen «Mansourah»",
        "address": "Résidence El Qods Mansourah",
        "commune": "Mansourah"
      }
    ],
    "communes": [
      "تلمسان (Tlemcen)",
      "مغنية (Maghnia)",
      "منصورة (Mansourah)",
      "شتوان (Chetouane)",
      "سبدو (Sebdou)",
      "الغزوات (Ghazaouet)",
      "الرمشي (Remchi)"
    ]
  },
  {
    "id": 14,
    "code": "14",
    "name_ar": "تيارت",
    "name_fr": "Tiaret",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 900,
    "desks": [
      {
        "key": "14A",
        "code": "14A",
        "name": "Tiaret",
        "address": "Cité 180 logements CNT local 01 N° 63 – Tiaret",
        "commune": "Tiaret"
      },
      {
        "key": "14B",
        "code": "14B",
        "name": "Tiaret « Frenda »",
        "address": "Cité 60 logements D121 GP 82 - Frenda",
        "commune": "Frenda"
      },
      {
        "key": "14C",
        "code": "14C",
        "name": "Tiaret «Ksar Chellala»",
        "address": "Cité Houcine Aït Ahmed, n° 17, Commune de Ksar Chellala, Wilaya de Tiaret, à côté de la mosquée Imam Ali Ibnou Abi Taleb",
        "commune": "Ksar Chellala"
      }
    ],
    "communes": [
      "تيارت (Tiaret)",
      "السوقر (Sougueur)",
      "فرندة (Frenda)",
      "قصر الشلالة (Ksar Chellala)",
      "مهدية (Mahdia)"
    ]
  },
  {
    "id": 15,
    "code": "15",
    "name_ar": "تيزي وزو",
    "name_fr": "Tizi Ouzou",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "15A",
        "code": "15A",
        "name": "Tizi Ouzou",
        "address": "Cité 450 Logements, Nouvelle Ville enface la salle des fetes lilya",
        "commune": "Tizi Ouzou"
      },
      {
        "key": "15B",
        "code": "15B",
        "name": "Tizi Ouzou «Azazga»",
        "address": "Route nationale N= 12 taddart",
        "commune": "Azazga"
      },
      {
        "key": "15C",
        "code": "15C",
        "name": "Tizi Ouzou «Draa Ben Khedda»",
        "address": "cooperative -EL WOOROUD, EN FACE A.D.E et ANEM de draa-ben khedda",
        "commune": "Draa Ben Khedda"
      }
    ],
    "communes": [
      "تيزي وزو (Tizi Ouzou)",
      "ذراع بن خدة (Draa Ben Khedda)",
      "عزازقة (Azazga)",
      "لاربعا نات ايراثن (Larbaâ Nath Irathen)",
      "بوغني (Boghni)",
      "تيقزيرت (Tigzirt)"
    ]
  },
  {
    "id": 16,
    "code": "16",
    "name_ar": "الجزائر",
    "name_fr": "Alger",
    "has_stopdesk": true,
    "desk_fee": 450,
    "home_fee": 700,
    "desks": [
      {
        "key": "16A",
        "code": "16A",
        "name": "Alger « Bir mourad Rais »",
        "address": "02, Lotissement Beau Séjour, Bir Mourad Raïs",
        "commune": "Bir Mourad Rais"
      },
      {
        "key": "16B",
        "code": "16B",
        "name": "Alger « Bab Ezzouar »",
        "address": "Devant clinique médicale, En face Ecole Hilal School",
        "commune": "Bab Azzouar"
      },
      {
        "key": "16C",
        "code": "16C",
        "name": "Alger « Chéraga »",
        "address": "Place Iben Badis N° 03 - RDC , Chéraga",
        "commune": "Cheraga"
      },
      {
        "key": "16D",
        "code": "16D",
        "name": "Alger « Reghaia »",
        "address": "822 Logmts LPP Amirouche Batiment A7 N°04 rez-de-chaussée ,Reghaia",
        "commune": "Reghaia"
      },
      {
        "key": "16E",
        "code": "16E",
        "name": "Alger « Centre - Sacré-Cœur »",
        "address": "22 Rue Hocine BELADJEL, Sacré-Cœur, Alger Centre, (En face la banque BADR)",
        "commune": "Alger Centre"
      },
      {
        "key": "16F",
        "code": "16F",
        "name": "Alger « Baba Hassen »",
        "address": "Cité Cherchali Boualam, À côté de croissant rouge, Baba Hassen",
        "commune": "Baba Hassen"
      },
      {
        "key": "16G",
        "code": "16G",
        "name": "Alger « Baraki »",
        "address": "Baraki, route de Larbaâ, entre la mosquée El Bachir El Ibrahimi et le commissariat de la circonscription administrative.",
        "commune": "Baraki"
      },
      {
        "key": "16H",
        "code": "16H",
        "name": "Alger « Bordj el bahri »",
        "address": "Cité Galoul, lotissement coopératif immobilier, n° 428 (A coté de la crèche IBN BAZ - طريق المرشي كوسيدار الجديدة )",
        "commune": "Bordj El Bahri"
      },
      {
        "key": "16I",
        "code": "16I",
        "name": "Alger « Zeralda »",
        "address": "Local N, Cité 62 local LPP BTN 5C, 02 03 RDC, Zéralda",
        "commune": "Zeralda"
      },
      {
        "key": "16J",
        "code": "16J",
        "name": "Alger « Birkhadem »",
        "address": "Birkhadem El Malha ",
        "commune": "Birkhadem"
      },
      {
        "key": "16K",
        "code": "16K",
        "name": "Alger « Hussein Dey »",
        "address": "Rue Layache Yahia N06, Hussein Dey en face Mosquee De Brossette",
        "commune": "Hussein Dey"
      },
      {
        "key": "16L",
        "code": "16L",
        "name": "Alger « Draria »",
        "address": "Draria Boudjemaa Temime Al Ansar",
        "commune": "Draria"
      }
    ],
    "communes": [
      "الجزائر الوسطى (Alger Centre)",
      "سيدي امحمد (Sidi M'Hamed)",
      "المدنية (El Madania)",
      "الحامة - بلوزداد (Belouizdad)",
      "باب الوادي (Bab El Oued)",
      "القصبة (Casbah)",
      "بولوغين (Bologhine)",
      "وادي قريش (Oued Koriche)",
      "بئر مراد رايس (Bir Mourad Raïs)",
      "بئر خادم (Birkhadem)",
      "حيدرة (Hydra)",
      "الأبيار (El Biar)",
      "بن عكنون (Ben Aknoun)",
      "دالي براهيم (Dely Ibrahim)",
      "الشراقة (Cheraga)",
      "أولاد فايت (Ouled Fayet)",
      "عين البنيان (Aïn Benian)",
      "زرالدة (Zeralda)",
      "السطاوالي (Staoueli)",
      "درارية (Draria)",
      "العاشور (El Achour)",
      "باب الزوار (Bab Ezzouar)",
      "الدار البيضاء (Dar El Beïda)",
      "المحمدية (Mohammadia)",
      "برج الكيفان (Bordj El Kiffan)",
      "برج البحري (Bordj El Bahri)",
      "الرغاية (Reghaïa)",
      "الرويبة (Rouïba)",
      "الحراش (El Harrach)",
      "براقي (Baraki)",
      "الكاليتوس (Les Eucalyptus)",
      "باش جراح (Bachedjerrah)",
      "القبة (Kouba)",
      "حسين داي (Hussein Dey)"
    ]
  },
  {
    "id": 17,
    "code": "17",
    "name_ar": "الجلفة",
    "name_fr": "Djelfa",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 1000,
    "desks": [
      {
        "key": "17A",
        "code": "17A",
        "name": "Djelfa",
        "address": "Centre-ville, en face de la Caisse Nationale des Retraites (C.N.R), Quartier Ben Djerma",
        "commune": "Djelfa"
      },
      {
        "key": "17B",
        "code": "17B",
        "name": "Djelfa «Ain Ouassara»",
        "address": "Quartier Mohamed Boudiaf, Section 23, Local n° 30 Bisi, Commune de Ain Oussera.",
        "commune": "Ain Oussera"
      }
    ],
    "communes": [
      "الجلفة (Djelfa)",
      "عين وسارة (Aïn Oussera)",
      "مسعد (Messaad)",
      "حاسي بحبح (Hassi Bahbah)",
      "دار الشيوخ (Dar Chioukh)"
    ]
  },
  {
    "id": 18,
    "code": "18",
    "name_ar": "جيجل",
    "name_fr": "Jijel",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "18A",
        "code": "18A",
        "name": "Jijel",
        "address": "rue26, Avenue Kaoula Mokhtar, cita sans intérdit , Hay IDARI",
        "commune": "Jijel"
      },
      {
        "key": "18B",
        "code": "18B",
        "name": "Jijel « El Milia »",
        "address": "5 juillet rue du stade EL-MILIA, à côté de la protection civile ",
        "commune": "El Milia"
      }
    ],
    "communes": [
      "جيجل (Jijel)",
      "طاهير (Taher)",
      "الميلية (El Milia)",
      "العوانة (El Aouana)",
      "زيامة منصورية (Ziama Mansouriah)"
    ]
  },
  {
    "id": 19,
    "code": "19",
    "name_ar": "سطيف",
    "name_fr": "Sétif",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "19A",
        "code": "19A",
        "name": "Sétif",
        "address": "Cité Mesoudi Edhouadi 1014-614 Logement (En face la gare Didouche Mourad)",
        "commune": "Setif"
      },
      {
        "key": "19B",
        "code": "19B",
        "name": "Sétif «El eulma»",
        "address": "Tassahoumi, a coté de transport hamouda et hôtel Rato rue Touaher el khayer et à côté de transport el ikhlas, el eulma, Sétif",
        "commune": "El Eulma"
      },
      {
        "key": "19C",
        "code": "19C",
        "name": "Sétif «Ain Oulmene»",
        "address": "En face CEM Douhil Abdul Hamid,",
        "commune": "Ain Oulmane"
      },
      {
        "key": "19D",
        "code": "19D",
        "name": "Sétif «Guidjel»",
        "address": "La zone industrielle, en face du groupe SADI et à côté de la moussala d'El Takwa",
        "commune": "Guidjel"
      }
    ],
    "communes": [
      "سطيف (Sétif)",
      "العلمة (El Eulma)",
      "عين ولمان (Aïn Oulmene)",
      "عين الكبيرة (Aïn El Kebira)",
      "بوقاعة (Bougaa)",
      "عموشة (Amoucha)"
    ]
  },
  {
    "id": 20,
    "code": "20",
    "name_ar": "سعيدة",
    "name_fr": "Saïda",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 900,
    "desks": [
      {
        "key": "20A",
        "code": "20A",
        "name": "Saïda",
        "address": "Cité Riad en face Maison de l'Environnement",
        "commune": "Saida"
      }
    ],
    "communes": [
      "سعيدة (Saïda)",
      "عين الحجر (Aïn El Hadjar)",
      "يوب (Youb)",
      "الحساسنة (Hassasna)"
    ]
  },
  {
    "id": 21,
    "code": "21",
    "name_ar": "سكيكدة",
    "name_fr": "Skikda",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "21A",
        "code": "21A",
        "name": "Skikda",
        "address": "Rue du Chahid Meziane Salah (Route Bouyali, Immeuble Guerza) شارع الشهيد مزيان صالح (طريق بويعلى,عمارة ڨرزة)",
        "commune": "Skikda"
      },
      {
        "key": "21B",
        "code": "21B",
        "name": "Skikda « Azzaba »",
        "address": "Cite mefrouche  dahmane",
        "commune": "Azzaba"
      },
      {
        "key": "21C",
        "code": "21C",
        "name": "Skikda «Collo»",
        "address": "Rue Zighoud Youssef (en face l'école primaire Mesikh Ammar / à côté du tribunal de Collo)",
        "commune": "Collo"
      }
    ],
    "communes": [
      "سكيكدة (Skikda)",
      "عزابة (Azzaba)",
      "الحروش (El Harrouch)",
      "القل (Collo)",
      "رمضان جمال (Ramdane Djamel)",
      "تمالوس (Tamalous)"
    ]
  },
  {
    "id": 22,
    "code": "22",
    "name_ar": "سيدي بلعباس",
    "name_fr": "Sidi Bel Abbès",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "22A",
        "code": "22A",
        "name": "Sidi bel abbès",
        "address": "Rue Adda Boudjellal , Boulevard Lieutenant Khelladi N°19 Sidi Belabbes (Ex rue Perrin,en face Sonelgaz)",
        "commune": "Sidi Bel Abbes"
      }
    ],
    "communes": [
      "سيدي بلعباس (Sidi Bel Abbès)",
      "تلاغ (Telagh)",
      "سفيزف (Sfisef)",
      "بن باديس (Ben Badis)",
      "سيدي لحسن (Sidi Lahcene)"
    ]
  },
  {
    "id": 23,
    "code": "23",
    "name_ar": "عنابة",
    "name_fr": "Annaba",
    "has_stopdesk": true,
    "desk_fee": 300,
    "home_fee": 500,
    "desks": [
      {
        "key": "23A",
        "code": "23A",
        "name": "Annaba",
        "address": "Rue Djemila, Saint Claud (À côté de la mosqué Badr)",
        "commune": "Annaba"
      },
      {
        "key": "23B",
        "code": "23B",
        "name": "Annaba «EL BOUNI»",
        "address": "Fractionnement de la Bouni 2, zone urbaine n° 43, rez-de-chaussée, section 40, groupe de propriété 02, Bouni",
        "commune": "El Bouni"
      }
    ],
    "communes": [
      "عنابة (Annaba)",
      "البوني (El Bouni)",
      "سيدي عمار (Sidi Amar)",
      "برحال (Berrahal)",
      "الحجار (El Hadjar)",
      "عين الباردة (Aïn Berda)"
    ]
  },
  {
    "id": 24,
    "code": "24",
    "name_ar": "قالمة",
    "name_fr": "Guelma",
    "has_stopdesk": true,
    "desk_fee": 450,
    "home_fee": 700,
    "desks": [
      {
        "key": "24A",
        "code": "24A",
        "name": "Guelma",
        "address": "Cité 19 Juin - Numéro 02, en face marché Elbaraka",
        "commune": "Guelma"
      }
    ],
    "communes": [
      "قالمة (Guelma)",
      "وادي الزناتي (Oued Zenati)",
      "بوشقوف (Bouchegouf)",
      "هيليوبوليس (Héliopolis)",
      "بلخير (Belkheir)"
    ]
  },
  {
    "id": 25,
    "code": "25",
    "name_ar": "قسنطينة",
    "name_fr": "Constantine",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "25A",
        "code": "25A",
        "name": "Constantine «Zouaghi»",
        "address": "Cité Tlemcen Zouaghi (En face de la gendarmerie)",
        "commune": "Hamma Bouziane"
      },
      {
        "key": "25B",
        "code": "25B",
        "name": "Constantine «Ali Mendjeli»",
        "address": "En face de Sarl Natura pro Algérie/entre deux salles des fêtés el baraka et méga",
        "commune": "El Khroub"
      },
      {
        "key": "25C",
        "code": "25C",
        "name": "Constantine",
        "address": "Avenue Kaddour Boumedous (Ciloc) a coté de la direction régionale d’Air Algérie.",
        "commune": "Constantine"
      }
    ],
    "communes": [
      "قسنطينة (Constantine)",
      "الخروب (El Khroub)",
      "علي منجلي (Ali Mendjeli)",
      "عين سمارة (Aïn Smara)",
      "حامة بوزيان (Hamma Bouziane)",
      "ديدوش مراد (Didouche Mourad)",
      "زيغود يوسف (Zighoud Youcef)"
    ]
  },
  {
    "id": 26,
    "code": "26",
    "name_ar": "المدية",
    "name_fr": "Médéa",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "26A",
        "code": "26A",
        "name": "Médéa",
        "address": "Cité Ennasr (Près du pôle universitaire et Sonelgaz)",
        "commune": "Medea"
      },
      {
        "key": "26B",
        "code": "26B",
        "name": "Médéa «Ksar El Boukhari»",
        "address": "ZONE URBAINE NOUVELLE 246/03 LOCAL 01 KEB",
        "commune": "Ksar El Boukhari"
      }
    ],
    "communes": [
      "المدية (Médéa)",
      "البرواقية (Berrouaghia)",
      "قصر البخاري (Ksar El Boukhari)",
      "بني سليمان (Beni Slimane)",
      "تابلاط (Tablat)"
    ]
  },
  {
    "id": 27,
    "code": "27",
    "name_ar": "مستغانم",
    "name_fr": "Mostaganem",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "27A",
        "code": "27A",
        "name": "Mostaganem",
        "address": "La pépinière en face la glacière juste à côté de la libraire BENALIOUA ( cité AKID AMIROUCHE boulevard NAFOUSSI OTHMAN)",
        "commune": "Mostaganem"
      },
      {
        "key": "27B",
        "code": "27B",
        "name": "Mostaganem «Sidi lakhder»",
        "address": "rue si abdelah  01 novembre devant la poste sidi lakhder",
        "commune": "Sidi Lakhdar"
      }
    ],
    "communes": [
      "مستغانم (Mostaganem)",
      "عين تادلس (Aïn Tedeles)",
      "سيدي علي (Sidi Ali)",
      "حاسي ماماش (Hassi Mameche)",
      "بوقيرات (Bouguirat)"
    ]
  },
  {
    "id": 28,
    "code": "28",
    "name_ar": "المسيلة",
    "name_fr": "M'Sila",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "28A",
        "code": "28A",
        "name": "M'sila",
        "address": "Rue Ichbilia (En face l'université de M'Sila)",
        "commune": "Msila"
      },
      {
        "key": "28B",
        "code": "28B",
        "name": "M'sila «Bousaada»",
        "address": "Cité El Bader (ESTTIH) a coté de L'annexe de L'APC ,Bousaada",
        "commune": "Bou Saada"
      }
    ],
    "communes": [
      "المسيلة (M'Sila)",
      "بوسعادة (Bou Saâda)",
      "سيدي عيسى (Sidi Aïssa)",
      "عين الحجل (Aïn El Hadjel)",
      "مقرة (Magra)"
    ]
  },
  {
    "id": 29,
    "code": "29",
    "name_ar": "معسكر",
    "name_fr": "Mascara",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 850,
    "desks": [
      {
        "key": "29A",
        "code": "29A",
        "name": "Mascara «Mohammadia»",
        "address": "Rue Larbi Ben M'hidi, a coté de l'agence de Barigou,",
        "commune": "Mohammadia"
      },
      {
        "key": "29B",
        "code": "29B",
        "name": "Mascara «Ville»",
        "address": "04 Rue Bouakkaz Ali, La zone 08, Mascara (à côté de salle des fêtes Bent El Solana, et Cafeteria Ali ; En face CNR Mascara)",
        "commune": "Mascara"
      }
    ],
    "communes": [
      "معسكر (Mascara)",
      "سيق (Sig)",
      "تيغنيف (Tighennif)",
      "المحمدية (Mohammadia)",
      "غريس (Ghriss)"
    ]
  },
  {
    "id": 30,
    "code": "30",
    "name_ar": "ورقلة",
    "name_fr": "Ouargla",
    "has_stopdesk": true,
    "desk_fee": 700,
    "home_fee": 1100,
    "desks": [
      {
        "key": "30A",
        "code": "30A",
        "name": "Ouargla",
        "address": "Sidi Abdelkader, derrière la maison de jeune",
        "commune": "Ouargla"
      },
      {
        "key": "30B",
        "code": "30B",
        "name": "Ouargla «Hassi Messaoud»",
        "address": "Quartier 1850, rue principale du marché hebdomadaire, en face de l’ancienne agence KIA, Hassi Messaoud",
        "commune": "Hassi Messaoud"
      }
    ],
    "communes": [
      "ورقلة (Ouargla)",
      "حاسي مسعود (Hassi Messaoud)",
      "الرويسات (Rouissat)",
      "النزلة (N'Goussa)"
    ]
  },
  {
    "id": 31,
    "code": "31",
    "name_ar": "وهران",
    "name_fr": "Oran",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "31A",
        "code": "31A",
        "name": "Oran «Maraval»",
        "address": "Maraval en face fulla moda a côté de supérette El kandi",
        "commune": "Es Senia"
      },
      {
        "key": "31B",
        "code": "31B",
        "name": "Oran «Bir El Djir»",
        "address": "Coopérative Immobilière Dar El Amel - N°14 - Local1 RC",
        "commune": "Bir El Djir"
      },
      {
        "key": "31C",
        "code": "31C",
        "name": "Oran «Gambita»",
        "address": "Gambetta En face arrêt de bus 51 et 11 de (dispensaire cave-gay)",
        "commune": "Oran"
      },
      {
        "key": "31D",
        "code": "31D",
        "name": "Oran «Arzew»",
        "address": "EN FACE ANCIEN DAIRA D’ARZEW , Rue KADIR ELHABIB N° 04, Oran",
        "commune": "Arzew"
      },
      {
        "key": "31E",
        "code": "31E",
        "name": "Oran «Essabah»",
        "address": "Coopérative Immobilière El Salam, N° D3, Lotissement 02, Îlot 51 (Partie 02), Îlot 292, Sidi Chami, Cité Essabah, à côté du terminus du tramway.",
        "commune": "Sidi Chami"
      }
    ],
    "communes": [
      "وهران (Oran)",
      "بئر الجير (Bir El Djir)",
      "السانية (Es Senia)",
      "عين الترك (Aïn El Turk)",
      "أرزيو (Arzew)",
      "بطيوة (Bethioua)",
      "الكرمة (El Kerma)",
      "سيدي الشحمي (Sidi Chami)",
      "قديل (Gdyel)"
    ]
  },
  {
    "id": 32,
    "code": "32",
    "name_ar": "البيض",
    "name_fr": "El Bayadh",
    "has_stopdesk": true,
    "desk_fee": 800,
    "home_fee": 1200,
    "desks": [
      {
        "key": "32A",
        "code": "32A",
        "name": "El Bayadh ",
        "address": "Cité jolie vue (Al-Mandhar Al-Jamil), à côté de la Direction de la distribution d'électricité et de gaz",
        "commune": "El Bayadh"
      }
    ],
    "communes": [
      "البيض (El Bayadh)",
      "الأبيض سيدي الشيخ (El Abiodh Sidi Cheikh)",
      "بريزينة (Brezina)",
      "بوعلام (Boualem)"
    ]
  },
  {
    "id": 33,
    "code": "33",
    "name_ar": "إليزي",
    "name_fr": "Illizi",
    "has_stopdesk": true,
    "desk_fee": 1500,
    "home_fee": 1900,
    "desks": [
      {
        "key": "33A",
        "code": "33A",
        "name": "Illizi",
        "address": "Centre-ville, quartier Bouchache, rue de la Poissonnerie.",
        "commune": "Illizi"
      }
    ],
    "communes": [
      "إليزي (Illizi)",
      "جانت (Djanet)",
      "إن أمناس (In Amenas)"
    ]
  },
  {
    "id": 34,
    "code": "34",
    "name_ar": "برج بوعريريج",
    "name_fr": "Bordj Bou Arreridj",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "34A",
        "code": "34A",
        "name": "Bordj Bou Arreridj",
        "address": "Rue Tabet Salah Bordj Bou Arreridj (Devant la maison de finance)",
        "commune": "Bordj Bou Arreridj"
      },
      {
        "key": "34B",
        "code": "34B",
        "name": "Ras El Oued",
        "address": "À l’intersection de la rue Salah Bey et de la rue Moussa N’mar , en face de la Brigade Régionale de la Gendarmerie Nationale de Ras El Oued",
        "commune": "Bordj Bou Arreridj «Ras El Oued» "
      }
    ],
    "communes": [
      "برج بوعريريج (Bordj Bou Arreridj)",
      "راس الوادي (Ras El Oued)",
      "برج الغدير (Bordj Ghedir)",
      "المنصورة (Mansoura)",
      "الحمادية (El Hamadia)"
    ]
  },
  {
    "id": 35,
    "code": "35",
    "name_ar": "بومرداس",
    "name_fr": "Boumerdès",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "35A",
        "code": "35A",
        "name": "Boumerdès ",
        "address": "Cité mimouza en face la piscine olympique Boumerdes",
        "commune": "Boumerdes"
      },
      {
        "key": "35B",
        "code": "35B",
        "name": "Boumerdès «Ouled Moussa» ",
        "address": "La zone industrielle d'Ouled Moussa",
        "commune": "Ouled Moussa"
      },
      {
        "key": "35C",
        "code": "35C",
        "name": "Boumerdès «Bordj Menaiel»",
        "address": "Rue Madaoui Ali, LOCAL BOUMZER EN FACE OPHTALMOLOGISTE DOCTEUR BENMOUSSA HOCINE, BORDJ MENAIEL, BOUMERDES ",
        "commune": "Bordj Menaiel"
      },
      {
        "key": "35D",
        "code": "35D",
        "name": "Boumerdès «Dellys»",
        "address": "La banlieue Est de Dellys, route nationale n° 24, Rez de chaussée bâtiment (B), Local N° B05, DELLYS | Repère : AGENCE IMMOBILLIERE NADJI",
        "commune": "Dellys"
      }
    ],
    "communes": [
      "بومرداس (Boumerdès)",
      "برج منايل (Bordj Menaïel)",
      "دلس (Dellys)",
      "يسر (Isser)",
      "الثنية (Thenia)",
      "خميس الخشنة (Khemis El Khechna)",
      "بودواو (Boudouaou)"
    ]
  },
  {
    "id": 36,
    "code": "36",
    "name_ar": "الطارف",
    "name_fr": "El Tarf",
    "has_stopdesk": true,
    "desk_fee": 450,
    "home_fee": 700,
    "desks": [
      {
        "key": "36A",
        "code": "36A",
        "name": "El Taref",
        "address": "حي ريتين خميس , بجانب الأمن الحضري الأول",
        "commune": "El Tarf"
      }
    ],
    "communes": [
      "الطارف (El Tarf)",
      "بوثلجة (Bouteldja)",
      "بن مهيدي (Ben M'Hidi)",
      "القالة (El Kala)",
      "الذرعان (Drean)"
    ]
  },
  {
    "id": 37,
    "code": "37",
    "name_ar": "تندوف",
    "name_fr": "Tindouf",
    "has_stopdesk": true,
    "desk_fee": 1000,
    "home_fee": 1600,
    "desks": [
      {
        "key": "37A",
        "code": "37A",
        "name": "Tindouf",
        "address": "Magasin N°03 cité Al-Qasabi, Section 14, Groupement Immobilier N° 165, Commune de Tindouf ",
        "commune": "Tindouf"
      }
    ],
    "communes": [
      "تندوف (Tindouf)",
      "أم العسل (Oum El Assel)"
    ]
  },
  {
    "id": 38,
    "code": "38",
    "name_ar": "تيسمسيلت",
    "name_fr": "Tissemsilt",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "38A",
        "code": "38A",
        "name": "Tissemsilt",
        "address": "Résidence kaidi (promotion) ancien arrêt des taxis",
        "commune": "Tissemsilt"
      }
    ],
    "communes": [
      "تيسمسيلت (Tissemsilt)",
      "ثنية الحد (Theniet El Had)",
      "برج بونعامة (Bordj Bounaama)",
      "خميستي (Khemisti)"
    ]
  },
  {
    "id": 39,
    "code": "39",
    "name_ar": "الوادي",
    "name_fr": "El Oued",
    "has_stopdesk": true,
    "desk_fee": 700,
    "home_fee": 1100,
    "desks": [
      {
        "key": "39A",
        "code": "39A",
        "name": "El Oued",
        "address": "Cité Al-Rimal, Commune El Oued wilaya El Ouadi (la route menant au tribunal)",
        "commune": "El Oued"
      }
    ],
    "communes": [
      "الوادي (El Oued)",
      "قمار (Guemar)",
      "الدبيلة (Debila)",
      "الرباح (Robbah)",
      "جامعة (Djamâa)",
      "المغير (El M'Ghair)"
    ]
  },
  {
    "id": 40,
    "code": "40",
    "name_ar": "خنشلة",
    "name_fr": "Khenchela",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "40A",
        "code": "40A",
        "name": "Khenchela",
        "address": "Rue du poid lourd à coté de la clinique du dialyse Messai -Khenchela-",
        "commune": "Khenchela"
      }
    ],
    "communes": [
      "خنشلة (Khenchela)",
      "ششار (Chechar)",
      "قايس (Kaïs)",
      "بابار (Babar)",
      "أولاد رشاش (Ouled Rechache)"
    ]
  },
  {
    "id": 41,
    "code": "41",
    "name_ar": "سوق أهراس",
    "name_fr": "Souk Ahras",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "41A",
        "code": "41A",
        "name": "Souk ahres",
        "address": "En face radio souk ahras et l laboratoire des analyses Taghest",
        "commune": "Souk Ahras"
      }
    ],
    "communes": [
      "سوق أهراس (Souk Ahras)",
      "سدراتة (Sedrata)",
      "مداوروش (Madaourouch)",
      "تاغاست (Taoura)"
    ]
  },
  {
    "id": 42,
    "code": "42",
    "name_ar": "تيبازة",
    "name_fr": "Tipaza",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "42A",
        "code": "42A",
        "name": "Tipaza",
        "address": "Cité Mohammed Bougara, a coté de ecole privé DAYA Shcool",
        "commune": "Tipaza"
      },
      {
        "key": "42B",
        "code": "42B",
        "name": "Tipaza «Koléa»",
        "address": "Route d’Alger - Kolea, commune de Kolea, wilaya de Tipaza.",
        "commune": "Kolea"
      }
    ],
    "communes": [
      "تيبازة (Tipaza)",
      "شرشال (Cherchell)",
      "القليعة (Koléa)",
      "بواسماعيل (Bou Ismaïl)",
      "حجوط (Hadjout)",
      "فوكة (Fouka)",
      "الداموس (Damous)"
    ]
  },
  {
    "id": 43,
    "code": "43",
    "name_ar": "ميلة",
    "name_fr": "Mila",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "43A",
        "code": "43A",
        "name": "Mila ",
        "address": "chateau d'eau en face protection civile",
        "commune": "Mila"
      },
      {
        "key": "43B",
        "code": "43B",
        "name": "Mila «Chelghoum El aid»",
        "address": "Rue 1er Nouvembre 1954 Chelghoum El aid (hotel Rhumel)",
        "commune": "Chelghoum Laid"
      },
      {
        "key": "43C",
        "code": "43C",
        "name": "Mila «Tadjenanet»",
        "address": "Rue 1 novembre en face cem mohamed abdo",
        "commune": "Tadjenanet"
      },
      {
        "key": "43D",
        "code": "43D",
        "name": "Mila «Ferdjioua»",
        "address": "Rue 1 novembre en face la gam assurance",
        "commune": "Ferdjioua"
      }
    ],
    "communes": [
      "ميلة (Mila)",
      "شلغوم العيد (Chelghoum Laïd)",
      "فرجيوة (Ferdjioua)",
      "تاجنانت (Tadjenanet)",
      "قرارم قوقة (Grarem Gouga)"
    ]
  },
  {
    "id": 44,
    "code": "44",
    "name_ar": "عين الدفلى",
    "name_fr": "Aïn Defla",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "44A",
        "code": "44A",
        "name": "Ain Defla",
        "address": "City Najem, en face de l'entrée du groupement régional de la Gendarmerie Nationale, L’escadron",
        "commune": "Ain Defla"
      },
      {
        "key": "44B",
        "code": "44B",
        "name": "Ain Defla «Khemis miliana»",
        "address": "Cité Ahmed ben Abd Allah commune khemismiliana wilaya de Ain defla",
        "commune": "Khemis Miliana"
      }
    ],
    "communes": [
      "عين الدفلى (Aïn Defla)",
      "خميس مليانة (Khemis Miliana)",
      "مليانة (Miliana)",
      "العطاف (El Attaf)",
      "العامرة (El Amra)"
    ]
  },
  {
    "id": 45,
    "code": "45",
    "name_ar": "النعامة",
    "name_fr": "Naâma",
    "has_stopdesk": true,
    "desk_fee": 800,
    "home_fee": 1200,
    "desks": [
      {
        "key": "45A",
        "code": "45A",
        "name": "Naâma «Mécheria»",
        "address": "Route Nationale n°06, à côté de l’hôtel Amine et du centre d’Algérie Télécom",
        "commune": "Mechria"
      }
    ],
    "communes": [
      "النعامة (Naâma)",
      "مشرية (Mécheria)",
      "عين الصفراء (Aïn Sefra)",
      "عسلة (Asla)"
    ]
  },
  {
    "id": 46,
    "code": "46",
    "name_ar": "عين تموشنت",
    "name_fr": "Aïn Témouchent",
    "has_stopdesk": true,
    "desk_fee": 500,
    "home_fee": 800,
    "desks": [
      {
        "key": "46A",
        "code": "46A",
        "name": "Aïn Témouchent",
        "address": "22A cité des oliviers ain témouchnet 46000(en face du parking de la  wilaya)",
        "commune": "Ain Temouchent"
      }
    ],
    "communes": [
      "عين تموشنت (Aïn Témouchent)",
      "بني صاف (Béni Saf)",
      "حمام بوحجر (Hammam Bouhadjar)",
      "العامرية (El Amria)"
    ]
  },
  {
    "id": 47,
    "code": "47",
    "name_ar": "غرداية",
    "name_fr": "Ghardaïa",
    "has_stopdesk": true,
    "desk_fee": 700,
    "home_fee": 1100,
    "desks": [
      {
        "key": "47A",
        "code": "47A",
        "name": "Ghardaïa",
        "address": "Rue principale Hadj Messaoud en face la branche municipale, Haj Masoud",
        "commune": "Ghardaia"
      }
    ],
    "communes": [
      "غرداية (Ghardaïa)",
      "القرارة (El Guerrara)",
      "بريان (Berriane)",
      "بني يزقن (Beni Isguen)",
      "المنيعة (El Menia)"
    ]
  },
  {
    "id": 48,
    "code": "48",
    "name_ar": "غليزان",
    "name_fr": "Relizane",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 900,
    "desks": [
      {
        "key": "48A",
        "code": "48A",
        "name": "Relizane",
        "address": "Cité 31 logmt en face la justice, a coté de la banque societé général algerie",
        "commune": "Relizane"
      }
    ],
    "communes": [
      "غليزان (Relizane)",
      "وادي ارهيو (Oued Rhiou)",
      "مازونة (Mazouna)",
      "يلل (Yellel)",
      "عمي موسى (Ammi Moussa)"
    ]
  },
  {
    "id": 49,
    "code": "49",
    "name_ar": "تيميمون",
    "name_fr": "Timimoun",
    "has_stopdesk": true,
    "desk_fee": 1000,
    "home_fee": 1500,
    "desks": [
      {
        "key": "49A",
        "code": "49A",
        "name": "Timimoun",
        "address": "cité MAHDJOUB N° de la porte 16 , Timimoun en face le stade et SAA",
        "commune": "Timimoun"
      }
    ],
    "communes": [
      "تيميمون (Timimoun)",
      "أوقروت (Aougrout)",
      "تنركوك (Tinerkouk)",
      "طلمين (Talmine)"
    ]
  },
  {
    "id": 50,
    "code": "50",
    "name_ar": "برج باجي مختار",
    "name_fr": "Bordj Badji Mokhtar",
    "has_stopdesk": false,
    "desk_fee": 1000,
    "home_fee": 1400,
    "desks": [],
    "communes": [
      "برج باجي مختار (Bordj Badji Mokhtar)",
      "تيمياوين (Timiaouine)"
    ]
  },
  {
    "id": 51,
    "code": "51",
    "name_ar": "أولاد جلال",
    "name_fr": "Ouled Djellal",
    "has_stopdesk": true,
    "desk_fee": 600,
    "home_fee": 1000,
    "desks": [
      {
        "key": "51A",
        "code": "51A",
        "name": "Ouled Djellal",
        "address": "تحت فندق ترنزيت نجانبة الحماية المدنية ولاد جلال /   Rez-de-chaussée de l'hôtel Transit, à côté de la protection civile d'Ouled Djellal.",
        "commune": "Ouled Djellal"
      }
    ],
    "communes": [
      "أولاد جلال (Ouled Djellal)",
      "سيدي خالد (Sidi Khaled)",
      "رأس الميعاد (Ras El Miaad)"
    ]
  },
  {
    "id": 52,
    "code": "52",
    "name_ar": "بني عباس",
    "name_fr": "Béni Abbès",
    "has_stopdesk": true,
    "desk_fee": 800,
    "home_fee": 1200,
    "desks": [
      {
        "key": "52A",
        "code": "52A",
        "name": "BENI ABBES",
        "address": "A coté la wilaya BENI ABBES , en face LAPIWI ( المجلس الشعبي الولائي  (",
        "commune": "Beni Abbes"
      }
    ],
    "communes": [
      "بني عباس (Béni Abbès)",
      "كرزاز (Kerzaz)",
      "الوطاء (El Ouata)",
      "تبلبالة (Tabelbala)"
    ]
  },
  {
    "id": 53,
    "code": "53",
    "name_ar": "عين صالح",
    "name_fr": "In Salah",
    "has_stopdesk": true,
    "desk_fee": 1200,
    "home_fee": 1800,
    "desks": [
      {
        "key": "53A",
        "code": "53A",
        "name": "In Salah",
        "address": "Près de la Direction des travaux publics, en face de l'entrée du radar d'Algérie Télécom",
        "commune": "Ain Salah"
      }
    ],
    "communes": [
      "عين صالح (In Salah)",
      "فقارة الزاوية (Foggaret Ezzaouia)",
      "إن غار (In Ghar)"
    ]
  },
  {
    "id": 54,
    "code": "54",
    "name_ar": "عين قزام",
    "name_fr": "In Guezzam",
    "has_stopdesk": false,
    "desk_fee": 1000,
    "home_fee": 1400,
    "desks": [],
    "communes": [
      "عين قزام (In Guezzam)",
      "تين زواتين (Tin Zaouatine)"
    ]
  },
  {
    "id": 55,
    "code": "55",
    "name_ar": "تقرت",
    "name_fr": "Touggourt",
    "has_stopdesk": true,
    "desk_fee": 700,
    "home_fee": 1100,
    "desks": [
      {
        "key": "55A",
        "code": "55A",
        "name": "Touggourt",
        "address": "Cité Sidi Abdeslam (Prés de la banque BEA), Touggourt",
        "commune": "Touggourt"
      }
    ],
    "communes": [
      "تقرت (Touggourt)",
      "تماسين (Temacine)",
      "المقارن (Megarine)",
      "الطيبات (Taibet)"
    ]
  },
  {
    "id": 56,
    "code": "56",
    "name_ar": "جانت",
    "name_fr": "Djanet",
    "has_stopdesk": true,
    "desk_fee": 1600,
    "home_fee": 2200,
    "desks": [
      {
        "key": "56A",
        "code": "56A",
        "name": "Djanet",
        "address": "Centre-ville Tine Khatema, à côté du dentiste, Djanet",
        "commune": "Djanet"
      }
    ],
    "communes": [
      "جانت (Djanet)",
      "برج الحواس (Bordj El Haouas)"
    ]
  },
  {
    "id": 57,
    "code": "57",
    "name_ar": "المغير",
    "name_fr": "El M'Ghair",
    "has_stopdesk": true,
    "desk_fee": 700,
    "home_fee": 1100,
    "desks": [
      {
        "key": "57A",
        "code": "57A",
        "name": "El M'Ghair",
        "address": "Centre-ville, à côté du café Jneidi – El M'Ghair.",
        "commune": "El M'Ghair"
      }
    ],
    "communes": [
      "المغير (El M'Ghair)",
      "جامعة (Djamâa)",
      "أم الطيور (Oum El Touyour)"
    ]
  },
  {
    "id": 58,
    "code": "58",
    "name_ar": "المنيعة",
    "name_fr": "El Meniaa",
    "has_stopdesk": true,
    "desk_fee": 700,
    "home_fee": 1100,
    "desks": [
      {
        "key": "58A",
        "code": "58A",
        "name": "El Meniaa",
        "address": "Rue de l'unite African (À côté de la boulangerie Boussaid) Il se trouve à 20 mètres de la mosquée saad beno abi elouas",
        "commune": "El Meniaa"
      }
    ],
    "communes": [
      "المنيعة (El Meniaa)",
      "حاسي الفحل (Hassi Gara)",
      "حاسي القارة (Hassi El Gara)"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WILAYAS_DATA;
}
