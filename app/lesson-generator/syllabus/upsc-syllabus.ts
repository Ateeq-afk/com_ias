import { SyllabusTopic, SubjectArea, LessonTemplate } from '../types'

export class UPSCSyllabusParser {
  private syllabusData: Record<SubjectArea, SyllabusTopic[]> = {
    'History': this.generateHistoryTopics(),
    'Geography': this.generateGeographyTopics(),
    'Polity': this.generatePolityTopics(),
    'Economy': this.generateEconomyTopics(),
    'Environment': this.generateEnvironmentTopics(),
    'Science & Technology': this.generateScienceTechTopics(),
    'Current Affairs': this.generateCurrentAffairsTopics(),
    'Ethics': this.generateEthicsTopics(),
    'Art & Culture': this.generateArtCultureTopics(),
    'International Relations': this.generateIRTopics()
  }
  
  getAllTopics(): SyllabusTopic[] {
    return Object.values(this.syllabusData).flat()
  }
  
  getTopicsBySubject(subject: SubjectArea): SyllabusTopic[] {
    return this.syllabusData[subject] || []
  }
  
  getHighPriorityTopics(): SyllabusTopic[] {
    return this.getAllTopics().filter(topic => topic.weight >= 8)
  }
  
  getTopicsByTemplate(template: LessonTemplate): SyllabusTopic[] {
    return this.getAllTopics().filter(topic => topic.suggestedTemplate === template)
  }
  
  searchTopics(query: string): SyllabusTopic[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllTopics().filter(topic => 
      topic.mainTopic.toLowerCase().includes(lowerQuery) ||
      topic.subTopics.some(sub => sub.toLowerCase().includes(lowerQuery)) ||
      topic.microTopics.some(micro => micro.toLowerCase().includes(lowerQuery))
    )
  }
  
