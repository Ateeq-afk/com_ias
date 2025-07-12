import {
  RevisionStreak,
  StreakMilestone,
  RevisionAchievement,
  AchievementCriteria,
  AchievementReward,
  RevisionGameProfile,
  GameBadge,
  GameStats,
  LeaderboardEntry,
  RevisionItem,
  UserResponse,
  RevisionSession
} from '../types'
import { SubjectArea } from '../../question-generator/types'

interface GamificationEvent {
  type: 'RevisionComplete' | 'StreakMilestone' | 'Achievement' | 'PerfectSession' | 'MasteryUnlock' | 'Comeback'
  userId: string
  data: any
  timestamp: Date
  xpAwarded: number
  specialRewards: AchievementReward[]
}

interface SeasonalChallenge {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  criteria: AchievementCriteria
  participants: string[]
  leaderboard: { userId: string; score: number; rank: number }[]
  rewards: AchievementReward[]
}

interface LearningMomentum {
  userId: string
  currentMomentum: number // 0-100
  momentumHistory: MomentumPoint[]
  momentumFactors: MomentumFactor[]
  momentumPrediction: number
  boostOpportunities: string[]
}

interface MomentumPoint {
  date: Date
  momentum: number
  trigger: string
  impact: number
}

interface MomentumFactor {
  factor: 'Consistency' | 'Performance' | 'Difficulty' | 'Social' | 'Progress'
  contribution: number
  trend: 'Increasing' | 'Stable' | 'Decreasing'
}

interface SocialFeatures {
  studyGroups: StudyGroup[]
  rivalries: Rivalry[]
  mentorships: Mentorship[]
  collaborativeGoals: CollaborativeGoal[]
}

interface StudyGroup {
  id: string
  name: string
  members: string[]
  groupGoals: string[]
  groupStats: GameStats
  groupAchievements: RevisionAchievement[]
}

interface Rivalry {
  id: string
  user1: string
  user2: string
  challengeType: 'Accuracy' | 'Speed' | 'Consistency' | 'Volume'
  status: 'Active' | 'Completed' | 'Paused'
  score1: number
  score2: number
  endDate: Date
}

interface Mentorship {
  id: string
  mentor: string
  mentee: string
  focusAreas: SubjectArea[]
  goals: string[]
  progress: Record<string, number>
}

interface CollaborativeGoal {
  id: string
  title: string
  description: string
  participants: string[]
  targetValue: number
  currentValue: number
  deadline: Date
  rewards: AchievementReward[]
}

export class UPSCRevisionGamificationEngine {
  
  private userProfiles: Map<string, RevisionGameProfile> = new Map()
  private userStreaks: Map<string, RevisionStreak[]> = new Map()
  private userAchievements: Map<string, RevisionAchievement[]> = new Map()
  private gamificationEvents: Map<string, GamificationEvent[]> = new Map()
  private seasonalChallenges: SeasonalChallenge[] = []
  private learningMomentum: Map<string, LearningMomentum> = new Map()
  private socialFeatures: Map<string, SocialFeatures> = new Map()

  private achievementTemplates: Partial<RevisionAchievement>[] = []
  private badgeTemplates: Partial<GameBadge>[] = []

  constructor() {
    console.log('🎮 UPSC Revision Gamification Engine initialized')
    this.initializeAchievementTemplates()
    this.initializeBadgeTemplates()
    this.initializeSeasonalChallenges()
  }

  async processRevisionCompletion(userId: string, item: RevisionItem, response: UserResponse, session: RevisionSession): Promise<GamificationEvent[]> {
    console.log(`🎯 Processing revision completion for gamification: ${item.topic}`)
    
    const events: GamificationEvent[] = []
    
    // Update user profile and stats
    await this.updateUserProfile(userId, item, response, session)
    
    // Process streak updates
    const streakEvents = await this.processStreakUpdates(userId, item, response)
    events.push(...streakEvents)
    
    // Check for achievements
    const achievementEvents = await this.checkAchievements(userId, item, response, session)
    events.push(...achievementEvents)
    
    // Update momentum
    await this.updateLearningMomentum(userId, item, response)
    
    // Award base XP
    const baseXPEvent = this.awardBaseXP(userId, item, response)
    events.push(baseXPEvent)
    
    // Check for special events
    const specialEvents = await this.checkSpecialEvents(userId, item, response, session)
    events.push(...specialEvents)
    
    // Update leaderboards
    await this.updateLeaderboards(userId)
    
    // Store events
    await this.storeGamificationEvents(userId, events)
    
    console.log(`🏆 Gamification processing complete: ${events.length} events generated`)
    return events
  }

