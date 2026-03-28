import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // URLを簡潔に: サーバー側で即リダイレクト（React起動不要）
  async redirects() {
    return [
      { source: "/", destination: "/login", permanent: false },
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
      { source: "/learner", destination: "/learner/skill-hub/home", permanent: false },
      { source: "/learner/workspace", destination: "/learner/skill-hub/home", permanent: false },
      { source: "/learner/home", destination: "/learner/skill-hub/home", permanent: false },
      { source: "/learner/skills/owned", destination: "/learner/skill-hub/owned", permanent: false },
      { source: "/learner/skills/gap", destination: "/learner/skill-hub/gap", permanent: false },
      { source: "/learner/skills/gap/:code*", destination: "/learner/skill-hub/gap/:code*", permanent: false },
      { source: "/learner/skills/timeline", destination: "/learner/skill-hub/timeline", permanent: false },
      { source: "/learner/diagnostics/survey", destination: "/learner/skill-hub/diagnostics/survey", permanent: false },
      { source: "/learner/diagnostics/exam", destination: "/learner/skill-hub/diagnostics/exam", permanent: false },
      { source: "/learner/skills/courses", destination: "/learner/track/courses", permanent: false },
      { source: "/learner/skills/courses/browse", destination: "/learner/track/courses/browse", permanent: false },
      { source: "/learner/skills/paths", destination: "/learner/track/paths", permanent: false },
      { source: "/learner/skills/history", destination: "/learner/track/history", permanent: false },
      { source: "/learner/skills/learning-path", destination: "/learner/track/learning-path", permanent: false },
      { source: "/learner/skills/recommendations", destination: "/learner/track/recommendations", permanent: false },
      { source: "/learner/notifications", destination: "/learner/track/notifications", permanent: false },
    ];
  },
};

export default nextConfig;