  private generateHistoryTopics(): SyllabusTopic[] {
    return [
      {
        id: 'hist-001',
        subject: 'History',
        mainTopic: 'Ancient India',
        subTopics: [
          'Indus Valley Civilization',
          'Vedic Period',
          'Buddhism and Jainism',
          'Mauryan Empire',
          'Post-Mauryan Period',
          'Gupta Period',
          'Post-Gupta Period'
        ],
        microTopics: [
          'Harappan town planning', 'Harappan script', 'Harappan decline theories', 'Harappan art and craft',
          'Rigvedic society', 'Later Vedic period', 'Vedic literature', 'Vedic religion',
          'Life of Buddha', 'Buddhist councils', 'Buddhist architecture', 'Jain Tirthankaras',
          'Chandragupta Maurya', 'Ashoka the Great', 'Mauryan administration', 'Mauryan art',
          'Sungas', 'Satavahanas', 'Indo-Greeks', 'Kushanas', 'Parthians',
          'Chandragupta II', 'Samudragupta', 'Gupta administration', 'Gupta art and literature',
          'Pushyabhuti dynasty', 'Chalukyas', 'Pallavas', 'Cholas', 'Pandyas'
        ],
        weight: 9,
        examFrequency: 'very-high',
        suggestedTemplate: 'TimelineExploration',
        prerequisites: [],
        estimatedLessons: 25
      },
      {
        id: 'hist-002',
        subject: 'History',
        mainTopic: 'Medieval India',
        subTopics: [
          'Delhi Sultanate',
          'Mughal Empire',
          'Vijayanagara Empire',
          'Bahmani Kingdom',
          'Regional Kingdoms',
          'Advent of Europeans'
        ],
        microTopics: [
          'Slave dynasty', 'Khilji dynasty', 'Tughlaq dynasty', 'Sayyid dynasty', 'Lodhi dynasty',
          'First Battle of Panipat', 'Babur', 'Humayun', 'Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb',
          'Krishnadevaraya', 'Vijayanagara administration', 'Hampi architecture',
          'Bahmani-Vijayanagara conflicts', 'Deccan Sultanates',
          'Marathas', 'Sikhs', 'Ahoms', 'Mysore', 'Hyderabad',
          'Portuguese in India', 'Dutch in India', 'French in India', 'British arrival'
        ],
        weight: 9,
        examFrequency: 'very-high',
        suggestedTemplate: 'TimelineExploration',
        prerequisites: ['hist-001'],
        estimatedLessons: 30
      },
      {
        id: 'hist-003',
        subject: 'History',
        mainTopic: 'Modern India - Colonial Period',
        subTopics: [
          'Company Rule Establishment',
          'Expansion and Consolidation',
          'Economic Impact',
          'Social and Religious Reforms',
          'Revolt of 1857',
          'Growth of Nationalism'
        ],
        microTopics: [
          'Battle of Plassey', 'Battle of Buxar', 'Regulating Act 1773', 'Pitt\'s India Act',
          'Anglo-Mysore Wars', 'Anglo-Maratha Wars', 'Anglo-Sikh Wars', 'Subsidiary Alliance', 'Doctrine of Lapse',
          'Drain of Wealth', 'Deindustrialization', 'Commercialization of Agriculture', 'Railway development',
          'Raja Ram Mohan Roy', 'Brahmo Samaj', 'Arya Samaj', 'Aligarh Movement', 'Theosophical Society',
          'Causes of 1857 revolt', 'Course of revolt', 'Consequences of revolt', 'Nature of revolt',
          'Formation of Indian National Congress', 'Moderates vs Extremists', 'Swadeshi Movement', 'Partition of Bengal'
        ],
        weight: 10,
        examFrequency: 'very-high',
        suggestedTemplate: 'CaseStudyAnalysis',
        prerequisites: ['hist-002'],
        estimatedLessons: 35
      },
      {
        id: 'hist-004',
        subject: 'History',
        mainTopic: 'Freedom Struggle',
        subTopics: [
          'Early Nationalist Movement',
          'Gandhi Era',
          'Revolutionary Movement',
          'Mass Movements',
          'Partition and Independence',
          'Integration of Princely States'
        ],
        microTopics: [
          'Morley-Minto Reforms', 'Lucknow Pact', 'Home Rule Movement', 'Montagu-Chelmsford Reforms',
          'Champaran Satyagraha', 'Khilafat Movement', 'Non-Cooperation Movement', 'Civil Disobedience', 'Quit India Movement',
          'Bhagat Singh', 'Chandrashekhar Azad', 'Subhas Chandra Bose', 'INA', 'Kakori Conspiracy',
          'Simon Commission', 'Round Table Conferences', 'Government of India Act 1935', 'Provincial elections',
          'Two-Nation Theory', 'Direct Action Day', 'Mountbatten Plan', 'Radcliffe Line',
          'Sardar Patel\'s role', 'Hyderabad Operation', 'Kashmir issue', 'Junagadh integration'
        ],
        weight: 10,
        examFrequency: 'very-high',
        suggestedTemplate: 'TimelineExploration',
        prerequisites: ['hist-003'],
        estimatedLessons: 40
      },
      {
        id: 'hist-005',
        subject: 'History',
        mainTopic: 'Post-Independence India',
        subTopics: [
          'Nation Building',
          'Economic Development',
          'Political Evolution',
          'Social Changes',
          'Foreign Policy',
          'Contemporary Challenges'
        ],
        microTopics: [
          'Constitution making', 'Integration challenges', 'Language policy', 'Reorganization of states',
          'Five Year Plans', 'Green Revolution', 'Liberalization 1991', 'Economic reforms',
          'Nehru era', 'Indira Gandhi period', 'Emergency 1975-77', 'Coalition politics',
          'Caste and society', 'Women\'s movement', 'Tribal issues', 'Urbanization',
          'Non-Alignment', 'China War 1962', 'Pakistan Wars', 'Nuclear policy',
          'Terrorism', 'Communalism', 'Regional movements', 'Globalization impact'
        ],
        weight: 8,
        examFrequency: 'high',
        suggestedTemplate: 'ComparativeAnalysis',
        prerequisites: ['hist-004'],
        estimatedLessons: 25
      }
    ]
  }
  