  async getUserProfile(userId: string): Promise<RevisionGameProfile> {
    if (!this.userProfiles.has(userId)) {
      const profile = await this.createUserProfile(userId)
      this.userProfiles.set(userId, profile)
    }
    
    return this.userProfiles.get(userId)!
  }

  async getUserStreaks(userId: string): Promise<RevisionStreak[]> {
    return this.userStreaks.get(userId) || []
  }

  async getUserAchievements(userId: string): Promise<RevisionAchievement[]> {
    return this.userAchievements.get(userId) || []
  }

  async getLearningMomentum(userId: string): Promise<LearningMomentum> {
    if (!this.learningMomentum.has(userId)) {
      const momentum = this.initializeLearningMomentum(userId)
      this.learningMomentum.set(userId, momentum)
    }
    
    return this.learningMomentum.get(userId)!
  }

  async getLeaderboard(category: string, timeframe: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'weekly'): Promise<LeaderboardEntry[]> {
    console.log(`🏅 Getting leaderboard for ${category} (${timeframe})`)
    
    // Mock leaderboard generation - in practice would query database
    const leaderboard: LeaderboardEntry[] = []
    
    // Get all user profiles and calculate rankings
    const profiles = Array.from(this.userProfiles.values())
    
    profiles.forEach((profile, index) => {
      let value = 0
      let comparison: 'Better' | 'Same' | 'Worse' = 'Same'
      
      switch (category) {
        case 'xp':
          value = profile.xp
          break
        case 'accuracy':
          value = profile.stats.averageAccuracy
          break
        case 'streak':
          value = this.getCurrentStreak(profile.userId)
          break
        case 'mastery':
          value = profile.stats.itemsMastered
          break
        default:
          value = profile.level
      }
      
      // Mock comparison - in practice would compare with previous period
      comparison = index < 3 ? 'Better' : index > 7 ? 'Worse' : 'Same'
      
      leaderboard.push({
        rank: index + 1,
        category,
        value,
        comparison
      })
    })
    
    return leaderboard.sort((a, b) => b.value - a.value).slice(0, 10)
  }

