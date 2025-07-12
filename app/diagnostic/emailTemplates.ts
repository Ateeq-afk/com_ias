// Email templates for the diagnostic test results
// These would be sent via a backend service in production

export const getImmediateEmailTemplate = (userName: string, score: number) => ({
  subject: "Your UPSC Diagnostic Results Are Ready",
  previewText: "You're closer than you think - see your personalized roadmap",
  body: `
    <h1>Hi ${userName},</h1>
    <p>Your diagnostic test results are ready! You scored <strong>${score}%</strong>.</p>
    <p>We've analyzed your performance across all subjects and created a personalized study plan just for you.</p>
    <a href="{{resultLink}}" style="display: inline-block; padding: 16px 32px; background: #1E3A8A; color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">View My Detailed Analysis</a>
    <p>Your results include:</p>
    <ul>
      <li>Subject-wise strength analysis</li>
      <li>Topic-level improvement areas</li>
      <li>Personalized study sequence</li>
      <li>Expected timeline to exam readiness</li>
    </ul>
    <p>Best regards,<br>Community IAS Team</p>
  `
});

export const getFollowUpEmails = (userName: string, weakestSubject: string, score: number) => [
  {
    day: 1,
    subject: "Did you notice this surprising insight in your results?",
    body: `
      <h1>Hi ${userName},</h1>
      <p>I noticed something interesting in your diagnostic results...</p>
      <p>While your overall score was ${score}%, your performance in ${weakestSubject} shows huge potential for quick improvement.</p>
      <p>Students who focus on their weakest subject first typically see a <strong>40% improvement in just 6 weeks</strong>.</p>
      <p>Here's a quick tip: Start with NCERT basics for ${weakestSubject}. Just 1 hour daily can make a significant difference.</p>
      <a href="{{platformLink}}">Start Your ${weakestSubject} Module</a>
    `
  },
  {
    day: 3,
    subject: `Quick tip for improving your ${weakestSubject} scores`,
    body: `
      <h1>Master ${weakestSubject} with the 3-2-1 Method</h1>
      <p>Hi ${userName},</p>
      <p>Here's a proven technique our toppers use:</p>
      <ul>
        <li><strong>3 concepts</strong> - Learn 3 new concepts daily</li>
        <li><strong>2 revisions</strong> - Revise yesterday's and last week's topics</li>
        <li><strong>1 practice test</strong> - Take a 10-minute quiz</li>
      </ul>
      <p>This method has helped 87% of our students improve their ${weakestSubject} scores within a month.</p>
      <a href="{{platformLink}}">Try the 3-2-1 Method</a>
    `
  },
  {
    day: 7,
    subject: "⏰ Your diagnostic results expire in 24 hours",
    body: `
      <h1>Don't lose your personalized study plan!</h1>
      <p>Hi ${userName},</p>
      <p>Your detailed diagnostic analysis and personalized study plan will be archived in 24 hours.</p>
      <p>Save your plan now and get:</p>
      <ul>
        <li>40% off on your first month</li>
        <li>Free 1-on-1 mentorship session</li>
        <li>Downloadable study schedule</li>
      </ul>
      <a href="{{platformLink}}" style="display: inline-block; padding: 16px 32px; background: #FF3B30; color: white; text-decoration: none; border-radius: 50px; font-weight: bold;">Claim My Plan Before It Expires</a>
    `
  },
  {
    day: 14,
    subject: "How Priya improved from 45% to 89% in History",
    body: `
      <h1>Your score reminds me of Priya's journey</h1>
      <p>Hi ${userName},</p>
      <p>When Priya took her diagnostic test, she scored ${Math.max(score - 5, 35)}% - very similar to your ${score}%.</p>
      <p>She was working full-time and could only dedicate 3 hours daily. Sound familiar?</p>
      <p>Here's what she did differently:</p>
      <ol>
        <li>Focused on her weakest subject first (History)</li>
        <li>Used our bite-sized modules during commute</li>
        <li>Joined a study group for accountability</li>
      </ol>
      <p>Result? She cleared Prelims in her second attempt with a comfortable margin.</p>
      <p>You can follow the same path. Your personalized plan is waiting.</p>
      <a href="{{platformLink}}">Start Like Priya Did</a>
    `
  }
];

export const getSMSTemplate = (userName: string, score: number) => 
  `Hi ${userName}! Your UPSC diagnostic score: ${score}%. Check your email for detailed analysis & personalized study plan. Need help? Reply GUIDE.`;

export const getWhatsAppTemplate = (userName: string, score: number, weakestSubject: string) => ({
  message: `🎯 *UPSC Diagnostic Results*

Hi ${userName}! Here's your quick summary:

📊 Overall Score: *${score}%*
⚠️ Focus Area: *${weakestSubject}*
⏱️ Estimated Prep Time: *${Math.ceil((100 - score) / 10)} months*

Your detailed report with personalized study plan is ready!

👉 community-ias.com/results`,
  
  followUp: `💡 *Daily Study Tip*

Based on your diagnostic, here's today's focus:

📚 Subject: ${weakestSubject}
⏰ Time: 45 minutes
📝 Topic: Basics & Fundamentals

Remember: Consistency beats intensity!`
});