  private generatePolityTopics(): SyllabusTopic[] {
    return [
      {
        id: 'pol-001',
        subject: 'Polity',
        mainTopic: 'Constitutional Framework',
        subTopics: [
          'Making of Constitution',
          'Salient Features',
          'Preamble',
          'Fundamental Rights',
          'Fundamental Duties',
          'Directive Principles'
        ],
        microTopics: [
          'Constituent Assembly', 'B.R. Ambedkar role', 'Sources of Constitution', 'Drafting Committee',
          'Federal features', 'Unitary features', 'Parliamentary system', 'Judicial review',
          'Preamble significance', 'Preamble amendments', 'Socialist secular democratic',
          'Right to Equality', 'Right to Freedom', 'Right against Exploitation', 'Cultural Rights', 'Constitutional Remedies',
          'Significance of duties', '42nd Amendment', 'Swaran Singh Committee',
          'Non-justiciable nature', 'State policy guidelines', 'Gandhian principles', 'Socialist principles'
        ],
        weight: 10,
        examFrequency: 'very-high',
        suggestedTemplate: 'ConceptExplanation',
        prerequisites: [],
        estimatedLessons: 30
      },
      {
        id: 'pol-002',
        subject: 'Polity',
        mainTopic: 'Union Government',
        subTopics: [
          'President',
          'Vice President',
          'Prime Minister',
          'Council of Ministers',
          'Parliament',
          'Supreme Court'
        ],
        microTopics: [
          'Presidential powers', 'Presidential election', 'Presidential ordinances', 'Presidential emergency',
          'Vice Presidential role', 'Vice Presidential election', 'Rajya Sabha Chairman',
          'PM appointment', 'PM powers', 'PM and President relations', 'Coalition governments',
          'Council of Ministers composition', 'Collective responsibility', 'Individual responsibility',
          'Lok Sabha composition', 'Rajya Sabha composition', 'Parliamentary committees', 'Budget process',
          'Supreme Court jurisdiction', 'Chief Justice', 'Judicial review', 'Public Interest Litigation'
        ],
        weight: 10,
        examFrequency: 'very-high',
        suggestedTemplate: 'ProcessFlow',
        prerequisites: ['pol-001'],
        estimatedLessons: 35
      },
      {
        id: 'pol-003',
        subject: 'Polity',
        mainTopic: 'State Government',
        subTopics: [
          'Governor',
          'Chief Minister',
          'State Legislature',
          'High Courts',
          'Local Government',
          'Centre-State Relations'
        ],
        microTopics: [
          'Governor appointment', 'Governor powers', 'Governor\'s rule', 'Governor discretion',
          'CM appointment', 'CM powers', 'CM and Governor relations',
          'State Assembly', 'State Council', 'State legislation process', 'Money Bills in states',
          'High Court jurisdiction', 'High Court judges', 'Administrative tribunals',
          'Panchayati Raj', '73rd Amendment', 'Urban local bodies', '74th Amendment',
          'Legislative relations', 'Administrative relations', 'Financial relations', 'Interstate disputes'
        ],
        weight: 9,
        examFrequency: 'high',
        suggestedTemplate: 'ComparativeAnalysis',
        prerequisites: ['pol-002'],
        estimatedLessons: 25
      },
      {
        id: 'pol-004',
        subject: 'Polity',
        mainTopic: 'Constitutional Bodies',
        subTopics: [
          'Election Commission',
          'CAG',
          'UPSC',
          'Attorney General',
          'Finance Commission',
          'Planning Commission/NITI Aayog'
        ],
        microTopics: [
          'Election Commission independence', 'Chief Election Commissioner', 'Election process', 'Model Code of Conduct',
          'CAG powers', 'CAG reports', 'Government accounting', 'Audit functions',
          'UPSC functions', 'Civil services examination', 'All India Services', 'State Public Service Commissions',
          'Attorney General role', 'Solicitor General', 'Government legal advice',
          'Finance Commission composition', 'Devolution of taxes', 'Grants to states',
          'Planning Commission evolution', 'NITI Aayog structure', 'Development planning', 'Cooperative federalism'
        ],
        weight: 8,
        examFrequency: 'high',
        suggestedTemplate: 'ConceptExplanation',
        prerequisites: ['pol-001'],
        estimatedLessons: 20
      },
      {
        id: 'pol-005',
        subject: 'Polity',
        mainTopic: 'Rights and Citizenship',
        subTopics: [
          'Citizenship Provisions',
          'Right to Information',
          'Consumer Rights',
          'Human Rights',
          'Women Rights',
          'Child Rights'
        ],
        microTopics: [
          'Citizenship by birth', 'Citizenship by descent', 'Citizenship by naturalization', 'Citizenship Amendment Act',
          'RTI Act provisions', 'Information Commission', 'Transparency in governance',
          'Consumer Protection Act', 'Consumer courts', 'Consumer awareness',
          'National Human Rights Commission', 'State Human Rights Commissions', 'Human rights violations',
          'Women\'s Commission', 'Domestic violence laws', 'Workplace harassment', 'Political participation',
          'Child welfare committees', 'POCSO Act', 'Juvenile Justice Act', 'Child labor laws'
        ],
        weight: 7,
        examFrequency: 'medium',
        suggestedTemplate: 'ConceptExplanation',
        prerequisites: ['pol-001'],
        estimatedLessons: 15
      }
    ]
  }
  
