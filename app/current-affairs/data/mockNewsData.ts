import { NewsItem, NewsSource } from '../types'

// Helper function to generate dates for the past week
function getDateForDayOffset(offset: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - offset)
  date.setHours(10, 0, 0, 0) // Set to 10 AM
  return date
}

// Mock news data for 7 days from 5 different sources
export const mockNewsData: Record<string, NewsItem[]> = {
  // Day 1 (7 days ago)
  'day1': [
    {
      id: 'pib-001',
      source: 'PIB' as NewsSource,
      title: 'Cabinet approves PM-VISHWAKARMA Scheme with outlay of Rs 13,000 crore',
      content: `The Union Cabinet chaired by Prime Minister has approved a new Central Sector Scheme "PM Vishwakarma" with a financial outlay of Rs 13,000 crore for a period of five years (FY 2023-24 to FY 2027-28). This major government policy initiative aims to strengthen and nurture the Guru-Shishya parampara or family-based practice of traditional skills by artisans and craftspeople. The scheme represents a significant government scheme for economic development and employment generation. The cabinet approval includes support to artisans and craftspeople of 18 traditional trades. This government initiative will boost manufacturing sector and contribute to GDP growth while preserving cultural heritage. The scheme aligns with government's vision of inclusive development and poverty alleviation through skill development and employment generation.`,
      publishedDate: getDateForDayOffset(7),
      url: 'https://pib.gov.in/sample-001',
      tags: ['economy', 'scheme', 'traditional crafts', 'skill development'],
      originalLength: 1200
    },
    {
      id: 'hindu-001',
      source: 'TheHindu' as NewsSource,
      title: 'Supreme Court Constitution Bench to examine scope of Article 32',
      content: `A five-judge Constitution Bench of the Supreme Court will examine the scope and limits of its extraordinary writ jurisdiction under Article 32 of the Constitution. The bench will specifically look into whether the Supreme Court can directly entertain petitions under Article 32 when an alternative remedy is available under Article 226 before High Courts. This examination comes in the context of increasing PIL filings directly in the Supreme Court, bypassing High Courts. The case has significant implications for federal judicial structure and access to constitutional remedies.`,
      publishedDate: getDateForDayOffset(7),
      url: 'https://thehindu.com/sample-001',
      author: 'Legal Correspondent',
      tags: ['judiciary', 'constitution', 'article 32', 'writ jurisdiction'],
      originalLength: 1500
    },
    {
      id: 'ie-001',
      source: 'IndianExpress' as NewsSource,
      title: 'Understanding the Global Biofuels Alliance: India\'s green diplomacy push',
      content: `India launched the Global Biofuels Alliance (GBA) during the G20 Summit, marking a significant step in green energy diplomacy. The alliance aims to facilitate cooperation between biofuel consumer and producer countries, share best practices, and provide technical support for national biofuel programs. With founding members including the US, Brazil, and India - together accounting for 85% of global ethanol production - the GBA seeks to accelerate the global uptake of biofuels. This initiative aligns with India\'s target of 20% ethanol blending by 2025 and net-zero emissions by 2070.`,
      publishedDate: getDateForDayOffset(7),
      url: 'https://indianexpress.com/sample-001',
      tags: ['environment', 'biofuels', 'G20', 'climate change', 'energy'],
      originalLength: 2000
    },
    {
      id: 'et-001',
      source: 'EconomicTimes' as NewsSource,
      title: 'RBI keeps repo rate unchanged at 6.5%, maintains \'withdrawal of accommodation\' stance',
      content: `The Reserve Bank of India\'s Monetary Policy Committee (MPC) has decided to keep the policy repo rate unchanged at 6.50% while maintaining its stance of \'withdrawal of accommodation\'. The decision was taken by a 5:1 majority. RBI Governor stated that while inflation has moderated from its peak, it remains above the target of 4%. The central bank has revised its GDP growth projection for FY24 to 6.5% from 6.5% earlier, while inflation projection remains at 5.4%. The decision reflects RBI\'s commitment to bringing inflation to target while supporting growth.`,
      publishedDate: getDateForDayOffset(7),
      url: 'https://economictimes.com/sample-001',
      tags: ['economy', 'monetary policy', 'RBI', 'inflation', 'interest rates'],
      originalLength: 1800
    },
    {
      id: 'dte-001',
      source: 'DownToEarth' as NewsSource,
      title: 'India\'s first Climate Change Assessment Report warns of 4.4°C rise by 2100',
      content: `The Ministry of Earth Sciences has released India\'s first comprehensive Climate Change Assessment Report, warning that India\'s average temperature could rise by 4.4°C by the end of the century under a high emission scenario. The report highlights that the Hindu Kush Himalayas have warmed by 1.5°C, affecting crucial water resources. Extreme rainfall events have increased by 75% between 1950-2015. The report emphasizes urgent need for mitigation and adaptation strategies, particularly for vulnerable coastal areas and agriculture-dependent regions.`,
      publishedDate: getDateForDayOffset(7),
      url: 'https://downtoearth.org.in/sample-001',
      tags: ['climate change', 'environment', 'temperature rise', 'assessment report'],
      originalLength: 2200
    }
  ],
  
  // Day 2 (6 days ago)
  'day2': [
    {
      id: 'pib-002',
      source: 'PIB' as NewsSource,
      title: 'India becomes 4th country to successfully soft-land on Moon with Chandrayaan-3',
      content: `India has scripted history by becoming the fourth country to successfully soft-land on the Moon and the first to land near the lunar south pole. The Chandrayaan-3 mission\'s Vikram lander touched down on the lunar surface at 6:04 PM IST. The success demonstrates India\'s growing prowess in space technology and cost-effective space missions. The mission, with a budget of just Rs 615 crore, will study the lunar surface composition, measure seismic activity, and analyze the lunar atmosphere. This achievement positions India as a major space power and opens new opportunities for lunar exploration.`,
      publishedDate: getDateForDayOffset(6),
      url: 'https://pib.gov.in/sample-002',
      tags: ['space', 'ISRO', 'Chandrayaan-3', 'technology', 'achievement'],
      originalLength: 1600
    },
    {
      id: 'hindu-002',
      source: 'TheHindu' as NewsSource,
      title: 'Parliament passes Digital Personal Data Protection Bill 2023',
      content: `Parliament has passed the Digital Personal Data Protection Bill 2023, marking a watershed moment in India\'s data governance framework. The bill establishes comprehensive rules for processing digital personal data, balancing individual privacy rights with legitimate data processing needs. Key provisions include consent requirements, data principal rights, obligations for data fiduciaries, and establishment of a Data Protection Board. The bill also provides exemptions for national security and public order. Critics raise concerns about government exemptions and lack of data localization requirements. The legislation will significantly impact tech companies and digital businesses operating in India.`,
      publishedDate: getDateForDayOffset(6),
      url: 'https://thehindu.com/sample-002',
      author: 'Technology Desk',
      tags: ['data protection', 'privacy', 'legislation', 'digital governance'],
      originalLength: 1900
    },
    {
      id: 'ie-002',
      source: 'IndianExpress' as NewsSource,
      title: 'Decoding the Women\'s Reservation Bill: 33% quota in Lok Sabha and Assemblies',
      content: `The Constitution (128th Amendment) Bill, commonly known as the Women\'s Reservation Bill or Nari Shakti Vandan Adhiniyam, promises to reserve one-third of seats in Lok Sabha and State Legislative Assemblies for women. However, implementation is linked to census and delimitation exercises, potentially delaying it until after 2029. The bill provides for rotation of reserved seats every delimitation, ensures reservation within SC/ST quota, and will remain in force for 15 years. While hailed as historic for women\'s political empowerment, questions remain about OBC women\'s representation and implementation timeline.`,
      publishedDate: getDateForDayOffset(6),
      url: 'https://indianexpress.com/sample-002',
      tags: ['womens reservation', 'constitution amendment', 'political representation', 'gender'],
      originalLength: 2100
    },
    {
      id: 'et-002',
      source: 'EconomicTimes' as NewsSource,
      title: 'India-Middle East-Europe Economic Corridor launched at G20 Summit',
      content: `The India-Middle East-Europe Economic Corridor (IMEC) was launched at the G20 Summit, presenting a transformative vision for connectivity between Asia, Middle East, and Europe. The corridor includes rail, road, and sea routes connecting India to Europe via UAE, Saudi Arabia, Jordan, and Israel. Expected to reduce transit time by 40% and costs by 30%, IMEC will facilitate trade, energy resources transportation, and digital connectivity. The project is seen as an alternative to China\'s Belt and Road Initiative and strengthens India\'s position as a global trade hub. Implementation will require significant infrastructure investment and geopolitical cooperation.`,
      publishedDate: getDateForDayOffset(6),
      url: 'https://economictimes.com/sample-002',
      tags: ['infrastructure', 'trade corridor', 'G20', 'connectivity', 'geopolitics'],
      originalLength: 1700
    },
    {
      id: 'dte-002',
      source: 'DownToEarth' as NewsSource,
      title: 'Great Nicobar mega project gets green clearance despite ecological concerns',
      content: `The Rs 72,000 crore Great Nicobar Development Project has received environmental clearance, sparking controversy among conservationists. The project includes an international transshipment port, airport, power plant, and township covering 166 sq km of pristine rainforest. Critics highlight threats to indigenous Shompen tribe, endemic species, and coral reefs. The island houses leatherback turtle nesting sites and lies in seismically active zone. While the government emphasizes strategic importance and economic benefits, environmental groups warn of irreversible ecological damage and violation of Forest Rights Act. The clearance conditions include wildlife management plans and biodiversity conservation measures.`,
      publishedDate: getDateForDayOffset(6),
      url: 'https://downtoearth.org.in/sample-002',
      tags: ['environment', 'Great Nicobar', 'development project', 'biodiversity', 'tribal rights'],
      originalLength: 2300
    }
  ],
  
  // Day 3 (5 days ago)
  'day3': [
    {
      id: 'pib-003',
      source: 'PIB' as NewsSource,
      title: 'National Curriculum Framework for School Education 2023 released',
      content: `The Ministry of Education has released the National Curriculum Framework for School Education 2023, the first major curriculum revision in nearly two decades. Based on NEP 2020 principles, the framework introduces a 5+3+3+4 structure replacing the 10+2 system. Key changes include mother tongue as medium of instruction till Grade 5, integration of vocational education from Grade 6, board exams twice a year, and emphasis on competency-based learning. The framework reduces curriculum load, promotes critical thinking, and introduces Indian Knowledge Systems across subjects. Implementation will begin from academic year 2024-25 with new textbooks.`,
      publishedDate: getDateForDayOffset(5),
      url: 'https://pib.gov.in/sample-003',
      tags: ['education', 'NCF', 'NEP 2020', 'curriculum reform'],
      originalLength: 1400
    },
    {
      id: 'hindu-003',
      source: 'TheHindu' as NewsSource,
      title: 'India abstains from UN vote on Gaza humanitarian crisis resolution',
      content: `India abstained from voting on a UN General Assembly resolution calling for immediate humanitarian ceasefire in Gaza, maintaining its nuanced position on the Israel-Palestine conflict. While 153 countries voted in favor, India joined 22 other nations in abstention. India\'s explanation emphasized need for peaceful resolution, condemned terrorism and civilian casualties on both sides, and called for humanitarian access. The abstention reflects India\'s balancing act between traditional support for Palestinian cause, growing ties with Israel, and concerns about terrorism. This position has implications for India\'s West Asia policy and role as a potential mediator.`,
      publishedDate: getDateForDayOffset(5),
      url: 'https://thehindu.com/sample-003',
      author: 'Diplomatic Editor',
      tags: ['foreign policy', 'UN', 'Israel-Palestine', 'diplomacy', 'West Asia'],
      originalLength: 1800
    },
    {
      id: 'ie-003',
      source: 'IndianExpress' as NewsSource,
      title: 'One Nation One Election: High-level committee submits report to President',
      content: `The high-level committee on \'One Nation One Election\' has submitted its report to the President, recommending simultaneous elections to Lok Sabha and State Assemblies. The committee suggests constitutional amendments to synchronize electoral cycles, with implementation in two phases. Phase one involves simultaneous Lok Sabha and Assembly elections, while phase two includes local body elections within 100 days. The report addresses concerns about federalism, suggests mechanisms for hung assemblies and no-confidence motions, and estimates Rs 10,000 crore savings per election cycle. Critics argue it undermines federal structure and favors national parties over regional ones.`,
      publishedDate: getDateForDayOffset(5),
      url: 'https://indianexpress.com/sample-003',
      tags: ['elections', 'constitutional reform', 'one nation one election', 'federalism'],
      originalLength: 2000
    },
    {
      id: 'et-003',
      source: 'EconomicTimes' as NewsSource,
      title: 'India\'s forex reserves cross $600 billion mark for first time',
      content: `India\'s foreign exchange reserves have crossed the $600 billion mark for the first time, reaching $604.5 billion as per RBI data. The milestone reflects strong capital inflows, robust services exports, and RBI\'s active intervention in forex markets. The reserves provide import cover of over 10 months and strengthen India\'s external sector resilience. Contributing factors include FDI inflows, strong IT exports, and remittances touching $100 billion. The healthy reserves position enables RBI to manage currency volatility and external shocks. However, economists caution about global headwinds including US Fed policy and geopolitical tensions affecting emerging markets.`,
      publishedDate: getDateForDayOffset(5),
      url: 'https://economictimes.com/sample-003',
      tags: ['economy', 'forex reserves', 'RBI', 'external sector', 'financial stability'],
      originalLength: 1600
    },
    {
      id: 'dte-003',
      source: 'DownToEarth' as NewsSource,
      title: 'Himalayan glaciers retreating 65% faster than in previous decade: Study',
      content: `A comprehensive study by the International Centre for Integrated Mountain Development reveals Himalayan glaciers are melting 65% faster in 2010-2019 compared to previous decades. The study analyzed 2,000 glaciers across Hindu Kush Himalaya region using satellite data. Total ice loss doubled from 0.36m to 0.69m per year. Glaciers below 4,000m altitude show highest retreat rates. The accelerated melting threatens water security for 2 billion people dependent on glacier-fed rivers. Immediate impacts include glacial lake outburst floods, while long-term effects include reduced river flows affecting agriculture and hydropower. The findings underscore urgency of limiting global warming to 1.5°C.`,
      publishedDate: getDateForDayOffset(5),
      url: 'https://downtoearth.org.in/sample-003',
      tags: ['climate change', 'Himalayas', 'glaciers', 'water security', 'global warming'],
      originalLength: 2100
    }
  ],
  
  // Day 4 (4 days ago)
  'day4': [
    {
      id: 'pib-004',
      source: 'PIB' as NewsSource,
      title: 'Pradhan Mantri Garib Kalyan Anna Yojana extended for 5 years',
      content: `The Union Cabinet has approved extension of Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY) for another five years, providing free foodgrains to 81.35 crore beneficiaries. Under the scheme, 5 kg wheat/rice per person per month will be provided free of cost to all Antyodaya Anna Yojana and Priority Households under National Food Security Act. The extension will incur expenditure of Rs 11.8 lakh crore, making it world\'s largest food security program. The decision ensures food security for poor and vulnerable sections, especially in the context of global food inflation and supply chain disruptions.`,
      publishedDate: getDateForDayOffset(4),
      url: 'https://pib.gov.in/sample-004',
      tags: ['welfare scheme', 'food security', 'PMGKAY', 'poverty alleviation'],
      originalLength: 1300
    },
    {
      id: 'hindu-004',
      source: 'TheHindu' as NewsSource,
      title: 'Chief Justice calls for indianisation of legal system and use of regional languages',
      content: `The Chief Justice of India has advocated for comprehensive indianisation of the legal system, emphasizing need for judgments in regional languages and incorporation of Indian dispute resolution methods. Speaking at a law conference, the CJI highlighted that colonial-era legal framework creates barriers for common citizens accessing justice. Proposals include translating important judgments into regional languages, establishing regional language benches in High Courts, and integrating traditional justice systems like Lok Adalats and gram nyayalayas. The initiative aims to make justice delivery more accessible, reduce pendency, and align legal system with Indian ethos while maintaining constitutional principles.`,
      publishedDate: getDateForDayOffset(4),
      url: 'https://thehindu.com/sample-004',
      author: 'Legal Affairs Editor',
      tags: ['judiciary', 'legal reform', 'regional languages', 'access to justice'],
      originalLength: 1700
    },
    {
      id: 'ie-004',
      source: 'IndianExpress' as NewsSource,
      title: 'Understanding the Global South: India\'s leadership and changing dynamics',
      content: `India\'s G20 presidency highlighted the concept of \'Global South\', representing developing nations\' collective voice in global governance. The term encompasses countries facing similar development challenges despite geographical diversity. India hosted Voice of Global South Summit, addressing issues like climate finance, technology transfer, and reformed multilateralism. Key demands include debt restructuring, increased climate adaptation funding, and equitable vaccine distribution. India\'s leadership leverages its credibility as a developing nation achieving significant growth. However, Global South isn\'t monolithic - divergent interests on trade, climate commitments, and geopolitical alignments pose challenges. Success depends on converting rhetoric into concrete outcomes benefiting developing nations.`,
      publishedDate: getDateForDayOffset(4),
      url: 'https://indianexpress.com/sample-004',
      tags: ['Global South', 'G20', 'international relations', 'development', 'multilateralism'],
      originalLength: 2200
    },
    {
      id: 'et-004',
      source: 'EconomicTimes' as NewsSource,
      title: 'PLI scheme success: Electronics exports cross $23 billion, smartphone production surges',
      content: `India\'s Production Linked Incentive (PLI) scheme for electronics has achieved significant milestones with electronics exports crossing $23 billion in FY23, a 50% increase year-on-year. Smartphone production reached $44 billion, making India the second-largest mobile manufacturer globally. The scheme attracted investments from Apple suppliers, Samsung, and domestic champions. iPhone exports alone touched $5 billion. The success has created 100,000 direct jobs and 300,000 indirect employment. Government plans to expand PLI to components manufacturing, targeting $300 billion electronics production by 2030. Challenges remain in developing complete ecosystem and reducing import dependence for critical components.`,
      publishedDate: getDateForDayOffset(4),
      url: 'https://economictimes.com/sample-004',
      tags: ['PLI scheme', 'electronics', 'manufacturing', 'exports', 'Make in India'],
      originalLength: 1900
    },
    {
      id: 'dte-004',
      source: 'DownToEarth' as NewsSource,
      title: 'India\'s first carbon credit auction fetches Rs 1,000 per tonne, sets precedent',
      content: `India conducted its first-ever carbon credit auction on the Indian Carbon Market platform, with credits fetching Rs 1,000 per tonne of CO2 equivalent. Twenty projects across renewable energy, energy efficiency, and afforestation sectors participated. The auction marks operationalization of India\'s compliance carbon market under the Energy Conservation Act. High prices compared to international markets (EU ETS ~€85) reflect strong domestic demand and limited supply. The framework allows energy-intensive industries to meet emission targets through trading. Critics warn against greenwashing and emphasize need for robust monitoring. Success could position India as major player in $2 billion global carbon market.`,
      publishedDate: getDateForDayOffset(4),
      url: 'https://downtoearth.org.in/sample-004',
      tags: ['carbon market', 'climate policy', 'carbon credits', 'emissions trading'],
      originalLength: 2000
    }
  ],
  
  // Day 5 (3 days ago)
  'day5': [
    {
      id: 'pib-005',
      source: 'PIB' as NewsSource,
      title: 'National Green Hydrogen Mission gets Cabinet nod with Rs 19,744 crore outlay',
      content: `The Union Cabinet has approved the National Green Hydrogen Mission with a total outlay of Rs 19,744 crore until 2029-30. The mission aims to make India a global hub for green hydrogen production, targeting 5 MMT annual production capacity by 2030. Key components include financial incentives for electrolyzer manufacturing and green hydrogen production, pilot projects for steel and shipping sectors, and R&D support. The mission is expected to attract Rs 8 lakh crore investments, create 6 lakh jobs, reduce fossil fuel imports by Rs 1 lakh crore, and abate 50 MMT CO2 emissions annually. India aims to export green hydrogen to EU, Japan, and South Korea.`,
      publishedDate: getDateForDayOffset(3),
      url: 'https://pib.gov.in/sample-005',
      tags: ['green hydrogen', 'renewable energy', 'climate action', 'energy transition'],
      originalLength: 1500
    },
    {
      id: 'hindu-005',
      source: 'TheHindu' as NewsSource,
      title: 'SC verdict on same-sex marriage: Recognizes rights but leaves legislation to Parliament',
      content: `The Supreme Court delivered a nuanced verdict on same-sex marriage petitions, declining to grant legal recognition but acknowledging LGBTQ+ rights and discrimination. The 5-judge bench ruled 3:2 that right to marry isn\'t a fundamental right and courts cannot legislate on marriage laws. However, the court recognized unmarried same-sex couples\' rights to cohabitation, protection from discrimination, and access to services. CJI\'s minority view favored civil union recognition. The verdict directs government to ensure non-discrimination in access to goods and services, form a committee for LGBTQ+ concerns, and sensitize public about queer rights. While disappointing for petitioners, the judgment advances LGBTQ+ rights discourse in India.`,
      publishedDate: getDateForDayOffset(3),
      url: 'https://thehindu.com/sample-005',
      author: 'Supreme Court Reporter',
      tags: ['LGBTQ rights', 'same-sex marriage', 'Supreme Court', 'fundamental rights'],
      originalLength: 2100
    },
    {
      id: 'ie-005',
      source: 'IndianExpress' as NewsSource,
      title: 'Decoding India\'s semiconductor ambitions: From import dependence to global player',
      content: `India\'s semiconductor mission is gaining momentum with multiple fab announcements and design initiatives. The $10 billion incentive program attracted Foxconn-Vedanta (later separated), Tata-PSMC, and Micron Technology. Micron\'s $2.75 billion assembly and test facility in Gujarat marks India\'s entry into semiconductor manufacturing. The mission targets $100 billion semiconductor market by 2030. Advantages include large domestic demand, engineering talent, and government support. Challenges involve high capital requirements, technology transfer, and ecosystem development. Success requires sustained policy support, skill development, and integration with global value chains. The geopolitical dimension of reducing China dependence adds strategic importance to India\'s semiconductor push.`,
      publishedDate: getDateForDayOffset(3),
      url: 'https://indianexpress.com/sample-005',
      tags: ['semiconductors', 'technology', 'manufacturing', 'strategic sector', 'self-reliance'],
      originalLength: 2300
    },
    {
      id: 'et-005',
      source: 'EconomicTimes' as NewsSource,
      title: 'Digital rupee pilot expands: CBDC transactions cross 10 lakh milestone',
      content: `The Reserve Bank of India\'s Central Bank Digital Currency (CBDC) pilot has achieved significant scale with transactions crossing 10 lakh and user base exceeding 50 lakh. The retail digital rupee (e₹-R) is now available across 26 cities with participation from 16 banks. RBI is testing offline functionality, programmability for targeted subsidies, and cross-border payments. Use cases include P2P transfers, merchant payments, and government disbursements. While adoption faces challenges from UPI\'s dominance, CBDC offers advantages like reduced settlement risk, lower transaction costs, and enhanced monetary policy transmission. RBI plans wholesale CBDC for securities settlement and interbank transfers.`,
      publishedDate: getDateForDayOffset(3),
      url: 'https://economictimes.com/sample-005',
      tags: ['digital rupee', 'CBDC', 'fintech', 'RBI', 'digital payments'],
      originalLength: 1800
    },
    {
      id: 'dte-005',
      source: 'DownToEarth' as NewsSource,
      title: 'Western Ghats ecosystems under severe threat: New biodiversity assessment',
      content: `A comprehensive biodiversity assessment reveals Western Ghats lost 35% of forest cover in past two decades, threatening its status as global biodiversity hotspot. The study documented 15 species extinctions and 185 species critically endangered. Primary threats include linear infrastructure projects, mining, encroachments, and climate change impacts. Despite six states\' involvement, implementation of Gadgil and Kasturirangan committee recommendations remains patchy. The assessment found 62% of endemic species facing habitat loss. Urgent conservation measures recommended include eco-sensitive zone notifications, wildlife corridor protection, and sustainable livelihood programs for forest communities. The Western Ghats\' role in monsoon patterns and water security for peninsular India makes conservation critical.`,
      publishedDate: getDateForDayOffset(3),
      url: 'https://downtoearth.org.in/sample-005',
      tags: ['Western Ghats', 'biodiversity', 'conservation', 'forest loss', 'endemic species'],
      originalLength: 2400
    }
  ],
  
  // Day 6 (2 days ago)
  'day6': [
    {
      id: 'pib-006',
      source: 'PIB' as NewsSource,
      title: 'Vibrant Villages Programme expanded to cover all border villages',
      content: `The government has expanded the Vibrant Villages Programme to cover all 4,687 villages along India\'s international borders. Initially covering northern borders, the program now includes villages along Myanmar and Bangladesh borders. With Rs 4,800 crore allocation, the scheme provides infrastructure development, connectivity, renewable energy, television and telecom connectivity, and livelihood support. Special focus on reversing migration through tourism promotion, skill development, and cultural preservation. Border villages will get priority in all central schemes. The program aims to transform border villages into vibrant communities, strengthening national security while improving living standards of 1.8 crore border residents.`,
      publishedDate: getDateForDayOffset(2),
      url: 'https://pib.gov.in/sample-006',
      tags: ['border development', 'rural development', 'national security', 'infrastructure'],
      originalLength: 1400
    },
    {
      id: 'hindu-006',
      source: 'TheHindu' as NewsSource,
      title: 'Electoral Bonds scheme declared unconstitutional by Supreme Court',
      content: `In a landmark judgment, the Supreme Court struck down the Electoral Bonds scheme as unconstitutional, violating citizens\' right to information. The 5-judge bench held that anonymous political funding undermines electoral transparency and voters\' right to make informed choices. The court directed SBI to stop issuing bonds immediately and disclose all donor-party transaction details to Election Commission within 12 weeks. The judgment emphasized that political contributions aren\'t covered under privacy rights when they affect electoral process. The verdict has major implications for political funding, requiring parties to find transparent funding mechanisms. Opposition parties hailed the verdict while government considers legislative alternatives for political funding reform.`,
      publishedDate: getDateForDayOffset(2),
      url: 'https://thehindu.com/sample-006',
      author: 'Constitutional Law Expert',
      tags: ['electoral bonds', 'Supreme Court', 'political funding', 'transparency', 'right to information'],
      originalLength: 2000
    },
    {
      id: 'ie-006',
      source: 'IndianExpress' as NewsSource,
      title: 'India-UK Free Trade Agreement: Final negotiations and sticking points',
      content: `India and UK are in final stages of Free Trade Agreement negotiations, targeting conclusion by year-end. The deal covers goods, services, investments, and intellectual property, potentially boosting bilateral trade from $20 billion to $50 billion by 2030. Key Indian demands include liberalized visa regime for professionals and market access for services. UK seeks reduced tariffs on automobiles and scotch whisky. Sticking points include data localization, carbon border tax implications, and access to government procurement. The FTA assumes strategic importance post-Brexit for UK and aligns with India\'s goal of $2 trillion exports by 2030. Success could template future agreements with EU and Canada.`,
      publishedDate: getDateForDayOffset(2),
      url: 'https://indianexpress.com/sample-006',
      tags: ['free trade agreement', 'India-UK', 'international trade', 'economic diplomacy'],
      originalLength: 2100
    },
    {
      id: 'et-006',
      source: 'EconomicTimes' as NewsSource,
      title: 'India\'s startup ecosystem: 111 unicorns despite funding winter',
      content: `Despite global funding winter, India maintains its position as third-largest startup ecosystem with 111 unicorns valued at $350 billion collectively. While funding dropped 60% to $10 billion in 2023, sectors like deeptech, AI, and climate tech attracted significant investments. Government initiatives including Startup India, Fund of Funds, and tax benefits supported ecosystem resilience. Notable trends include reverse flipping with startups returning to India, focus on profitability over growth, and emergence of tier-2 city startups. Challenges include valuation corrections, layoffs, and regulatory uncertainty. The ecosystem\'s maturity shows in increased domestic capital participation and successful IPOs of former unicorns.`,
      publishedDate: getDateForDayOffset(2),
      url: 'https://economictimes.com/sample-006',
      tags: ['startups', 'unicorns', 'venture capital', 'innovation', 'entrepreneurship'],
      originalLength: 1900
    },
    {
      id: 'dte-006',
      source: 'DownToEarth' as NewsSource,
      title: 'Joshimath subsidence crisis: One year later, lessons unlearned',
      content: `One year after Joshimath land subsidence crisis displaced 850 families, a comprehensive study reveals continuing ground movement and expanding affected areas. Latest satellite data shows 5.4 cm annual subsidence rate with 2,000 buildings now showing cracks. Despite expert warnings about unplanned construction, hydropower projects\' impact, and carrying capacity breach, development activities continue. The study links subsidence to aquifer puncturing by Tapovan-Vishnugad project tunnel. Similar risks identified in 15 other Himalayan towns. Rehabilitation remains incomplete with affected families in temporary shelters. The crisis highlights urgent need for carrying capacity studies, building codes enforcement, and sustainable development models for fragile mountain ecosystems.`,
      publishedDate: getDateForDayOffset(2),
      url: 'https://downtoearth.org.in/sample-006',
      tags: ['Joshimath', 'land subsidence', 'Himalayas', 'urban planning', 'disaster'],
      originalLength: 2200
    }
  ],
  
  // Day 7 (1 day ago)
  'day7': [
    {
      id: 'pib-007',
      source: 'PIB' as NewsSource,
      title: 'India achieves 50% renewable energy capacity milestone ahead of 2030 target',
      content: `India has achieved a significant milestone with renewable energy capacity reaching 180 GW, representing 50% of total installed power capacity. Solar capacity stands at 75 GW, wind at 45 GW, and remaining from hydro and other sources. The achievement comes 7 years ahead of the 2030 target. PM announced revised target of 500 GW renewable capacity by 2030. Key enablers include policy support, declining technology costs, and innovative financing mechanisms. Green energy corridor projects ensure grid integration. The milestone positions India as a global renewable energy leader and supports net-zero commitment by 2070. Next focus areas include energy storage, green hydrogen, and offshore wind development.`,
      publishedDate: getDateForDayOffset(1),
      url: 'https://pib.gov.in/sample-007',
      tags: ['renewable energy', 'solar power', 'climate targets', 'energy transition'],
      originalLength: 1600
    },
    {
      id: 'hindu-007',
      source: 'TheHindu' as NewsSource,
      title: 'Caste census debate intensifies as Bihar releases survey findings',
      content: `Bihar\'s caste survey results showing OBCs constitute 27.1% and EBCs 36.01% of population has reignited national debate on caste census. The survey, covering 12.7 crore population, provides first comprehensive caste data since 1931. Political parties across spectrum demand similar exercise nationally for evidence-based reservation policies. Government maintains position that caste census could divide society while opposition argues it\'s essential for social justice. Constitutional experts debate whether such enumeration violates privacy or serves legitimate state interest. The issue gains significance with Supreme Court examining economically weaker section reservation and creamy layer criteria. Implications extend to political representation, resource allocation, and social policy formulation.`,
      publishedDate: getDateForDayOffset(1),
      url: 'https://thehindu.com/sample-007',
      author: 'Political Bureau',
      tags: ['caste census', 'Bihar', 'social justice', 'reservation', 'OBC'],
      originalLength: 2200
    },
    {
      id: 'ie-007',
      source: 'IndianExpress' as NewsSource,
      title: 'Understanding India\'s new criminal laws: Colonial legacy to constitutional values',
      content: `The Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, and Bharatiya Sakshya Adhiniyam will replace IPC, CrPC, and Evidence Act from July 2024, marking the most significant legal reform since independence. Key changes include prioritizing crimes against women and children, introducing community service as punishment, recognizing organized crime and terrorism, and mandating videography of crime scenes. The laws emphasize victim rights, witness protection, and time-bound investigation and trials. Technology integration includes e-FIRs, virtual hearings, and electronic evidence provisions. Critics raise concerns about enhanced police powers and certain vague provisions. Implementation requires massive training of police, judiciary, and legal professionals across the country.`,
      publishedDate: getDateForDayOffset(1),
      url: 'https://indianexpress.com/sample-007',
      tags: ['criminal law reform', 'BNS', 'legal system', 'decolonization', 'justice delivery'],
      originalLength: 2400
    },
    {
      id: 'et-007',
      source: 'EconomicTimes' as NewsSource,
      title: 'UPI goes global: International expansion and digital payment diplomacy',
      content: `India\'s Unified Payments Interface (UPI) continues global expansion with launches in UAE, Singapore, Bhutan, Nepal, and France. Monthly transactions crossed 11 billion worth Rs 18 lakh crore. Agreements signed with 30 countries for UPI deployment. The internationalization serves dual purpose: convenience for Indian diaspora and soft power projection. NPCI targets 100 billion monthly transactions by 2027. Technical innovations include UPI Lite for offline payments, credit line integration, and cross-border remittances. Competition emerges from CBDCs and private networks. Success factors include zero MDR policy, interoperability, and real-time settlement. UPI\'s global adoption could reshape international digital payment landscape and reduce dollar dependency.`,
      publishedDate: getDateForDayOffset(1),
      url: 'https://economictimes.com/sample-007',
      tags: ['UPI', 'digital payments', 'fintech diplomacy', 'NPCI', 'international expansion'],
      originalLength: 2000
    },
    {
      id: 'dte-007',
      source: 'DownToEarth' as NewsSource,
      title: 'Air pollution crisis: 40% Indians breathing severely polluted air, study finds',
      content: `Comprehensive air quality analysis reveals 40% of India\'s population exposed to PM2.5 levels exceeding 100 μg/m³, seven times WHO guidelines. North India faces acute crisis with 63 cities among world\'s 100 most polluted. Health impact includes 1.67 million annual deaths and Rs 2.5 lakh crore economic loss. Despite National Clean Air Programme, pollution levels increased in 43% of cities. Study attributes failure to weak enforcement, continued reliance on coal, vehicular growth, and crop burning. Solutions require airshed approach, stricter emission norms, clean energy transition, and behavioral change. The crisis demands treating air pollution as public health emergency with coordinated action across sectors and states.`,
      publishedDate: getDateForDayOffset(1),
      url: 'https://downtoearth.org.in/sample-007',
      tags: ['air pollution', 'public health', 'PM2.5', 'environmental crisis', 'clean air'],
      originalLength: 2300
    }
  ]
}

// Helper function to get all news for a specific day
export function getNewsForDay(dayNumber: number): NewsItem[] {
  return mockNewsData[`day${dayNumber}`] || []
}

// Helper function to get all news for the week
export function getAllWeekNews(): NewsItem[] {
  const allNews: NewsItem[] = []
  for (let i = 1; i <= 7; i++) {
    allNews.push(...getNewsForDay(i))
  }
  return allNews
}

// Helper function to get news by source
export function getNewsBySource(source: NewsSource): NewsItem[] {
  const allNews = getAllWeekNews()
  return allNews.filter(news => news.source === source)
}

// Helper function to get news by date range
export function getNewsByDateRange(startDate: Date, endDate: Date): NewsItem[] {
  const allNews = getAllWeekNews()
  return allNews.filter(news => 
    news.publishedDate >= startDate && news.publishedDate <= endDate
  )
}