  async createRivalry(user1: string, user2: string, challengeType: 'Accuracy' | 'Speed' | 'Consistency' | 'Volume'): Promise<Rivalry> {
    console.log(`⚔️ Creating rivalry between ${user1} and ${user2} (${challengeType})`)
    
    const rivalry: Rivalry = {
      id: `rivalry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user1,
      user2,
      challengeType,
      status: 'Active',
      score1: 0,
      score2: 0,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
    }
    
    // Add to both users' social features
    [user1, user2].forEach(userId => {
      const social = this.socialFeatures.get(userId) || this.initializeSocialFeatures()
      social.rivalries.push(rivalry)
      this.socialFeatures.set(userId, social)
    })
    
    return rivalry
  }

  async createStudyGroup(name: string, members: string[], goals: string[]): Promise<StudyGroup> {
    console.log(`👥 Creating study group: ${name} with ${members.length} members`)
    
    const studyGroup: StudyGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      members,
      groupGoals: goals,
      groupStats: this.initializeGroupStats(),
      groupAchievements: []
    }
    
    // Add to all members' social features
    members.forEach(userId => {
      const social = this.socialFeatures.get(userId) || this.initializeSocialFeatures()
      social.studyGroups.push(studyGroup)
      this.socialFeatures.set(userId, social)
    })
    
    return studyGroup
  }

  async getGamificationInsights(userId: string): Promise<any> {
    const profile = await this.getUserProfile(userId)
    const streaks = await this.getUserStreaks(userId)
    const achievements = await this.getUserAchievements(userId)
    const momentum = await this.getLearningMomentum(userId)
    const events = this.gamificationEvents.get(userId) || []
    
    return {
      profile: {
        level: profile.level,
        xp: profile.xp,
        nextLevelXP: profile.nextLevelXP,
        title: profile.title,
        totalBadges: profile.badges.length
      },
      progress: {
        currentStreaks: streaks.filter(s => s.currentStreak > 0).length,
        longestStreak: Math.max(...streaks.map(s => s.longestStreak), 0),
        achievementsUnlocked: achievements.filter(a => a.achieved).length,
        totalAchievements: achievements.length,
        momentum: momentum.currentMomentum
      },
      performance: {
        averageAccuracy: profile.stats.averageAccuracy,
        totalRevisions: profile.stats.totalRevisions,
        perfectSessions: profile.stats.perfectSessions,
        timeSpent: profile.stats.timeSpent,
        itemsMastered: profile.stats.itemsMastered
      },
      engagement: {
        recentEvents: events.slice(-10),
        upcomingMilestones: this.getUpcomingMilestones(userId),
        boostOpportunities: momentum.boostOpportunities,
        socialInteractions: this.getSocialInteractionCount(userId)
      },
      recommendations: this.generateGamificationRecommendations(profile, momentum, achievements)
    }
  }

  // Private helper methods
  private async updateUserProfile(userId: string, item: RevisionItem, response: UserResponse, session: RevisionSession): Promise<void> {
    const profile = await this.getUserProfile(userId)
    
    // Update stats
    profile.stats.totalRevisions++
    
    const accuracy = this.calculateAccuracyFromResponse(response)
    profile.stats.averageAccuracy = (profile.stats.averageAccuracy * (profile.stats.totalRevisions - 1) + accuracy) / profile.stats.totalRevisions
    
    if (session.performance.overallAccuracy >= 95) {
      profile.stats.perfectSessions++
    }
    
    profile.stats.timeSpent += response.timeSpent / 60 // Convert to minutes
    
    if (response.selfRating === 'Easy' && accuracy >= 90) {
      profile.stats.itemsMastered++
    }
    
    // Update strongest subject
    profile.stats.strongestSubject = this.calculateStrongestSubject(userId)
    profile.stats.favoriteTime = this.calculateFavoriteTime(userId)
    
    this.userProfiles.set(userId, profile)
  }

  private async processStreakUpdates(userId: string, item: RevisionItem, response: UserResponse): Promise<GamificationEvent[]> {
    const events: GamificationEvent[] = []
    const streaks = this.userStreaks.get(userId) || []
    
    // Daily streak
    let dailyStreak = streaks.find(s => s.streakType === 'Daily')
    if (!dailyStreak) {
      dailyStreak = this.createNewStreak(userId, 'Daily')
      streaks.push(dailyStreak)
    }
    
    const today = new Date().toDateString()
    const lastActivity = dailyStreak.lastActivity.toDateString()
    
    if (today !== lastActivity) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
      
      if (lastActivity === yesterday) {
        // Continue streak
        dailyStreak.currentStreak++
        dailyStreak.longestStreak = Math.max(dailyStreak.longestStreak, dailyStreak.currentStreak)
      } else {
        // Reset streak
        dailyStreak.currentStreak = 1
      }
      
      dailyStreak.lastActivity = new Date()
      
      // Check for streak milestones
      const milestoneEvents = this.checkStreakMilestones(userId, dailyStreak)
      events.push(...milestoneEvents)
    }
    
    // Perfect streak (only correct answers)
    if (response.selfRating === 'Easy' || response.selfRating === 'Good') {
      let perfectStreak = streaks.find(s => s.streakType === 'Perfect')
      if (!perfectStreak) {
        perfectStreak = this.createNewStreak(userId, 'Perfect')
        streaks.push(perfectStreak)
      }
      
      perfectStreak.currentStreak++
      perfectStreak.longestStreak = Math.max(perfectStreak.longestStreak, perfectStreak.currentStreak)
      perfectStreak.lastActivity = new Date()
    } else {
      // Reset perfect streak
      const perfectStreak = streaks.find(s => s.streakType === 'Perfect')
      if (perfectStreak) {
        perfectStreak.currentStreak = 0
      }
    }
    
    // Subject streak
    let subjectStreak = streaks.find(s => s.streakType === 'Subject')
    if (!subjectStreak) {
      subjectStreak = this.createNewStreak(userId, 'Subject')
      streaks.push(subjectStreak)
    }
    
    // Update subject streak logic here...
    
    this.userStreaks.set(userId, streaks)
    return events
  }

  private async checkAchievements(userId: string, item: RevisionItem, response: UserResponse, session: RevisionSession): Promise<GamificationEvent[]> {
    const events: GamificationEvent[] = []
    const achievements = this.userAchievements.get(userId) || []
    const profile = await this.getUserProfile(userId)
    
    // Check each achievement template
    for (const template of this.achievementTemplates) {
      let userAchievement = achievements.find(a => a.title === template.title)
      
      if (!userAchievement) {
        userAchievement = {
          ...template,
          id: `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          progress: 0,
          achieved: false
        } as RevisionAchievement
        achievements.push(userAchievement)
      }
      