  private generateEconomyTopics(): SyllabusTopic[] {
    return [
      {
        id: 'eco-001',
        subject: 'Economy',
        mainTopic: 'Economic Planning and Development',
        subTopics: [
          'Planning in India',
          'Five Year Plans',
          'NITI Aayog',
          'Economic Surveys',
          'Development Indicators',
          'Sustainable Development'
        ],
        microTopics: [
          'Planning Commission history', 'Centralized planning', 'Mixed economy model', 'Planning process',
          'First Plan to Twelfth Plan', 'Plan objectives', 'Plan achievements', 'Plan failures',
          'NITI Aayog formation', 'NITI Aayog functions', 'Cooperative federalism', 'Three year action agenda',
          'Economic Survey significance', 'Survey methodology', 'Key economic indicators',
          'GDP growth', 'Per capita income', 'Human Development Index', 'Ease of Doing Business',
          'Sustainable Development Goals', 'Environmental sustainability', 'Social sustainability', 'Economic sustainability'
        ],
        weight: 9,
        examFrequency: 'very-high',
        suggestedTemplate: 'TimelineExploration',
        prerequisites: [],
        estimatedLessons: 30
      },
      {
        id: 'eco-002',
        subject: 'Economy',
        mainTopic: 'Economic Reforms',
        subTopics: [
          'Pre-1991 Economy',
          'Liberalization Process',
          'Privatization',
          'Globalization',
          'Sectoral Reforms',
          'Impact Assessment'
        ],
        microTopics: [
          'License Raj', 'Import substitution', 'Public sector dominance', 'Economic crisis 1991',
          'New Economic Policy', 'Liberalization measures', 'Manmohan Singh reforms', 'Structural adjustment',
          'Disinvestment policy', 'Public sector enterprises', 'Strategic disinvestment', 'Asset monetization',
          'FDI policy', 'Trade liberalization', 'Capital account convertibility', 'WTO membership',
          'Banking reforms', 'Insurance sector', 'Telecom sector', 'Power sector', 'Transport sector',
          'Growth impact', 'Employment impact', 'Poverty impact', 'Income inequality', 'Regional disparities'
        ],
        weight: 10,
        examFrequency: 'very-high',
        suggestedTemplate: 'ComparativeAnalysis',
        prerequisites: ['eco-001'],
        estimatedLessons: 35
      },
      {
        id: 'eco-003',
        subject: 'Economy',
        mainTopic: 'Money and Banking',
        subTopics: [
          'Reserve Bank of India',
          'Monetary Policy',
          'Banking System',
          'Financial Markets',
          'Payment Systems',
          'Financial Inclusion'
        ],
        microTopics: [
          'RBI functions', 'RBI autonomy', 'Governor appointment', 'Monetary Policy Committee',
          'Interest rates', 'Inflation targeting', 'Open market operations', 'Cash Reserve Ratio', 'Statutory Liquidity Ratio',
          'Commercial banks', 'Cooperative banks', 'Regional Rural Banks', 'Non-banking financial companies',
          'Stock exchanges', 'Bond markets', 'Commodity markets', 'Foreign exchange markets',
          'Digital payments', 'UPI', 'Mobile banking', 'Fintech innovations',
          'Jan Dhan Yojana', 'Financial literacy', 'Microfinance', 'Self Help Groups'
        ],
        weight: 9,
        examFrequency: 'high',
        suggestedTemplate: 'ProcessFlow',
        prerequisites: ['eco-002'],
        estimatedLessons: 25
      },
      {
        id: 'eco-004',
        subject: 'Economy',
        mainTopic: 'Public Finance',
        subTopics: [
          'Government Budget',
          'Taxation System',
          'Fiscal Policy',
          'Public Debt',
          'Finance Commission',
          'GST'
        ],
        microTopics: [
          'Budget process', 'Revenue budget', 'Capital budget', 'Budget deficit types',
          'Direct taxes', 'Indirect taxes', 'Tax reforms', 'Tax administration',
          'Fiscal deficit', 'Revenue deficit', 'Primary deficit', 'Fiscal consolidation',
          'Internal debt', 'External debt', 'Debt sustainability', 'Debt management',
          'Finance Commission role', 'Tax devolution', 'Grants to states', 'Local body finances',
          'GST structure', 'GST implementation', 'GST Council', 'GST impact'
        ],
        weight: 10,
        examFrequency: 'very-high',
        suggestedTemplate: 'ProcessFlow',
        prerequisites: ['eco-001'],
        estimatedLessons: 30
      },
      {
        id: 'eco-005',
        subject: 'Economy',
        mainTopic: 'External Sector',
        subTopics: [
          'Balance of Payments',
          'Foreign Trade',
          'Exchange Rate',
          'Foreign Investment',
          'Trade Policy',
          'International Economics'
        ],
        microTopics: [
          'Current account', 'Capital account', 'Trade balance', 'Invisible items',
          'Export promotion', 'Import policy', 'Trade deficit', 'Trade agreements',
          'Exchange rate determination', 'Exchange rate regimes', 'Currency convertibility',
          'FDI flows', 'FII investments', 'External commercial borrowings', 'Sovereign bonds',
          'Export-import policy', 'Special Economic Zones', 'Trade facilitation', 'Make in India',
          'WTO agreements', 'Regional trade agreements', 'Multilateral trade', 'Trade disputes'
        ],
        weight: 8,
        examFrequency: 'high',
        suggestedTemplate: 'DataInterpretation',
        prerequisites: ['eco-003'],
        estimatedLessons: 20
      }
    ]
  }
  
