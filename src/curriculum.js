/**
 * CBSE Curriculum Registry
 * 
 * Hierarchy:
 * Class (6-12) -> Subject -> Academic Year (e.g., "2026-27") -> Course/Code -> Chapters/Units
 * 
 * Chapter/Unit Schema:
 * {
 *   num: number,
 *   name: string,
 *   type: "chapter" | "unit",
 *   book?: string,
 *   course?: string,
 *   code?: string
 * }
 */

export const CBSE_CURRICULUM = {
  "6": {
    "Mathematics": {
      "2026-27": {
        "default": {
          book: "Ganita Prakash",
          chapters: [
            { num: 1, name: "Patterns in Mathematics", type: "chapter", book: "Ganita Prakash" },
            { num: 2, name: "Lines and Angles", type: "chapter", book: "Ganita Prakash" },
            { num: 3, name: "Number Play", type: "chapter", book: "Ganita Prakash" },
            { num: 4, name: "Data Handling and Presentation", type: "chapter", book: "Ganita Prakash" },
            { num: 5, name: "Prime Time", type: "chapter", book: "Ganita Prakash" },
            { num: 6, name: "Perimeter and Area", type: "chapter", book: "Ganita Prakash" },
            { num: 7, name: "Fractions", type: "chapter", book: "Ganita Prakash" },
            { num: 8, name: "Playing with Constructions", type: "chapter", book: "Ganita Prakash" },
            { num: 9, name: "Symmetry", type: "chapter", book: "Ganita Prakash" },
            { num: 10, name: "The Other Side of Zero", type: "chapter", book: "Ganita Prakash" }
          ]
        }
      }
    },
    "Science": {
      "2026-27": {
        "default": {
          book: "Curiosity",
          chapters: [
            { num: 1, name: "The Wonderful World of Science", type: "chapter", book: "Curiosity" },
            { num: 2, name: "Diversity in the Living World", type: "chapter", book: "Curiosity" },
            { num: 3, name: "Mindful Eating: A Path to a Healthy Body", type: "chapter", book: "Curiosity" },
            { num: 4, name: "Exploring Magnets", type: "chapter", book: "Curiosity" },
            { num: 5, name: "Measurement of Length and Motion", type: "chapter", book: "Curiosity" },
            { num: 6, name: "Materials Around Us", type: "chapter", book: "Curiosity" },
            { num: 7, name: "Temperature and Its Measurement", type: "chapter", book: "Curiosity" },
            { num: 8, name: "A Journey Through States of Water", type: "chapter", book: "Curiosity" },
            { num: 9, name: "Methods of Separation in Everyday Life", type: "chapter", book: "Curiosity" },
            { num: 10, name: "Living Creatures: Exploring Their Characteristics", type: "chapter", book: "Curiosity" },
            { num: 11, name: "Nature's Treasures", type: "chapter", book: "Curiosity" },
            { num: 12, name: "Beyond Earth", type: "chapter", book: "Curiosity" }
          ]
        }
      }
    },
    "Social Science": {
      "2026-27": {
        "default": {
          book: "Exploring Society: India and Beyond",
          chapters: [
            { num: 1, name: "Locating Places on the Earth", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 2, name: "Oceans and Continents", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 3, name: "Landforms and Life", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 4, name: "Timeline and Sources of History", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 5, name: "India, That Is Bharat", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 6, name: "The Beginnings of Indian Civilisation", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 7, name: "India's Cultural Roots", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 8, name: "Unity in Diversity, or 'Many in the One'", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 9, name: "Family and Community", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 10, name: "Grassroots Democracy — Part 1: Governance", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 11, name: "Grassroots Democracy — Part 2: Local Government in Rural Areas", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 12, name: "Grassroots Democracy — Part 3: Local Government in Urban Areas", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 13, name: "The Value of Work", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 14, name: "Economic Activities Around Us", type: "chapter", book: "Exploring Society: India and Beyond" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "default": {
          book: "Poorvi",
          chapters: [
            { num: 1, name: "A Bottle of Dew", type: "chapter", book: "Poorvi" },
            { num: 2, name: "The Raven and the Fox", type: "chapter", book: "Poorvi" },
            { num: 3, name: "Rama to the Rescue", type: "chapter", book: "Poorvi" },
            { num: 4, name: "The Unlikely Best Friends", type: "chapter", book: "Poorvi" },
            { num: 5, name: "A Friend's Prayer", type: "chapter", book: "Poorvi" },
            { num: 6, name: "The Chair", type: "chapter", book: "Poorvi" },
            { num: 7, name: "Neem Baba", type: "chapter", book: "Poorvi" },
            { num: 8, name: "What a Bird Thought", type: "chapter", book: "Poorvi" },
            { num: 9, name: "Spices that Heal Us", type: "chapter", book: "Poorvi" },
            { num: 10, name: "Change of Heart", type: "chapter", book: "Poorvi" },
            { num: 11, name: "The Winner", type: "chapter", book: "Poorvi" },
            { num: 12, name: "Yoga — A Way of Life", type: "chapter", book: "Poorvi" },
            { num: 13, name: "Hamara Bharat — Incredible India!", type: "chapter", book: "Poorvi" },
            { num: 14, name: "The Kites", type: "chapter", book: "Poorvi" },
            { num: 15, name: "Ila Sachani: Embroidering Dreams with her Feet", type: "chapter", book: "Poorvi" },
            { num: 16, name: "National War Memorial", type: "chapter", book: "Poorvi" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "default": {
          book: "Malhar",
          chapters: [
            { num: 1, name: "मातृभूमि", type: "chapter", book: "Malhar" },
            { num: 2, name: "गोल", type: "chapter", book: "Malhar" },
            { num: 3, name: "पहली बूँद", type: "chapter", book: "Malhar" },
            { num: 4, name: "हार की जीत", type: "chapter", book: "Malhar" },
            { num: 5, name: "रहीम के दोहे", type: "chapter", book: "Malhar" },
            { num: 6, name: "मेरी माँ", type: "chapter", book: "Malhar" },
            { num: 7, name: "जलाते चलो", type: "chapter", book: "Malhar" },
            { num: 8, name: "सत्रिया और बिहू नृत्य", type: "chapter", book: "Malhar" },
            { num: 9, name: "मैया मैं नहिं माखन खायो", type: "chapter", book: "Malhar" },
            { num: 10, name: "परीक्षा", type: "chapter", book: "Malhar" },
            { num: 11, name: "चेतक की वीरता", type: "chapter", book: "Malhar" },
            { num: 12, name: "हिन्द महासागर में छोटा-सा हिंदुस्तान", type: "chapter", book: "Malhar" },
            { num: 13, name: "पेड़ की बात", type: "chapter", book: "Malhar" }
          ]
        }
      }
    },
    "Sanskrit": {
      "2026-27": {
        "default": {
          book: "Deepakam",
          chapters: [
            { num: 1, name: "वयं वर्णमालां पठामः", type: "chapter", book: "Deepakam" },
            { num: 2, name: "संयुक्त-व्यञ्जनानि", type: "chapter", book: "Deepakam" },
            { num: 3, name: "एषः कः? एषा का? एतत् किम्?", type: "chapter", book: "Deepakam" },
            { num: 4, name: "अहं च त्वं च", type: "chapter", book: "Deepakam" },
            { num: 5, name: "संख्यागणना ननु सरला", type: "chapter", book: "Deepakam" },
            { num: 6, name: "अहं प्रातः उत्तिष्ठामि", type: "chapter", book: "Deepakam" },
            { num: 7, name: "शूराः वयं धीराः वयम्", type: "chapter", book: "Deepakam" },
            { num: 8, name: "सः एव महान् चित्रकारः", type: "chapter", book: "Deepakam" },
            { num: 9, name: "अतिथिदेवो भव", type: "chapter", book: "Deepakam" },
            { num: 10, name: "बुद्धिः सर्वार्थसाधिका", type: "chapter", book: "Deepakam" },
            { num: 11, name: "यः जानाति सः पण्डितः", type: "chapter", book: "Deepakam" },
            { num: 12, name: "त्वम् आपणं गच्छ", type: "chapter", book: "Deepakam" },
            { num: 13, name: "पृथिव्यां त्रीणि रत्नानि", type: "chapter", book: "Deepakam" },
            { num: 14, name: "आलस्यं हि मनुष्याणां शरीरस्थः महान् रिपुः", type: "chapter", book: "Deepakam" },
            { num: 15, name: "माधवस्य प्रियम् अङ्गम्", type: "chapter", book: "Deepakam" },
            { num: 16, name: "वृक्षाः सत्पुरुषाः इव", type: "chapter", book: "Deepakam" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          chapters: [
            { num: 1, name: "Introduction to AI and Everyday Examples", type: "unit" },
            { num: 2, name: "Basic Data Concepts", type: "unit" },
            { num: 3, name: "Simple Pattern Recognition and Decision Making", type: "unit" },
            { num: 4, name: "Ethics and Digital Responsibility", type: "unit" }
          ]
        }
      }
    }
  },
  "7": {
    "Mathematics": {
      "2026-27": {
        "default": {
          book: "Ganita Prakash",
          chapters: [
            { num: 1, name: "Large Numbers Around Us", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 2, name: "Arithmetic Expressions", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 3, name: "A Peek Beyond the Point", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 4, name: "Expressions Using Letter-Numbers", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 5, name: "Parallel and Intersecting Lines", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 6, name: "Number Play", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 7, name: "A Tale of Three Intersecting Lines", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 8, name: "Working with Fractions", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 9, name: "Geometric Twins (Congruent Figures)", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 10, name: "Operations with Integers", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 11, name: "Finding Common Ground (Rational Numbers)", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 12, name: "Another Peek Beyond the Point", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 13, name: "Connecting the Dots… (Comparing Quantities)", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 14, name: "Constructions and Tilings", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 15, name: "Finding the Unknown (Simple Equations)", type: "chapter", book: "Ganita Prakash Part 2" }
          ]
        }
      }
    },
    "Science": {
      "2026-27": {
        "default": {
          book: "Curiosity",
          chapters: [
            { num: 1, name: "The Ever-Evolving World of Science", type: "chapter", book: "Curiosity" },
            { num: 2, name: "Exploring Substances: Acidic, Basic, and Neutral", type: "chapter", book: "Curiosity" },
            { num: 3, name: "Electricity: Circuits and their Components", type: "chapter", book: "Curiosity" },
            { num: 4, name: "The World of Metals and Non-metals", type: "chapter", book: "Curiosity" },
            { num: 5, name: "Changes Around Us: Physical and Chemical", type: "chapter", book: "Curiosity" },
            { num: 6, name: "Adolescence: A Stage of Growth and Change", type: "chapter", book: "Curiosity" },
            { num: 7, name: "Heat Transfer in Nature", type: "chapter", book: "Curiosity" },
            { num: 8, name: "Measurement of Time and Motion", type: "chapter", book: "Curiosity" },
            { num: 9, name: "Life Processes in Animals", type: "chapter", book: "Curiosity" },
            { num: 10, name: "Life Processes in Plants", type: "chapter", book: "Curiosity" },
            { num: 11, name: "Light: Shadows and Reflections", type: "chapter", book: "Curiosity" },
            { num: 12, name: "Earth, Moon, and the Sun", type: "chapter", book: "Curiosity" }
          ]
        }
      }
    },
    "Social Science": {
      "2026-27": {
        "default": {
          book: "Exploring Society: India and Beyond",
          chapters: [
            { num: 1, name: "Geographical Diversity of India", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 2, name: "Understanding the Weather", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 3, name: "Climates of India", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 4, name: "New Beginnings: Cities and States", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 5, name: "The Rise of Empires", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 6, name: "The Age of Reorganisation", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 7, name: "The Gupta Era: An Age of Tireless Creativity", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 8, name: "How the Land Becomes Sacred", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 9, name: "From the Rulers to the Ruled: Types of Governments", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 10, name: "The Constitution of India — An Introduction", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 11, name: "From Barter to Money", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 12, name: "Understanding Markets", type: "chapter", book: "Exploring Society: India and Beyond" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "default": {
          book: "Poorvi",
          chapters: [
            { num: 1, name: "The Day the River Spoke", type: "chapter", book: "Poorvi" },
            { num: 2, name: "Try Again", type: "chapter", book: "Poorvi" },
            { num: 3, name: "Three Days to See", type: "chapter", book: "Poorvi" },
            { num: 4, name: "Animals, Birds, and Dr. Dolittle", type: "chapter", book: "Poorvi" },
            { num: 5, name: "A Funny Man", type: "chapter", book: "Poorvi" },
            { num: 6, name: "Say the Right Thing", type: "chapter", book: "Poorvi" },
            { num: 7, name: "My Brother's Great Invention", type: "chapter", book: "Poorvi" },
            { num: 8, name: "Paper Boats", type: "chapter", book: "Poorvi" },
            { num: 9, name: "North, South, East, West", type: "chapter", book: "Poorvi" },
            { num: 10, name: "The Tunnel", type: "chapter", book: "Poorvi" },
            { num: 11, name: "Travel", type: "chapter", book: "Poorvi" },
            { num: 12, name: "Conquering the Summit", type: "chapter", book: "Poorvi" },
            { num: 13, name: "A Homage to Our Brave Soldiers", type: "chapter", book: "Poorvi" },
            { num: 14, name: "My Dear Soldiers", type: "chapter", book: "Poorvi" },
            { num: 15, name: "Rani Abbakka", type: "chapter", book: "Poorvi" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "default": {
          book: "Malhar",
          chapters: [
            { num: 1, name: "माँ, कह एक कहानी", type: "chapter", book: "Malhar" },
            { num: 2, name: "तीन बुद्धिमान", type: "chapter", book: "Malhar" },
            { num: 3, name: "फूल और काँटा", type: "chapter", book: "Malhar" },
            { num: 4, name: "पानी रे पानी", type: "chapter", book: "Malhar" },
            { num: 5, name: "नहीं होना बीमार", type: "chapter", book: "Malhar" },
            { num: 6, name: "गिरधर कविराय की कुंडलियाँ", type: "chapter", book: "Malhar" },
            { num: 7, name: "वर्षा-बहाड़", type: "chapter", book: "Malhar" },
            { num: 8, name: "बिरजू महाराज से साक्षात्कार", type: "chapter", book: "Malhar" },
            { num: 9, name: "चिड़िया", type: "chapter", book: "Malhar" },
            { num: 10, name: "मीरा के पद", type: "chapter", book: "Malhar" }
          ]
        }
      }
    },
    "Sanskrit": {
      "2026-27": {
        "default": {
          book: "Deepakam",
          chapters: [
            { num: 1, name: "वन्दे भारतमातरम्", type: "chapter", book: "Deepakam" },
            { num: 2, name: "नित्यं पिबामः सुभाषितरसम्", type: "chapter", book: "Deepakam" },
            { num: 3, name: "मित्राय नमः", type: "chapter", book: "Deepakam" },
            { num: 4, name: "न लभ्यते चेत् आम्लं द्राक्षाफलम्", type: "chapter", book: "Deepakam" },
            { num: 5, name: "सेवा हि परमो धर्मः", type: "chapter", book: "Deepakam" },
            { num: 6, name: "क्रीडाम वयं श्लोकान्त्याक्षरीम्", type: "chapter", book: "Deepakam" },
            { num: 7, name: "ईशावास्यम् इदं सर्वम्", type: "chapter", book: "Deepakam" },
            { num: 8, name: "हितं मनोहारि च दुर्लभं वचः", type: "chapter", book: "Deepakam" },
            { num: 9, name: "अन्नाद् भवन्ति भूतानि", type: "chapter", book: "Deepakam" },
            { num: 10, name: "दशमः कः?", type: "chapter", book: "Deepakam" },
            { num: 11, name: "द्वीपेषु रम्यः द्वीपोऽण्डमानः", type: "chapter", book: "Deepakam" },
            { num: 12, name: "वीराङ्गना पन्नाधाया", type: "chapter", book: "Deepakam" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          chapters: [
            { num: 1, name: "AI Domains and Applications", type: "unit" },
            { num: 2, name: "AI in Industries", type: "unit" },
            { num: 3, name: "Data Visualisation and Analysis", type: "unit" },
            { num: 4, name: "Ethics and AI Bias Awareness", type: "unit" }
          ]
        }
      }
    }
  },
  "8": {
    "Mathematics": {
      "2026-27": {
        "default": {
          book: "Ganita Prakash",
          chapters: [
            { num: 1, name: "A Square and A Cube", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 2, name: "Power Play", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 3, name: "A Story of Numbers", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 4, name: "Understanding Quadrilaterals", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 5, name: "Data Handling", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 6, name: "Mensuration", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 7, name: "Linear Equations in One Variable", type: "chapter", book: "Ganita Prakash Part 1" },
            { num: 8, name: "Fractions in Disguise", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 9, name: "Comparing Quantities", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 10, name: "Squares and Square Roots (Advanced Methods)", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 11, name: "The Pythagoras Theorem", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 12, name: "Proportional Reasoning", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 13, name: "Algebra Play", type: "chapter", book: "Ganita Prakash Part 2" },
            { num: 14, name: "Factorisation", type: "chapter", book: "Ganita Prakash Part 2" }
          ]
        }
      }
    },
    "Science": {
      "2026-27": {
        "default": {
          book: "Curiosity",
          chapters: [
            { num: 1, name: "Exploring the Investigative World of Science", type: "chapter", book: "Curiosity" },
            { num: 2, name: "The Invisible Living World: Beyond Our Naked Eye", type: "chapter", book: "Curiosity" },
            { num: 3, name: "Health: The Ultimate Treasure", type: "chapter", book: "Curiosity" },
            { num: 4, name: "Electricity: Magnetic and Heating Effects", type: "chapter", book: "Curiosity" },
            { num: 5, name: "Exploring Forces", type: "chapter", book: "Curiosity" },
            { num: 6, name: "Pressure, Winds, Storms, and Cyclones", type: "chapter", book: "Curiosity" },
            { num: 7, name: "Particulate Nature of Matter", type: "chapter", book: "Curiosity" },
            { num: 8, name: "Nature of Matter: Elements, Compounds, and Mixtures", type: "chapter", book: "Curiosity" },
            { num: 9, name: "The Amazing World of Solutes, Solvents, and Solutions", type: "chapter", book: "Curiosity" },
            { num: 10, name: "Light: Mirrors and Lenses", type: "chapter", book: "Curiosity" },
            { num: 11, name: "Keeping Time with the Skies", type: "chapter", book: "Curiosity" },
            { num: 12, name: "How Nature Works in Harmony", type: "chapter", book: "Curiosity" },
            { num: 13, name: "Our Unique Earth", type: "chapter", book: "Curiosity" }
          ]
        }
      }
    },
    "Social Science": {
      "2026-27": {
        "default": {
          book: "Exploring Society: India and Beyond",
          chapters: [
            { num: 1, name: "Natural Resources and Their Use", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 2, name: "Reshaping India's Political Map", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 3, name: "The Rise of the Marathas", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 4, name: "The Colonial Era in India", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 5, name: "Universal Franchise and India's Electoral System", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 6, name: "The Parliamentary System: Legislature and Executive", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 7, name: "Factors of Production", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 8, name: "World Geography: Some Glimpses", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 9, name: "India's Long Road to Independence", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 10, name: "A Journey Through Indian Architecture", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 11, name: "The Role of the Judiciary in Our Society", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 12, name: "Citizenship: Rights and Duties", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 13, name: "Dynamics of Population", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 14, name: "India's Urban Landscape", type: "chapter", book: "Exploring Society: India and Beyond" },
            { num: 15, name: "Cultural Currents: 13th to 17th Centuries", type: "chapter", book: "Exploring Society: India and Beyond" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "default": {
          book: "Poorvi",
          chapters: [
            { num: 1, name: "The Wit that Won Hearts", type: "chapter", book: "Poorvi" },
            { num: 2, name: "A Concrete Example", type: "chapter", book: "Poorvi" },
            { num: 3, name: "Wisdom Paves the Way", type: "chapter", book: "Poorvi" },
            { num: 4, name: "A Tale of Valour: Major Somnath Sharma and the Battle of Badgam", type: "chapter", book: "Poorvi" },
            { num: 5, name: "Somebody's Mother", type: "chapter", book: "Poorvi" },
            { num: 6, name: "Verghese Kurien—I Too Had a Dream", type: "chapter", book: "Poorvi" },
            { num: 7, name: "The Case of the Fifth Word", type: "chapter", book: "Poorvi" },
            { num: 8, name: "The Magic Brush of Dreams", type: "chapter", book: "Poorvi" },
            { num: 9, name: "Spectacular Wonders", type: "chapter", book: "Poorvi" },
            { num: 10, name: "The Cherry Tree", type: "chapter", book: "Poorvi" },
            { num: 11, name: "Harvest Hymn", type: "chapter", book: "Poorvi" },
            { num: 12, name: "Waiting for the Rain", type: "chapter", book: "Poorvi" },
            { num: 13, name: "Feathered Friend", type: "chapter", book: "Poorvi" },
            { num: 14, name: "Magnifying Glass", type: "chapter", book: "Poorvi" },
            { num: 15, name: "Bibha Chowdhuri: The Beam of Light That Lit", type: "chapter", book: "Poorvi" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "default": {
          book: "Malhar",
          chapters: [
            { num: 1, name: "स्वदेश (कविता)", type: "chapter", book: "Malhar" },
            { num: 2, name: "दो गौरैया (कहानी)", type: "chapter", book: "Malhar" },
            { num: 3, name: "एक आशीर्वाद (कविता)", type: "chapter", book: "Malhar" },
            { num: 4, name: "हरिद्वार (पत्र)", type: "chapter", book: "Malhar" },
            { num: 5, name: "कबीर के दोहे", type: "chapter", book: "Malhar" },
            { num: 6, name: "एक टोकरी भर मिट्टी (कहानी)", type: "chapter", book: "Malhar" },
            { num: 7, name: "मत बाँधो (कविता)", type: "chapter", book: "Malhar" },
            { num: 8, name: "नए मेहमान (एकांकी)", type: "chapter", book: "Malhar" },
            { num: 9, name: "आदमी का अनुपात (कविता)", type: "chapter", book: "Malhar" },
            { num: 10, name: "तरुण के स्वप्न (उद्बोधन)", type: "chapter", book: "Malhar" }
          ]
        }
      }
    },
    "Sanskrit": {
      "2026-27": {
        "default": {
          book: "Deepakam",
          chapters: [
            { num: 1, name: "संगच्छध्वं संवदध्वम्", type: "chapter", book: "Deepakam" },
            { num: 2, name: "अल्पानामपि वस्तूनां संहतिः कार्यसाधिका", type: "chapter", book: "Deepakam" },
            { num: 3, name: "सुभाषितरसं पीत्वा जीवनं सफलं कुरु", type: "chapter", book: "Deepakam" },
            { num: 4, name: "प्रणम्यो देशभक्तोऽयं गोपबन्धुर्महामनाः", type: "chapter", book: "Deepakam" },
            { num: 5, name: "गीता सुगीता कर्तव्या", type: "chapter", book: "Deepakam" },
            { num: 6, name: "डिजिभारतम् – युगपरिवर्तनम्", type: "chapter", book: "Deepakam" },
            { num: 7, name: "मञ्जुलमञ्जूषा सुन्दरसुरभाषा", type: "chapter", book: "Deepakam" },
            { num: 8, name: "पश्यत कोणमैशान्यं भारतस्य मनोहरम्", type: "chapter", book: "Deepakam" },
            { num: 9, name: "कोऽरुक्? कोऽरुक्? कोऽरुक्?", type: "chapter", book: "Deepakam" },
            { num: 10, name: "सन्निमित्ते वरं त्यागः (क-भागः)", type: "chapter", book: "Deepakam" },
            { num: 11, name: "सन्निमित्ते वरं त्यागः (ख-भागः)", type: "chapter", book: "Deepakam" },
            { num: 12, name: "सम्यग्वर्णप्रयोगेण ब्रह्मलोके महीयते", type: "chapter", book: "Deepakam" },
            { num: 13, name: "वर्णोच्चारण-शिक्षा १", type: "chapter", book: "Deepakam" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          chapters: [
            { num: 1, name: "Excite (Introduction to AI & Domains)", type: "unit" },
            { num: 2, name: "Relate (Human-Machine Interactions)", type: "unit" },
            { num: 3, name: "Purpose (AI Project Lifecycle)", type: "unit" },
            { num: 4, name: "Possibilities (AI Across Sectors & No-Code Tools)", type: "unit" },
            { num: 5, name: "AI Ethics and Responsible Use", type: "unit" }
          ]
        }
      }
    }
  },
  "9": {
    "Mathematics": {
      "2026-27": {
        "standard": {
          code: "041",
          book: "Ganita Manjari",
          chapters: [
            { num: 1, name: "Orienting Yourself: The Use of Coordinates", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 2, name: "Introduction to Linear Polynomials", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 3, name: "The World of Numbers", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 4, name: "Exploring Algebraic Identities", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 5, name: "I'm Up and Down, and Round and Round (Circles)", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 6, name: "Measuring Space: Perimeter and Area", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 7, name: "The Mathematics of Maybe: Introduction to Probability", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 8, name: "Predicting What Comes Next: Exploring Sequences and Progressions", type: "chapter", book: "Ganita Manjari Part I" },
            { num: 9, name: "Propositions and their Converses", type: "chapter", book: "Ganita Manjari Part II" },
            { num: 10, name: "How Quantities Combine: Understanding Data", type: "chapter", book: "Ganita Manjari Part II" },
            { num: 11, name: "The World of Algorithms", type: "chapter", book: "Ganita Manjari Part II" },
            { num: 12, name: "Quadrilaterals", type: "chapter", book: "Ganita Manjari Part II" },
            { num: 13, name: "Two Variables, One Line", type: "chapter", book: "Ganita Manjari Part II" },
            { num: 14, name: "Math of Space: Surface Area and Volume", type: "chapter", book: "Ganita Manjari Part II" }
          ]
        }
      }
    },
    "Science": {
      "2026-27": {
        "default": {
          code: "086",
          book: "Exploration",
          chapters: [
            { num: 1, name: "Exploration – Entering the World of Secondary Science", type: "chapter", book: "Exploration" },
            { num: 2, name: "Cell – The Building Block of Life", type: "chapter", book: "Exploration" },
            { num: 3, name: "Tissues in Action", type: "chapter", book: "Exploration" },
            { num: 4, name: "Describing Motion Around Us", type: "chapter", book: "Exploration" },
            { num: 5, name: "Exploring Mixtures and Their Separation", type: "chapter", book: "Exploration" },
            { num: 6, name: "How Forces Affect Motion", type: "chapter", book: "Exploration" },
            { num: 7, name: "Work, Energy and Simple Machines", type: "chapter", book: "Exploration" },
            { num: 8, name: "Journey Inside the Atom", type: "chapter", book: "Exploration" },
            { num: 9, name: "Atomic Foundations of Matter", type: "chapter", book: "Exploration" },
            { num: 10, name: "Sound", type: "chapter", book: "Exploration" },
            { num: 11, name: "Reproduction – How Life Continues", type: "chapter", book: "Exploration" },
            { num: 12, name: "Diversity in Living Organisms", type: "chapter", book: "Exploration" },
            { num: 13, name: "Earth as a System: Energy, Matter and Life", type: "chapter", book: "Exploration" }
          ]
        }
      }
    },
    "Social Science": {
      "2026-27": {
        "default": {
          code: "087",
          book: "Understanding Society: India and Beyond",
          chapters: [
            { num: 1, name: "Understanding Social Science", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 2, name: "Shaping of the Earth's Surface", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 3, name: "Atmosphere and Climate", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 4, name: "Early Humans and Beginning of Civilisation", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 5, name: "State and Society (up to 1000 CE)", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 6, name: "Democracy", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 7, name: "Elections", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 8, name: "Building Blocks in Economics: The Problem of Choice", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 9, name: "The Price Puzzle: What Drives the Market", type: "chapter", book: "Understanding Society: India and Beyond Part 1" },
            { num: 10, name: "Oceans and Life", type: "chapter", book: "Understanding Society: India and Beyond Part 2" },
            { num: 11, name: "Life on Earth", type: "chapter", book: "Understanding Society: India and Beyond Part 2" },
            { num: 12, name: "Resistance and Resilience (1000 CE–1700 CE)", type: "chapter", book: "Understanding Society: India and Beyond Part 2" },
            { num: 13, name: "India and the World-I (1900 BCE–1200 CE)", type: "chapter", book: "Understanding Society: India and Beyond Part 2" },
            { num: 14, name: "Authority", type: "chapter", book: "Understanding Society: India and Beyond Part 2" },
            { num: 15, name: "Entrepreneurship and Personal Finance Management", type: "chapter", book: "Understanding Society: India and Beyond Part 2" },
            { num: 16, name: "Globalisation and Interconnectedness", type: "chapter", book: "Understanding Society: India and Beyond Part 2" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "Language & Literature": {
          code: "184",
          book: "Kaveri",
          chapters: [
            { num: 1, name: "How I Taught My Grandmother to Read", type: "chapter", book: "Kaveri" },
            { num: 2, name: "The Pot Maker", type: "chapter", book: "Kaveri" },
            { num: 3, name: "Winds of Change", type: "chapter", book: "Kaveri" },
            { num: 4, name: "Vitamin-M", type: "chapter", book: "Kaveri" },
            { num: 5, name: "The World of Limitless Possibilities", type: "chapter", book: "Kaveri" },
            { num: 6, name: "Twin Melodies", type: "chapter", book: "Kaveri" },
            { num: 7, name: "Carrier of Words", type: "chapter", book: "Kaveri" },
            { num: 8, name: "Follow That Dream", type: "chapter", book: "Kaveri" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "Course A": {
          code: "002",
          book: "Ganga",
          chapters: [
            { num: 1, name: "दो बैलों की कथा", type: "chapter", book: "Ganga" },
            { num: 2, name: "क्या लिखूँ", type: "chapter", book: "Ganga" },
            { num: 3, name: "संवादहीन", type: "chapter", book: "Ganga" },
            { num: 4, name: "ऐसी भी बातें होती हैं (लता मंगेशकर से साक्षात्कार)", type: "chapter", book: "Ganga" },
            { num: 5, name: "आखिरी चट्टान तक", type: "chapter", book: "Ganga" },
            { num: 6, name: "रीढ़ की हड्डी", type: "chapter", book: "Ganga" },
            { num: 7, name: "मैं और मेरा देश", type: "chapter", book: "Ganga" },
            { num: 8, name: "रैदास के पद", type: "chapter", book: "Ganga" },
            { num: 9, name: "राम-लक्ष्मण-परशुराम संवाद", type: "chapter", book: "Ganga" },
            { num: 10, name: "भारति, जय, विजयकरे", type: "chapter", book: "Ganga" },
            { num: 11, name: "झाँसी की रानी", type: "chapter", book: "Ganga" },
            { num: 12, name: "घर की याद", type: "chapter", book: "Ganga" }
          ]
        },
        "Course B": {
          code: "085",
          chapters: []
        }
      }
    },
    "Sanskrit": {
      "2026-27": {
        "default": {
          code: "122",
          book: "Sharada",
          chapters: [
            { num: 1, name: "सत्यं शिवं सुन्दरं संस्कृतम्", type: "chapter", book: "Sharada" },
            { num: 2, name: "सुखस्य मूलं धर्मः धर्मस्य मूलम् अर्थः", type: "chapter", book: "Sharada" },
            { num: 3, name: "आत्मवत्सर्वभूतेषु यः पश्यति सः पण्डितः", type: "chapter", book: "Sharada" },
            { num: 4, name: "न खलु वयस्तेजसो हेतुः", type: "chapter", book: "Sharada" },
            { num: 5, name: "एषा सा कृतकबुद्धिः मानवबुद्धेः सहकरी", type: "chapter", book: "Sharada" },
            { num: 6, name: "मनःपूतं समाचरेत्", type: "chapter", book: "Sharada" },
            { num: 7, name: "उपायं चिन्तयेत् प्राज्ञस्तथापायं च चिन्तयेत्", type: "chapter", book: "Sharada" },
            { num: 8, name: "अन्नाद् आनन्दं प्रति", type: "chapter", book: "Sharada" },
            { num: 9, name: "कृतं प्रतिकृतं भूयादेष धर्मः सनातनः", type: "chapter", book: "Sharada" },
            { num: 10, name: "णमो अरिहन्ताणम्", type: "chapter", book: "Sharada" },
            { num: 11, name: "वर्णोच्चारण-शिक्षा २", type: "chapter", book: "Sharada" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          code: "417",
          chapters: [
            { num: 1, name: "Communication Skills-I", type: "unit" },
            { num: 2, name: "Self-Management Skills-I", type: "unit" },
            { num: 3, name: "ICT Skills-I", type: "unit" },
            { num: 4, name: "Entrepreneurial Skills-I", type: "unit" },
            { num: 5, name: "Green Skills-I", type: "unit" },
            { num: 6, name: "AI Reflection, Project Cycle and Ethics", type: "unit" },
            { num: 7, name: "Data Literacy", type: "unit" },
            { num: 8, name: "Maths for AI (Statistics & Probability)", type: "unit" },
            { num: 9, name: "Introduction to Generative AI", type: "unit" },
            { num: 10, name: "Introduction to Python", type: "unit" }
          ]
        }
      }
    },
    "Computer Science": {
      "2026-27": {
        "default": {
          chapters: []
        }
      }
    }
  },
  "10": {
    "Mathematics": {
      "2026-27": {
        "standard": {
          code: "041",
          book: "Mathematics",
          chapters: [
            {
              num: 1,
              name: "Real Numbers",
              type: "chapter",
              book: "Mathematics",
              topics: [
                "Fundamental Theorem of Arithmetic",
                "Proofs of irrationality of √2, √3, √5"
              ]
            },
            { num: 2, name: "Polynomials", type: "chapter", book: "Mathematics" },
            { num: 3, name: "Pair of Linear Equations in Two Variables", type: "chapter", book: "Mathematics" },
            { num: 4, name: "Quadratic Equations", type: "chapter", book: "Mathematics" },
            { num: 5, name: "Arithmetic Progressions", type: "chapter", book: "Mathematics" },
            { num: 6, name: "Triangles", type: "chapter", book: "Mathematics" },
            { num: 7, name: "Coordinate Geometry", type: "chapter", book: "Mathematics" },
            { num: 8, name: "Introduction to Trigonometry", type: "chapter", book: "Mathematics" },
            { num: 9, name: "Some Applications of Trigonometry", type: "chapter", book: "Mathematics" },
            { num: 10, name: "Circles", type: "chapter", book: "Mathematics" },
            { num: 11, name: "Areas Related to Circles", type: "chapter", book: "Mathematics" },
            { num: 12, name: "Surface Areas and Volumes", type: "chapter", book: "Mathematics" },
            { num: 13, name: "Statistics", type: "chapter", book: "Mathematics" },
            { num: 14, name: "Probability", type: "chapter", book: "Mathematics" }
          ]
        },
        "basic": {
          code: "241",
          book: "Mathematics",
          chapters: [
            { num: 1, name: "Real Numbers", type: "chapter", book: "Mathematics" },
            { num: 2, name: "Polynomials", type: "chapter", book: "Mathematics" },
            { num: 3, name: "Pair of Linear Equations in Two Variables", type: "chapter", book: "Mathematics" },
            { num: 4, name: "Quadratic Equations", type: "chapter", book: "Mathematics" },
            { num: 5, name: "Arithmetic Progressions", type: "chapter", book: "Mathematics" },
            { num: 6, name: "Triangles", type: "chapter", book: "Mathematics" },
            { num: 7, name: "Coordinate Geometry", type: "chapter", book: "Mathematics" },
            { num: 8, name: "Introduction to Trigonometry", type: "chapter", book: "Mathematics" },
            { num: 9, name: "Some Applications of Trigonometry", type: "chapter", book: "Mathematics" },
            { num: 10, name: "Circles", type: "chapter", book: "Mathematics" },
            { num: 11, name: "Areas Related to Circles", type: "chapter", book: "Mathematics" },
            { num: 12, name: "Surface Areas and Volumes", type: "chapter", book: "Mathematics" },
            { num: 13, name: "Statistics", type: "chapter", book: "Mathematics" },
            { num: 14, name: "Probability", type: "chapter", book: "Mathematics" }
          ]
        }
      }
    },
    "Science": {
      "2026-27": {
        "default": {
          code: "086",
          book: "Science",
          chapters: [
            { num: 1, name: "Chemical Reactions and Equations", type: "chapter", book: "Science" },
            { num: 2, name: "Acids, Bases and Salts", type: "chapter", book: "Science" },
            { num: 3, name: "Metals and Non-metals", type: "chapter", book: "Science" },
            { num: 4, name: "Carbon and its Compounds", type: "chapter", book: "Science" },
            { num: 5, name: "Life Processes", type: "chapter", book: "Science" },
            { num: 6, name: "Control and Coordination", type: "chapter", book: "Science" },
            { num: 7, name: "How do Organisms Reproduce?", type: "chapter", book: "Science" },
            { num: 8, name: "Heredity", type: "chapter", book: "Science" },
            { num: 9, name: "Light – Reflection and Refraction", type: "chapter", book: "Science" },
            { num: 10, name: "The Human Eye and the Colourful World", type: "chapter", book: "Science" },
            { num: 11, name: "Electricity", type: "chapter", book: "Science" },
            { num: 12, name: "Magnetic Effects of Electric Current", type: "chapter", book: "Science" },
            { num: 13, name: "Our Environment", type: "chapter", book: "Science" }
          ]
        }
      }
    },
    "Social Science": {
      "2026-27": {
        "default": {
          code: "087",
          chapters: [
            { num: 1, name: "The Rise of Nationalism in Europe", type: "chapter", book: "India and the Contemporary World-II" },
            { num: 2, name: "Nationalism in India", type: "chapter", book: "India and the Contemporary World-II" },
            { num: 3, name: "The Making of a Global World", type: "chapter", book: "India and the Contemporary World-II" },
            { num: 4, name: "Print Culture and the Modern World", type: "chapter", book: "India and the Contemporary World-II" },
            { num: 5, name: "Resources and Development", type: "chapter", book: "Contemporary India-II" },
            { num: 6, name: "Forest and Wildlife Resources", type: "chapter", book: "Contemporary India-II" },
            { num: 7, name: "Water Resources", type: "chapter", book: "Contemporary India-II" },
            { num: 8, name: "Agriculture", type: "chapter", book: "Contemporary India-II" },
            { num: 9, name: "Minerals and Energy Resources", type: "chapter", book: "Contemporary India-II" },
            { num: 10, name: "Manufacturing Industries", type: "chapter", book: "Contemporary India-II" },
            { num: 11, name: "Lifelines of National Economy", type: "chapter", book: "Contemporary India-II" },
            { num: 12, name: "Power Sharing", type: "chapter", book: "Democratic Politics-II" },
            { num: 13, name: "Federalism", type: "chapter", book: "Democratic Politics-II" },
            { num: 14, name: "Gender, Religion and Caste", type: "chapter", book: "Democratic Politics-II" },
            { num: 15, name: "Political Parties", type: "chapter", book: "Democratic Politics-II" },
            { num: 16, name: "Outcomes of Democracy", type: "chapter", book: "Democratic Politics-II" },
            { num: 17, name: "Development", type: "chapter", book: "Understanding Economic Development" },
            { num: 18, name: "Sectors of the Indian Economy", type: "chapter", book: "Understanding Economic Development" },
            { num: 19, name: "Money and Credit", type: "chapter", book: "Understanding Economic Development" },
            { num: 20, name: "Globalisation and the Indian Economy", type: "chapter", book: "Understanding Economic Development" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "Language & Literature": {
          code: "184",
          chapters: [
            { num: 1, name: "A Letter to God", type: "chapter", book: "First Flight" },
            { num: 2, name: "Nelson Mandela: Long Walk to Freedom", type: "chapter", book: "First Flight" },
            { num: 3, name: "Two Stories about Flying", type: "chapter", book: "First Flight" },
            { num: 4, name: "From the Diary of Anne Frank", type: "chapter", book: "First Flight" },
            { num: 5, name: "Glimpses of India", type: "chapter", book: "First Flight" },
            { num: 6, name: "Mijbil the Otter", type: "chapter", book: "First Flight" },
            { num: 7, name: "Madam Rides the Bus", type: "chapter", book: "First Flight" },
            { num: 8, name: "The Sermon at Benares", type: "chapter", book: "First Flight" },
            { num: 9, name: "The Proposal", type: "chapter", book: "First Flight" },
            { num: 10, name: "Dust of Snow", type: "chapter", book: "First Flight (Poetry)" },
            { num: 11, name: "Fire and Ice", type: "chapter", book: "First Flight (Poetry)" },
            { num: 12, name: "A Tiger in the Zoo", type: "chapter", book: "First Flight (Poetry)" },
            { num: 13, name: "How to Tell Wild Animals", type: "chapter", book: "First Flight (Poetry)" },
            { num: 14, name: "The Ball Poem", type: "chapter", book: "First Flight (Poetry)" },
            { num: 15, name: "Amanda!", type: "chapter", book: "First Flight (Poetry)" },
            { num: 16, name: "The Trees", type: "chapter", book: "First Flight (Poetry)" },
            { num: 17, name: "Fog", type: "chapter", book: "First Flight (Poetry)" },
            { num: 18, name: "The Tale of Custard the Dragon", type: "chapter", book: "First Flight (Poetry)" },
            { num: 19, name: "For Anne Gregory", type: "chapter", book: "First Flight (Poetry)" },
            { num: 20, name: "A Triumph of Surgery", type: "chapter", book: "Footprints Without Feet" },
            { num: 21, name: "The Thief's Story", type: "chapter", book: "Footprints Without Feet" },
            { num: 22, name: "The Midnight Visitor", type: "chapter", book: "Footprints Without Feet" },
            { num: 23, name: "A Question of Trust", type: "chapter", book: "Footprints Without Feet" },
            { num: 24, name: "Footprints Without Feet", type: "chapter", book: "Footprints Without Feet" },
            { num: 25, name: "The Making of a Scientist", type: "chapter", book: "Footprints Without Feet" },
            { num: 26, name: "The Necklace", type: "chapter", book: "Footprints Without Feet" },
            { num: 27, name: "Bholi", type: "chapter", book: "Footprints Without Feet" },
            { num: 28, name: "The Book That Saved the Earth", type: "chapter", book: "Footprints Without Feet" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "Course A": {
          code: "002",
          chapters: [
            { num: 1, name: "पद (सूरदास)", type: "chapter", book: "Kshitij Part 2" },
            { num: 2, name: "राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)", type: "chapter", book: "Kshitij Part 2" },
            { num: 3, name: "आत्मकथ्य (जयशंकर प्रसाद)", type: "chapter", book: "Kshitij Part 2" },
            { num: 4, name: "उत्साह और अट नहीं रही है (सूर्यकांत त्रिपाठी 'निराला')", type: "chapter", book: "Kshitij Part 2" },
            { num: 5, name: "यह दंतुरित मुस्कान और फसल (नागार्जुन)", type: "chapter", book: "Kshitij Part 2" },
            { num: 6, name: "संगतकार (मंगलेश डबराल)", type: "chapter", book: "Kshitij Part 2" },
            { num: 7, name: "नेताजी का चश्मा (स्वयं प्रकाश)", type: "chapter", book: "Kshitij Part 2" },
            { num: 8, name: "बालगोबिन भगत (रामवृक्ष बेनीपुरी)", type: "chapter", book: "Kshitij Part 2" },
            { num: 9, name: "लखनवी अंदाज़ (यशपाल)", type: "chapter", book: "Kshitij Part 2" },
            { num: 10, name: "एक कहानी यह भी (मन्नू भंडारी)", type: "chapter", book: "Kshitij Part 2" },
            { num: 11, name: "नौबतखाने में इबादत (यतींद्र मिश्र)", type: "chapter", book: "Kshitij Part 2" },
            { num: 12, name: "संस्कृति (भदंत आनंद कौसल्यायन)", type: "chapter", book: "Kshitij Part 2" },
            { num: 13, name: "माता का अँचल (शिवपूजन सहाय)", type: "chapter", book: "Kritika Part 2" },
            { num: 14, name: "साना-साना हाथ जोड़ि (मधु कांकरिया)", type: "chapter", book: "Kritika Part 2" },
            { num: 15, name: "मैं क्यों लिखता हूँ? (अज्ञेय)", type: "chapter", book: "Kritika Part 2" }
          ]
        },
        "Course B": {
          code: "085",
          chapters: [
            { num: 1, name: "साखी (कबीर)", type: "chapter", book: "Sparsh Part 2" },
            { num: 2, name: "पद (मीरा)", type: "chapter", book: "Sparsh Part 2" },
            { num: 3, name: "मनुष्यता (मैथिलीशरण गुप्त)", type: "chapter", book: "Sparsh Part 2" },
            { num: 4, name: "पर्वत प्रदेश में पावस (सुमित्रानंदन पंत)", type: "chapter", book: "Sparsh Part 2" },
            { num: 5, name: "तोप (वीरेन डंगवाल)", type: "chapter", book: "Sparsh Part 2" },
            { num: 6, name: "कर चले हम फ़िदा (कैफ़ी आज़मी)", type: "chapter", book: "Sparsh Part 2" },
            { num: 7, name: "आत्मत्राण (रवींद्रनाथ ठाकुर)", type: "chapter", book: "Sparsh Part 2" },
            { num: 8, name: "बड़े भाई साहब (प्रेमचंद)", type: "chapter", book: "Sparsh Part 2" },
            { num: 9, name: "डायरी का एक पन्ना (सीताराम सेकसरिया)", type: "chapter", book: "Sparsh Part 2" },
            { num: 10, name: "तंतारा-वामीरो कथा (लीलाधर मंडलोई)", type: "chapter", book: "Sparsh Part 2" },
            { num: 11, name: "तीसरी कसम के शिल्पकार शैलेंद्र (प्रहलाद अग्रवाल)", type: "chapter", book: "Sparsh Part 2" },
            { num: 12, name: "अब कहाँ दूसरे के दुख से दुखी होने वाले (निदा फ़ाज़ली)", type: "chapter", book: "Sparsh Part 2" },
            { num: 13, name: "पतझर में टूटी पत्तियाँ (रवींद्र केलेकर)", type: "chapter", book: "Sparsh Part 2" },
            { num: 14, name: "कारतूस (हबीब तनवीर)", type: "chapter", book: "Sparsh Part 2" },
            { num: 15, name: "हरिहर काका (मिथिलेश्वर)", type: "chapter", book: "Sanchayan Part 2" },
            { num: 16, name: "सपनों के-से दिन (गुरदयाल सिंह)", type: "chapter", book: "Sanchayan Part 2" },
            { num: 17, name: "टोपी शुक्ला (राही मासूम रज़ा)", type: "chapter", book: "Sanchayan Part 2" }
          ]
        }
      }
    },
    "Sanskrit": {
      "2026-27": {
        "default": {
          code: "122",
          book: "Shemushi Dwitiyo Bhagah",
          chapters: [
            { num: 1, name: "शुचिपर्यावरणम्", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 2, name: "बुद्धिर्बलवती सदा", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 3, name: "शिशुलालनम्", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 4, name: "जननी तुल्यवत्सला", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 5, name: "सुभाषितानि", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 6, name: "सौहार्दं प्रकृतेः शोभा", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 7, name: "विचित्रः साक्षी", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 8, name: "सूक्तयः", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 9, name: "प्राणेभ्योऽपि प्रियः सुहृद्", type: "chapter", book: "Shemushi Dwitiyo Bhagah" },
            { num: 10, name: "अन्योक्तयः", type: "chapter", book: "Shemushi Dwitiyo Bhagah" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          code: "417",
          chapters: [
            { num: 1, name: "Communication Skills-II", type: "unit" },
            { num: 2, name: "Self-Management Skills-II", type: "unit" },
            { num: 3, name: "ICT Skills-II", type: "unit" },
            { num: 4, name: "Entrepreneurial Skills-II", type: "unit" },
            { num: 5, name: "Green Skills-II", type: "unit" },
            { num: 6, name: "Revisiting AI Project Cycle & Ethical Frameworks", type: "unit" },
            { num: 7, name: "Advanced Concepts of Modelling in AI", type: "unit" },
            { num: 8, name: "Evaluating Models", type: "unit" },
            { num: 9, name: "Statistical Data", type: "unit" },
            { num: 10, name: "Computer Vision", type: "unit" },
            { num: 11, name: "Natural Language Processing (NLP)", type: "unit" },
            { num: 12, name: "Advance Python", type: "unit" }
          ]
        }
      }
    },
    "Computer Science": {
      "2026-27": {
        "default": {
          chapters: []
        }
      }
    }
  },
  "11": {
    "Mathematics": {
      "2026-27": {
        "standard": {
          code: "041",
          book: "Mathematics",
          chapters: [
            { num: 1, name: "Sets", type: "chapter", book: "Mathematics" },
            { num: 2, name: "Relations and Functions", type: "chapter", book: "Mathematics" },
            { num: 3, name: "Trigonometric Functions", type: "chapter", book: "Mathematics" },
            { num: 4, name: "Complex Numbers and Quadratic Equations", type: "chapter", book: "Mathematics" },
            { num: 5, name: "Linear Inequalities", type: "chapter", book: "Mathematics" },
            { num: 6, name: "Permutations and Combinations", type: "chapter", book: "Mathematics" },
            { num: 7, name: "Binomial Theorem", type: "chapter", book: "Mathematics" },
            { num: 8, name: "Sequences and Series", type: "chapter", book: "Mathematics" },
            { num: 9, name: "Straight Lines", type: "chapter", book: "Mathematics" },
            { num: 10, name: "Conic Sections", type: "chapter", book: "Mathematics" },
            { num: 11, name: "Introduction to Three Dimensional Geometry", type: "chapter", book: "Mathematics" },
            { num: 12, name: "Limits and Derivatives", type: "chapter", book: "Mathematics" },
            { num: 13, name: "Statistics", type: "chapter", book: "Mathematics" },
            { num: 14, name: "Probability", type: "chapter", book: "Mathematics" }
          ]
        },
        "applied": {
          code: "241",
          book: "Applied Mathematics",
          chapters: [
            { num: 1, name: "Numbers, Quantification and Numerical Applications", type: "unit" },
            { num: 2, name: "Algebra", type: "unit" },
            { num: 3, name: "Calculus", type: "unit" },
            { num: 4, name: "Probability", type: "unit" },
            { num: 5, name: "Descriptive Statistics", type: "unit" },
            { num: 6, name: "Basics of Financial Mathematics", type: "unit" },
            { num: 7, name: "Coordinate Geometry", type: "unit" }
          ]
        }
      }
    },
    "Physics": {
      "2026-27": {
        "default": {
          code: "042",
          book: "Physics",
          chapters: [
            { num: 1, name: "Units and Measurements", type: "chapter", book: "Physics Part I" },
            { num: 2, name: "Motion in a Straight Line", type: "chapter", book: "Physics Part I" },
            { num: 3, name: "Motion in a Plane", type: "chapter", book: "Physics Part I" },
            { num: 4, name: "Laws of Motion", type: "chapter", book: "Physics Part I" },
            { num: 5, name: "Work, Energy and Power", type: "chapter", book: "Physics Part I" },
            { num: 6, name: "System of Particles and Rotational Motion", type: "chapter", book: "Physics Part I" },
            { num: 7, name: "Gravitation", type: "chapter", book: "Physics Part I" },
            { num: 8, name: "Mechanical Properties of Solids", type: "chapter", book: "Physics Part II" },
            { num: 9, name: "Mechanical Properties of Fluids", type: "chapter", book: "Physics Part II" },
            { num: 10, name: "Thermal Properties of Matter", type: "chapter", book: "Physics Part II" },
            { num: 11, name: "Thermodynamics", type: "chapter", book: "Physics Part II" },
            { num: 12, name: "Kinetic Theory", type: "chapter", book: "Physics Part II" },
            { num: 13, name: "Oscillations", type: "chapter", book: "Physics Part II" },
            { num: 14, name: "Waves", type: "chapter", book: "Physics Part II" }
          ]
        }
      }
    },
    "Chemistry": {
      "2026-27": {
        "default": {
          code: "043",
          book: "Chemistry",
          chapters: [
            { num: 1, name: "Some Basic Concepts of Chemistry", type: "chapter", book: "Chemistry Part I" },
            { num: 2, name: "Structure of Atom", type: "chapter", book: "Chemistry Part I" },
            { num: 3, name: "Classification of Elements and Periodicity in Properties", type: "chapter", book: "Chemistry Part I" },
            { num: 4, name: "Chemical Bonding and Molecular Structure", type: "chapter", book: "Chemistry Part I" },
            { num: 5, name: "Chemical Thermodynamics", type: "chapter", book: "Chemistry Part I" },
            { num: 6, name: "Equilibrium", type: "chapter", book: "Chemistry Part I" },
            { num: 7, name: "Redox Reactions", type: "chapter", book: "Chemistry Part II" },
            { num: 8, name: "Organic Chemistry: Some Basic Principles and Techniques", type: "chapter", book: "Chemistry Part II" },
            { num: 9, name: "Hydrocarbons", type: "chapter", book: "Chemistry Part II" }
          ]
        }
      }
    },
    "Biology": {
      "2026-27": {
        "default": {
          code: "044",
          book: "Biology",
          chapters: [
            { num: 1, name: "The Living World", type: "chapter", book: "Biology" },
            { num: 2, name: "Biological Classification", type: "chapter", book: "Biology" },
            { num: 3, name: "Plant Kingdom", type: "chapter", book: "Biology" },
            { num: 4, name: "Animal Kingdom", type: "chapter", book: "Biology" },
            { num: 5, name: "Morphology of Flowering Plants", type: "chapter", book: "Biology" },
            { num: 6, name: "Anatomy of Flowering Plants", type: "chapter", book: "Biology" },
            { num: 7, name: "Structural Organisation in Animals", type: "chapter", book: "Biology" },
            { num: 8, name: "Cell: The Unit of Life", type: "chapter", book: "Biology" },
            { num: 9, name: "Biomolecules", type: "chapter", book: "Biology" },
            { num: 10, name: "Cell Cycle and Cell Division", type: "chapter", book: "Biology" },
            { num: 11, name: "Photosynthesis in Higher Plants", type: "chapter", book: "Biology" },
            { num: 12, name: "Respiration in Plants", type: "chapter", book: "Biology" },
            { num: 13, name: "Plant Growth and Development", type: "chapter", book: "Biology" },
            { num: 14, name: "Breathing and Exchange of Gases", type: "chapter", book: "Biology" },
            { num: 15, name: "Body Fluids and Circulation", type: "chapter", book: "Biology" },
            { num: 16, name: "Excretory Products and their Elimination", type: "chapter", book: "Biology" },
            { num: 17, name: "Locomotion and Movement", type: "chapter", book: "Biology" },
            { num: 18, name: "Neural Control and Coordination", type: "chapter", book: "Biology" },
            { num: 19, name: "Chemical Coordination and Integration", type: "chapter", book: "Biology" }
          ]
        }
      }
    },
    "Accountancy": {
      "2026-27": {
        "default": {
          code: "055",
          book: "Financial Accounting",
          chapters: [
            { num: 1, name: "Introduction to Accounting", type: "chapter", book: "Financial Accounting Part I" },
            { num: 2, name: "Theory Base of Accounting", type: "chapter", book: "Financial Accounting Part I" },
            { num: 3, name: "Recording of Transactions - I", type: "chapter", book: "Financial Accounting Part I" },
            { num: 4, name: "Recording of Transactions - II", type: "chapter", book: "Financial Accounting Part I" },
            { num: 5, name: "Bank Reconciliation Statement", type: "chapter", book: "Financial Accounting Part I" },
            { num: 6, name: "Trial Balance and Rectification of Errors", type: "chapter", book: "Financial Accounting Part I" },
            { num: 7, name: "Depreciation, Provisions and Reserves", type: "chapter", book: "Financial Accounting Part I" },
            { num: 8, name: "Financial Statements - I", type: "chapter", book: "Financial Accounting Part II" },
            { num: 9, name: "Financial Statements - II", type: "chapter", book: "Financial Accounting Part II" }
          ]
        }
      }
    },
    "Business Studies": {
      "2026-27": {
        "default": {
          code: "054",
          book: "Business Studies",
          chapters: [
            { num: 1, name: "Evolution and Fundamentals of Business", type: "chapter", book: "Business Studies" },
            { num: 2, name: "Forms of Business Organisations", type: "chapter", book: "Business Studies" },
            { num: 3, name: "Public, Private and Global Enterprises", type: "chapter", book: "Business Studies" },
            { num: 4, name: "Business Services", type: "chapter", book: "Business Studies" },
            { num: 5, name: "Emerging Modes of Business", type: "chapter", book: "Business Studies" },
            { num: 6, name: "Social Responsibility of Business and Business Ethics", type: "chapter", book: "Business Studies" },
            { num: 7, name: "Sources of Business Finance", type: "chapter", book: "Business Studies" },
            { num: 8, name: "Small Business and Entrepreneurship", type: "chapter", book: "Business Studies" },
            { num: 9, name: "Internal Trade", type: "chapter", book: "Business Studies" },
            { num: 10, name: "International Business", type: "chapter", book: "Business Studies" }
          ]
        }
      }
    },
    "Economics": {
      "2026-27": {
        "default": {
          code: "030",
          chapters: [
            { num: 1, name: "Introduction", type: "chapter", book: "Statistics for Economics" },
            { num: 2, name: "Collection of Data", type: "chapter", book: "Statistics for Economics" },
            { num: 3, name: "Organisation of Data", type: "chapter", book: "Statistics for Economics" },
            { num: 4, name: "Presentation of Data", type: "chapter", book: "Statistics for Economics" },
            { num: 5, name: "Measures of Central Tendency", type: "chapter", book: "Statistics for Economics" },
            { num: 6, name: "Correlation", type: "chapter", book: "Statistics for Economics" },
            { num: 7, name: "Index Numbers", type: "chapter", book: "Statistics for Economics" },
            { num: 8, name: "Introduction to Microeconomics", type: "chapter", book: "Introductory Microeconomics" },
            { num: 9, name: "Theory of Consumer Behaviour", type: "chapter", book: "Introductory Microeconomics" },
            { num: 10, name: "Production and Costs", type: "chapter", book: "Introductory Microeconomics" },
            { num: 11, name: "The Theory of the Firm under Perfect Competition", type: "chapter", book: "Introductory Microeconomics" },
            { num: 12, name: "Market Equilibrium", type: "chapter", book: "Introductory Microeconomics" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "Core": {
          code: "301",
          chapters: [
            { num: 1, name: "The Portrait of a Lady", type: "chapter", book: "Hornbill" },
            { num: 2, name: "A Photograph", type: "chapter", book: "Hornbill (Poetry)" },
            { num: 3, name: "We're Not Afraid to Die... if We Can All Be Together", type: "chapter", book: "Hornbill" },
            { num: 4, name: "Discovering Tut: the Saga Continues", type: "chapter", book: "Hornbill" },
            { num: 5, name: "The Laburnum Top", type: "chapter", book: "Hornbill (Poetry)" },
            { num: 6, name: "The Voice of the Rain", type: "chapter", book: "Hornbill (Poetry)" },
            { num: 7, name: "Childhood", type: "chapter", book: "Hornbill (Poetry)" },
            { num: 8, name: "The Adventure", type: "chapter", book: "Hornbill" },
            { num: 9, name: "Silk Road", type: "chapter", book: "Hornbill" },
            { num: 10, name: "Father to Son", type: "chapter", book: "Hornbill (Poetry)" },
            { num: 11, name: "The Summer of the Beautiful White Horse", type: "chapter", book: "Snapshots" },
            { num: 12, name: "The Address", type: "chapter", book: "Snapshots" },
            { num: 13, name: "Mother's Day", type: "chapter", book: "Snapshots" },
            { num: 14, name: "Birth", type: "chapter", book: "Snapshots" },
            { num: 15, name: "The Tale of Melon City", type: "chapter", book: "Snapshots" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "Core": {
          code: "302",
          chapters: [
            { num: 1, name: "आत्मपरिचय और एक गीत (हरिवंश राय बच्चन)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 2, name: "कबीर (हम तौ एक एक करि जाना)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 3, name: "मीरा (मेरे तो गिरधर गोपाल)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 4, name: "घर की याद (भवानी प्रसाद मिश्र)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 5, name: "चंपा काले काले अच्छर नहीं चीन्हती (त्रिलोचन)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 6, name: "गज़ल (दुष्यंत कुमार)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 7, name: "हे भूख! मत मचल और हे मेरे जूही के फूल जैसे ईश्वर (अक्क महादेवी)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 8, name: "सबसे खतरनाक (अवतार सिंह पाश)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 9, name: "आओ, मिलकर बचाएँ (निर्मला पुतुल)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 10, name: "नमक का दारोगा (प्रेमचंद)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 11, name: "मियाँ नसीरुद्दीन (कृष्णा सोबती)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 12, name: "अप्पू के साथ ढाई साल (सत्यजित राय)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 13, name: "विदाई-संभाषण (बालमुकुंद गुप्त)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 14, name: "गलता लोहा (शेखर जोशी)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 15, name: "रजनी (मन्नू भंडारी)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 16, name: "जामुन का पेड़ (कृष्णचंद्र)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 17, name: "भारत माता (जवाहरलाल नेहरू)", type: "chapter", book: "Aroh Bhag 1" },
            { num: 18, name: "भारतीय गायिकाओं में बेजोड़: लता मंगेशकर (कुमार गंधर्व)", type: "chapter", book: "Vitan Bhag 1" },
            { num: 19, name: "राजस्थान की रजत बूंदें (अनुपम मिश्र)", type: "chapter", book: "Vitan Bhag 1" },
            { num: 20, name: "आलो-आँधारि (बेबी हालदार)", type: "chapter", book: "Vitan Bhag 1" }
          ]
        }
      }
    },
    "Computer Science": {
      "2026-27": {
        "default": {
          code: "083",
          book: "Computer Science with Python",
          chapters: [
            { num: 1, name: "Computer Systems and Organisation", type: "unit" },
            { num: 2, name: "Computational Thinking and Programming - 1", type: "unit" },
            { num: 3, name: "Society, Law and Ethics", type: "unit" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          code: "843",
          book: "Artificial Intelligence",
          chapters: [
            { num: 1, name: "Communication Skills – III", type: "unit" },
            { num: 2, name: "Self-Management Skills – III", type: "unit" },
            { num: 3, name: "ICT Skills – III", type: "unit" },
            { num: 4, name: "Entrepreneurial Skills – III", type: "unit" },
            { num: 5, name: "Green Skills – III", type: "unit" },
            { num: 6, name: "Introduction: Artificial Intelligence for Everyone", type: "unit" },
            { num: 7, name: "Unlocking Your Future in AI", type: "unit" },
            { num: 8, name: "Python Programming", type: "unit" },
            { num: 9, name: "Introduction to Capstone Project", type: "unit" },
            { num: 10, name: "Data Literacy – Data Collection to Data Analysis", type: "unit" },
            { num: 11, name: "Machine Learning Algorithms", type: "unit" },
            { num: 12, name: "Leveraging Linguistics and Computer Science", type: "unit" },
            { num: 13, name: "AI Ethics and Values", type: "unit" }
          ]
        }
      }
    },
    "History": {
      "2026-27": {
        "default": {
          code: "027",
          book: "Themes in World History",
          chapters: [
            { num: 1, name: "Writing and City Life", type: "chapter", book: "Themes in World History" },
            { num: 2, name: "An Empire Across Three Continents", type: "chapter", book: "Themes in World History" },
            { num: 3, name: "Nomadic Empires", type: "chapter", book: "Themes in World History" },
            { num: 4, name: "The Three Orders", type: "chapter", book: "Themes in World History" },
            { num: 5, name: "Changing Cultural Traditions", type: "chapter", book: "Themes in World History" },
            { num: 6, name: "Displacing Indigenous Peoples", type: "chapter", book: "Themes in World History" },
            { num: 7, name: "Paths to Modernisation", type: "chapter", book: "Themes in World History" }
          ]
        }
      }
    },
    "Political Science": {
      "2026-27": {
        "default": {
          code: "028",
          book: "Indian Constitution at Work & Political Theory",
          chapters: [
            { num: 1, name: "Constitution: Why and How?", type: "chapter", book: "Indian Constitution at Work" },
            { num: 2, name: "Rights in the Indian Constitution", type: "chapter", book: "Indian Constitution at Work" },
            { num: 3, name: "Election and Representation", type: "chapter", book: "Indian Constitution at Work" },
            { num: 4, name: "Executive", type: "chapter", book: "Indian Constitution at Work" },
            { num: 5, name: "Legislature", type: "chapter", book: "Indian Constitution at Work" },
            { num: 6, name: "Judiciary", type: "chapter", book: "Indian Constitution at Work" },
            { num: 7, name: "Federalism", type: "chapter", book: "Indian Constitution at Work" },
            { num: 8, name: "Local Governments", type: "chapter", book: "Indian Constitution at Work" },
            { num: 9, name: "Constitution as a Living Document", type: "chapter", book: "Indian Constitution at Work" },
            { num: 10, name: "The Philosophy of the Constitution", type: "chapter", book: "Indian Constitution at Work" },
            { num: 11, name: "Political Theory: An Introduction", type: "chapter", book: "Political Theory" },
            { num: 12, name: "Freedom", type: "chapter", book: "Political Theory" },
            { num: 13, name: "Equality", type: "chapter", book: "Political Theory" },
            { num: 14, name: "Social Justice", type: "chapter", book: "Political Theory" },
            { num: 15, name: "Rights", type: "chapter", book: "Political Theory" },
            { num: 16, name: "Citizenship", type: "chapter", book: "Political Theory" },
            { num: 17, name: "Nationalism", type: "chapter", book: "Political Theory" },
            { num: 18, name: "Secularism", type: "chapter", book: "Political Theory" }
          ]
        }
      }
    },
    "Geography": {
      "2026-27": {
        "default": {
          code: "029",
          book: "Fundamentals of Physical Geography & India Physical Environment",
          chapters: [
            { num: 1, name: "Geography as a Discipline", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 2, name: "The Origin and Evolution of the Earth", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 3, name: "Interior of the Earth", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 4, name: "Distribution of Oceans and Continents", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 5, name: "Geomorphic Processes", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 6, name: "Landforms and their Evolution", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 7, name: "Composition and Structure of Atmosphere", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 8, name: "Solar Radiation, Heat Balance and Temperature", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 9, name: "Atmospheric Circulation and Weather Systems", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 10, name: "Water in the Atmosphere", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 11, name: "World Climate and Climate Change", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 12, name: "Water (Oceans)", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 13, name: "Movements of Ocean Water", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 14, name: "Biodiversity and Conservation", type: "chapter", book: "Fundamentals of Physical Geography" },
            { num: 15, name: "India – Location", type: "chapter", book: "India Physical Environment" },
            { num: 16, name: "Structure and Physiography", type: "chapter", book: "India Physical Environment" },
            { num: 17, name: "Drainage System", type: "chapter", book: "India Physical Environment" },
            { num: 18, name: "Climate", type: "chapter", book: "India Physical Environment" },
            { num: 19, name: "Natural Vegetation", type: "chapter", book: "India Physical Environment" },
            { num: 20, name: "Soils", type: "chapter", book: "India Physical Environment" },
            { num: 21, name: "Natural Hazards and Disasters", type: "chapter", book: "India Physical Environment" }
          ]
        }
      }
    },
    "Sociology": {
      "2026-27": {
        "default": {
          code: "039",
          book: "Introducing Sociology & Understanding Society",
          chapters: [
            { num: 1, name: "Sociology, Society and its Relationship with other Social Sciences", type: "chapter", book: "Introducing Sociology" },
            { num: 2, name: "Terms, Concepts and their Use in Sociology", type: "chapter", book: "Introducing Sociology" },
            { num: 3, name: "Understanding Social Institutions", type: "chapter", book: "Introducing Sociology" },
            { num: 4, name: "Culture and Socialisation", type: "chapter", book: "Introducing Sociology" },
            { num: 5, name: "Social Change and Social Order in Rural and Urban Society", type: "chapter", book: "Understanding Society" },
            { num: 6, name: "Introducing Western Sociologists", type: "chapter", book: "Understanding Society" },
            { num: 7, name: "Indian Sociologists", type: "chapter", book: "Understanding Society" }
          ]
        }
      }
    },
    "Psychology": {
      "2026-27": {
        "default": {
          code: "037",
          book: "Psychology",
          chapters: [
            { num: 1, name: "What is Psychology?", type: "chapter", book: "Psychology" },
            { num: 2, name: "Methods of Enquiry in Psychology", type: "chapter", book: "Psychology" },
            { num: 3, name: "Human Development", type: "chapter", book: "Psychology" },
            { num: 4, name: "Sensory, Attentional and Perceptual Processes", type: "chapter", book: "Psychology" },
            { num: 5, name: "Learning", type: "chapter", book: "Psychology" },
            { num: 6, name: "Human Memory", type: "chapter", book: "Psychology" },
            { num: 7, name: "Thinking", type: "chapter", book: "Psychology" },
            { num: 8, name: "Motivation and Emotion", type: "chapter", book: "Psychology" }
          ]
        }
      }
    },
    "Legal Studies": {
      "2026-27": {
        "default": {
          code: "074",
          book: "Legal Studies",
          chapters: [
            { num: 1, name: "Introduction to Political Institutions", type: "unit" },
            { num: 2, name: "Basic Features of the Constitution of India", type: "unit" },
            { num: 3, name: "Jurisprudence, Nature and Sources of Laws", type: "unit" },
            { num: 4, name: "Judiciary: Constitutional, Civil and Criminal Courts and Processes", type: "unit" },
            { num: 5, name: "Family Justice System", type: "unit" }
          ]
        }
      }
    },
    "Physical Education": {
      "2026-27": {
        "default": {
          code: "048",
          book: "Physical Education",
          chapters: [
            { num: 1, name: "Changing Trends & Career in Physical Education", type: "unit" },
            { num: 2, name: "Olympic Value Education", type: "unit" },
            { num: 3, name: "Yoga", type: "unit" },
            { num: 4, name: "Physical Education & Sports for CWSN (Children with Special Needs – Divyang)", type: "unit" },
            { num: 5, name: "Physical Fitness, Wellness and Lifestyle", type: "unit" },
            { num: 6, name: "Test, Measurement & Evaluation", type: "unit" },
            { num: 7, name: "Fundamentals of Anatomy and Physiology in Sports", type: "unit" },
            { num: 8, name: "Fundamentals of Kinesiology and Biomechanics in Sports", type: "unit" },
            { num: 9, name: "Psychology and Sports", type: "unit" },
            { num: 10, name: "Training & Doping in Sports", type: "unit" }
          ]
        }
      }
    }
  },
  "12": {
    "Mathematics": {
      "2026-27": {
        "standard": {
          code: "041",
          book: "Mathematics",
          chapters: [
            { num: 1, name: "Relations and Functions", type: "chapter", book: "Mathematics Part I" },
            { num: 2, name: "Inverse Trigonometric Functions", type: "chapter", book: "Mathematics Part I" },
            { num: 3, name: "Matrices", type: "chapter", book: "Mathematics Part I" },
            { num: 4, name: "Determinants", type: "chapter", book: "Mathematics Part I" },
            { num: 5, name: "Continuity and Differentiability", type: "chapter", book: "Mathematics Part I" },
            { num: 6, name: "Application of Derivatives", type: "chapter", book: "Mathematics Part I" },
            { num: 7, name: "Integrals", type: "chapter", book: "Mathematics Part II" },
            { num: 8, name: "Application of Integrals", type: "chapter", book: "Mathematics Part II" },
            { num: 9, name: "Differential Equations", type: "chapter", book: "Mathematics Part II" },
            { num: 10, name: "Vector Algebra", type: "chapter", book: "Mathematics Part II" },
            { num: 11, name: "Three Dimensional Geometry", type: "chapter", book: "Mathematics Part II" },
            { num: 12, name: "Linear Programming", type: "chapter", book: "Mathematics Part II" },
            { num: 13, name: "Probability", type: "chapter", book: "Mathematics Part II" }
          ]
        },
        "applied": {
          code: "241",
          book: "Applied Mathematics",
          chapters: [
            { num: 1, name: "Numbers, Quantification and Numerical Applications", type: "unit" },
            { num: 2, name: "Algebra", type: "unit" },
            { num: 3, name: "Calculus", type: "unit" },
            { num: 4, name: "Probability Distributions", type: "unit" },
            { num: 5, name: "Inferential Statistics", type: "unit" },
            { num: 6, name: "Index Numbers and Time-Based Data", type: "unit" },
            { num: 7, name: "Financial Mathematics", type: "unit" },
            { num: 8, name: "Linear Programming", type: "unit" }
          ]
        }
      }
    },
    "Physics": {
      "2026-27": {
        "default": {
          code: "042",
          book: "Physics",
          chapters: [
            { num: 1, name: "Electric Charges and Fields", type: "chapter", book: "Physics Part I" },
            { num: 2, name: "Electrostatic Potential and Capacitance", type: "chapter", book: "Physics Part I" },
            { num: 3, name: "Current Electricity", type: "chapter", book: "Physics Part I" },
            { num: 4, name: "Moving Charges and Magnetism", type: "chapter", book: "Physics Part I" },
            { num: 5, name: "Magnetism and Matter", type: "chapter", book: "Physics Part I" },
            { num: 6, name: "Electromagnetic Induction", type: "chapter", book: "Physics Part I" },
            { num: 7, name: "Alternating Current", type: "chapter", book: "Physics Part I" },
            { num: 8, name: "Electromagnetic Waves", type: "chapter", book: "Physics Part I" },
            { num: 9, name: "Ray Optics and Optical Instruments", type: "chapter", book: "Physics Part II" },
            { num: 10, name: "Wave Optics", type: "chapter", book: "Physics Part II" },
            { num: 11, name: "Dual Nature of Radiation and Matter", type: "chapter", book: "Physics Part II" },
            { num: 12, name: "Atoms", type: "chapter", book: "Physics Part II" },
            { num: 13, name: "Nuclei", type: "chapter", book: "Physics Part II" },
            { num: 14, name: "Semiconductor Electronics: Materials, Devices and Simple Circuits", type: "chapter", book: "Physics Part II" }
          ]
        }
      }
    },
    "Chemistry": {
      "2026-27": {
        "default": {
          code: "043",
          book: "Chemistry",
          chapters: [
            { num: 1, name: "Solutions", type: "chapter", book: "Chemistry Part I" },
            { num: 2, name: "Electrochemistry", type: "chapter", book: "Chemistry Part I" },
            { num: 3, name: "Chemical Kinetics", type: "chapter", book: "Chemistry Part I" },
            { num: 4, name: "The d- and f-Block Elements", type: "chapter", book: "Chemistry Part I" },
            { num: 5, name: "Coordination Compounds", type: "chapter", book: "Chemistry Part I" },
            { num: 6, name: "Haloalkanes and Haloarenes", type: "chapter", book: "Chemistry Part II" },
            { num: 7, name: "Alcohols, Phenols and Ethers", type: "chapter", book: "Chemistry Part II" },
            { num: 8, name: "Aldehydes, Ketones and Carboxylic Acids", type: "chapter", book: "Chemistry Part II" },
            { num: 9, name: "Amines", type: "chapter", book: "Chemistry Part II" },
            { num: 10, name: "Biomolecules", type: "chapter", book: "Chemistry Part II" }
          ]
        }
      }
    },
    "Biology": {
      "2026-27": {
        "default": {
          code: "044",
          book: "Biology",
          chapters: [
            { num: 1, name: "Sexual Reproduction in Flowering Plants", type: "chapter", book: "Biology" },
            { num: 2, name: "Human Reproduction", type: "chapter", book: "Biology" },
            { num: 3, name: "Reproductive Health", type: "chapter", book: "Biology" },
            { num: 4, name: "Principles of Inheritance and Variation", type: "chapter", book: "Biology" },
            { num: 5, name: "Molecular Basis of Inheritance", type: "chapter", book: "Biology" },
            { num: 6, name: "Evolution", type: "chapter", book: "Biology" },
            { num: 7, name: "Human Health and Disease", type: "chapter", book: "Biology" },
            { num: 8, name: "Microbes in Human Welfare", type: "chapter", book: "Biology" },
            { num: 9, name: "Biotechnology: Principles and Processes", type: "chapter", book: "Biology" },
            { num: 10, name: "Biotechnology and its Applications", type: "chapter", book: "Biology" },
            { num: 11, name: "Organisms and Populations", type: "chapter", book: "Biology" },
            { num: 12, name: "Ecosystem", type: "chapter", book: "Biology" },
            { num: 13, name: "Biodiversity and Conservation", type: "chapter", book: "Biology" }
          ]
        }
      }
    },
    "Accountancy": {
      "2026-27": {
        "default": {
          code: "055",
          book: "Accountancy",
          chapters: [
            { num: 1, name: "Accounting for Partnership: Basic Concepts", type: "chapter", book: "Accountancy Part I" },
            { num: 2, name: "Reconstitution of a Partnership Firm – Admission of a Partner", type: "chapter", book: "Accountancy Part I" },
            { num: 3, name: "Reconstitution of a Partnership Firm – Retirement/Death of a Partner", type: "chapter", book: "Accountancy Part I" },
            { num: 4, name: "Dissolution of Partnership Firm", type: "chapter", book: "Accountancy Part I" },
            { num: 5, name: "Accounting for Share Capital", type: "chapter", book: "Accountancy Part II" },
            { num: 6, name: "Issue and Redemption of Debentures", type: "chapter", book: "Accountancy Part II" },
            { num: 7, name: "Financial Statements of a Company", type: "chapter", book: "Accountancy Part II" },
            { num: 8, name: "Analysis of Financial Statements", type: "chapter", book: "Accountancy Part II" },
            { num: 9, name: "Accounting Ratios", type: "chapter", book: "Accountancy Part II" },
            { num: 10, name: "Cash Flow Statement", type: "chapter", book: "Accountancy Part II" }
          ]
        }
      }
    },
    "Business Studies": {
      "2026-27": {
        "default": {
          code: "054",
          book: "Business Studies",
          chapters: [
            { num: 1, name: "Nature and Significance of Management", type: "chapter", book: "Business Studies Part I" },
            { num: 2, name: "Principles of Management", type: "chapter", book: "Business Studies Part I" },
            { num: 3, name: "Business Environment", type: "chapter", book: "Business Studies Part I" },
            { num: 4, name: "Planning", type: "chapter", book: "Business Studies Part I" },
            { num: 5, name: "Organising", type: "chapter", book: "Business Studies Part I" },
            { num: 6, name: "Staffing", type: "chapter", book: "Business Studies Part I" },
            { num: 7, name: "Directing", type: "chapter", book: "Business Studies Part I" },
            { num: 8, name: "Controlling", type: "chapter", book: "Business Studies Part I" },
            { num: 9, name: "Financial Management", type: "chapter", book: "Business Studies Part II" },
            { num: 10, name: "Financial Markets", type: "chapter", book: "Business Studies Part II" },
            { num: 11, name: "Marketing Management", type: "chapter", book: "Business Studies Part II" },
            { num: 12, name: "Consumer Protection", type: "chapter", book: "Business Studies Part II" }
          ]
        }
      }
    },
    "Economics": {
      "2026-27": {
        "default": {
          code: "030",
          chapters: [
            { num: 1, name: "Introduction to Macroeconomics", type: "chapter", book: "Introductory Macroeconomics" },
            { num: 2, name: "National Income Accounting", type: "chapter", book: "Introductory Macroeconomics" },
            { num: 3, name: "Money and Banking", type: "chapter", book: "Introductory Macroeconomics" },
            { num: 4, name: "Determination of Income and Employment", type: "chapter", book: "Introductory Macroeconomics" },
            { num: 5, name: "Government Budget and the Economy", type: "chapter", book: "Introductory Macroeconomics" },
            { num: 6, name: "Open Economy Macroeconomics (Balance of Payments)", type: "chapter", book: "Introductory Macroeconomics" },
            { num: 7, name: "Indian Economy on the Eve of Independence", type: "chapter", book: "Indian Economic Development" },
            { num: 8, name: "Indian Economy (1950-1990)", type: "chapter", book: "Indian Economic Development" },
            { num: 9, name: "Liberalisation, Privatisation and Globalisation: An Appraisal", type: "chapter", book: "Indian Economic Development" },
            { num: 10, name: "Human Capital Formation in India", type: "chapter", book: "Indian Economic Development" },
            { num: 11, name: "Rural Development", type: "chapter", book: "Indian Economic Development" },
            { num: 12, name: "Employment: Growth, Informalisation and Other Issues", type: "chapter", book: "Indian Economic Development" },
            { num: 13, name: "Environment and Sustainable Development", type: "chapter", book: "Indian Economic Development" },
            { num: 14, name: "Comparative Development Experiences of India and its Neighbours", type: "chapter", book: "Indian Economic Development" }
          ]
        }
      }
    },
    "English": {
      "2026-27": {
        "Core": {
          code: "301",
          chapters: [
            { num: 1, name: "The Last Lesson", type: "chapter", book: "Flamingo" },
            { num: 2, name: "Lost Spring", type: "chapter", book: "Flamingo" },
            { num: 3, name: "Deep Water", type: "chapter", book: "Flamingo" },
            { num: 4, name: "The Rattrap", type: "chapter", book: "Flamingo" },
            { num: 5, name: "Indigo", type: "chapter", book: "Flamingo" },
            { num: 6, name: "Poets and Pancakes", type: "chapter", book: "Flamingo" },
            { num: 7, name: "The Interview", type: "chapter", book: "Flamingo" },
            { num: 8, name: "Going Places", type: "chapter", book: "Flamingo" },
            { num: 9, name: "My Mother at Sixty-Six", type: "chapter", book: "Flamingo (Poetry)" },
            { num: 10, name: "Keeping Quiet", type: "chapter", book: "Flamingo (Poetry)" },
            { num: 11, name: "A Thing of Beauty", type: "chapter", book: "Flamingo (Poetry)" },
            { num: 12, name: "A Roadside Stand", type: "chapter", book: "Flamingo (Poetry)" },
            { num: 13, name: "Aunt Jennifer's Tigers", type: "chapter", book: "Flamingo (Poetry)" },
            { num: 14, name: "The Third Level", type: "chapter", book: "Vistas" },
            { num: 15, name: "The Tiger King", type: "chapter", book: "Vistas" },
            { num: 16, name: "Journey to the End of the Earth", type: "chapter", book: "Vistas" },
            { num: 17, name: "The Enemy", type: "chapter", book: "Vistas" },
            { num: 18, name: "On the Face of It", type: "chapter", book: "Vistas" },
            { num: 19, name: "Memories of Childhood", type: "chapter", book: "Vistas" }
          ]
        }
      }
    },
    "Hindi": {
      "2026-27": {
        "Core": {
          code: "302",
          chapters: [
            { num: 1, name: "आत्मपरिचय और एक गीत (हरिवंश राय बच्चन)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 2, name: "पतंग (आलोक धन्वा)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 3, name: "कविता के बहाने और बात सीधी थी पर (कुँवर नारायण)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 4, name: "कैमरे में बंद अपाहिज (रघुवीर सहाय)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 5, name: "उषा (शमशेर बहादुर सिंह)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 6, name: "बादल राग (सूर्यकांत त्रिपाठी 'निराला')", type: "chapter", book: "Aroh Bhag 2" },
            { num: 7, name: "कवितावली और लक्ष्मण-मूर्छा और राम का विलाप (तुलसीदास)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 8, name: "रुबाइयाँ (फ़िराक़ गोरखपुरी)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 9, name: "छोटा मेरा खेत और बगुलों के पंख (उमाशंकर जोशी)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 10, name: "भक्तिन (महादेवी वर्मा)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 11, name: "बाज़ार दर्शन (जैनेंद्र कुमार)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 12, name: "काले मेघा पानी दे (धर्मवीर भारती)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 13, name: "पहलवान की ढोलक (फणीश्वर नाथ 'रेणु')", type: "chapter", book: "Aroh Bhag 2" },
            { num: 14, name: "शिरीष के फूल (हजारी प्रसाद द्विवेदी)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 15, name: "श्रम विभाजन और जाति-प्रथा / मेरी कल्पना का आदर्श समाज (डॉ. भीमराव आंबेडकर)", type: "chapter", book: "Aroh Bhag 2" },
            { num: 16, name: "सिल्वर वैडिंग (मनोहर श्याम जोशी)", type: "chapter", book: "Vitan Bhag 2" },
            { num: 17, name: "जूझ (आनंद यादव)", type: "chapter", book: "Vitan Bhag 2" },
            { num: 18, name: "अतीत में दबे पाँव (ओम थानवी)", type: "chapter", book: "Vitan Bhag 2" }
          ]
        }
      }
    },
    "Computer Science": {
      "2026-27": {
        "default": {
          code: "083",
          book: "Computer Science with Python",
          chapters: [
            { num: 1, name: "Computational Thinking and Programming – 2", type: "unit" },
            { num: 2, name: "Computer Networks", type: "unit" },
            { num: 3, name: "Database Management", type: "unit" }
          ]
        }
      }
    },
    "Artificial Intelligence": {
      "2026-27": {
        "default": {
          code: "843",
          book: "Artificial Intelligence",
          chapters: [
            { num: 1, name: "Communication Skills - IV", type: "unit" },
            { num: 2, name: "Self-Management Skills - IV", type: "unit" },
            { num: 3, name: "ICT Skills - IV", type: "unit" },
            { num: 4, name: "Entrepreneurial Skills - IV", type: "unit" },
            { num: 5, name: "Green Skills - IV", type: "unit" },
            { num: 6, name: "Python Programming - II", type: "unit" },
            { num: 7, name: "Data Science Methodology", type: "unit" },
            { num: 8, name: "Making Machines See (Computer Vision)", type: "unit" },
            { num: 9, name: "AI with Orange Data Mining Tool", type: "unit" },
            { num: 10, name: "Introduction to Big Data and Data Analytics", type: "unit" },
            { num: 11, name: "Understanding Neural Networks", type: "unit" },
            { num: 12, name: "Generative AI", type: "unit" },
            { num: 13, name: "Data Storytelling", type: "unit" }
          ]
        }
      }
    },
    "History": {
      "2026-27": {
        "default": {
          code: "027",
          book: "Themes in Indian History",
          chapters: [
            { num: 1, name: "Bricks, Beads and Bones (The Harappan Civilisation)", type: "chapter", book: "Themes in Indian History Part I" },
            { num: 2, name: "Kings, Farmers and Towns (Early States and Economies)", type: "chapter", book: "Themes in Indian History Part I" },
            { num: 3, name: "Kinship, Caste and Class (Early Societies)", type: "chapter", book: "Themes in Indian History Part I" },
            { num: 4, name: "Thinkers, Beliefs and Buildings (Cultural Developments)", type: "chapter", book: "Themes in Indian History Part I" },
            { num: 5, name: "Through the Eyes of Travellers (Perceptions of Society)", type: "chapter", book: "Themes in Indian History Part II" },
            { num: 6, name: "Bhakti-Sufi Traditions (Changes in Religious Beliefs)", type: "chapter", book: "Themes in Indian History Part II" },
            { num: 7, name: "An Imperial Capital: Vijayanagara", type: "chapter", book: "Themes in Indian History Part II" },
            { num: 8, name: "Peasants, Zamindars and the State (Agrarian Society)", type: "chapter", book: "Themes in Indian History Part II" },
            { num: 9, name: "Colonialism and The Countryside (Exploring Official Archives)", type: "chapter", book: "Themes in Indian History Part III" },
            { num: 10, name: "Rebels and the Raj (1857 Revolt and its Representations)", type: "chapter", book: "Themes in Indian History Part III" },
            { num: 11, name: "Mahatma Gandhi and the Nationalist Movement (Civil Disobedience and Beyond)", type: "chapter", book: "Themes in Indian History Part III" },
            { num: 12, name: "Framing the Constitution (The Beginning of a New Era)", type: "chapter", book: "Themes in Indian History Part III" }
          ]
        }
      }
    },
    "Political Science": {
      "2026-27": {
        "default": {
          code: "028",
          book: "Contemporary World Politics & Politics in India Since Independence",
          chapters: [
            { num: 1, name: "The End of Bipolarity", type: "chapter", book: "Contemporary World Politics" },
            { num: 2, name: "Contemporary Centres of Power", type: "chapter", book: "Contemporary World Politics" },
            { num: 3, name: "Contemporary South Asia", type: "chapter", book: "Contemporary World Politics" },
            { num: 4, name: "International Organisations", type: "chapter", book: "Contemporary World Politics" },
            { num: 5, name: "Security in the Contemporary World", type: "chapter", book: "Contemporary World Politics" },
            { num: 6, name: "Environment and Natural Resources", type: "chapter", book: "Contemporary World Politics" },
            { num: 7, name: "Globalisation", type: "chapter", book: "Contemporary World Politics" },
            { num: 8, name: "Challenges of Nation-Building", type: "chapter", book: "Politics in India Since Independence" },
            { num: 9, name: "Era of One-Party Dominance", type: "chapter", book: "Politics in India Since Independence" },
            { num: 10, name: "Politics of Planned Development", type: "chapter", book: "Politics in India Since Independence" },
            { num: 11, name: "India's External Relations", type: "chapter", book: "Politics in India Since Independence" },
            { num: 12, name: "Challenges to and Restoration of the Congress System", type: "chapter", book: "Politics in India Since Independence" },
            { num: 13, name: "The Crisis of Democratic Order", type: "chapter", book: "Politics in India Since Independence" },
            { num: 14, name: "Regional Aspirations", type: "chapter", book: "Politics in India Since Independence" },
            { num: 15, name: "Recent Developments in Indian Politics", type: "chapter", book: "Politics in India Since Independence" }
          ]
        }
      }
    },
    "Geography": {
      "2026-27": {
        "default": {
          code: "029",
          book: "Fundamentals of Human Geography & India – People and Economy",
          chapters: [
            { num: 1, name: "Human Geography: Nature and Scope", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 2, name: "The World Population: Distribution, Density and Growth", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 3, name: "Human Development", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 4, name: "Primary Activities", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 5, name: "Secondary Activities", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 6, name: "Tertiary and Quaternary Activities", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 7, name: "Transport and Communication", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 8, name: "International Trade", type: "chapter", book: "Fundamentals of Human Geography" },
            { num: 9, name: "Population: Distribution, Density, Growth and Composition", type: "chapter", book: "India – People and Economy" },
            { num: 10, name: "Human Settlements", type: "chapter", book: "India – People and Economy" },
            { num: 11, name: "Land Resources and Agriculture", type: "chapter", book: "India – People and Economy" },
            { num: 12, name: "Water Resources", type: "chapter", book: "India – People and Economy" },
            { num: 13, name: "Mineral and Energy Resources", type: "chapter", book: "India – People and Economy" },
            { num: 14, name: "Planning and Sustainable Development in Indian Context", type: "chapter", book: "India – People and Economy" },
            { num: 15, name: "Transport and Communication in India", type: "chapter", book: "India – People and Economy" },
            { num: 16, name: "International Trade of India", type: "chapter", book: "India – People and Economy" },
            { num: 17, name: "Geographical Perspective on Selected Issues and Problems", type: "chapter", book: "India – People and Economy" }
          ]
        }
      }
    },
    "Sociology": {
      "2026-27": {
        "default": {
          code: "039",
          book: "Indian Society & Social Change and Development in India",
          chapters: [
            { num: 1, name: "The Demographic Structure of the Indian Society", type: "chapter", book: "Indian Society" },
            { num: 2, name: "Social Institutions: Continuity and Change", type: "chapter", book: "Indian Society" },
            { num: 3, name: "Patterns of Social Inequality and Exclusion", type: "chapter", book: "Indian Society" },
            { num: 4, name: "The Challenges of Cultural Diversity", type: "chapter", book: "Indian Society" },
            { num: 5, name: "Structural Change", type: "chapter", book: "Social Change and Development in India" },
            { num: 6, name: "Cultural Change", type: "chapter", book: "Social Change and Development in India" },
            { num: 7, name: "Change and Development in Rural Society", type: "chapter", book: "Social Change and Development in India" },
            { num: 8, name: "Change and Development in Industrial Society", type: "chapter", book: "Social Change and Development in India" },
            { num: 9, name: "Social Movements", type: "chapter", book: "Social Change and Development in India" }
          ]
        }
      }
    },
    "Psychology": {
      "2026-27": {
        "default": {
          code: "037",
          book: "Psychology",
          chapters: [
            { num: 1, name: "Variations in Psychological Attributes", type: "chapter", book: "Psychology" },
            { num: 2, name: "Self and Personality", type: "chapter", book: "Psychology" },
            { num: 3, name: "Meeting Life Challenges", type: "chapter", book: "Psychology" },
            { num: 4, name: "Psychological Disorders", type: "chapter", book: "Psychology" },
            { num: 5, name: "Therapeutic Approaches", type: "chapter", book: "Psychology" },
            { num: 6, name: "Attitude and Social Cognition", type: "chapter", book: "Psychology" },
            { num: 7, name: "Social Influence and Group Processes", type: "chapter", book: "Psychology" }
          ]
        }
      }
    },
    "Legal Studies": {
      "2026-27": {
        "default": {
          code: "074",
          book: "Legal Studies",
          chapters: [
            { num: 1, name: "Judiciary", type: "unit" },
            { num: 2, name: "Alternative Dispute Resolution in India (ADR)", type: "unit" },
            { num: 3, name: "Topics in Law-I (Business Laws)", type: "unit" },
            { num: 4, name: "Topics in Law-II (General Laws)", type: "unit" },
            { num: 5, name: "Concept of Human Rights", type: "unit" },
            { num: 6, name: "International Law", type: "unit" },
            { num: 7, name: "Legal Profession in India", type: "unit" },
            { num: 8, name: "Legal Services", type: "unit" }
          ]
        }
      }
    },
    "Physical Education": {
      "2026-27": {
        "default": {
          code: "048",
          book: "Physical Education",
          chapters: [
            { num: 1, name: "Management of Sporting Events", type: "unit" },
            { num: 2, name: "Children and Women in Sports", type: "unit" },
            { num: 3, name: "Yoga as Preventive Measure for Lifestyle Disease", type: "unit" },
            { num: 4, name: "Physical Education and Sports for CWSN (Children with Special Needs – Divyang)", type: "unit" },
            { num: 5, name: "Sports and Nutrition", type: "unit" },
            { num: 6, name: "Test and Measurement in Sports", type: "unit" },
            { num: 7, name: "Physiology and Injuries in Sport", type: "unit" },
            { num: 8, name: "Biomechanics and Sports", type: "unit" },
            { num: 9, name: "Psychology and Sports", type: "unit" },
            { num: 10, name: "Training in Sports", type: "unit" }
          ]
        }
      }
    }
  }
};

/**
 * Retrieves chapters/units for a specific class and subject.
 * 
 * @param {string|number} classNum - Student's class ("6" to "12")
 * @param {string} subjectName - Subject name (e.g. "Mathematics", "Science")
 * @param {Object} [options] - Optional selection parameters
 * @param {string} [options.academicYear="2026-27"] - Academic year
 * @param {string} [options.course] - Specific course or variant (e.g., "Course A", "standard")
 * @returns {Array<Object>|null} Array of chapters or null if not found
 */
export const getChapters = (classNum, subjectName, options = {}) => {
  if (!classNum || !subjectName) return null;

  const clsKey = String(classNum).trim();
  const classData = CBSE_CURRICULUM[clsKey];
  if (!classData) return null;

  const subjectData = classData[subjectName];
  if (!subjectData) return null;

  const yearKey = options.academicYear || "2026-27";
  const yearData = subjectData[yearKey];
  if (!yearData) return null;

  // 1. If explicit course requested, check for it
  if (options.course && yearData[options.course]) {
    const entry = yearData[options.course];
    return Array.isArray(entry.chapters) && entry.chapters.length > 0 ? entry.chapters : null;
  }

  // 2. If "default" course exists
  if (yearData.default) {
    const entry = yearData.default;
    return Array.isArray(entry.chapters) && entry.chapters.length > 0 ? entry.chapters : null;
  }

  // 3. If "standard" course exists (e.g. standard Mathematics)
  if (yearData.standard) {
    const entry = yearData.standard;
    return Array.isArray(entry.chapters) && entry.chapters.length > 0 ? entry.chapters : null;
  }

  // 4. Fallback to first available course variant
  const courseKeys = Object.keys(yearData);
  if (courseKeys.length > 0) {
    const firstCourse = yearData[courseKeys[0]];
    if (firstCourse && Array.isArray(firstCourse.chapters) && firstCourse.chapters.length > 0) {
      return firstCourse.chapters;
    }
  }

  return null;
};