      if (!userAchievement.achieved) {
        const previousProgress = userAchievement.progress
        userAchievement.progress = this.calculateAchievementProgress(userAchievement, profile, item, response, session)
        
        if (userAchievement.progress >= 100) {
          userAchievement.achieved = true
          userAchievement.achievedDate = new Date()
          
          // Award achievement
          const achievementEvent: GamificationEvent = {
            type: 'Achievement',
            userId,
            data: { achievement: userAchievement },
            timestamp: new Date(),
            xpAwarded: userAchievement.reward.type === 'XP' ? Number(userAchievement.reward.value) : 100,
            specialRewards: [userAchievement.reward]
          }
          
          events.push(achievementEvent)
          
          // Award badge if applicable
          if (userAchievement.reward.type === 'Badge') {
            await this.awardBadge(userId, userAchievement.reward.value as string)
          }
        }
      }
    }
    
    this.userAchievements.set(userId, achievements)
    return events
  }

  private async updateLearningMomentum(userId: string, item: RevisionItem, response: UserResponse): Promise<void> {
    const momentum = await this.getLearningMomentum(userId)
    
    // Calculate momentum change based on performance
    const accuracy = this.calculateAccuracyFromResponse(response)
    const momentumChange = this.calculateMomentumChange(accuracy, response.confidence, response.timeSpent)
    
    // Add momentum point
    momentum.momentumHistory.push({
      date: new Date(),
      momentum: momentumChange,
      trigger: `${item.subject} revision`,
      impact: momentumChange
    })
    
    // Update current momentum (weighted average)
    momentum.currentMomentum = Math.max(0, Math.min(100, 
      momentum.currentMomentum * 0.8 + momentumChange * 0.2
    ))
    
    // Update momentum factors
    momentum.momentumFactors = this.analyzeMomentumFactors(momentum.momentumHistory)
    
    // Generate boost opportunities
    momentum.boostOpportunities = this.generateBoostOpportunities(momentum)
    
    this.learningMomentum.set(userId, momentum)
  }

  private awardBaseXP(userId: string, item: RevisionItem, response: UserResponse): GamificationEvent {
    const accuracy = this.calculateAccuracyFromResponse(response)
    
    // Base XP calculation
    let xp = 10 // Base XP
    
    // Accuracy bonus
    if (accuracy >= 90) xp += 15
    else if (accuracy >= 80) xp += 10
    else if (accuracy >= 70) xp += 5
    
    // Difficulty bonus
    if (item.difficulty === 'hard') xp += 10
    else if (item.difficulty === 'medium') xp += 5
    
    // Speed bonus
    if (response.timeSpent < 30 && accuracy >= 80) xp += 5
    
    // Confidence bonus
    if (response.confidence >= 4) xp += 5
    
    return {
      type: 'RevisionComplete',
      userId,
      data: { item, response, accuracy },
      timestamp: new Date(),
      xpAwarded: xp,
      specialRewards: []
    }
  }

  private async checkSpecialEvents(userId: string, item: RevisionItem, response: UserResponse, session: RevisionSession): Promise<GamificationEvent[]> {
    const events: GamificationEvent[] = []
    
    // Perfect session
    if (session.performance.overallAccuracy >= 95) {
      events.push({
        type: 'PerfectSession',
        userId,
        data: { session },
        timestamp: new Date(),
        xpAwarded: 50,
        specialRewards: []
      })
    }
    
    // Mastery unlock
    if (response.selfRating === 'Easy' && this.calculateAccuracyFromResponse(response) >= 90) {
      events.push({
        type: 'MasteryUnlock',
        userId,
        data: { item },
        timestamp: new Date(),
        xpAwarded: 25,
        specialRewards: []
      })
    }
    
    // Comeback (good performance after struggling)
    const recentPerformance = await this.getRecentPerformance(userId, 5)
    if (recentPerformance.length >= 3) {
      const recentLow = recentPerformance.slice(0, 2).every(p => p < 60)
      const currentHigh = this.calculateAccuracyFromResponse(response) >= 80
      
      if (recentLow && currentHigh) {
        events.push({
          type: 'Comeback',
          userId,
          data: { improvement: 'Significant improvement after struggling' },
          timestamp: new Date(),
          xpAwarded: 30,
          specialRewards: []
        })
      }
    }
    
    return events
  }

  private async updateLeaderboards(userId: string): Promise<void> {
    const profile = await this.getUserProfile(userId)
    
    // Update user's leaderboard entries
    const categories = ['xp', 'accuracy', 'streak', 'mastery']
    
    categories.forEach(category => {
      let value = 0
      switch (category) {
        case 'xp': value = profile.xp; break
        case 'accuracy': value = profile.stats.averageAccuracy; break
        case 'streak': value = this.getCurrentStreak(userId); break
        case 'mastery': value = profile.stats.itemsMastered; break
      }
      
      // Calculate rank (simplified)
      const rank = Math.floor(Math.random() * 10) + 1
      const comparison = rank <= 3 ? 'Better' : rank >= 8 ? 'Worse' : 'Same'
      
      const entry: LeaderboardEntry = { rank, category, value, comparison }
      
      // Update in profile
      const existingIndex = profile.leaderboards.findIndex(l => l.category === category)
      if (existingIndex >= 0) {
        profile.leaderboards[existingIndex] = entry
      } else {
        profile.leaderboards.push(entry)
      }
    })
    
    this.userProfiles.set(userId, profile)
  }

  private async storeGamificationEvents(userId: string, events: GamificationEvent[]): Promise<void> {
    const userEvents = this.gamificationEvents.get(userId) || []
    userEvents.push(...events)
    
    // Keep only last 100 events
    if (userEvents.length > 100) {
      userEvents.splice(0, userEvents.length - 100)
    }
    
    this.gamificationEvents.set(userId, userEvents)
    
    // Update profile with XP
    const profile = await this.getUserProfile(userId)
    const totalXP = events.reduce((sum, event) => sum + event.xpAwarded, 0)
    
    profile.xp += totalXP
    
    // Level up check
    while (profile.xp >= profile.nextLevelXP) {
      profile.xp -= profile.nextLevelXP
      profile.level++
      profile.nextLevelXP = this.calculateNextLevelXP(profile.level)
      
      // Award level up bonus
      await this.awardLevelUpBonus(userId, profile.level)
    }
    
    this.userProfiles.set(userId, profile)
  }

  private async createUserProfile(userId: string): Promise<RevisionGameProfile> {
    return {
      userId,
      level: 1,
      xp: 0,
      nextLevelXP: 100,
      title: 'UPSC Aspirant',
      badges: [],
      stats: {
        totalRevisions: 0,
        perfectSessions: 0,
        timeSpent: 0,
        itemsMastered: 0,
        averageAccuracy: 0,
        favoriteTime: 'morning',
        strongestSubject: 'Polity'
      },
      leaderboards: []
    }
  }

  private createNewStreak(userId: string, type: RevisionStreak['streakType']): RevisionStreak {
    return {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      streakType: type,
      lastActivity: new Date(),
      milestones: this.createStreakMilestones(type)
    }
  }

  private createStreakMilestones(type: RevisionStreak['streakType']): StreakMilestone[] {
    const baseMilestones = [
      { days: 3, title: 'Getting Started', reward: 'First Steps Badge', achieved: false },
      { days: 7, title: 'Week Warrior', reward: '50 XP Bonus', achieved: false },
      { days: 14, title: 'Fortnight Fighter', reward: 'Consistency Badge', achieved: false },
      { days: 30, title: 'Month Master', reward: '200 XP + Special Title', achieved: false },
      { days: 60, title: 'Unstoppable', reward: 'Legendary Badge', achieved: false },
      { days: 100, title: 'Centurion', reward: 'Elite Status + 500 XP', achieved: false }
    ]
    
    return baseMilestones
  }

  private checkStreakMilestones(userId: string, streak: RevisionStreak): GamificationEvent[] {
    const events: GamificationEvent[] = []
    
    streak.milestones.forEach(milestone => {
      if (!milestone.achieved && streak.currentStreak >= milestone.days) {
        milestone.achieved = true
        milestone.achievedDate = new Date()
        
        events.push({
          type: 'StreakMilestone',
          userId,
          data: { milestone, streak },
          timestamp: new Date(),
          xpAwarded: this.calculateMilestoneXP(milestone.days),
          specialRewards: [{ type: 'Badge', value: milestone.reward, description: milestone.title }]
        })
      }
    })
    
    return events
  }

  private calculateAccuracyFromResponse(response: UserResponse): number {
    const ratingMap = { 'Easy': 95, 'Good': 85, 'Hard': 65, 'Again': 35 }
    const baseAccuracy = ratingMap[response.selfRating]
    const confidenceAdjustment = (response.confidence - 3) * 5
    return Math.max(0, Math.min(100, baseAccuracy + confidenceAdjustment))
  }

  private calculateStrongestSubject(userId: string): SubjectArea {
    // Mock calculation - in practice would analyze performance by subject
    const subjects: SubjectArea[] = ['Polity', 'History', 'Geography', 'Economy']
    return subjects[Math.floor(Math.random() * subjects.length)]
  }

  private calculateFavoriteTime(userId: string): string {
    // Mock calculation - in practice would analyze activity patterns
    const times = ['morning', 'afternoon', 'evening', 'night']
    return times[Math.floor(Math.random() * times.length)]
  }

  private calculateAchievementProgress(
    achievement: RevisionAchievement,
    profile: RevisionGameProfile,
    item: RevisionItem,
    response: UserResponse,
    session: RevisionSession
  ): number {
    switch (achievement.criteria.type) {
      case 'Streak':
        const currentStreak = this.getCurrentStreak(profile.userId)
        return Math.min(100, (currentStreak / achievement.criteria.target) * 100)
        
      case 'Accuracy':
        return Math.min(100, (profile.stats.averageAccuracy / achievement.criteria.target) * 100)
        
      case 'Volume':
        return Math.min(100, (profile.stats.totalRevisions / achievement.criteria.target) * 100)
        
      case 'Perfect':
        return Math.min(100, (profile.stats.perfectSessions / achievement.criteria.target) * 100)
        
      case 'Speed':
        const avgSpeed = profile.stats.totalRevisions > 0 ? profile.stats.timeSpent / profile.stats.totalRevisions : 0
        const targetSpeed = achievement.criteria.target
        return avgSpeed <= targetSpeed ? 100 : Math.max(0, 100 - ((avgSpeed - targetSpeed) / targetSpeed) * 100)
        
      default:
        return achievement.progress
    }
  }

  private initializeLearningMomentum(userId: string): LearningMomentum {
    return {
      userId,
      currentMomentum: 50,
      momentumHistory: [],
      momentumFactors: [
        { factor: 'Consistency', contribution: 0, trend: 'Stable' },
        { factor: 'Performance', contribution: 0, trend: 'Stable' },
        { factor: 'Difficulty', contribution: 0, trend: 'Stable' },
        { factor: 'Social', contribution: 0, trend: 'Stable' },
        { factor: 'Progress', contribution: 0, trend: 'Stable' }
      ],
      momentumPrediction: 50,
      boostOpportunities: []
    }
  }

  private calculateMomentumChange(accuracy: number, confidence: number, timeSpent: number): number {
    let change = 0
    
    // Accuracy impact
    if (accuracy >= 90) change += 15
    else if (accuracy >= 80) change += 10
    else if (accuracy >= 70) change += 5
    else if (accuracy < 50) change -= 10
    
    // Confidence impact
    if (confidence >= 4) change += 5
    else if (confidence <= 2) change -= 5
    
    // Time efficiency impact
    if (timeSpent < 30) change += 5
    else if (timeSpent > 120) change -= 5
    
    return Math.max(-20, Math.min(20, change))
  }

  private analyzeMomentumFactors(history: MomentumPoint[]): MomentumFactor[] {
    if (history.length < 5) {
      return [
        { factor: 'Consistency', contribution: 0, trend: 'Stable' },
        { factor: 'Performance', contribution: 0, trend: 'Stable' },
        { factor: 'Difficulty', contribution: 0, trend: 'Stable' },
        { factor: 'Social', contribution: 0, trend: 'Stable' },
        { factor: 'Progress', contribution: 0, trend: 'Stable' }
      ]
    }
    
    const recent = history.slice(-10)
    const avgMomentum = recent.reduce((sum, p) => sum + p.momentum, 0) / recent.length
    
    return [
      {
        factor: 'Consistency',
        contribution: this.calculateConsistencyContribution(recent),
        trend: avgMomentum > 5 ? 'Increasing' : avgMomentum < -5 ? 'Decreasing' : 'Stable'
      },
      {
        factor: 'Performance',
        contribution: Math.round(avgMomentum),
        trend: 'Stable'
      },
      {
        factor: 'Difficulty',
        contribution: 0,
        trend: 'Stable'
      },
      {
        factor: 'Social',
        contribution: 5, // Mock positive social impact
        trend: 'Increasing'
      },
      {
        factor: 'Progress',
        contribution: Math.round(avgMomentum * 0.8),
        trend: 'Stable'
      }
    ]
  }

  private generateBoostOpportunities(momentum: LearningMomentum): string[] {
    const opportunities = []
    
    if (momentum.currentMomentum < 30) {
      opportunities.push('Take a break and review easier topics')
      opportunities.push('Join a study group for motivation')
    }
    
    if (momentum.currentMomentum < 50) {
      opportunities.push('Set a small daily goal')
      opportunities.push('Review recent achievements')
    }
    
    if (momentum.currentMomentum > 70) {
      opportunities.push('Challenge yourself with harder topics')
      opportunities.push('Mentor another student')
    }
    
    opportunities.push('Take a practice test to gauge progress')
    
    return opportunities
  }

  private getCurrentStreak(userId: string): number {
    const streaks = this.userStreaks.get(userId) || []
    const dailyStreak = streaks.find(s => s.streakType === 'Daily')
    return dailyStreak ? dailyStreak.currentStreak : 0
  }

  private async awardBadge(userId: string, badgeName: string): Promise<void> {
    const profile = await this.getUserProfile(userId)
    const badgeTemplate = this.badgeTemplates.find(b => b.name === badgeName)
    
    if (badgeTemplate && !profile.badges.some(b => b.name === badgeName)) {
      const badge: GameBadge = {
        ...badgeTemplate,
        id: `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        earnedDate: new Date()
      } as GameBadge
      
      profile.badges.push(badge)
      this.userProfiles.set(userId, profile)
    }
  }

  private calculateNextLevelXP(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1))
  }

  private async awardLevelUpBonus(userId: string, level: number): Promise<void> {
    const bonusXP = level * 10
    const profile = await this.getUserProfile(userId)
    
    // Award level-specific titles
    if (level === 5) profile.title = 'Dedicated Student'
    else if (level === 10) profile.title = 'Knowledge Seeker'
    else if (level === 20) profile.title = 'UPSC Scholar'
    else if (level === 50) profile.title = 'Civil Service Elite'
    
    this.userProfiles.set(userId, profile)
  }

  private calculateMilestoneXP(days: number): number {
    return days * 5 // 5 XP per day in streak
  }

  private async getRecentPerformance(userId: string, count: number): Promise<number[]> {
    // Mock implementation - in practice would fetch from performance history
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100))
  }

  private initializeAchievementTemplates(): void {
    this.achievementTemplates = [
      {
        title: 'First Steps',
        description: 'Complete your first revision session',
        category: 'Memory',
        criteria: { type: 'Volume', target: 1 },
        reward: { type: 'XP', value: 50, description: 'Welcome bonus' }
      },
      {
        title: 'Consistency Champion',
        description: 'Maintain a 7-day revision streak',
        category: 'Consistency',
        criteria: { type: 'Streak', target: 7 },
        reward: { type: 'Badge', value: 'Consistency Badge', description: 'Streak master' }
      },
      {
        title: 'Accuracy Expert',
        description: 'Achieve 90% average accuracy',
        category: 'Performance',
        criteria: { type: 'Accuracy', target: 90 },
        reward: { type: 'XP', value: 200, description: 'Accuracy bonus' }
      },
      {
        title: 'Speed Demon',
        description: 'Complete revisions in under 2 minutes average',
        category: 'Speed',
        criteria: { type: 'Speed', target: 2 },
        reward: { type: 'Badge', value: 'Speed Badge', description: 'Lightning fast' }
      },
      {
        title: 'Perfect Session',
        description: 'Complete 10 perfect revision sessions',
        category: 'Mastery',
        criteria: { type: 'Perfect', target: 10 },
        reward: { type: 'Title', value: 'Perfectionist', description: 'Flawless execution' }
      },
      {
        title: 'Knowledge Vault',
        description: 'Complete 100 revision sessions',
        category: 'Memory',
        criteria: { type: 'Volume', target: 100 },
        reward: { type: 'XP', value: 500, description: 'Volume achievement' }
      },
      {
        title: 'Marathon Master',
        description: 'Maintain a 30-day streak',
        category: 'Consistency',
        criteria: { type: 'Streak', target: 30 },
        reward: { type: 'Badge', value: 'Marathon Badge', description: 'Endurance champion' }
      },
      {
        title: 'UPSC Warrior',
        description: 'Master 50 different topics',
        category: 'Mastery',
        criteria: { type: 'Volume', target: 50 },
        reward: { type: 'Title', value: 'UPSC Warrior', description: 'Topic master' }
      }
    ]
    
    console.log(`🏆 Initialized ${this.achievementTemplates.length} achievement templates`)
  }

  private initializeBadgeTemplates(): void {
    this.badgeTemplates = [
      {
        name: 'First Steps Badge',
        description: 'Completed first revision',
        rarity: 'Common',
        category: 'Getting Started'
      },
      {
        name: 'Consistency Badge',
        description: 'Maintained regular revision schedule',
        rarity: 'Rare',
        category: 'Consistency'
      },
      {
        name: 'Speed Badge',
        description: 'Fast and accurate revisions',
        rarity: 'Epic',
        category: 'Performance'
      },
      {
        name: 'Marathon Badge',
        description: 'Long-term commitment to learning',
        rarity: 'Legendary',
        category: 'Endurance'
      },
      {
        name: 'Perfect Badge',
        description: 'Flawless revision performance',
        rarity: 'Epic',
        category: 'Mastery'
      }
    ]
    
    console.log(`🎖️ Initialized ${this.badgeTemplates.length} badge templates`)
  }

  private initializeSeasonalChallenges(): void {
    const now = new Date()
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    this.seasonalChallenges = [
      {
        id: 'monthly-mastery',
        name: 'Monthly Mastery Challenge',
        description: 'Master 20 topics this month',
        startDate: now,
        endDate: nextMonth,
        criteria: { type: 'Volume', target: 20 },
        participants: [],
        leaderboard: [],
        rewards: [
          { type: 'XP', value: 1000, description: 'Challenge completion bonus' },
          { type: 'Badge', value: 'Monthly Master', description: 'Seasonal achievement' }
        ]
      }
    ]
    
    console.log(`🎯 Initialized ${this.seasonalChallenges.length} seasonal challenges`)
  }

  private initializeSocialFeatures(): SocialFeatures {
    return {
      studyGroups: [],
      rivalries: [],
      mentorships: [],
      collaborativeGoals: []
    }
  }

  private initializeGroupStats(): GameStats {
    return {
      totalRevisions: 0,
      perfectSessions: 0,
      timeSpent: 0,
      itemsMastered: 0,
      averageAccuracy: 0,
      favoriteTime: 'morning',
      strongestSubject: 'Polity'
    }
  }

  private getUpcomingMilestones(userId: string): any[] {
    const streaks = this.userStreaks.get(userId) || []
    const milestones = []
    
    streaks.forEach(streak => {
      const nextMilestone = streak.milestones.find(m => !m.achieved)
      if (nextMilestone) {
        milestones.push({
          type: 'streak',
          title: nextMilestone.title,
          current: streak.currentStreak,
          target: nextMilestone.days,
          progress: (streak.currentStreak / nextMilestone.days) * 100
        })
      }
    })
    
    return milestones.slice(0, 3) // Return next 3 milestones
  }

  private getSocialInteractionCount(userId: string): number {
    const social = this.socialFeatures.get(userId)
    if (!social) return 0
    
    return social.studyGroups.length + social.rivalries.length + social.mentorships.length
  }

  private generateGamificationRecommendations(
    profile: RevisionGameProfile,
    momentum: LearningMomentum,
    achievements: RevisionAchievement[]
  ): string[] {
    const recommendations = []
    
    if (momentum.currentMomentum < 40) {
      recommendations.push('Focus on building consistency with daily small sessions')
    }
    
    if (profile.stats.averageAccuracy < 70) {
      recommendations.push('Review fundamentals before attempting harder topics')
    }
    
    const unlockedAchievements = achievements.filter(a => a.achieved).length
    const totalAchievements = achievements.length
    
    if (unlockedAchievements / totalAchievements < 0.3) {
      recommendations.push('Work towards achievement goals for extra motivation')
    }
    
    if (profile.stats.perfectSessions === 0) {
      recommendations.push('Aim for a perfect session to unlock mastery rewards')
    }
    
    recommendations.push('Join a study group to boost social momentum')
    recommendations.push('Challenge a friend to create healthy competition')
    
    return recommendations
  }

  private calculateConsistencyContribution(history: MomentumPoint[]): number {
    const daysCovered = new Set(history.map(p => p.date.toDateString())).size
    const totalDays = Math.min(7, history.length) // Check last 7 days
    return Math.round((daysCovered / totalDays) * 20) // 0-20 contribution
  }
}