  private generateGeographyTopics(): SyllabusTopic[] {
    return [
      {
        id: 'geo-001',
        subject: 'Geography',
        mainTopic: 'Physical Geography - Earth',
        subTopics: [
          'Origin and Evolution of Earth',
          'Interior of Earth',
          'Landforms',
          'Drainage Systems',
          'Climate and Weather',
          'Oceanography'
        ],
        microTopics: [
          'Solar system formation', 'Earth\'s evolution', 'Geological time scale', 'Continental drift',
          'Earth\'s crust', 'Mantle', 'Core', 'Plate tectonics', 'Earthquakes', 'Volcanoes',
          'Mountains', 'Plateaus', 'Plains', 'Coastal landforms', 'Glacial landforms', 'Desert landforms',
          'River systems', 'Drainage patterns', 'Watershed management', 'Groundwater',
          'Weather elements', 'Climate types', 'Monsoons', 'Cyclones', 'Climate change',
          'Ocean currents', 'Tides', 'Ocean resources', 'Marine ecosystems'
        ],
        weight: 8,
        examFrequency: 'high',
        suggestedTemplate: 'ConceptExplanation',
        prerequisites: [],
        estimatedLessons: 35
      },
      {
        id: 'geo-002',
        subject: 'Geography',
        mainTopic: 'India - Physical Features',
        subTopics: [
          'Physiographic Divisions',
          'Himalayan System',
          'Northern Plains',
          'Peninsular Plateau',
          'Coastal Plains',
          'Islands'
        ],
        microTopics: [
          'Major physiographic divisions', 'Geological structure', 'Relief features',
          'Greater Himalayas', 'Lesser Himalayas', 'Shiwaliks', 'Himalayan ranges', 'Himalayan rivers',
          'Indus-Ganga-Brahmaputra plains', 'Alluvial deposits', 'Bhabar', 'Terai', 'Delta formation',
          'Central Highlands', 'Deccan Plateau', 'Western Ghats', 'Eastern Ghats', 'Peninsular rivers',
          'Western coastal plains', 'Eastern coastal plains', 'Lagoons', 'Backwaters',
          'Andaman and Nicobar', 'Lakshadweep', 'Coral reefs', 'Island ecology'
        ],
        weight: 9,
        examFrequency: 'very-high',
        suggestedTemplate: 'MapBased',
        prerequisites: ['geo-001'],
        estimatedLessons: 25
      },
      {
        id: 'geo-003',
        subject: 'Geography',
        mainTopic: 'India - Climate',
        subTopics: [
          'Factors Affecting Climate',
          'Monsoon System',
          'Seasons',
          'Rainfall Distribution',
          'Climatic Regions',
          'Climate Change Impact'
        ],
        microTopics: [
          'Latitude', 'Altitude', 'Distance from sea', 'Relief features', 'Ocean currents',
          'Southwest monsoon', 'Northeast monsoon', 'Monsoon mechanism', 'El Nino', 'La Nina',
          'Winter season', 'Summer season', 'Rainy season', 'Retreating monsoon',
          'Rainfall patterns', 'Drought', 'Floods', 'Cyclones in India',
          'Tropical wet', 'Tropical dry', 'Subtropical humid', 'Mountain climate',
          'Temperature rise', 'Rainfall changes', 'Extreme weather events', 'Adaptation strategies'
        ],
        weight: 9,
        examFrequency: 'very-high',
        suggestedTemplate: 'ProcessFlow',
        prerequisites: ['geo-002'],
        estimatedLessons: 20
      },
      {
        id: 'geo-004',
        subject: 'Geography',
        mainTopic: 'India - Natural Resources',
        subTopics: [
          'Water Resources',
          'Soil Resources',
          'Forest Resources',
          'Mineral Resources',
          'Energy Resources',
          'Marine Resources'
        ],
        microTopics: [
          'River water', 'Groundwater', 'Water conservation', 'Rainwater harvesting', 'Interlinking of rivers',
          'Soil types', 'Soil degradation', 'Soil conservation', 'Organic farming',
          'Forest types', 'Forest cover', 'Deforestation', 'Afforestation', 'Forest policy',
          'Metallic minerals', 'Non-metallic minerals', 'Fuel minerals', 'Mineral distribution', 'Mining issues',
          'Coal', 'Petroleum', 'Natural gas', 'Renewable energy', 'Energy security',
          'Fisheries', 'Marine minerals', 'Blue economy', 'Coastal management'
        ],
        weight: 8,
        examFrequency: 'high',
        suggestedTemplate: 'MapBased',
        prerequisites: ['geo-003'],
        estimatedLessons: 25
      },
      {
        id: 'geo-005',
        subject: 'Geography',
        mainTopic: 'Human Geography',
        subTopics: [
          'Population Geography',
          'Settlement Geography',
          'Economic Geography',
          'Transport Geography',
          'Cultural Geography',
          'Regional Planning'
        ],
        microTopics: [
          'Population distribution', 'Population density', 'Population growth', 'Migration', 'Demographic transition',
          'Rural settlements', 'Urban settlements', 'Urbanization', 'Smart cities', 'Urban problems',
          'Agriculture', 'Industries', 'Services', 'Regional development', 'Economic disparities',
          'Road transport', 'Rail transport', 'Water transport', 'Air transport', 'Communication',
          'Languages', 'Religions', 'Tribes', 'Cultural regions', 'Cultural diversity',
          'Development planning', 'Regional imbalances', 'Backward area development', 'Special area programs'
        ],
        weight: 8,
        examFrequency: 'high',
        suggestedTemplate: 'DataInterpretation',
        prerequisites: ['geo-004'],
        estimatedLessons: 30
      }
    ]
  }
  
  // Add other subject generators (shortened for brevity)
  private generateEnvironmentTopics(): SyllabusTopic[] {
    // Implementation for Environment topics (200+ micro-topics)
    return []
  }
  
  private generateScienceTechTopics(): SyllabusTopic[] {
    // Implementation for Science & Technology topics (200+ micro-topics)  
    return []
  }
  
  private generateCurrentAffairsTopics(): SyllabusTopic[] {
    // Implementation for Current Affairs topics (200+ micro-topics)
    return []
  }
  
  private generateEthicsTopics(): SyllabusTopic[] {
    // Implementation for Ethics topics (200+ micro-topics)
    return []
  }
  
  private generateArtCultureTopics(): SyllabusTopic[] {
    // Implementation for Art & Culture topics (200+ micro-topics)
    return []
  }
  
  private generateIRTopics(): SyllabusTopic[] {
    // Implementation for International Relations topics (200+ micro-topics)
    return []
  }
}